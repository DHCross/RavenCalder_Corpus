import argparse
import json
import re
from pathlib import Path


def fmt(v, nd=3):
    try:
        return f"{float(v):.{nd}f}"
    except Exception:
        return str(v)


def build_lines(metrics: dict):
    auc = fmt(metrics.get('auc'))
    ci = metrics.get('auc_ci95') or [None, None]
    ci_lo = fmt(ci[0]) if ci[0] is not None else "—"
    ci_hi = fmt(ci[1]) if ci[1] is not None else "—"
    pr_auc = fmt(metrics.get('pr_auc'))

    # thresholded metrics: prefer best Youden
    tm = (metrics.get('threshold_metrics') or {}).get('t_best_youden', {})
    mcc = fmt(tm.get('mcc'))
    macro_f1 = fmt(tm.get('macro_f1'))

    brier = fmt(metrics.get('brier'))
    # ECE may be present from significance_report
    ece_val = metrics.get('ece')
    ece = fmt(ece_val) if ece_val is not None else "__"
    slope = fmt(metrics.get('reliability_slope'))
    intercept = fmt(metrics.get('reliability_intercept'))

    null_mean = fmt(metrics.get('perm_null_mean'))
    null_sd = fmt(metrics.get('perm_null_sd'))
    p_perm = fmt(metrics.get('perm_p_value'))

    parent_signature = (
        f"- **Parent signature (presence)**: AUC = {auc} [95% CI {ci_lo}–{ci_hi}], "
        f"PR-AUC = {pr_auc}, MCC = {mcc}, Macro-F1 = {macro_f1}"
    )

    calibration = (
        f"- **Calibration**: Brier = {brier}, ECE = {ece}; "
        f"reliability slope = {slope}, intercept = {intercept}"
    )

    significance = (
        f"- **Significance**: Permutation AUC null mean = {null_mean} (SD {null_sd}); "
        f"observed AUC p_perm = {p_perm}"
    )

    return parent_signature, calibration, significance


def update_study(study_path: Path, metrics: dict, out_path: Path | None):
    text = study_path.read_text(encoding='utf-8')
    parent_signature, calibration, significance = build_lines(metrics)

    lines = text.splitlines()
    for i, line in enumerate(lines):
        l = line.strip()
        if l.startswith("- **Parent signature (presence)**"):
            lines[i] = parent_signature
        elif l.startswith("- **Calibration**:"):
            lines[i] = calibration
        elif l.startswith("- **Significance**:"):
            lines[i] = significance
    updated = "\n".join(lines)

    target = out_path or study_path
    target.write_text(updated, encoding='utf-8')
    return target


def main():
    ap = argparse.ArgumentParser(description="Insert metrics into study Markdown")
    ap.add_argument('--study', required=True, help='Path to the study Markdown file')
    ap.add_argument('--metrics', required=True, help='Path to metrics JSON (from significance_report.py)')
    ap.add_argument('--out', default=None, help='Optional output path; defaults to in-place update')
    args = ap.parse_args()

    study_path = Path(args.study)
    metrics_path = Path(args.metrics)
    out_path = Path(args.out) if args.out else None

    metrics = json.loads(metrics_path.read_text(encoding='utf-8'))
    target = update_study(study_path, metrics, out_path)
    print(f"[ok] updated: {target}")


if __name__ == '__main__':
    main()
