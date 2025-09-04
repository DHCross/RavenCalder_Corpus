"""Publish-to-Survive — Training & Evaluation (Clean CLI)

Usage:
  python pts_train_eval_cli.py \
    --extracted-data-dir extracted_charts \
    --out results_ml.json \
    --models both \
    --feature-mode circular \
    --include-aspects --aspect-orb 3.0

Notes:
- This script does not depend on Colab and has no side effects.
- It supports two feature modes (basic, circular) and optional simple aspect flags.
"""

import argparse
import json
import math
import os
import warnings
from datetime import datetime
from itertools import combinations

import numpy as np
import re

from sklearn.model_selection import StratifiedShuffleSplit, StratifiedKFold, GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import roc_auc_score, accuracy_score, balanced_accuracy_score, log_loss
from sklearn.calibration import calibration_curve

warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=UserWarning)


def _build_pipelines(seed: int):
    logit = Pipeline([
        ("impute", SimpleImputer(strategy="constant", fill_value=0.0)),
        ("scale", StandardScaler()),
        ("clf", LogisticRegression(
            max_iter=2000, solver="saga", penalty="l2", class_weight="balanced",
            random_state=seed
        ))
    ])
    logit_grid = {"clf__C": [0.1, 0.25, 0.5, 1.0, 2.0, 5.0]}

    gb = Pipeline([
        ("impute", SimpleImputer(strategy="constant", fill_value=0.0)),
        ("clf", GradientBoostingClassifier(random_state=seed))
    ])
    gb_grid = {
        "clf__n_estimators": [200, 400],
        "clf__learning_rate": [0.05, 0.1],
        "clf__max_depth": [2, 3],
        "clf__subsample": [0.7, 1.0]
    }

    return {
        "logistic": (logit, logit_grid),
        "gboost": (gb, gb_grid),
    }


def _metrics(y_true, proba):
    y_hat = (proba >= 0.5).astype(int)
    out = {
        "auc": float(roc_auc_score(y_true, proba)) if len(np.unique(y_true)) > 1 else None,
        "accuracy": float(accuracy_score(y_true, y_hat)),
        "balanced_accuracy": float(balanced_accuracy_score(y_true, y_hat)),
        "log_loss": float(log_loss(y_true, np.vstack([1 - proba, proba]).T, labels=[0, 1])),
    }
    prob_true, prob_pred = calibration_curve(y_true, proba, n_bins=10, strategy="quantile")
    out["calibration_bins"] = [{"pred": float(p), "true": float(t)} for p, t in zip(prob_pred, prob_true)]
    return out


def _nested_cv_auc(pipe, grid, X, y, seed):
    inner = StratifiedKFold(n_splits=3, shuffle=True, random_state=seed)
    outer = StratifiedKFold(n_splits=3, shuffle=True, random_state=seed + 1)
    aucs = []
    for i, (tr_idx, te_idx) in enumerate(outer.split(X, y)):
        Xtr, Xte = X[tr_idx], X[te_idx]
        ytr, yte = y[tr_idx], y[te_idx]
        try:
            if len(np.unique(ytr)) < 2 or len(np.unique(yte)) < 2:
                raise ValueError("Single-class fold; skip.")
            gs = GridSearchCV(pipe, grid, scoring="roc_auc", cv=inner, n_jobs=-1, refit=True)
            gs.fit(Xtr, ytr)
            proba = gs.predict_proba(Xte)[:, 1]
            aucs.append(roc_auc_score(yte, proba))
        except ValueError as e:
            print(f"Warning: Skipping outer fold {i+1} during nested CV: {e}")
    if not aucs:
        return float("nan"), float("nan")
    return float(np.mean(aucs)), float(np.std(aucs))


# ---------------------- Data loading & feature building ----------------------
def parse_txt_file(filepath):
    parsed_data = []
    with open(filepath, 'r', encoding='utf-8') as f:
        for raw in f:
            line = raw.strip()
            if not line:
                continue
            if ':' not in line:
                parsed_data.append({"raw_line": line})
                continue
            parts = line.split(':')
            if len(parts) == 4:
                body = parts[0].strip()
                sign_part = parts[1].strip()
                degree = parts[2].strip()
                retrograde = parts[3].strip()
                match = re.search(r"\d+", sign_part)
                sign_index = int(match.group(0)) if match else None
                try:
                    deg = float(degree)
                except ValueError:
                    deg = np.nan
                parsed_data.append({
                    "Body": body,
                    "Sign_Index": sign_index,
                    "Degree": deg,
                    "Retrograde": retrograde,
                })
            else:
                key = parts[0].strip()
                value = ':'.join(parts[1:]).strip()
                parsed_data.append({key: value})
    return parsed_data


