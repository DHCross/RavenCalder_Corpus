import argparse
import json
import numpy as np
from sklearn.metrics import (
    roc_auc_score,
    brier_score_loss,
    log_loss,
    precision_recall_curve,
    average_precision_score,
    matthews_corrcoef,
    f1_score,
)
from pss.metrics import ece_score

def bootstrap_auc_ci(y, p, iters=10000, alpha=0.05, seed=42):
    rng = np.random.default_rng(seed)
    n = len(y)
    stats = []
    for _ in range(iters):
        idx = rng.integers(0, n, size=n)
        try:
            stats.append(roc_auc_score(y[idx], p[idx]))
        except ValueError:
            # single-class sample; skip
            pass
    lo = float(np.quantile(stats, alpha/2))
    hi = float(np.quantile(stats, 1-alpha/2))
    return lo, hi

def permutation_auc_pvalue(y, p, iters=10000, seed=123):
    rng = np.random.default_rng(seed)
    obs = roc_auc_score(y, p)
    null = []
    for _ in range(iters):
        y_perm = rng.permutation(y)
        null.append(roc_auc_score(y_perm, p))
    null = np.array(null)
    p_perm = float((np.sum(null >= obs) + 1) / (len(null) + 1))
    return obs, float(np.mean(null)), float(np.std(null)), p_perm

def reliability(y, p):
    # slope/intercept from regressing y on p (simple approximation of reliability curve)
    X = np.vstack([p, np.ones_like(p)]).T
    beta, _, _, _ = np.linalg.lstsq(X, y, rcond=None)
    slope = float(beta[0])
    intercept = float(beta[1])
    return slope, intercept


def best_threshold_by_youden(y, p):
    # scan thresholds 0..1 step .01; choose that maximizes TPR-FPR (Youden J)
    ts = np.linspace(0, 1, 101)
    best_t = 0.5
    best_j = -1.0
    for t in ts:
        yhat = (p >= t).astype(int)
        tp = np.sum((y == 1) & (yhat == 1))
        fn = np.sum((y == 1) & (yhat == 0))
        fp = np.sum((y == 0) & (yhat == 1))
        tn = np.sum((y == 0) & (yhat == 0))
        tpr = tp / max(1, (tp + fn))
        fpr = fp / max(1, (fp + tn))
        j = tpr - fpr
        if j > best_j:
            best_j = j
            best_t = float(t)
    return best_t

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--results', required=True, help='Path to results JSON produced by CLI')
    ap.add_argument('--model', default='logistic', choices=['logistic','gboost'])
    ap.add_argument('--iters', type=int, default=10000)
    ap.add_argument('--exclude-ids', type=str, default=None, help='Optional path to newline-separated IDs to exclude from analysis')
    args = ap.parse_args()

    with open(args.results, 'r', encoding='utf-8') as f:
        res = json.load(f)

    m = res['models'].get(args.model)
    if not m or 'holdout_detail' not in m:
        raise SystemExit('Holdout detail not found; rerun CLI to include holdout_detail in results.')

    d = m['holdout_detail']
    ids = np.array(d['ids'])
    y = np.array(d['y_true'], dtype=int)
    p = np.array(d['p_hat'], dtype=float)

    if args.exclude_ids:
        with open(args.exclude_ids, 'r', encoding='utf-8') as f:
            excl = {line.strip() for line in f if line.strip()}
        keep = np.array([i not in excl for i in ids])
        ids = ids[keep]
        y = y[keep]
        p = p[keep]

    auc = roc_auc_score(y, p)
    brier = brier_score_loss(y, p)
    try:
        ll = log_loss(y, np.column_stack([1-p, p]))
    except Exception:
        ll = None
    # calibration error (ECE)
    try:
        ece = float(ece_score(p, y, bins=10))
    except Exception:
        ece = None
    slope, intercept = reliability(y, p)
    lo, hi = bootstrap_auc_ci(y, p, iters=args.iters)
    obs, null_mean, null_sd, p_perm = permutation_auc_pvalue(y, p, iters=args.iters)

    # PR-AUC
    pr_auc = average_precision_score(y, p)
    # thresholded metrics at 0.5 and best Youden
    t_best = best_threshold_by_youden(y, p)
    def thresh_metrics(t):
        yhat = (p >= t).astype(int)
        return {
            'threshold': float(t),
            'mcc': float(matthews_corrcoef(y, yhat)),
            'macro_f1': float(f1_score(y, yhat, average='macro')),
        }
    tm_05 = thresh_metrics(0.5)
    tm_best = thresh_metrics(t_best)

    out = {
        'auc': auc,
        'auc_ci95': [lo, hi],
        'brier': brier,
        'logloss': ll,
        'ece': ece,
        'reliability_slope': slope,
        'reliability_intercept': intercept,
        'pr_auc': pr_auc,
        'perm_null_mean': null_mean,
        'perm_null_sd': null_sd,
        'perm_p_value': p_perm,
        'n_holdout': int(len(y)),
        'ids_used': ids.tolist(),
        'threshold_metrics': {
            't05': tm_05,
            't_best_youden': tm_best,
        },
    }
    print(json.dumps(out, indent=2))

if __name__ == '__main__':
    main()
