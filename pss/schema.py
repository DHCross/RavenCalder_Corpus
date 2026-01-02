from dataclasses import dataclass
from typing import Dict, List, Optional


@dataclass
class Body:
    lon: float          # absolute longitude in degrees [0, 360)
    sign: Optional[str] # optional sign label (e.g., "Leo")
    house: int          # 1..12
    retro: bool = False


@dataclass
class Aspect:
    a: str              # endpoint A name (planet or point like ASC/MC)
    b: str              # endpoint B name
    type: str           # e.g., 'trine', 'opposition', 'square', 'sextile', 'conjunction'
    orb: float          # absolute orb in degrees
    applying: bool      # whether aspect is applying


@dataclass
class Chart:
    angles: Dict[str, float]                 # e.g., {"ASC": 25.08, "MC": 7.91, ...}
    houses: Dict[int, Dict[str, float]]      # {house_num: {"cusp_deg": float, ...}}
    planets: Dict[str, Body]
    aspects: List[Aspect]
    # Optional metadata for label/id
    id: Optional[str] = None
    label: Optional[str] = None              # e.g., 'artist' vs 'control' or other target