def load_json_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


def load_chart_data(extracted_charts_dir):
    all_charts = []
    for root, _, files in os.walk(extracted_charts_dir):
        txt_files = {f[:-4]: os.path.join(root, f) for f in files if f.endswith('.txt')}
        json_files = {f[:-10]: os.path.join(root, f) for f in files if f.endswith('.meta.json')}
        for base in txt_files:
            if base not in json_files:
                print(f"Warning: No matching .meta.json for {base}.txt")
                continue
            chart = parse_txt_file(txt_files[base])
            meta = load_json_file(json_files[base])
            all_charts.append({
                "file_base_name": base,
                "directory": os.path.basename(root),
                "chart_data": chart,
                "metadata": meta,
            })
    return all_charts


def _abs_longitude(sign_idx, degree):
    if sign_idx is None or np.isnan(degree):
        return np.nan
    base = (int(sign_idx) - 1) * 30.0
    val = base + float(degree)
    return float(val % 360.0)


def _sin_cos(deg):
    rad = math.radians(deg)
    return math.sin(rad), math.cos(rad)


def build_features(charts_information, feature_mode="basic", include_aspects=False, aspect_orb=3.0):
    bodies = sorted(list({entry.get("Body") for ch in charts_information for entry in ch["chart_data"] if "Body" in entry}))
    aspect_defs = [(0, 'conj'), (60, 'sext'), (90, 'square'), (120, 'trine'), (180, 'opp')]
    body_pairs = list(combinations(bodies, 2)) if include_aspects else []

    feature_cols = []
    if feature_mode == "basic":
        for b in bodies:
            feature_cols.extend([f"{b}_Sign_Index", f"{b}_Degree", f"{b}_Retrograde"])
    elif feature_mode == "circular":
        for b in bodies:
            feature_cols.extend([f"{b}_AbsLon_Sin", f"{b}_AbsLon_Cos", f"{b}_Retrograde"])
    else:
        raise ValueError(f"Unknown feature_mode: {feature_mode}")

    if include_aspects:
        for (a, b) in body_pairs:
            for ang, tag in aspect_defs:
                feature_cols.append(f"ASP_{a}__{b}__{tag}")

    X_rows, y, ids = [], [], []
    for ch in charts_information:
        by_body = {e["Body"]: e for e in ch["chart_data"] if "Body" in e}
        row = []
        for b in bodies:
            entry = by_body.get(b, {})
            sidx = entry.get("Sign_Index")
            deg = entry.get("Degree", np.nan)
            retro = 1 if entry.get("Retrograde", 'R0') == 'R1' else 0
            if feature_mode == "basic":
                row.append(int(sidx) if sidx is not None else 0)
                row.append(float(deg) if not np.isnan(deg) else 0.0)
                row.append(retro)
            else:
                abs_lon = _abs_longitude(sidx, deg) if sidx is not None and not np.isnan(deg) else np.nan
                if np.isnan(abs_lon):
                    row.extend([0.0, 0.0])
                else:
                    s, c = _sin_cos(abs_lon)
                    row.extend([s, c])
                row.append(retro)

        if include_aspects:
            lon_map = {}
            for b in bodies:
                e = by_body.get(b, {})
                sidx = e.get("Sign_Index")
                d = e.get("Degree", np.nan)
                lon = _abs_longitude(sidx, d) if sidx is not None and not np.isnan(d) else np.nan
                lon_map[b] = lon
            for (a, b) in body_pairs:
                da = lon_map.get(a, np.nan)
                db = lon_map.get(b, np.nan)
                if np.isnan(da) or np.isnan(db):
                    row.extend([0] * len(aspect_defs))
                    continue
                delta = abs(da - db) % 360.0
                delta = min(delta, 360.0 - delta)
                for ang, _ in aspect_defs:
                    row.append(1 if abs(delta - ang) <= aspect_orb else 0)

        X_rows.append(row)
        cohort = ch.get("metadata", {}).get('class', '').lower()
        y.append(1 if cohort == 'artist' else 0)
        ids.append(ch.get("file_base_name"))

    X = np.asarray(X_rows, dtype=float)
    y = np.asarray(y, dtype=int)
    ids = np.asarray(ids)
    return X, y, ids, feature_cols


