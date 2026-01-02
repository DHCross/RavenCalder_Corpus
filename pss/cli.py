"""CLI to train/evaluate on JSON charts matching the pss.schema.

Example:
  python -m pss.cli \
    --charts-dir charts_json \
    --out results_pss.json \
    --models both
"""

import argparse
import json
import os
from datetime import datetime
from typing import Tuple

import numpy as np
from sklearn.model_selection import StratifiedShuffleSplit, StratifiedKFold, GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import GradientBoostingClassifier

from .io import load_charts_dir
from .features import house_features, aspect_house_features
from .metrics import (
    auc_score, brier_score, logloss, accuracy_at_best_threshold,
    ece_score, alignment_score, bootstrap_alignment_ci
)


def _build_pipelines(seed: int):
    logit = Pipeline([
        ("impute", SimpleImputer(strategy="constant", fill_value=0.0)),
        ("scale", StandardScaler()),
        ("clf", LogisticRegression(max_iter=2000, solver="saga", penalty="l2", class_weight="balanced", random_state=seed)),
    ])
    logit_grid = {"clf__C": [0.1, 0.25, 0.5, 1.0, 2.0, 5.0]}

    gb = Pipeline([
        ("impute", SimpleImputer(strategy="constant", fill_value=0.0)),
        ("clf", GradientBoostingClassifier(random_state=seed)),
    ])
    gb_grid = {
        "clf__n_estimators": [200, 400],
        "clf__learning_rate": [0.05, 0.1],
        "clf__max_depth": [2, 3],
        "clf__subsample": [0.7, 1.0],
    }
    return {"logistic": (logit, logit_grid), "gboost": (gb, gb_grid)}


def _build_matrix(charts, include_aspect_feats=True) -> Tuple[np.ndarray, np.ndarray, np.ndarray, list]:
    # Feature vector = house_features + optional aspect_house_features
    rows = []
    ids = []
    y = []
    # Build a sample row to determine vector sizes
    hf_dim = len(house_features(charts[0])) if charts else 0
    af_dim = len(aspect_house_features(charts[0])) if (charts and include_aspect_feats) else 0
    feat_cols = [f"H_{i}" for i in range(hf_dim)] + ([f"A_{i}" for i in range(af_dim)] if include_aspect_feats else [])

    for ch in charts:
        hvec = house_features(ch)
        avec = aspect_house_features(ch) if include_aspect_feats else np.zeros(0, dtype=float)
        row = np.concatenate([hvec, avec])
        rows.append(row)
        ids.append(ch.id or "")
        y.append(1 if (ch.label or "").lower() == "artist" else 0)
    X = np.asarray(rows, dtype=float)
    y = np.asarray(y, dtype=int)
    ids = np.asarray(ids)
    return X, y, ids, feat_cols


def main():
    ap = argparse.ArgumentParser(description="Publish-to-Survive JSON charts — Training & Evaluation")
    ap.add_argument("--charts-dir", required=True, help="Directory containing chart JSON files")
    ap.add_argument("--out", required=True, help="Path to write JSON results")
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--holdout", type=float, default=0.25)
    ap.add_argument("--models", choices=["both", "logistic", "gboost"], default="both")
    ap.add_argument("--include-aspect-features", action="store_true")
    ap.add_argument("--report-alignment", action="store_true", help="If provided, expects uncanny scores alongside labels in metadata")
    args = ap.parse_args()

    charts = load_charts_dir(args.charts_dir)
    if not charts:
        raise SystemExit(f"No charts found in {args.charts_dir}")

    X, y, ids, feat_cols = _build_matrix(charts, include_aspect_feats=args.include_aspect_features)
    if len(np.unique(y)) < 2:
        raise SystemExit("Single-class labels in dataset; cannot train.")

    sss = StratifiedShuffleSplit(n_splits=1, test_size=args.holdout, random_state=args.seed)
    tr_idx, te_idx = next(sss.split(X, y))
    Xtr, Xte = X[tr_idx], X[te_idx]
    ytr, yte = y[tr_idx], y[te_idx]
    ids_holdout = ids[te_idx].tolist()

    model_dict = _build_pipelines(args.seed)
    results = {"holdout_ids": ids_holdout, "models": {}}

    models = ("logistic", "gboost") if args.models == "both" else (args.models,)
    for name in models:
        pipe, grid = model_dict[name]
        inner = StratifiedKFold(n_splits=3, shuffle=True, random_state=args.seed)
        gs = GridSearchCV(pipe, grid, scoring="roc_auc", cv=inner, n_jobs=-1, refit=True)
        gs.fit(Xtr, ytr)
        p_tr = gs.predict_proba(Xtr)[:, 1]
        p_te = gs.predict_proba(Xte)[:, 1]

        res = {
            "best_params": gs.best_params_,
            "train": {
                "auc": auc_score(p_tr, ytr),
                "brier": brier_score(p_tr, ytr),
                "logloss": logloss(p_tr, ytr),
                "ece": ece_score(p_tr, ytr),
                "accuracy_best_t": accuracy_at_best_threshold(p_tr, ytr),
            },
            "holdout": {
                "auc": auc_score(p_te, yte),
                "brier": brier_score(p_te, yte),
                "logloss": logloss(p_te, yte),
                "ece": ece_score(p_te, yte),
                "accuracy_best_t": accuracy_at_best_threshold(p_te, yte),
            },
        }

        # Optional alignment with uncanny score if present in chart metadata as 'uncanny'
        if args.report_alignment:
            # gather uncanny for splits in same order
            u_all = np.array([float(getattr(ch, "uncanny", getattr(getattr(ch, "metadata", {}), "uncanny", 0.0))) if hasattr(ch, "uncanny") else float((getattr(ch, "label", "") == "uncanny")) for ch in charts])
            u_tr = u_all[tr_idx]
            u_te = u_all[te_idx]
            try:
                align_tr = alignment_score(p_tr, u_tr)
                align_te = alignment_score(p_te, u_te)
                lo, hi = bootstrap_alignment_ci(p_te, u_te)
                res["alignment"] = {"train": align_tr, "holdout": align_te, "holdout_ci95": [lo, hi]}
            except Exception:
                pass

        results["models"][name] = res

    results["meta"] = {
        "timestamp_utc": datetime.utcnow().isoformat() + "Z",
        "seed": args.seed,
        "holdout": args.holdout,
        "n_samples": int(X.shape[0]),
        "n_features": int(X.shape[1]),
        "feature_columns": feat_cols,
        "class_balance": {"artists": int(np.sum(y == 1)), "controls": int(np.sum(y == 0))},
        "include_aspect_features": bool(args.include_aspect_features),
    }

    os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"[ok] wrote {args.out}")


if __name__ == "__main__":
    main()

