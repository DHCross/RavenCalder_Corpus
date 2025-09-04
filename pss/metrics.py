import numpy as np
from typing import Tuple
from sklearn.metrics import roc_auc_score, log_loss


def brier_score(p: np.ndarray, y: np.ndarray) -> float:
    p = np.clip(p, 1e-9, 1 - 1e-9)
    return float(np.mean((p - y) ** 2))


def auc_score(p: np.ndarray, y: np.ndarray) -> float:
    return float(roc_auc_score(y, p))


def logloss(p: np.ndarray, y: np.ndarray) -> float:
    p = np.clip(p, 1e-9, 1 - 1e-9)
    return float(log_loss(y, p))


def accuracy_at_best_threshold(p: np.ndarray, y: np.ndarray) -> float:
    ts = np.linspace(0.0, 1.0, 101)
    best_acc = 0.0
    for t in ts:
        yhat = (p >= t).astype(int)
        acc = float(np.mean(yhat == y))
        # Could optimize by Youden J, but accuracy suffices for summary
        if acc > best_acc:
            best_acc = acc
    return best_acc


def ece_score(p: np.ndarray, y: np.ndarray, bins: int = 10) -> float:
    # Equal-width bins on [0,1]
    p = np.clip(p, 1e-9, 1 - 1e-9)
    edges = np.linspace(0.0, 1.0, bins + 1)
    ece = 0.0
    n = len(y)
    for i in range(bins):
        lo, hi = edges[i], edges[i + 1]
        mask = (p >= lo) & (p < hi) if i < bins - 1 else (p >= lo) & (p <= hi)
        m = int(np.sum(mask))
        if m == 0:
            continue
        conf = float(np.mean(p[mask]))
        acc = float(np.mean(y[mask]))
        ece += (m / n) * abs(acc - conf)
    return float(ece)


def alignment_score(p: np.ndarray, u: np.ndarray) -> float:
    """1 - mean absolute difference between model probability p and uncanny score u."""
    return float(1.0 - np.mean(np.abs(p - u)))


def bootstrap_alignment_ci(p: np.ndarray, u: np.ndarray, iters: int = 1000, alpha: float = 0.05) -> Tuple[float, float]:
    rng = np.random.default_rng(42)
    n = len(p)
    stats = []
    for _ in range(iters):
        idx = rng.integers(0, n, size=n)
        stats.append(1.0 - float(np.mean(np.abs(p[idx] - u[idx]))))
    lo = float(np.quantile(stats, alpha / 2.0))
    hi = float(np.quantile(stats, 1.0 - alpha / 2.0))
    return lo, hi

