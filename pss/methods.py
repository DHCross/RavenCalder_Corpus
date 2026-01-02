import numpy as np
from typing import Dict, List


def uncanny_score(factors: List[float]) -> float:
    """Compute Uncanny score with fixed weights per spec.

    factors order: [symbolic_precision, temporal_accuracy, multi_layer_alignment,
                    context_match, statistical_rarity, impact_level]
    Weights: [0.2, 0.2, 0.15, 0.15, 0.2, 0.1]
    """
    w = np.array([0.2, 0.2, 0.15, 0.15, 0.2, 0.1], dtype=float)
    s = np.array(factors, dtype=float)
    if s.shape[0] != 6:
        raise ValueError("Uncanny score expects 6 factors.")
    return float(np.dot(w, s))


def bias_risk(components: Dict[str, float]) -> float:
    """Weighted bias risk composite. Components in [0,1].

    Expected keys:
      selection, interpretation, confirmation, expectation, post_hoc
    Weights: [0.35, 0.15, 0.10, 0.30, 0.10]
    """
    keys = ["selection", "interpretation", "confirmation", "expectation", "post_hoc"]
    w = np.array([0.35, 0.15, 0.10, 0.30, 0.10], dtype=float)
    x = np.array([components.get(k, 0.0) for k in keys], dtype=float)
    # clip to [0,1]
    x = np.clip(x, 0.0, 1.0)
    return float(np.dot(w, x))


def stability_delta(prev: float, new: float, eps: float = 1e-6) -> float:
    """Relative change between versions for a score (e.g., signature strength)."""
    denom = max(eps, prev)
    return float(abs(new - prev) / denom)


def rolling_window_corr(x: np.ndarray, y: np.ndarray, w: int) -> np.ndarray:
    """Compute rolling window Pearson correlation for two 1D arrays."""
    if len(x) != len(y):
        raise ValueError("x and y must have same length")
    n = len(x)
    if w < 2 or w > n:
        raise ValueError("Invalid window size")
    out = []
    for i in range(n - w + 1):
        xi = x[i:i + w]
        yi = y[i:i + w]
        if np.std(xi) == 0 or np.std(yi) == 0:
            out.append(0.0)
        else:
            out.append(float(np.corrcoef(xi, yi)[0, 1]))
    return np.array(out, dtype=float)

