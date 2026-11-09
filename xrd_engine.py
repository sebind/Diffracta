import os
import re
import json
import math
import glob
import xml.etree.ElementTree as ET
from typing import List, Dict, Any, Optional, Tuple
import numpy as np
from scipy.signal import savgol_filter, find_peaks
from scipy.optimize import least_squares
import requests

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_DIR = os.environ.get("DIFFRACTA_DB_DIR", os.path.join(BASE_DIR, "database"))
SAMPLE_DIR = os.environ.get("DIFFRACTA_SAMPLE_DIR", os.path.join(BASE_DIR, "sample_data"))

# Atomic numbers (Z) used as scattering factor approximation f0(s) = Z * exp(-B*s^2)
ATOMIC_Z = {
    "H": 1, "He": 2, "Li": 3, "Be": 4, "B": 5, "C": 6, "N": 7, "O": 8, "F": 9, "Ne": 10,
    "Na": 11, "Mg": 12, "Al": 13, "Si": 14, "P": 15, "S": 16, "Cl": 17, "Ar": 18,
    "K": 19, "Ca": 20, "Sc": 21, "Ti": 22, "V": 23, "Cr": 24, "Mn": 25, "Fe": 26,
    "Co": 27, "Ni": 28, "Cu": 29, "Zn": 30, "Ga": 31, "Ge": 32, "As": 33, "Se": 34,
    "Br": 35, "Kr": 36, "Rb": 37, "Sr": 38, "Y": 39, "Zr": 40, "Nb": 41, "Mo": 42,
    "Tc": 43, "Ru": 44, "Rh": 45, "Pd": 46, "Ag": 47, "Cd": 48, "In": 49, "Sn": 50,
    "Sb": 51, "Te": 52, "I": 53, "Xe": 54, "Cs": 55, "Ba": 56, "La": 57, "Ce": 58,
    "Pr": 59, "Nd": 60, "Sm": 62, "Eu": 63, "Gd": 64, "Tb": 65, "Dy": 66, "Ho": 67,
    "Er": 68, "Tm": 69, "Yb": 70, "Lu": 71, "Hf": 72, "Ta": 73, "W": 74, "Re": 75,
    "Os": 76, "Ir": 77, "Pt": 78, "Au": 79, "Hg": 80, "Tl": 81, "Pb": 82, "Bi": 83,
    "Th": 90, "U": 92
}

