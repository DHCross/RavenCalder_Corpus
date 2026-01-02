import json
import os
from typing import List, Tuple, Dict, Optional

from .schema import Chart, Body, Aspect


def load_chart_from_json(path: str) -> Chart:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    angles = data.get("angles", {})
    houses = data.get("houses", {})
    planets_raw = data.get("planets", {})
    aspects_raw = data.get("aspects", [])

    planets: Dict[str, Body] = {}
    for name, b in planets_raw.items():
        planets[name] = Body(
            lon=float(b.get("lon", 0.0)),
            sign=b.get("sign"),
            house=int(b.get("house", 0)),
            retro=bool(b.get("retro", False)),
        )

    aspects: List[Aspect] = []
    for a in aspects_raw:
        aspects.append(Aspect(
            a=str(a.get("a")),
            b=str(a.get("b")),
            type=str(a.get("type")),
            orb=float(a.get("orb", 0.0)),
            applying=bool(a.get("applying", False)),
        ))

    meta = data.get("metadata", {})
    cid = meta.get("id") or os.path.splitext(os.path.basename(path))[0]
    label = meta.get("class") or meta.get("label")

    return Chart(angles=angles, houses=houses, planets=planets, aspects=aspects, id=cid, label=label)


def load_charts_dir(dirpath: str) -> List[Chart]:
    charts: List[Chart] = []
    for root, _, files in os.walk(dirpath):
        for fn in files:
            if fn.endswith(".json"):
                charts.append(load_chart_from_json(os.path.join(root, fn)))
    return charts