def fit_and_score(X, y, ids, seed=42, holdout=0.25, models=("logistic", "gboost")):
    if len(np.unique(y)) < 2:
        raise ValueError("Labels contain a single class; cannot train.")

    sss = StratifiedShuffleSplit(n_splits=1, test_size=holdout, random_state=seed)
    (train_idx, test_idx) = next(sss.split(X, y))
    Xtr, Xte = X[train_idx], X[test_idx]
    ytr, yte = y[train_idx], y[test_idx]
    ids_holdout = ids[test_idx].tolist()

    model_dict = _build_pipelines(seed)
    results = {"holdout_ids": ids_holdout, "models": {}}

    for name in models:
        pipe, grid = model_dict[name]
        cv_mean, cv_std = _nested_cv_auc(pipe, grid, Xtr, ytr, seed)
        inner = StratifiedKFold(n_splits=3, shuffle=True, random_state=seed)
        gs = GridSearchCV(pipe, grid, scoring="roc_auc", cv=inner, n_jobs=-1, refit=True)
        try:
            gs.fit(Xtr, ytr)
            proba_tr = gs.predict_proba(Xtr)[:, 1]
            proba_te = gs.predict_proba(Xte)[:, 1]
            res = {
                "cv_auc_mean": float(cv_mean),
                "cv_auc_std": float(cv_std),
                "best_params": gs.best_params_,
                "train": _metrics(ytr, proba_tr),
                "holdout": _metrics(yte, proba_te),
            }
            try:
                if name == "logistic":
                    fi = gs.best_estimator_.named_steps["clf"].coef_.ravel().tolist()
                elif name == "gboost":
                    fi = gs.best_estimator_.named_steps["clf"].feature_importances_.tolist()
                else:
                    fi = None
            except Exception:
                fi = None
            res["feature_importance"] = fi
            results["models"][name] = res
        except ValueError as e:
            print(f"Warning: Skipping model '{name}' refit/holdout evaluation: {e}")
            results["models"][name] = {
                "cv_auc_mean": float(cv_mean),
                "cv_auc_std": float(cv_std),
                "best_params": None,
                "train": None,
                "holdout": None,
                "feature_importance": None,
            }
    return results


def main():
    ap = argparse.ArgumentParser(description="Publish-to-Survive Training & Evaluation (Clean CLI)")
    ap.add_argument("--extracted-data-dir", required=True, help="Directory with paired .txt and .meta.json files")
    ap.add_argument("--out", required=True, help="Path to write JSON results")
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--holdout", type=float, default=0.25)
    ap.add_argument("--models", choices=["both", "logistic", "gboost"], default="both")
    ap.add_argument("--feature-mode", choices=["basic", "circular"], default="basic")
    ap.add_argument("--include-aspects", action="store_true")
    ap.add_argument("--aspect-orb", type=float, default=3.0)
    args = ap.parse_args()

    charts = load_chart_data(args.extracted_data_dir)
    if not charts:
        raise SystemExit(f"No charts found under {args.extracted_data_dir}")

    X, y, ids, feat_cols = build_features(
        charts,
        feature_mode=args.feature_mode,
        include_aspects=args.include_aspects,
        aspect_orb=args.aspect_orb,
    )

    models = ("logistic", "gboost") if args.models == "both" else (args.models,)
    try:
        res = fit_and_score(X, y, ids, seed=args.seed, holdout=args.holdout, models=models)
    except ValueError as e:
        # Write out meta-only results if dataset is not trainable (e.g., single-class)
        res = {"models": {}, "holdout_ids": []}
        print(f"Aborted training: {e}")

    res["meta"] = {
        "timestamp_utc": datetime.utcnow().isoformat() + "Z",
        "seed": args.seed,
        "holdout": args.holdout,
        "n_samples": int(X.shape[0]),
        "n_features": int(X.shape[1]),
        "feature_columns": feat_cols,
        "class_balance": {
            "artists": int(np.sum(y == 1)),
            "controls": int(np.sum(y == 0)),
        },
        "feature_mode": args.feature_mode,
        "include_aspects": bool(args.include_aspects),
        "aspect_orb": float(args.aspect_orb),
    }

    os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(res, f, indent=2)
    print(f"[ok] wrote {args.out}")


if __name__ == "__main__":
    main()