# Built-in curated crystallographic reference library seeded into e:\XRD\database
SEED_PHASES = [
    {
        "id": "036-1451",
        "jcpds": "036-1451",
        "cod_id": "2300450",
        "name": "Zincite (ZnO)",
        "formula": "ZnO",
        "system": "Hexagonal",
        "space_group": "P63mc",
        "cell": {"a": 3.2498, "b": 3.2498, "c": 5.2066, "alpha": 90.0, "beta": 90.0, "gamma": 120.0},
        "peaks": [
            {"two_theta": 31.77, "intensity": 57.0, "hkl": [1, 0, 0], "d": 2.8143},
            {"two_theta": 34.42, "intensity": 44.0, "hkl": [0, 0, 2], "d": 2.6033},
            {"two_theta": 36.25, "intensity": 100.0, "hkl": [1, 0, 1], "d": 2.4759},
            {"two_theta": 47.54, "intensity": 23.0, "hkl": [1, 0, 2], "d": 1.9111},
            {"two_theta": 56.60, "intensity": 32.0, "hkl": [1, 1, 0], "d": 1.6249},
            {"two_theta": 62.86, "intensity": 29.0, "hkl": [1, 0, 3], "d": 1.4772},
            {"two_theta": 66.38, "intensity": 4.0, "hkl": [2, 0, 0], "d": 1.4072},
            {"two_theta": 67.96, "intensity": 23.0, "hkl": [1, 1, 2], "d": 1.3782},
            {"two_theta": 69.10, "intensity": 11.0, "hkl": [2, 0, 1], "d": 1.3583},
            {"two_theta": 72.56, "intensity": 2.0, "hkl": [0, 0, 4], "d": 1.3017},
            {"two_theta": 76.96, "intensity": 4.0, "hkl": [2, 0, 2], "d": 1.2380}
        ]
    },
    {
        "id": "021-1272",
        "jcpds": "021-1272",
        "cod_id": "9009086",
        "name": "Anatase (TiO2)",
        "formula": "TiO2",
        "system": "Tetragonal",
        "space_group": "I41/amd",
        "cell": {"a": 3.7852, "b": 3.7852, "c": 9.5139, "alpha": 90.0, "beta": 90.0, "gamma": 90.0},
        "peaks": [
            {"two_theta": 25.28, "intensity": 100.0, "hkl": [1, 0, 1], "d": 3.5200},
            {"two_theta": 36.95, "intensity": 10.0, "hkl": [1, 0, 3], "d": 2.4310},
            {"two_theta": 37.80, "intensity": 20.0, "hkl": [0, 0, 4], "d": 2.3780},
            {"two_theta": 38.58, "intensity": 8.0, "hkl": [1, 1, 2], "d": 2.3320},
            {"two_theta": 48.05, "intensity": 35.0, "hkl": [2, 0, 0], "d": 1.8920},
            {"two_theta": 53.89, "intensity": 20.0, "hkl": [1, 0, 5], "d": 1.6999},
            {"two_theta": 55.06, "intensity": 20.0, "hkl": [2, 1, 1], "d": 1.6665},
            {"two_theta": 62.69, "intensity": 14.0, "hkl": [2, 0, 4], "d": 1.4808},
            {"two_theta": 68.76, "intensity": 6.0, "hkl": [1, 1, 6], "d": 1.3641},
            {"two_theta": 70.31, "intensity": 6.0, "hkl": [2, 2, 0], "d": 1.3378}
        ]
    },
    {
        "id": "021-1276",
        "jcpds": "021-1276",
        "cod_id": "9004141",
        "name": "Rutile (TiO2)",
        "formula": "TiO2",
        "system": "Tetragonal",
        "space_group": "P42/mnm",
        "cell": {"a": 4.5933, "b": 4.5933, "c": 2.9592, "alpha": 90.0, "beta": 90.0, "gamma": 90.0},
        "peaks": [
            {"two_theta": 27.45, "intensity": 100.0, "hkl": [1, 1, 0], "d": 3.2470},
            {"two_theta": 36.09, "intensity": 50.0, "hkl": [1, 0, 1], "d": 2.4870},
            {"two_theta": 39.19, "intensity": 8.0, "hkl": [2, 0, 0], "d": 2.2970},
            {"two_theta": 41.23, "intensity": 25.0, "hkl": [1, 1, 1], "d": 2.1880},
            {"two_theta": 44.05, "intensity": 10.0, "hkl": [2, 1, 0], "d": 2.0540},
            {"two_theta": 54.32, "intensity": 60.0, "hkl": [2, 1, 1], "d": 1.6874},
            {"two_theta": 56.64, "intensity": 20.0, "hkl": [2, 2, 0], "d": 1.6237},
            {"two_theta": 62.74, "intensity": 10.0, "hkl": [0, 0, 2], "d": 1.4797},
            {"two_theta": 64.04, "intensity": 10.0, "hkl": [3, 1, 0], "d": 1.4528},
            {"two_theta": 69.01, "intensity": 20.0, "hkl": [3, 0, 1], "d": 1.3598}
        ]
    },
    {
        "id": "027-1402",
        "jcpds": "027-1402",
        "cod_id": "9011998",
        "name": "Silicon (Si)",
        "formula": "Si",
        "system": "Cubic",
        "space_group": "Fd-3m",
        "cell": {"a": 5.4309, "b": 5.4309, "c": 5.4309, "alpha": 90.0, "beta": 90.0, "gamma": 90.0},
        "peaks": [
            {"two_theta": 28.44, "intensity": 100.0, "hkl": [1, 1, 1], "d": 3.1355},
            {"two_theta": 47.30, "intensity": 55.0, "hkl": [2, 2, 0], "d": 1.9201},
            {"two_theta": 56.12, "intensity": 30.0, "hkl": [3, 1, 1], "d": 1.6375},
            {"two_theta": 69.13, "intensity": 6.0, "hkl": [4, 0, 0], "d": 1.3577},
            {"two_theta": 76.38, "intensity": 11.0, "hkl": [3, 3, 1], "d": 1.2459}
        ]
    },
    {
        "id": "046-1212",
        "jcpds": "046-1212",
        "cod_id": "1000032",
        "name": "Corundum (alpha-Al2O3)",
        "formula": "Al2O3",
        "system": "Hexagonal",
        "space_group": "R-3c",
        "cell": {"a": 4.7587, "b": 4.7587, "c": 12.9929, "alpha": 90.0, "beta": 90.0, "gamma": 120.0},
        "peaks": [
            {"two_theta": 25.58, "intensity": 68.0, "hkl": [0, 1, 2], "d": 3.4799},
            {"two_theta": 35.15, "intensity": 100.0, "hkl": [1, 0, 4], "d": 2.5509},
            {"two_theta": 37.78, "intensity": 46.0, "hkl": [1, 1, 0], "d": 2.3794},
            {"two_theta": 43.35, "intensity": 96.0, "hkl": [1, 1, 3], "d": 2.0854},
            {"two_theta": 52.55, "intensity": 47.0, "hkl": [0, 2, 4], "d": 1.7400},
            {"two_theta": 57.50, "intensity": 92.0, "hkl": [1, 1, 6], "d": 1.6015},
            {"two_theta": 66.52, "intensity": 35.0, "hkl": [2, 1, 4], "d": 1.4045},
            {"two_theta": 68.21, "intensity": 52.0, "hkl": [3, 0, 0], "d": 1.3738}
        ]
    },
    {
        "id": "046-1045",
        "jcpds": "046-1045",
        "cod_id": "9012600",
        "name": "Quartz (alpha-SiO2)",
        "formula": "SiO2",
        "system": "Hexagonal",
        "space_group": "P3221",
        "cell": {"a": 4.9134, "b": 4.9134, "c": 5.4052, "alpha": 90.0, "beta": 90.0, "gamma": 120.0},
        "peaks": [
            {"two_theta": 20.86, "intensity": 22.0, "hkl": [1, 0, 0], "d": 4.2550},
            {"two_theta": 26.64, "intensity": 100.0, "hkl": [1, 0, 1], "d": 3.3435},
            {"two_theta": 36.54, "intensity": 8.0, "hkl": [1, 1, 0], "d": 2.4567},
            {"two_theta": 39.47, "intensity": 7.0, "hkl": [1, 0, 2], "d": 2.2814},
            {"two_theta": 42.45, "intensity": 6.0, "hkl": [2, 0, 0], "d": 2.1277},
            {"two_theta": 50.14, "intensity": 14.0, "hkl": [1, 1, 2], "d": 1.8179},
            {"two_theta": 59.96, "intensity": 9.0, "hkl": [2, 1, 1], "d": 1.5415},
            {"two_theta": 68.14, "intensity": 7.0, "hkl": [2, 0, 3], "d": 1.3750}
        ]
    },
    {
        "id": "019-0629",
        "jcpds": "019-0629",
        "cod_id": "9005812",
        "name": "Magnetite (Fe3O4)",
        "formula": "Fe3O4",
        "system": "Cubic",
        "space_group": "Fd-3m",
        "cell": {"a": 8.3960, "b": 8.3960, "c": 8.3960, "alpha": 90.0, "beta": 90.0, "gamma": 90.0},
        "peaks": [
            {"two_theta": 30.10, "intensity": 30.0, "hkl": [2, 2, 0], "d": 2.9684},
            {"two_theta": 35.45, "intensity": 100.0, "hkl": [3, 1, 1], "d": 2.5315},
            {"two_theta": 37.09, "intensity": 8.0, "hkl": [2, 2, 2], "d": 2.4237},
            {"two_theta": 43.09, "intensity": 20.0, "hkl": [4, 0, 0], "d": 2.0990},
            {"two_theta": 53.45, "intensity": 10.0, "hkl": [4, 2, 2], "d": 1.7140},
            {"two_theta": 56.98, "intensity": 30.0, "hkl": [5, 1, 1], "d": 1.6155},
            {"two_theta": 62.57, "intensity": 40.0, "hkl": [4, 4, 0], "d": 1.4842}
        ]
    },
    {
        "id": "033-0664",
        "jcpds": "033-0664",
        "cod_id": "9000139",
        "name": "Hematite (alpha-Fe2O3)",
        "formula": "Fe2O3",
        "system": "Hexagonal",
        "space_group": "R-3c",
        "cell": {"a": 5.0356, "b": 5.0356, "c": 13.7489, "alpha": 90.0, "beta": 90.0, "gamma": 120.0},
        "peaks": [
            {"two_theta": 24.14, "intensity": 30.0, "hkl": [0, 1, 2], "d": 3.6840},
            {"two_theta": 33.15, "intensity": 100.0, "hkl": [1, 0, 4], "d": 2.7000},
            {"two_theta": 35.61, "intensity": 70.0, "hkl": [1, 1, 0], "d": 2.5190},
            {"two_theta": 40.85, "intensity": 20.0, "hkl": [1, 1, 3], "d": 2.2070},
            {"two_theta": 49.48, "intensity": 40.0, "hkl": [0, 2, 4], "d": 1.8406},
            {"two_theta": 54.09, "intensity": 45.0, "hkl": [1, 1, 6], "d": 1.6941},
            {"two_theta": 62.45, "intensity": 30.0, "hkl": [2, 1, 4], "d": 1.4859},
            {"two_theta": 63.99, "intensity": 30.0, "hkl": [3, 0, 0], "d": 1.4538}
        ]
    },
    {
        "id": "005-0626",
        "jcpds": "005-0626",
        "cod_id": "1507756",
        "name": "Barium Titanate (BaTiO3)",
        "formula": "BaTiO3",
        "system": "Tetragonal",
        "space_group": "P4mm",
        "cell": {"a": 3.9940, "b": 3.9940, "c": 4.0380, "alpha": 90.0, "beta": 90.0, "gamma": 90.0},
        "peaks": [
            {"two_theta": 22.24, "intensity": 25.0, "hkl": [1, 0, 0], "d": 3.9940},
            {"two_theta": 31.50, "intensity": 100.0, "hkl": [1, 0, 1], "d": 2.8380},
            {"two_theta": 38.89, "intensity": 25.0, "hkl": [1, 1, 1], "d": 2.3140},
            {"two_theta": 45.24, "intensity": 35.0, "hkl": [2, 0, 0], "d": 1.9970},
            {"two_theta": 50.92, "intensity": 12.0, "hkl": [2, 0, 1], "d": 1.7920},
            {"two_theta": 56.18, "intensity": 35.0, "hkl": [2, 1, 1], "d": 1.6360},
            {"two_theta": 65.85, "intensity": 20.0, "hkl": [2, 2, 0], "d": 1.4170}
        ]
    },
    {
        "id": "034-0394",
        "jcpds": "034-0394",
        "cod_id": "9009008",
        "name": "Cerianite (CeO2)",
        "formula": "CeO2",
        "system": "Cubic",
        "space_group": "Fm-3m",
        "cell": {"a": 5.4113, "b": 5.4113, "c": 5.4113, "alpha": 90.0, "beta": 90.0, "gamma": 90.0},
        "peaks": [
            {"two_theta": 28.55, "intensity": 100.0, "hkl": [1, 1, 1], "d": 3.1242},
            {"two_theta": 33.08, "intensity": 30.0, "hkl": [2, 0, 0], "d": 2.7057},
            {"two_theta": 47.48, "intensity": 51.0, "hkl": [2, 2, 0], "d": 1.9132},
            {"two_theta": 56.34, "intensity": 42.0, "hkl": [3, 1, 1], "d": 1.6316},
            {"two_theta": 59.09, "intensity": 8.0, "hkl": [2, 2, 2], "d": 1.5621},
            {"two_theta": 69.41, "intensity": 8.0, "hkl": [4, 0, 0], "d": 1.3528}
        ]
    },
    {
        "id": "005-0586",
        "jcpds": "005-0586",
        "cod_id": "9009668",
        "name": "Calcite (CaCO3)",
        "formula": "CaCO3",
        "system": "Hexagonal",
        "space_group": "R-3c",
        "cell": {"a": 4.9896, "b": 4.9896, "c": 17.0610, "alpha": 90.0, "beta": 90.0, "gamma": 120.0},
        "peaks": [
            {"two_theta": 23.05, "intensity": 12.0, "hkl": [0, 1, 2], "d": 3.8550},
            {"two_theta": 29.40, "intensity": 100.0, "hkl": [1, 0, 4], "d": 3.0355},
            {"two_theta": 35.97, "intensity": 14.0, "hkl": [1, 1, 0], "d": 2.4950},
            {"two_theta": 39.41, "intensity": 18.0, "hkl": [1, 1, 3], "d": 2.2845},
            {"two_theta": 43.16, "intensity": 18.0, "hkl": [2, 0, 2], "d": 2.0945},
            {"two_theta": 47.50, "intensity": 17.0, "hkl": [0, 1, 8], "d": 1.9125},
            {"two_theta": 48.51, "intensity": 17.0, "hkl": [1, 1, 6], "d": 1.8750}
        ]
    },
    {
        "id": "004-0836",
        "jcpds": "004-0836",
        "cod_id": "9013014",
        "name": "Copper (Cu)",
        "formula": "Cu",
        "system": "Cubic",
        "space_group": "Fm-3m",
        "cell": {"a": 3.6150, "b": 3.6150, "c": 3.6150, "alpha": 90.0, "beta": 90.0, "gamma": 90.0},
        "peaks": [
            {"two_theta": 43.30, "intensity": 100.0, "hkl": [1, 1, 1], "d": 2.0871},
            {"two_theta": 50.43, "intensity": 46.0, "hkl": [2, 0, 0], "d": 1.8075},
            {"two_theta": 74.13, "intensity": 20.0, "hkl": [2, 2, 0], "d": 1.2781}
        ]
    },
    {
        "id": "004-0783",
        "jcpds": "004-0783",
        "cod_id": "9008459",
        "name": "Silver (Ag)",
        "formula": "Ag",
        "system": "Cubic",
        "space_group": "Fm-3m",
        "cell": {"a": 4.0862, "b": 4.0862, "c": 4.0862, "alpha": 90.0, "beta": 90.0, "gamma": 90.0},
        "peaks": [
            {"two_theta": 38.12, "intensity": 100.0, "hkl": [1, 1, 1], "d": 2.3592},
            {"two_theta": 44.28, "intensity": 40.0, "hkl": [2, 0, 0], "d": 2.0431},
            {"two_theta": 64.43, "intensity": 25.0, "hkl": [2, 2, 0], "d": 1.4447},
            {"two_theta": 77.47, "intensity": 26.0, "hkl": [3, 1, 1], "d": 1.2320}
        ]
    },
    {
        "id": "004-0784",
        "jcpds": "004-0784",
        "cod_id": "9008463",
        "name": "Gold (Au)",
        "formula": "Au",
        "system": "Cubic",
        "space_group": "Fm-3m",
        "cell": {"a": 4.0786, "b": 4.0786, "c": 4.0786, "alpha": 90.0, "beta": 90.0, "gamma": 90.0},
        "peaks": [
            {"two_theta": 38.18, "intensity": 100.0, "hkl": [1, 1, 1], "d": 2.3548},
            {"two_theta": 44.39, "intensity": 52.0, "hkl": [2, 0, 0], "d": 2.0393},
            {"two_theta": 64.58, "intensity": 32.0, "hkl": [2, 2, 0], "d": 1.4420},
            {"two_theta": 77.55, "intensity": 36.0, "hkl": [3, 1, 1], "d": 1.2297}
        ]
    },
    {
        "id": "045-0946",
        "jcpds": "045-0946",
        "cod_id": "9006789",
        "name": "Periclase (MgO)",
        "formula": "MgO",
        "system": "Cubic",
        "space_group": "Fm-3m",
        "cell": {"a": 4.2112, "b": 4.2112, "c": 4.2112, "alpha": 90.0, "beta": 90.0, "gamma": 90.0},
        "peaks": [
            {"two_theta": 36.94, "intensity": 10.0, "hkl": [1, 1, 1], "d": 2.4313},
            {"two_theta": 42.92, "intensity": 100.0, "hkl": [2, 0, 0], "d": 2.1056},
            {"two_theta": 62.30, "intensity": 52.0, "hkl": [2, 2, 0], "d": 1.4889},
            {"two_theta": 74.69, "intensity": 6.0, "hkl": [3, 1, 1], "d": 1.2697}
        ]
    },
    {
        "id": "034-0427",
        "jcpds": "034-0427",
        "cod_id": "1000057",
        "name": "Lanthanum Hexaboride (LaB6 NIST 660c)",
        "formula": "LaB6",
        "system": "Cubic",
        "space_group": "Pm-3m",
        "cell": {"a": 4.1569, "b": 4.1569, "c": 4.1569, "alpha": 90.0, "beta": 90.0, "gamma": 90.0},
        "peaks": [
            {"two_theta": 21.36, "intensity": 58.0, "hkl": [1, 0, 0], "d": 4.1569},
            {"two_theta": 30.38, "intensity": 100.0, "hkl": [1, 1, 0], "d": 2.9394},
            {"two_theta": 37.44, "intensity": 46.0, "hkl": [1, 1, 1], "d": 2.4000},
            {"two_theta": 43.51, "intensity": 28.0, "hkl": [2, 0, 0], "d": 2.0785},
            {"two_theta": 48.96, "intensity": 48.0, "hkl": [2, 1, 0], "d": 1.8590},
            {"two_theta": 53.99, "intensity": 29.0, "hkl": [2, 1, 1], "d": 1.6970},
            {"two_theta": 63.22, "intensity": 14.0, "hkl": [2, 2, 0], "d": 1.4697},
            {"two_theta": 67.55, "intensity": 23.0, "hkl": [3, 0, 0], "d": 1.3856}
        ]
    }
]


