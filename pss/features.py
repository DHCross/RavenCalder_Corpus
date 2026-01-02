import numpy as np
from itertools import combinations
from typing import List, Tuple

from .schema import Chart


MAJOR = {"conjunction", "opposition", "square", "trine", "sextile"}
PUBLIC = {5, 9, 10, 11}
PRIVATE = {4, 8, 12}
PUBLIC_W = {5: 0.25, 9: 0.25, 10: 0.30, 11: 0.20}
PRIVATE_W = {4: 0.30, 8: 0.40, 12: 0.30}
PERSONAL = {"Sun", "Moon", "Mercury", "Venus", "Mars"}
OUTER = {"Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Chiron"}
ANGLES = {"ASC", "MC", "DSC", "IC"}


def encode_planet_house(body_house: int) -> np.ndarray:
    """Dense, model-friendly per-planet house encoding.

    Returns: [12 one-hot houses] + [angular, succedent, cadent] + [publicness_weight, privateness_weight]
    """
    h = np.zeros(12, dtype=float)
    idx = max(1, min(12, int(body_house))) - 1
    h[idx] = 1.0
    angular = 1.0 if body_house in {1, 4, 7, 10} else 0.0
    succedent = 1.0 if body_house in {2, 5, 8, 11} else 0.0
    cadent = 1.0 if body_house in {3, 6, 9, 12} else 0.0
    public_w = float(PUBLIC_W.get(body_house, 0.0))
    private_w = float(PRIVATE_W.get(body_house, 0.0))
    return np.concatenate([h, [angular, succedent, cadent, public_w, private_w]]).astype(float)


def house_features(chart: Chart) -> np.ndarray:
    """Concatenate per-planet encodings in deterministic planet order."""
    # Deterministic planet order by name
    names = sorted(chart.planets.keys())
    vecs = [encode_planet_house(chart.planets[n].house) for n in names]
    return np.concatenate(vecs) if vecs else np.zeros(0, dtype=float)


def _count_personal_outer_major(chart: Chart) -> int:
    majors = [a for a in chart.aspects if a.type in MAJOR]
    cnt = 0
    for a in majors:
        endpoints = {a.a, a.b}
        if (endpoints & PERSONAL) and (endpoints & OUTER):
            cnt += 1
    return cnt


def _public_link_rate(chart: Chart) -> float:
    majors = [a for a in chart.aspects if a.type in MAJOR]
    if not majors:
        return 0.0
    lk = 0
    for a in majors:
        ah = chart.planets.get(a.a).house if a.a in chart.planets else None
        bh = chart.planets.get(a.b).house if a.b in chart.planets else None
        if (ah in PUBLIC) or (bh in PUBLIC):
            lk += 1
    return float(lk) / float(len(majors))


def _angle_hits(chart: Chart) -> int:
    majors = [a for a in chart.aspects if a.type in MAJOR]
    hits = 0
    for a in majors:
        if (a.a in ANGLES) or (a.b in ANGLES):
            hits += 1
    return hits


def _mars_chain_public(chart: Chart) -> int:
    if "Mars" not in chart.planets:
        return 0
    mh = chart.planets["Mars"].house
    if mh in PUBLIC:
        # Mars present in public house and has at least one major aspect
        for asp in chart.aspects:
            if asp.type in MAJOR and ("Mars" == asp.a or "Mars" == asp.b):
                return 1
    return 0


def _mercury_rx_depth(chart: Chart) -> int:
    m = chart.planets.get("Mercury")
    if not m:
        return 0
    return int(bool(m.retro and (m.house in {8, 12})))


def aspect_house_features(chart: Chart) -> np.ndarray:
    """Compact features relating aspects with house/publicness logic.

    Returns vector:
      [personal_outer_major_count,
       public_link_rate,
       angle_hits,
       mars_chain_public,
       mercury_rx_depth]
    """
    return np.array([
        float(_count_personal_outer_major(chart)),
        float(_public_link_rate(chart)),
        float(_angle_hits(chart)),
        float(_mars_chain_public(chart)),
        float(_mercury_rx_depth(chart)),
    ], dtype=float)