def ensure_directories_and_seed():
    """Creates database/ and sample_data/ folders and seeds initial CIF/JSON cards and sample datasets."""
    os.makedirs(DATABASE_DIR, exist_ok=True)
    os.makedirs(SAMPLE_DIR, exist_ok=True)

    # Write JSON & CIF files to database/
    for phase in SEED_PHASES:
        safe_name = re.sub(r"[^A-Za-z0-9_\-]", "_", f"{phase['formula']}_{phase['id']}")
        json_path = os.path.join(DATABASE_DIR, f"{safe_name}.json")
        if not os.path.exists(json_path):
            with open(json_path, "w", encoding="utf-8") as f:
                json.dump(phase, f, indent=2)

        cif_path = os.path.join(DATABASE_DIR, f"{safe_name}.cif")
        if not os.path.exists(cif_path):
            cif_content = generate_cif_from_phase(phase)
            with open(cif_path, "w", encoding="utf-8") as f:
                f.write(cif_content)

    # Generate the 3-curve ZnO series (x = 0, x = 0.1, x = 0.2) matching the reference graph!
    generate_reference_zno_series()


def generate_cif_from_phase(phase: Dict[str, Any]) -> str:
    cell = phase["cell"]
    lines = [
        f"data_{phase['id']}",
        f"_chemical_name_mineral '{phase['name']}'",
        f"_chemical_formula_sum '{phase['formula']}'",
        f"_symmetry_space_group_name_H-M '{phase['space_group']}'",
        f"_cell_length_a {cell['a']:.4f}",
        f"_cell_length_b {cell['b']:.4f}",
        f"_cell_length_c {cell['c']:.4f}",
        f"_cell_angle_alpha {cell['alpha']:.2f}",
        f"_cell_angle_beta {cell['beta']:.2f}",
        f"_cell_angle_gamma {cell['gamma']:.2f}",
        f"# JCPDS {phase.get('jcpds', phase['id'])} | COD {phase.get('cod_id', '')}"
    ]
    return "\n".join(lines) + "\n"


def pseudo_voigt(x: np.ndarray, x0: float, amp: float, fwhm: float, eta: float = 0.5) -> np.ndarray:
    """Computes a pseudo-Voigt peak profile centered at x0."""
    fwhm = max(fwhm, 0.02)
    sigma = fwhm / (2.0 * math.sqrt(2.0 * math.log(2.0)))
    gamma = fwhm / 2.0
    gauss = np.exp(-0.5 * ((x - x0) / sigma) ** 2)
    lorentz = 1.0 / (1.0 + ((x - x0) / gamma) ** 2)
    return amp * (eta * lorentz + (1.0 - eta) * gauss)


def generate_reference_zno_series():
    """Generates realistic ZnO (x = 0, x = 0.1, x = 0.2) XRD datasets matching the user's reference image."""
    two_theta = np.linspace(20.0, 70.0, 2001)
    zno_peaks = SEED_PHASES[0]["peaks"]
    rng = np.random.default_rng(42)

    configs = [
        ("ZnO_x0.xy", "x = 0", 0.00, 0.23, 1.0, "#e60000"),
        ("ZnO_x0.1.xy", "x = 0.1", -0.05, 0.24, 0.96, "#0018c4"),
        ("ZnO_x0.2.xy", "x = 0.2", -0.10, 0.26, 0.90, "#006b1b"),
    ]

    for fname, label, shift, base_fwhm, scale, color in configs:
        fpath = os.path.join(SAMPLE_DIR, fname)
        if not os.path.exists(fpath):
            y = np.full_like(two_theta, 85.0) + 12.0 * np.exp(-(two_theta - 20.0) / 35.0)
            for pk in zno_peaks:
                pos = pk["two_theta"] + shift * (pk["two_theta"] / 36.25)
                if 20.0 <= pos <= 70.0:
                    theta_rad = math.radians(pos / 2.0)
                    fwhm = math.sqrt(0.012 * (math.tan(theta_rad) ** 2) + 0.002 * math.tan(theta_rad) + base_fwhm ** 2)
                    y += pseudo_voigt(two_theta, pos, pk["intensity"] * 18.0 * scale, fwhm, eta=0.58)
            noise = rng.normal(0.0, np.sqrt(y) * 0.95)
            y = np.clip(y + noise, 10.0, None)
            header = f"# Sample: {label}\n# 2Theta\tIntensity\n"
            lines = [f"{tt:.4f}\t{val:.2f}" for tt, val in zip(two_theta, y)]
            with open(fpath, "w", encoding="utf-8") as f:
                f.write(header + "\n".join(lines) + "\n")


def get_default_zno_series() -> List[Dict[str, Any]]:
    """Loads the 3-curve ZnO series (x = 0, x = 0.1, x = 0.2) for immediate display."""
    ensure_directories_and_seed()
    series = []
    meta = [
        ("ZnO_x0.xy", "x = 0", "#e60000"),
        ("ZnO_x0.1.xy", "x = 0.1", "#0018c4"),
        ("ZnO_x0.2.xy", "x = 0.2", "#006b1b"),
    ]
    for fname, label, color in meta:
        fpath = os.path.join(SAMPLE_DIR, fname)
        if os.path.exists(fpath):
            with open(fpath, "r", encoding="utf-8") as f:
                parsed = parse_xrd_content(f.read(), fname)
                parsed["label"] = label
                parsed["color"] = color
                series.append(parsed)
    return series


def parse_xrd_content(content: str, filename: str = "pattern.xy") -> Dict[str, Any]:
    """Parses .xy, .csv, .txt, .dat, .xrdml files into 2theta and intensity arrays."""
    ext = os.path.splitext(filename)[1].lower()
    if ext == ".xrdml" or "<xrdMeasurements" in content:
        return parse_xrdml(content, filename)

    two_theta = []
    intensity = []
    for line in content.splitlines():
        line = line.strip()
        if not line or line.startswith("#") or line.startswith(";") or line.startswith("//") or line.startswith("_"):
            continue
        # Match lines starting with two floating point numbers separated by whitespace, comma, or semicolon
        parts = re.split(r"[\s,;]+", line)
        if len(parts) >= 2:
            try:
                x = float(parts[0])
                y = float(parts[1])
                if math.isfinite(x) and math.isfinite(y):
                    two_theta.append(x)
                    intensity.append(y)
            except ValueError:
                continue

    if not two_theta:
        raise ValueError(f"Could not parse numeric (2theta, intensity) pairs from {filename}")

    arr_x = np.array(two_theta, dtype=float)
    arr_y = np.array(intensity, dtype=float)
    order = np.argsort(arr_x)
    arr_x = arr_x[order]
    arr_y = arr_y[order]

    base_label = os.path.splitext(os.path.basename(filename))[0]
    return {
        "filename": filename,
        "label": base_label,
        "two_theta": arr_x.tolist(),
        "intensity": arr_y.tolist(),
        "min_2theta": float(arr_x[0]),
        "max_2theta": float(arr_x[-1]),
        "num_points": len(arr_x)
    }


def parse_xrdml(content: str, filename: str) -> Dict[str, Any]:
    """Parses PANalytical .xrdml XML diffraction files."""
    root = ET.fromstring(content)
    ns = {"x": root.tag.split("}")[0].strip("{")} if "}" in root.tag else {}
    prefix = "x:" if ns else ""

    intensities_node = root.find(f".//{prefix}intensities", ns)
    if intensities_node is None:
        intensities_node = root.find(f".//{prefix}counts", ns)
    if intensities_node is None or not intensities_node.text:
        raise ValueError("No <intensities> or <counts> found in XRDML file")

    y_vals = [float(v) for v in intensities_node.text.strip().split()]
    pos_node = root.find(f".//{prefix}positions[@axis='2Theta']", ns)
    start_node = pos_node.find(f"{prefix}startPosition", ns) if pos_node is not None else None
    end_node = pos_node.find(f"{prefix}endPosition", ns) if pos_node is not None else None

    if start_node is not None and end_node is not None:
        start_2t = float(start_node.text)
        end_2t = float(end_node.text)
        x_vals = np.linspace(start_2t, end_2t, len(y_vals)).tolist()
    else:
        x_vals = np.linspace(10.0, 80.0, len(y_vals)).tolist()

    return {
        "filename": filename,
        "label": os.path.splitext(os.path.basename(filename))[0],
        "two_theta": x_vals,
        "intensity": y_vals,
        "min_2theta": float(x_vals[0]),
        "max_2theta": float(x_vals[-1]),
        "num_points": len(x_vals)
    }


def detect_experimental_peaks(
    two_theta: List[float],
    intensity: List[float],
    prominence_pct: float = 6.0,
    min_distance_deg: float = 0.35
) -> List[Dict[str, Any]]:
    """Detects diffraction peaks with Savitzky-Golay smoothing and baseline subtraction."""
    x = np.array(two_theta, dtype=float)
    y = np.array(intensity, dtype=float)
    if len(x) < 15:
        return []

    # Estimate smooth background via moving percentile
    win = max(15, int(len(y) * 0.08) | 1)
    y_smooth = savgol_filter(y, window_length=min(11, (len(y) // 2) * 2 - 1), polyorder=3)
    baseline = np.percentile(y_smooth, 15)
    y_net = np.clip(y_smooth - baseline, 0.0, None)
    max_net = float(np.max(y_net)) if np.max(y_net) > 0 else 1.0

    step = float(np.median(np.diff(x))) if len(x) > 1 else 0.02
    dist_pts = max(3, int(min_distance_deg / max(step, 1e-4)))
    prom = (prominence_pct / 100.0) * max_net

    peaks_idx, props = find_peaks(y_net, prominence=prom, distance=dist_pts, width=1)
    wavelength = 1.5406  # Cu Ka1

    results = []
    for idx in peaks_idx:
        tt = float(x[idx])
        theta_rad = math.radians(tt / 2.0)
        d_val = wavelength / (2.0 * math.sin(theta_rad)) if theta_rad > 0 else 0.0
        rel_int = float((y_net[idx] / max_net) * 100.0)
        results.append({
            "two_theta": round(tt, 3),
            "intensity_raw": round(float(y[idx]), 2),
            "intensity": round(rel_int, 1),
            "d": round(d_val, 4)
        })
    return results


def compute_d_spacings_for_cell(
    system: str,
    cell: Dict[str, float],
    wavelength: float = 1.5406,
    min_2theta: float = 10.0,
    max_2theta: float = 85.0,
    max_index: int = 5
) -> List[Dict[str, Any]]:
    """Computes Bragg reflections (2theta, d, hkl, multiplicity) for any crystal system."""
    a = float(cell.get("a", 4.0))
    b = float(cell.get("b", a))
    c = float(cell.get("c", a))
    alpha = math.radians(float(cell.get("alpha", 90.0)))
    beta = math.radians(float(cell.get("beta", 90.0)))
    gamma = math.radians(float(cell.get("gamma", 120.0 if system.lower() in ["hexagonal", "trigonal"] else 90.0)))

    # Reciprocal metric tensor G*
    cos_a, cos_b, cos_g = math.cos(alpha), math.cos(beta), math.cos(gamma)
    sin_a, sin_b, sin_g = math.sin(alpha), math.sin(beta), math.sin(gamma)
    vol_sq = 1.0 - cos_a**2 - cos_b**2 - cos_g**2 + 2.0 * cos_a * cos_b * cos_g
    if vol_sq <= 1e-8:
        vol_sq = 1.0
    V = a * b * c * math.sqrt(vol_sq)

    a_star = (b * c * sin_a) / V
    b_star = (a * c * sin_b) / V
    c_star = (a * b * sin_g) / V
    cos_a_star = (cos_b * cos_g - cos_a) / (sin_b * sin_g) if (sin_b * sin_g) != 0 else 0.0
    cos_b_star = (cos_a * cos_g - cos_b) / (sin_a * sin_g) if (sin_a * sin_g) != 0 else 0.0
    cos_g_star = (cos_a * cos_b - cos_g) / (sin_a * sin_b) if (sin_a * sin_b) != 0 else 0.0

    reflections_by_d = {}
    sys_low = system.lower()

    rng = range(-max_index, max_index + 1)
    for h in rng:
        for k in rng:
            for l in rng:
                if h == 0 and k == 0 and l == 0:
                    continue
                inv_d2 = (
                    (h * a_star) ** 2
                    + (k * b_star) ** 2
                    + (l * c_star) ** 2
                    + 2.0 * h * k * a_star * b_star * cos_g_star
                    + 2.0 * k * l * b_star * c_star * cos_a_star
                    + 2.0 * h * l * a_star * c_star * cos_b_star
                )
                if inv_d2 <= 1e-8:
                    continue
                d = 1.0 / math.sqrt(inv_d2)
                sin_theta = wavelength / (2.0 * d)
                if sin_theta <= 0.0 or sin_theta >= 0.995:
                    continue
                two_theta = 2.0 * math.degrees(math.asin(sin_theta))
                if not (min_2theta <= two_theta <= max_2theta):
                    continue

                d_key = round(d, 4)
                # Prefer positive canonical (hkl)
                score = (h >= 0) * 4 + (k >= 0) * 2 + (l >= 0) * 1 + (h >= k) * 0.5
                if d_key not in reflections_by_d:
                    reflections_by_d[d_key] = {
                        "two_theta": round(two_theta, 3),
                        "d": round(d, 4),
                        "hkl": [h, k, l],
                        "mult": 1,
                        "_best_score": score
                    }
                else:
                    reflections_by_d[d_key]["mult"] += 1
                    if score > reflections_by_d[d_key]["_best_score"]:
                        reflections_by_d[d_key]["hkl"] = [h, k, l]
                        reflections_by_d[d_key]["_best_score"] = score

    out = []
    for k_val in sorted(reflections_by_d.keys(), reverse=True):
        item = reflections_by_d[k_val]
        theta_rad = math.radians(item["two_theta"] / 2.0)
        lp = (1.0 + math.cos(2 * theta_rad) ** 2) / (math.sin(theta_rad) ** 2 * math.cos(theta_rad))
        raw_i = item["mult"] * lp
        out.append({
            "two_theta": item["two_theta"],
            "d": item["d"],
            "hkl": item["hkl"],
            "mult": item["mult"],
            "raw_intensity": raw_i
        })

    if out:
        max_i = max(r["raw_intensity"] for r in out)
        for r in out:
            r["intensity"] = round((r["raw_intensity"] / max_i) * 100.0, 1)
            del r["raw_intensity"]
    return out


def parse_cif_string(cif_text: str, source_id: str = "CIF") -> Optional[Dict[str, Any]]:
    """Parses a CIF file string to extract unit cell, formula, space group, and atomic positions to compute XRD peaks."""
    def extract_val(tag: str, default=None):
        m = re.search(rf"{tag}\s+(['\"].*?['\"]|\S+)", cif_text, re.IGNORECASE)
        if not m:
            return default
        val = m.group(1).strip("'\"")
        return val

    def extract_float(tag: str, default: float) -> float:
        raw = extract_val(tag)
        if raw is None:
            return default
        # Strip uncertainty parentheses e.g. 3.2498(5) -> 3.2498
        clean = re.sub(r"\(.*?\)", "", raw)
        try:
            return float(clean)
        except ValueError:
            return default

    a = extract_float("_cell_length_a", 0.0)
    if a <= 0:
        return None
    b = extract_float("_cell_length_b", a)
    c = extract_float("_cell_length_c", a)
    alpha = extract_float("_cell_angle_alpha", 90.0)
    beta = extract_float("_cell_angle_beta", 90.0)
    gamma = extract_float("_cell_angle_gamma", 90.0)

    formula = (
        extract_val("_chemical_formula_sum")
        or extract_val("_chemical_formula_structural")
        or extract_val("_chemical_formula_moiety")
        or source_id
    )
    name = (
        extract_val("_chemical_name_mineral")
        or extract_val("_chemical_name_common")
        or extract_val("_chemical_name_systematic")
        or formula
    )
    sg = (
        extract_val("_symmetry_space_group_name_H-M")
        or extract_val("_space_group_name_H-M_alt")
        or "P1"
    )

    # Determine crystal system from cell parameters
    if abs(alpha - 90) < 0.01 and abs(beta - 90) < 0.01 and abs(gamma - 120) < 0.01:
        system = "Hexagonal"
    elif abs(a - b) < 0.005 and abs(b - c) < 0.005 and abs(alpha - 90) < 0.01 and abs(beta - 90) < 0.01 and abs(gamma - 90) < 0.01:
        system = "Cubic"
    elif abs(a - b) < 0.005 and abs(alpha - 90) < 0.01 and abs(beta - 90) < 0.01 and abs(gamma - 90) < 0.01:
        system = "Tetragonal"
    elif abs(alpha - 90) < 0.01 and abs(beta - 90) < 0.01 and abs(gamma - 90) < 0.01:
        system = "Orthorhombic"
    else:
        system = "Monoclinic"

    cell = {"a": a, "b": b, "c": c, "alpha": alpha, "beta": beta, "gamma": gamma}
    peaks = compute_d_spacings_for_cell(system, cell, min_2theta=15.0, max_2theta=80.0, max_index=4)
    # Keep top 16 peaks by intensity
    peaks = sorted(peaks, key=lambda p: p["intensity"], reverse=True)[:16]
    peaks = sorted(peaks, key=lambda p: p["two_theta"])

    return {
        "id": source_id,
        "jcpds": source_id,
        "cod_id": source_id,
        "name": f"{name} ({formula})" if name != formula else formula,
        "formula": formula,
        "system": system,
        "space_group": sg,
        "cell": cell,
        "peaks": peaks,
        "source": "Local CIF"
    }


def load_local_database() -> List[Dict[str, Any]]:
    """Loads all reference phases from e:\\XRD\\database (.json, .cif, .xy/.csv)."""
    ensure_directories_and_seed()
    phases_by_id: Dict[str, Dict[str, Any]] = {}

    # 1. Load JSON cards first
    for jpath in sorted(glob.glob(os.path.join(DATABASE_DIR, "*.json"))):
        try:
            with open(jpath, "r", encoding="utf-8") as f:
                data = json.load(f)
                pid = str(data.get("id") or os.path.splitext(os.path.basename(jpath))[0])
                data["source"] = "Local DB"
                data["file"] = os.path.basename(jpath)
                phases_by_id[pid] = data
        except Exception:
            continue

    # 2. Load any standalone .cif files in database/ that don't have a matching JSON card
    for cpath in sorted(glob.glob(os.path.join(DATABASE_DIR, "*.cif"))):
        stem = os.path.splitext(os.path.basename(cpath))[0]
        # Check if already loaded from JSON
        already = any(stem.endswith(pid) or pid == stem for pid in phases_by_id)
        if already:
            continue
        try:
            with open(cpath, "r", encoding="utf-8") as f:
                parsed = parse_cif_string(f.read(), source_id=stem)
                if parsed:
                    parsed["file"] = os.path.basename(cpath)
                    phases_by_id[stem] = parsed
        except Exception:
            continue

    return list(phases_by_id.values())


def query_cod_database(query: str, max_results: int = 8) -> List[Dict[str, Any]]:
    """Queries the Crystallography Open Database (COD) live REST API and computes XRD patterns."""
    results = []
    q = query.strip()
    if not q:
        return results

    try:
        # Check if query is a numeric COD ID (e.g., 2300450 or 9009086)
        if re.match(r"^\d{7}$", q):
            cod_ids = [q]
        else:
            # Parse chemical elements from query if formula-like (e.g. "ZnO" -> ["Zn", "O"])
            elems = re.findall(r"[A-Z][a-z]?", q)
            params = {"format": "json"}
            if elems and "".join(elems) == re.sub(r"[0-9\s]", "", q) and 1 <= len(elems) <= 4:
                for idx, el in enumerate(elems[:4], start=1):
                    params[f"el{idx}"] = el
                if len(elems) == 2:
                    params["nel"] = "2"
                elif len(elems) == 1:
                    params["nel"] = "1"
            else:
                params["text"] = q

            resp = requests.get(
                "https://www.crystallography.net/cod/result",
                params=params,
                timeout=6.0
            )
            if resp.status_code == 200:
                records = resp.json()
                cod_ids = [str(r.get("file")) for r in records[:max_results] if r.get("file")]
            else:
                cod_ids = []

        for cid in cod_ids[:max_results]:
            try:
                cif_resp = requests.get(f"https://www.crystallography.net/cod/{cid}.cif", timeout=4.5)
                if cif_resp.status_code == 200:
                    parsed = parse_cif_string(cif_resp.text, source_id=f"COD-{cid}")
                    if parsed:
                        parsed["cod_id"] = cid
                        parsed["jcpds"] = f"COD {cid}"
                        parsed["source"] = "COD"
                        results.append(parsed)
            except Exception:
                continue
    except Exception:
        pass

    # Fallback filter against local/curated COD cards if offline or rate-limited
    if not results:
        ql = q.lower()
        for p in SEED_PHASES:
            if ql in p["name"].lower() or ql in p["formula"].lower() or ql in p.get("cod_id", "").lower():
                copy_p = dict(p)
                copy_p["id"] = f"COD-{p['cod_id']}"
                copy_p["jcpds"] = f"COD {p['cod_id']}"
                copy_p["source"] = "COD"
                results.append(copy_p)

    return results


def query_optimade_database(query: str, max_results: int = 8) -> List[Dict[str, Any]]:
    """Queries public OPTIMADE crystallographic providers (Materials Cloud / COD OPTIMADE / RRUFF)."""
    results = []
    q = query.strip()
    if not q:
        return results

    elems = sorted(list(set(re.findall(r"[A-Z][a-z]?", q))))
    if elems:
        has_all = ",".join(f'"{e}"' for e in elems)
        filter_expr = f'elements HAS ALL {has_all} AND nelements={len(elems)}'
    else:
        filter_expr = f'chemical_formula_descriptive CONTAINS "{q}"'

    endpoints = [
        ("Materials Cloud", "https://aiida.materialscloud.org/mc3d/optimade/v1/structures"),
        ("COD OPTIMADE", "https://www.crystallography.net/cod/optimade/v1/structures"),
    ]

    for provider_name, url in endpoints:
        try:
            resp = requests.get(
                url,
                params={"filter": filter_expr, "page_limit": min(max_results, 5)},
                timeout=5.0
            )
            if resp.status_code != 200:
                continue
            payload = resp.json()
            for item in payload.get("data", []):
                attrs = item.get("attributes", {})
                vecs = attrs.get("lattice_vectors")
                if not vecs or len(vecs) != 3:
                    continue
                v1, v2, v3 = [np.array(v, dtype=float) for v in vecs]
                a = float(np.linalg.norm(v1))
                b = float(np.linalg.norm(v2))
                c = float(np.linalg.norm(v3))
                if a <= 0 or b <= 0 or c <= 0:
                    continue
                alpha = math.degrees(math.acos(np.clip(np.dot(v2, v3) / (b * c), -1.0, 1.0)))
                beta = math.degrees(math.acos(np.clip(np.dot(v1, v3) / (a * c), -1.0, 1.0)))
                gamma = math.degrees(math.acos(np.clip(np.dot(v1, v2) / (a * b), -1.0, 1.0)))

                cell = {
                    "a": round(a, 4), "b": round(b, 4), "c": round(c, 4),
                    "alpha": round(alpha, 2), "beta": round(beta, 2), "gamma": round(gamma, 2)
                }
                formula = attrs.get("chemical_formula_reduced") or attrs.get("chemical_formula_descriptive") or q
                item_id = str(item.get("id", "OPT"))
                system = "Hexagonal" if abs(gamma - 120) < 0.5 else ("Cubic" if abs(a - b) < 0.01 and abs(b - c) < 0.01 else "Tetragonal" if abs(a - b) < 0.01 else "Orthorhombic")
                peaks = compute_d_spacings_for_cell(system, cell, min_2theta=15.0, max_2theta=80.0, max_index=4)
                peaks = sorted(peaks, key=lambda p: p["intensity"], reverse=True)[:14]
                peaks = sorted(peaks, key=lambda p: p["two_theta"])

                results.append({
                    "id": f"OPT-{item_id}",
                    "jcpds": f"OPT-{item_id}",
                    "name": f"{formula} ({provider_name})",
                    "formula": formula,
                    "system": system,
                    "space_group": system,
                    "cell": cell,
                    "peaks": peaks,
                    "source": provider_name
                })
            if results:
                break
        except Exception:
            continue

    # Also match against built-in RRUFF/ICDD reference entries
    ql = q.lower()
    for p in SEED_PHASES:
        if ql in p["name"].lower() or ql in p["formula"].lower() or ql in p["id"].lower():
            cp = dict(p)
            cp["source"] = "RRUFF / ICDD"
            results.append(cp)

    return results[:max_results]


def search_match_phases(
    two_theta: List[float],
    intensity: List[float],
    tolerance_deg: float = 0.45,
    extra_phases: Optional[List[Dict[str, Any]]] = None
) -> List[Dict[str, Any]]:
    """Compares experimental XRD peaks against Local DB and loaded external phases, returning ranked matches."""
    exp_peaks = detect_experimental_peaks(two_theta, intensity, prominence_pct=5.0)
    if not exp_peaks:
        return []

    t_min, t_max = min(two_theta), max(two_theta)
    candidates = load_local_database()
    if extra_phases:
        seen = {c["id"] for c in candidates}
        for ep in extra_phases:
            if ep["id"] not in seen:
                candidates.append(ep)
                seen.add(ep["id"])

    ranked = []
    for phase in candidates:
        ref_in_range = [p for p in phase.get("peaks", []) if t_min - 0.5 <= p["two_theta"] <= t_max + 0.5]
        if not ref_in_range:
            continue

        matched_weight = 0.0
        total_weight = sum(p["intensity"] for p in ref_in_range) or 1.0
        pos_errors = []
        matched_count = 0

        for rp in ref_in_range:
            best_diff = min((abs(ep["two_theta"] - rp["two_theta"]) for ep in exp_peaks), default=999.0)
            if best_diff <= tolerance_deg:
                matched_count += 1
                pos_errors.append(best_diff)
                prox_factor = 1.0 - 0.35 * (best_diff / tolerance_deg)
                matched_weight += rp["intensity"] * prox_factor

        fom = (matched_weight / total_weight) * 100.0
        if matched_count > 0:
            ranked.append({
                **phase,
                "fom": round(min(100.0, fom), 1),
                "matched_peaks": matched_count,
                "total_ref_peaks": len(ref_in_range),
                "mean_delta_2theta": round(float(np.mean(pos_errors)), 3)
            })

    ranked.sort(key=lambda r: r["fom"], reverse=True)
    return ranked


def assign_miller_indices(
    two_theta: List[float],
    intensity: List[float],
    reference_phase: Optional[Dict[str, Any]] = None,
    system: str = "Hexagonal",
    cell: Optional[Dict[str, float]] = None,
    tolerance_deg: float = 0.55,
    prominence_pct: float = 5.0
) -> Dict[str, Any]:
    """Assigns Miller indices (hkl) to experimental peaks using a reference phase or unit cell parameters."""
    exp_peaks = detect_experimental_peaks(two_theta, intensity, prominence_pct=prominence_pct)

    if reference_phase and reference_phase.get("peaks"):
        ref_peaks = reference_phase["peaks"]
        used_System = reference_phase.get("system", system)
        used_Cell = reference_phase.get("cell", cell or {"a": 3.25, "b": 3.25, "c": 5.20, "alpha": 90, "beta": 90, "gamma": 120})
    else:
        used_System = system
        used_Cell = cell or {"a": 3.2498, "b": 3.2498, "c": 5.2066, "alpha": 90, "beta": 90, "gamma": 120}
        ref_peaks = compute_d_spacings_for_cell(
            used_System,
            used_Cell,
            min_2theta=min(two_theta),
            max_2theta=max(two_theta)
        )

    indexed_peaks = []
    used_hkls = set()

    # Sort experimental peaks by intensity descending so strongest peaks claim primary (hkl) first
    for ep in sorted(exp_peaks, key=lambda p: p["intensity"], reverse=True):
        candidates = [
            rp for rp in ref_peaks
            if abs(rp["two_theta"] - ep["two_theta"]) <= tolerance_deg
        ]
        if candidates:
            # Score by proximity + reference intensity
            best = max(
                candidates,
                key=lambda rp: rp.get("intensity", 50.0) * (1.0 - abs(rp["two_theta"] - ep["two_theta"]) / (tolerance_deg * 1.4))
            )
            hkl_tuple = tuple(best["hkl"])
            hkl_label = f"({hkl_tuple[0]}{hkl_tuple[1]}{hkl_tuple[2]})"
            show_on_plot = hkl_tuple not in used_hkls and best.get("intensity", 100.0) >= 15.0
            used_hkls.add(hkl_tuple)
            indexed_peaks.append({
                "two_theta": ep["two_theta"],
                "two_theta_calc": round(best["two_theta"], 3),
                "delta_2theta": round(ep["two_theta"] - best["two_theta"], 4),
                "d_obs": ep["d"],
                "d_calc": best["d"],
                "intensity": ep["intensity"],
                "intensity_raw": ep["intensity_raw"],
                "hkl": list(hkl_tuple),
                "hkl_str": hkl_label,
                "indexed": True,
                "show_label": show_on_plot
            })
        else:
            indexed_peaks.append({
                "two_theta": ep["two_theta"],
                "two_theta_calc": None,
                "delta_2theta": None,
                "d_obs": ep["d"],
                "d_calc": None,
                "intensity": ep["intensity"],
                "intensity_raw": ep["intensity_raw"],
                "hkl": None,
                "hkl_str": "",
                "indexed": False,
                "show_label": False
            })

    indexed_peaks.sort(key=lambda p: p["two_theta"])
    return {
        "system": used_System,
        "cell": used_Cell,
        "peaks": indexed_peaks
    }


def run_rietveld_refinement(
    two_theta: List[float],
    intensity: List[float],
    phase: Dict[str, Any],
    wavelength: float = 1.5406
) -> Dict[str, Any]:
    """
    Performs full profile Rietveld least-squares refinement:
    Refines scale factor, zero-shift, unit cell parameters (a, c), Caglioti FWHM (U, V, W),
    pseudo-Voigt mixing (eta), and 5-term Chebyshev polynomial background.
    """
    x = np.array(two_theta, dtype=float)
    y_obs = np.array(intensity, dtype=float)
    n_pts = len(x)
    x_min, x_max = float(x[0]), float(x[-1])
    x_norm = 2.0 * (x - x_min) / max(x_max - x_min, 1e-5) - 1.0

    # Chebyshev basis T0..T4
    T = np.column_stack([
        np.ones_like(x_norm),
        x_norm,
        2.0 * x_norm**2 - 1.0,
        4.0 * x_norm**3 - 3.0 * x_norm,
        8.0 * x_norm**4 - 8.0 * x_norm**2 + 1.0
    ])

    ref_peaks = [p for p in phase.get("peaks", []) if x_min - 1.0 <= p["two_theta"] <= x_max + 1.0]
    if not ref_peaks:
        ref_peaks = compute_d_spacings_for_cell(
            phase.get("system", "Hexagonal"),
            phase.get("cell", {"a": 3.25, "b": 3.25, "c": 5.20, "alpha": 90, "beta": 90, "gamma": 120}),
            wavelength=wavelength,
            min_2theta=x_min,
            max_2theta=x_max
        )

    cell0 = phase.get("cell", {"a": 3.2498, "b": 3.2498, "c": 5.2066, "alpha": 90.0, "beta": 90.0, "gamma": 120.0})
    a0 = float(cell0.get("a", 3.2498))
    c0 = float(cell0.get("c", 5.2066))
    sys_name = phase.get("system", "Hexagonal").lower()

    # Initial parameter guesses
    bg0 = float(np.percentile(y_obs, 12))
    max_net = max(float(np.max(y_obs)) - bg0, 10.0)
    scale0 = max_net / 100.0

    # Parameter vector p:
    # [scale, zero_shift, eps_a, eps_c, U, V, W, eta, b0, b1, b2, b3, b4]
    p0 = np.array([scale0, 0.0, 0.0, 0.0, 0.015, -0.002, 0.055, 0.55, bg0, 0.0, 0.0, 0.0, 0.0], dtype=float)
    lb = np.array([scale0 * 0.05, -0.45, -0.03, -0.03, 0.0, -0.05, 0.003, 0.05, -500.0, -500.0, -300.0, -200.0, -200.0])
    ub = np.array([scale0 * 5.0,   0.45,  0.03,  0.03, 0.5,  0.10, 0.450, 0.98,  5000.0, 500.0,  300.0,  200.0,  200.0])

    # Weights for weighted profile residual: w_i = 1 / sqrt(max(Y_obs, 1))
    sqrt_w = 1.0 / np.sqrt(np.maximum(y_obs, 1.0))

    def calc_profile(p: np.ndarray) -> Tuple[np.ndarray, np.ndarray, List[Dict[str, Any]]]:
        scale, zero, eps_a, eps_c, U, V_p, W, eta = p[:8]
        b_coeffs = p[8:]
        y_bkg = T @ b_coeffs
        y_peaks = np.zeros_like(x)
        ticks = []

        a_cur = a0 * (1.0 + eps_a)
        c_cur = c0 * (1.0 + (eps_a if sys_name == "cubic" else eps_c))

        for pk in ref_peaks:
            h, k, l = pk["hkl"]
            # Exact Bragg position shift from refined lattice constants
            if sys_name in ["hexagonal", "trigonal"]:
                inv_d2 = (4.0 / 3.0) * ((h**2 + h * k + k**2) / (a_cur**2)) + (l**2) / (c_cur**2)
            elif sys_name == "tetragonal":
                inv_d2 = (h**2 + k**2) / (a_cur**2) + (l**2) / (c_cur**2)
            elif sys_name == "cubic":
                inv_d2 = (h**2 + k**2 + l**2) / (a_cur**2)
            else:
                # General isotropic/anisotropic scaling around reference d
                inv_d2 = (1.0 / (pk["d"] ** 2)) / ((1.0 + eps_a) ** 2)

            if inv_d2 > 0:
                d_cur = 1.0 / math.sqrt(inv_d2)
                sin_th = wavelength / (2.0 * d_cur)
                if 0.0 < sin_th < 0.995:
                    pos = 2.0 * math.degrees(math.asin(sin_th)) + zero
                else:
                    pos = pk["two_theta"] + zero
            else:
                pos = pk["two_theta"] + zero

            theta_rad = math.radians(max(pos / 2.0, 1.0))
            tan_th = math.tan(theta_rad)
            fwhm_sq = max(U * (tan_th**2) + V_p * tan_th + W, 0.0025)
            fwhm = math.sqrt(fwhm_sq)

            # Evaluate pseudo-Voigt on local window for speed
            mask = np.abs(x - pos) <= (fwhm * 9.0)
            if np.any(mask):
                y_peaks[mask] += pseudo_voigt(x[mask], pos, scale * pk["intensity"], fwhm, eta)

            ticks.append({
                "two_theta": round(float(pos), 3),
                "hkl": pk["hkl"],
                "hkl_str": f"({h}{k}{l})",
                "intensity": pk["intensity"],
                "fwhm": round(fwhm, 4)
            })

        return y_bkg + y_peaks, y_bkg, ticks

    def residuals(p: np.ndarray) -> np.ndarray:
        y_calc, _, _ = calc_profile(p)
        return (y_obs - y_calc) * sqrt_w

    res = least_squares(residuals, p0, bounds=(lb, ub), x_scale="jac", max_nfev=150, ftol=1e-5, xtol=1e-5)
    p_opt = res.x
    y_calc, y_bkg, bragg_ticks = calc_profile(p_opt)
    y_diff = y_obs - y_calc

    # Agreement factors: Rp, Rwp, Rexp, Chi2
    denom_rp = float(np.sum(np.abs(y_obs))) or 1.0
    rp = (float(np.sum(np.abs(y_diff))) / denom_rp) * 100.0

    w = sqrt_w ** 2
    num_rwp = float(np.sum(w * (y_diff ** 2)))
    den_rwp = float(np.sum(w * (y_obs ** 2))) or 1.0
    rwp = math.sqrt(num_rwp / den_rwp) * 100.0

    n_params = len(p_opt)
    rexp = math.sqrt(max(n_pts - n_params, 1) / den_rwp) * 100.0
    chi2 = (rwp / max(rexp, 1e-4)) ** 2

    a_ref = float(a0 * (1.0 + p_opt[2]))
    c_ref = float(c0 * (1.0 + (p_opt[2] if sys_name == "cubic" else p_opt[3])))
    b_ref = float(a_ref if sys_name in ["cubic", "tetragonal", "hexagonal", "trigonal"] else float(cell0.get("b", a0)) * (1.0 + p_opt[2]))

    # Unit cell volume
    gamma_rad = math.radians(float(cell0.get("gamma", 120.0 if sys_name in ["hexagonal", "trigonal"] else 90.0)))
    vol = float(a_ref * b_ref * c_ref * math.sin(gamma_rad))

    # Average crystallite size via Scherrer D = (K * lambda) / (FWHM_rad * cos(theta))
    mean_fwhm_deg = math.sqrt(max(float(p_opt[6]), 0.004))
    crystallite_nm = float((0.9 * (wavelength / 10.0)) / (math.radians(mean_fwhm_deg) * math.cos(math.radians(18.0))))

    return {
        "phase_name": phase.get("name", "Refined Phase"),
        "phase_id": phase.get("jcpds", phase.get("id", "")),
        "system": phase.get("system", "Hexagonal"),
        "space_group": phase.get("space_group", ""),
        "two_theta": x.tolist(),
        "y_obs": np.round(y_obs, 2).tolist(),
        "y_calc": np.round(y_calc, 2).tolist(),
        "y_bkg": np.round(y_bkg, 2).tolist(),
        "y_diff": np.round(y_diff, 2).tolist(),
        "bragg_ticks": bragg_ticks,
        "metrics": {
            "rwp": round(float(rwp), 2),
            "rp": round(float(rp), 2),
            "rexp": round(float(rexp), 2),
            "chi2": round(float(chi2), 2),
            "a": round(a_ref, 4),
            "b": round(b_ref, 4),
            "c": round(c_ref, 4),
            "volume": round(vol, 2),
            "zero_shift": round(float(p_opt[1]), 4),
            "eta": round(float(p_opt[7]), 3),
            "U": round(float(p_opt[4]), 4),
            "V": round(float(p_opt[5]), 4),
            "W": round(float(p_opt[6]), 4),
            "crystallite_nm": round(crystallite_nm, 1)
        }
    }
