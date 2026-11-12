import os
import re
import json
import math
import glob
import sqlite3
import fnmatch
import concurrent.futures
import xml.etree.ElementTree as ET
from typing import List, Dict, Any, Optional, Tuple
import numpy as np
from scipy.signal import savgol_filter, find_peaks
from scipy.optimize import least_squares
import requests

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_DIR = os.environ.get("DIFFRACTA_DB_DIR", os.path.join(BASE_DIR, "database"))
SAMPLE_DIR = os.environ.get("DIFFRACTA_SAMPLE_DIR", os.path.join(BASE_DIR, "sample_data"))
SQ_CONFIG_PATH = os.path.join(DATABASE_DIR, "sq_index.cfg")

ALL_ELEMENTS_103 = [
    "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne",
    "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca",
    "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn",
    "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr",
    "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn",
    "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd",
    "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb",
    "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg",
    "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th",
    "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm",
    "Md", "No", "Lr"
]
VALID_ELEMENTS_SET = set(ALL_ELEMENTS_103)
ELEMENT_TO_Z = {el: idx + 1 for idx, el in enumerate(ALL_ELEMENTS_103)}
Z_TO_ELEMENT = {idx + 1: el for idx, el in enumerate(ALL_ELEMENTS_103)}

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

    # Seed a sample QualX-compatible SQLite .sq reference database in sample_data/pdf2-1.sq
    sample_sq = os.path.join(SAMPLE_DIR, "pdf2-1.sq")
    if not os.path.exists(sample_sq):
        seed_sample_sq_database(sample_sq)


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
    """Loads the default single ZnO XRD pattern for display."""
    ensure_directories_and_seed()
    series = []
    fpath = os.path.join(SAMPLE_DIR, "ZnO_x0.xy")
    if os.path.exists(fpath):
        with open(fpath, "r", encoding="utf-8") as f:
            parsed = parse_xrd_content(f.read(), "ZnO_x0.xy")
            parsed["label"] = "ZnO"
            parsed["color"] = "#e60000"
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

    peaks_idx, props = find_peaks(y_net, prominence=prom, distance=dist_pts, width=1, rel_height=0.5)
    widths_pts = props.get("widths", np.ones_like(peaks_idx, dtype=float))
    wavelength = 1.5406  # Cu Ka1

    results = []
    for k_i, idx in enumerate(peaks_idx):
        tt = float(x[idx])
        theta_rad = math.radians(tt / 2.0)
        d_val = wavelength / (2.0 * math.sin(theta_rad)) if theta_rad > 0 else 0.0
        rel_int = float((y_net[idx] / max_net) * 100.0)
        fwhm_deg = max(float(widths_pts[k_i]) * abs(step), 0.03)
        results.append({
            "two_theta": round(tt, 3),
            "intensity_raw": round(float(y[idx]), 2),
            "intensity": round(rel_int, 1),
            "d": round(d_val, 4),
            "fwhm": round(fwhm_deg, 4),
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


def _clean_cif_number(val: str, default: float = 0.0) -> float:
    if val is None:
        return default
    s = re.sub(r"\(.*?\)", "", str(val).strip().strip("'\""))
    if not s or s in (".", "?"):
        return default
    if "/" in s:
        parts = s.split("/", 1)
        try:
            den = float(parts[1])
            return float(parts[0]) / den if den != 0 else default
        except ValueError:
            return default
    try:
        return float(s)
    except ValueError:
        return default


def _parse_symop_xyz(expr: str) -> Optional[Tuple[np.ndarray, np.ndarray]]:
    """Parses a CIF symmetry operation like 'x-y, x, z+1/2' into (3x3 matrix M, 3-vector t)."""
    cleaned = str(expr).strip().strip("'\"").replace("*", "").replace(" ", "").lower()
    parts = cleaned.split(",")
    if len(parts) != 3:
        return None
    mat = np.zeros((3, 3), dtype=float)
    vec = np.zeros(3, dtype=float)
    var_map = {"x": 0, "y": 1, "z": 2}
    term_re = re.compile(r"[+-]?(?:\d+/\d+|\d*\.?\d+)?[xyz]|[+-]?(?:\d+/\d+|\d*\.?\d+)")

    for row_idx, comp in enumerate(parts):
        if not comp:
            return None
        pos = 0
        for m in term_re.finditer(comp):
            if m.start() != pos:
                return None
            pos = m.end()
            tok = m.group(0)
            if not tok:
                continue
            last_ch = tok[-1]
            if last_ch in var_map:
                prefix = tok[:-1]
                if prefix in ("", "+"):
                    coeff = 1.0
                elif prefix == "-":
                    coeff = -1.0
                else:
                    coeff = _clean_cif_number(prefix, 1.0)
                mat[row_idx, var_map[last_ch]] += coeff
            else:
                vec[row_idx] += _clean_cif_number(tok, 0.0)
        if pos != len(comp):
            return None
    return mat, vec


def _parse_cif_loops(cif_text: str) -> List[Tuple[List[str], List[List[str]]]]:
    """Extracts (header_tags_lower, rows) from all loop_ blocks in a CIF string."""
    lines_clean = []
    in_semi = False
    for raw_line in cif_text.splitlines():
        stripped = raw_line.strip()
        if raw_line.startswith(";"):
            in_semi = not in_semi
            continue
        if in_semi or not stripped or stripped.startswith("#"):
            continue
        # Strip trailing comments outside quotes
        no_comment = re.sub(r"(?<!['\"])#.*$", "", raw_line).strip()
        if no_comment:
            lines_clean.append(no_comment)

    token_re = re.compile(r"'[^']*'|\"[^\"]*\"|\S+")
    tokens = []
    for ln in lines_clean:
        for tok in token_re.findall(ln):
            tokens.append(tok)

    loops: List[Tuple[List[str], List[List[str]]]] = []
    i = 0
    n = len(tokens)
    while i < n:
        if tokens[i].lower() == "loop_":
            i += 1
            tags = []
            while i < n and tokens[i].startswith("_"):
                tags.append(tokens[i].lower())
                i += 1
            vals = []
            while i < n:
                tk = tokens[i]
                tk_low = tk.lower()
                if tk_low == "loop_" or tk_low.startswith("data_") or (tk.startswith("_") and not (tk.startswith("'_") or tk.startswith('"_'))):
                    break
                vals.append(tk.strip("'\""))
                i += 1
            if tags and len(vals) >= len(tags):
                ncols = len(tags)
                nrows = len(vals) // ncols
                rows = [vals[r * ncols:(r + 1) * ncols] for r in range(nrows)]
                loops.append((tags, rows))
        else:
            i += 1
    return loops


def _expand_cif_unit_cell_atoms(cif_text: str, space_group: str = "") -> List[Tuple[int, float, float, float, float]]:
    """Returns expanded unit-cell atoms as (atomic_Z, occupancy, x, y, z) from CIF loops."""
    loops = _parse_cif_loops(cif_text)
    symops: List[Tuple[np.ndarray, np.ndarray]] = []
    asym_atoms: List[Tuple[int, float, float, float, float]] = []

    sym_tag_candidates = (
        "_symmetry_equiv_pos_as_xyz",
        "_space_group_symop_operation_xyz",
    )

    for tags, rows in loops:
        for st in sym_tag_candidates:
            if st in tags:
                col = tags.index(st)
                for r in rows:
                    parsed_op = _parse_symop_xyz(r[col])
                    if parsed_op is not None:
                        symops.append(parsed_op)
                break

        if "_atom_site_fract_x" in tags and "_atom_site_fract_y" in tags and "_atom_site_fract_z" in tags:
            ix = tags.index("_atom_site_fract_x")
            iy = tags.index("_atom_site_fract_y")
            iz = tags.index("_atom_site_fract_z")
            isym = tags.index("_atom_site_type_symbol") if "_atom_site_type_symbol" in tags else (
                tags.index("_atom_site_label") if "_atom_site_label" in tags else -1
            )
            iocc = tags.index("_atom_site_occupancy") if "_atom_site_occupancy" in tags else -1
            for r in rows:
                raw_sym = r[isym] if isym >= 0 else "Si"
                m_el = re.match(r"([A-Z][a-z]?)", raw_sym.strip())
                el = m_el.group(1) if m_el else "Si"
                z_num = ELEMENT_TO_Z.get(el, 14)
                fx = _clean_cif_number(r[ix], 0.0) % 1.0
                fy = _clean_cif_number(r[iy], 0.0) % 1.0
                fz = _clean_cif_number(r[iz], 0.0) % 1.0
                occ = _clean_cif_number(r[iocc], 1.0) if iocc >= 0 else 1.0
                if occ > 0:
                    asym_atoms.append((z_num, min(max(occ, 0.01), 1.0), fx, fy, fz))

    if not asym_atoms:
        return []

    if not symops:
        base_ops = [(np.eye(3), np.zeros(3))]
        sg_clean = str(space_group or "").strip()
        centering = sg_clean[0].upper() if sg_clean else "P"
        translations = {
            "I": [[0.5, 0.5, 0.5]],
            "F": [[0.0, 0.5, 0.5], [0.5, 0.0, 0.5], [0.5, 0.5, 0.0]],
            "C": [[0.5, 0.5, 0.0]],
            "A": [[0.0, 0.5, 0.5]],
            "B": [[0.5, 0.0, 0.5]],
            "R": [[2.0 / 3.0, 1.0 / 3.0, 1.0 / 3.0], [1.0 / 3.0, 2.0 / 3.0, 2.0 / 3.0]],
        }.get(centering, [])
        symops = list(base_ops)
        for tr in translations:
            symops.append((np.eye(3), np.array(tr, dtype=float)))

    expanded: List[Tuple[int, float, float, float, float]] = []
    for z_num, occ, fx, fy, fz in asym_atoms:
        coord = np.array([fx, fy, fz], dtype=float)
        site_images: List[np.ndarray] = []
        for mat, vec in symops:
            img = (mat @ coord + vec) % 1.0
            is_dup = False
            for prev in site_images:
                diff = np.abs(img - prev)
                diff = np.minimum(diff, 1.0 - diff)
                if np.max(diff) < 0.012:
                    is_dup = True
                    break
            if not is_dup:
                site_images.append(img)
                expanded.append((z_num, occ, float(img[0]), float(img[1]), float(img[2])))
    return expanded


def _compute_structure_factor_peaks(
    cell: Dict[str, float],
    atoms: List[Tuple[int, float, float, float, float]],
    wavelength: float = 1.5406,
    min_2theta: float = 5.0,
    max_2theta: float = 85.0,
    max_peaks: int = 35,
) -> List[Dict[str, Any]]:
    """Computes powder XRD reflection positions and |F_hkl|^2 * LP intensities from unit-cell atoms."""
    if not atoms:
        return []
    a = float(cell.get("a", 4.0))
    b = float(cell.get("b", a))
    c = float(cell.get("c", a))
    alpha = math.radians(float(cell.get("alpha", 90.0)))
    beta = math.radians(float(cell.get("beta", 90.0)))
    gamma = math.radians(float(cell.get("gamma", 90.0)))

    ca, cb, cg = math.cos(alpha), math.cos(beta), math.cos(gamma)
    sa, sb, sg = math.sin(alpha), math.sin(beta), math.sin(gamma)
    vol_sq = 1.0 - ca**2 - cb**2 - cg**2 + 2.0 * ca * cb * cg
    if vol_sq <= 1e-8 or a <= 0 or b <= 0 or c <= 0:
        return []
    vol = a * b * c * math.sqrt(vol_sq)

    a_star = (b * c * sa) / vol
    b_star = (a * c * sb) / vol
    c_star = (a * b * sg) / vol
    cos_a_star = (cb * cg - ca) / (sb * sg) if (sb * sg) != 0 else 0.0
    cos_b_star = (ca * cg - cb) / (sa * sg) if (sa * sg) != 0 else 0.0
    cos_g_star = (ca * cb - cg) / (sa * sb) if (sa * sb) != 0 else 0.0

    sin_max = math.sin(math.radians(min(max_2theta, 160.0) / 2.0))
    d_min = max(wavelength / (2.0 * max(sin_max, 0.05)), 1.05)

    h_max = min(max(4, int(math.ceil(a / d_min))), 14)
    k_max = min(max(4, int(math.ceil(b / d_min))), 14)
    l_max = min(max(4, int(math.ceil(c / d_min))), 18)
    while (2 * h_max + 1) * (2 * k_max + 1) * (l_max + 1) > 28000 and max(h_max, k_max, l_max) > 5:
        if l_max >= max(h_max, k_max):
            l_max -= 1
        elif h_max >= k_max:
            h_max -= 1
        else:
            k_max -= 1

    # Generate Friedel hemisphere (each reflection represents (h,k,l) and (-h,-k,-l), weight = 2)
    h_grid, k_grid, l_grid = np.meshgrid(
        np.arange(-h_max, h_max + 1, dtype=np.int32),
        np.arange(-k_max, k_max + 1, dtype=np.int32),
        np.arange(0, l_max + 1, dtype=np.int32),
        indexing="ij",
    )
    h_flat = h_grid.ravel()
    k_flat = k_grid.ravel()
    l_flat = l_grid.ravel()
    hemi_mask = (l_flat > 0) | ((l_flat == 0) & (k_flat > 0)) | ((l_flat == 0) & (k_flat == 0) & (h_flat > 0))
    h_arr = h_flat[hemi_mask].astype(np.float64)
    k_arr = k_flat[hemi_mask].astype(np.float64)
    l_arr = l_flat[hemi_mask].astype(np.float64)

    inv_d2 = (
        (h_arr * a_star) ** 2
        + (k_arr * b_star) ** 2
        + (l_arr * c_star) ** 2
        + 2.0 * h_arr * k_arr * a_star * b_star * cos_g_star
        + 2.0 * k_arr * l_arr * b_star * c_star * cos_a_star
        + 2.0 * h_arr * l_arr * a_star * c_star * cos_b_star
    )
    valid = inv_d2 > 1e-8
    inv_d2 = inv_d2[valid]
    h_arr, k_arr, l_arr = h_arr[valid], k_arr[valid], l_arr[valid]

    d_arr = 1.0 / np.sqrt(inv_d2)
    sin_th = wavelength / (2.0 * d_arr)
    ang_mask = (sin_th > 0.0) & (sin_th < 0.995)
    d_arr, sin_th = d_arr[ang_mask], sin_th[ang_mask]
    h_arr, k_arr, l_arr = h_arr[ang_mask], k_arr[ang_mask], l_arr[ang_mask]

    two_theta_arr = 2.0 * np.degrees(np.arcsin(sin_th))
    win_mask = (two_theta_arr >= min_2theta) & (two_theta_arr <= max_2theta)
    if not np.any(win_mask):
        return []

    d_arr = d_arr[win_mask]
    sin_th = sin_th[win_mask]
    two_theta_arr = two_theta_arr[win_mask]
    h_arr = h_arr[win_mask].astype(np.int32)
    k_arr = k_arr[win_mask].astype(np.int32)
    l_arr = l_arr[win_mask].astype(np.int32)

    z_occ = np.array([at[0] * at[1] for at in atoms], dtype=np.float64)
    xyz = np.array([[at[2], at[3], at[4]] for at in atoms], dtype=np.float64)  # (N_atoms, 3)
    hkl_mat = np.stack([h_arr, k_arr, l_arr], axis=1).astype(np.float64)  # (N_ref, 3)

    n_ref = len(d_arr)
    f2_arr = np.zeros(n_ref, dtype=np.float64)
    s_sq = (sin_th / wavelength) ** 2
    batch_size = 1024
    two_pi = 2.0 * math.pi
    for start in range(0, n_ref, batch_size):
        end = min(start + batch_size, n_ref)
        phases = two_pi * (hkl_mat[start:end] @ xyz.T)  # (B, N_atoms)
        decay = np.exp(-2.2 * s_sq[start:end, None])
        weights = decay * z_occ[None, :]
        re_f = np.sum(weights * np.cos(phases), axis=1)
        im_f = np.sum(weights * np.sin(phases), axis=1)
        f2_arr[start:end] = 2.0 * (re_f * re_f + im_f * im_f)

    # Group reflections by d-spacing (0.0005 A shell) to sum symmetry/accidental equivalents
    shells: Dict[int, Dict[str, Any]] = {}
    for idx in range(n_ref):
        f2_val = float(f2_arr[idx])
        if f2_val <= 1e-4:
            continue
        d_val = float(d_arr[idx])
        tt_val = float(two_theta_arr[idx])
        hi, ki, li = int(h_arr[idx]), int(k_arr[idx]), int(l_arr[idx])
        shell_key = int(round(d_val * 2000.0))
        # Prefer canonical non-negative (hkl) label
        hkl_score = (hi >= 0) * 8 + (ki >= 0) * 4 + (li >= 0) * 2 + (hi >= ki) * 1
        if shell_key not in shells:
            shells[shell_key] = {
                "two_theta": round(tt_val, 3),
                "d": round(d_val, 4),
                "hkl": [hi, ki, li],
                "mult": 2,
                "f2_sum": f2_val,
                "_best_score": hkl_score,
                "_best_f2": f2_val,
            }
        else:
            sh = shells[shell_key]
            sh["mult"] += 2
            sh["f2_sum"] += f2_val
            if (f2_val > sh["_best_f2"] * 1.05) or (
                abs(f2_val - sh["_best_f2"]) <= sh["_best_f2"] * 0.05 and hkl_score > sh["_best_score"]
            ):
                sh["hkl"] = [hi, ki, li]
                sh["_best_score"] = hkl_score
                sh["_best_f2"] = max(sh["_best_f2"], f2_val)

    if not shells:
        return []

    out = []
    for sh in shells.values():
        theta_rad = math.radians(sh["two_theta"] / 2.0)
        denom = (math.sin(theta_rad) ** 2) * math.cos(theta_rad)
        if denom <= 1e-8:
            continue
        lp = (1.0 + math.cos(2.0 * theta_rad) ** 2) / denom
        raw_i = sh["f2_sum"] * lp
        out.append({
            "two_theta": sh["two_theta"],
            "d": sh["d"],
            "hkl": sh["hkl"],
            "mult": sh["mult"],
            "_raw_i": raw_i,
        })

    if not out:
        return []
    max_i = max(r["_raw_i"] for r in out) or 1.0
    cleaned_peaks = []
    for r in out:
        rel_i = round((r["_raw_i"] / max_i) * 100.0, 1)
        if rel_i >= 1.5:
            cleaned_peaks.append({
                "two_theta": r["two_theta"],
                "d": r["d"],
                "hkl": r["hkl"],
                "mult": r["mult"],
                "intensity": rel_i,
            })

    cleaned_peaks = sorted(cleaned_peaks, key=lambda p: p["intensity"], reverse=True)[:max_peaks]
    return sorted(cleaned_peaks, key=lambda p: p["two_theta"])


def parse_cif_string(cif_text: str, source_id: str = "CIF") -> Optional[Dict[str, Any]]:
    """Parses a CIF file string to extract unit cell, formula, space group, and atomic positions to compute XRD peaks."""
    def extract_val(tag: str, default=None):
        m = re.search(rf"{tag}\s+(['\"].*?['\"]|\S+)", cif_text, re.IGNORECASE)
        if not m:
            return default
        val = m.group(1).strip("'\"")
        return val if val not in ("?", ".") else default

    def extract_float(tag: str, default: float) -> float:
        raw = extract_val(tag)
        if raw is None:
            return default
        return _clean_cif_number(raw, default)

    a = extract_float("_cell_length_a", 0.0)
    if a <= 0:
        return None
    b = extract_float("_cell_length_b", a)
    c = extract_float("_cell_length_c", a)
    alpha = extract_float("_cell_angle_alpha", 90.0)
    beta = extract_float("_cell_angle_beta", 90.0)
    gamma = extract_float("_cell_angle_gamma", 90.0)

    raw_formula = (
        extract_val("_chemical_formula_structural")
        or extract_val("_chemical_formula_sum")
        or extract_val("_chemical_formula_moiety")
        or source_id
    )
    formula = re.sub(r"^[\-\s]+|[\-\s]+$", "", str(raw_formula)).strip() or source_id
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

    cell = {"a": a, "b": b, "c": c, "alpha": alpha, "beta": beta, "gamma": gamma}
    system = _normalize_crystal_system("", cell)

    atoms = _expand_cif_unit_cell_atoms(cif_text, space_group=sg)
    peaks = _compute_structure_factor_peaks(cell, atoms, min_2theta=5.0, max_2theta=85.0, max_peaks=45) if atoms else []
    if not peaks:
        peaks = compute_d_spacings_for_cell(system, cell, min_2theta=5.0, max_2theta=85.0, max_index=5)
        peaks = sorted(peaks, key=lambda p: p["intensity"], reverse=True)[:24]
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


def extract_formula_elements(formula: str) -> List[str]:
    """Extracts unique valid periodic table element symbols from a chemical formula."""
    if not formula:
        return []
    tokens = re.findall(r"[A-Z][a-z]?", str(formula))
    seen = []
    for tok in tokens:
        if tok in VALID_ELEMENTS_SET and tok not in seen:
            seen.append(tok)
    return seen


def parse_formula_stoichiometry(formula: str) -> Optional[Dict[str, float]]:
    """Parses a pure chemical formula like 'Cs3Bi2I9' or 'Bi2 Cs3 I9' into {'Cs': 3.0, 'Bi': 2.0, 'I': 9.0}."""
    if not formula:
        return None
    cleaned = re.sub(r"^[\-\s]+|[\-\s]+$", "", str(formula))
    cleaned = re.sub(r"\s+", "", cleaned)
    if not cleaned or not re.match(r"^(?:[A-Z][a-z]?\d*(?:\.\d+)?)+$", cleaned):
        return None
    counts: Dict[str, float] = {}
    for m in re.finditer(r"([A-Z][a-z]?)(\d*(?:\.\d+)?)", cleaned):
        el = m.group(1)
        if el not in VALID_ELEMENTS_SET:
            return None
        num_s = m.group(2)
        amt = float(num_s) if num_s else 1.0
        counts[el] = round(counts.get(el, 0.0) + amt, 3)
    return counts if counts else None


_AMBIGUOUS_SINGLE_ELEMENT_WORDS = {
    "In", "As", "At", "No", "Be", "He", "Am", "Ac", "Pa", "Po", "Ra", "Re", " Se", "Ho", "Ne", "Os"
}


def extract_clean_formula_hint(hint: str) -> str:
    """Extracts a clean chemical formula token (e.g. 'Cs3Bi2I9', 'ZnO') from a sample label or filename."""
    if not hint:
        return ""
    stem = re.sub(r"\.(xy|xrdml|raw|csv|txt|dat|asc|cif)$", "", str(hint).strip(), flags=re.IGNORECASE)
    for tok in re.split(r"[\s_,\-()\[\]/\\]+", stem):
        cand = tok.strip()
        if not cand or len(cand) < 2:
            continue
        stoich = parse_formula_stoichiometry(cand)
        if not stoich:
            continue
        # Reject single-element 2-letter English words unless accompanied by digits
        if len(stoich) == 1 and cand in _AMBIGUOUS_SINGLE_ELEMENT_WORDS and not re.search(r"\d", cand):
            continue
        return cand
    return ""


def compute_cell_volume(cell: Dict[str, Any], system: str = "") -> float:
    """Computes unit-cell volume (A^3) from cell lengths and angles."""
    if not cell:
        return 0.0
    a = float(cell.get("a") or 0.0)
    if a <= 0:
        return 0.0
    b = float(cell.get("b") or a)
    c = float(cell.get("c") or a)
    sys_low = (system or "").lower()
    alpha = math.radians(float(cell.get("alpha") or 90.0))
    beta = math.radians(float(cell.get("beta") or 90.0))
    gamma = math.radians(float(cell.get("gamma") or (120.0 if sys_low in ("hexagonal", "trigonal") else 90.0)))
    ca, cb, cg = math.cos(alpha), math.cos(beta), math.cos(gamma)
    vol_sq = max(0.0, 1.0 - ca**2 - cb**2 - cg**2 + 2.0 * ca * cb * cg)
    return round(a * b * c * math.sqrt(vol_sq), 2)


def infer_phase_subfiles(phase: Dict[str, Any]) -> List[str]:
    """Infers standard PDF/QualX subfile codes (I, O, M, A, C, CP, N) when not explicitly provided."""
    existing = phase.get("subfiles")
    if isinstance(existing, list) and existing:
        return [str(s).upper() for s in existing]
    if isinstance(existing, str) and existing.strip():
        return [s.strip().upper() for s in re.split(r"[,;\s]+", existing) if s.strip()]

    elems = phase.get("elements") or extract_formula_elements(phase.get("formula", ""))
    el_set = set(elems)
    name_low = str(phase.get("name", "")).lower()
    sub = set()

    if "C" in el_set and ("H" in el_set or "N" in el_set):
        sub.add("O")  # Organic
    else:
        sub.add("I")  # Inorganic

    metals_non_alk = {
        "Al", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Zr", "Nb", "Mo",
        "Pd", "Ag", "Cd", "Sn", "Hf", "Ta", "W", "Pt", "Au", "Pb", "Bi", "Mg", "Si"
    }
    if el_set and el_set.issubset(metals_non_alk):
        sub.add("A")  # Metal & Alloy

    mineral_keywords = [
        "zincite", "anatase", "rutile", "corundum", "quartz", "magnetite", "hematite",
        "calcite", "periclase", "cerianite", "halite", "fluorite", "galena", "sphalerite",
        "apatite", "perovskite", "aragonite", "brookite", "wurtzite"
    ]
    if any(k in name_low for k in mineral_keywords) or ("(" in str(phase.get("name", "")) and "I" in sub and len(el_set) >= 2):
        sub.add("M")  # Mineral

    if "O" in el_set and len(el_set) >= 2 and "I" in sub:
        sub.add("C")  # Ceramic / Oxide

    if "nist" in name_low or str(phase.get("id", "")) in ("027-1402", "034-0427", "046-1212"):
        sub.add("N")  # NIST / Standard

    sub.add("CP")  # Common Phase
    return sorted(sub)


def enrich_phase_metadata(phase: Dict[str, Any]) -> Dict[str, Any]:
    """Ensures elements, subfiles, volume, and normalized crystal system are present on a phase dict."""
    p = dict(phase)
    if not p.get("elements"):
        p["elements"] = extract_formula_elements(p.get("formula", ""))
    p["subfiles"] = infer_phase_subfiles(p)
    cell = p.get("cell") or {}
    if not p.get("volume"):
        p["volume"] = compute_cell_volume(cell, p.get("system", ""))
    return p


EXTRA_SQ_PHASES = [
    {
        "id": "005-0628", "jcpds": "005-0628", "cod_id": "9008678",
        "name": "Halite (NaCl)", "formula": "NaCl", "system": "Cubic", "space_group": "Fm-3m",
        "subfiles": ["I", "M", "CP"], "density": 2.165,
        "cell": {"a": 5.6402, "b": 5.6402, "c": 5.6402, "alpha": 90.0, "beta": 90.0, "gamma": 90.0},
        "peaks": [
            {"two_theta": 27.36, "intensity": 13.0, "hkl": [1, 1, 1], "d": 3.2564},
            {"two_theta": 31.69, "intensity": 100.0, "hkl": [2, 0, 0], "d": 2.8201},
            {"two_theta": 45.45, "intensity": 55.0, "hkl": [2, 2, 0], "d": 1.9941},
            {"two_theta": 53.85, "intensity": 2.0, "hkl": [3, 1, 1], "d": 1.7006},
            {"two_theta": 56.47, "intensity": 15.0, "hkl": [2, 2, 2], "d": 1.6282},
            {"two_theta": 66.22, "intensity": 6.0, "hkl": [4, 0, 0], "d": 1.4101},
            {"two_theta": 75.30, "intensity": 11.0, "hkl": [4, 2, 0], "d": 1.2612}
        ]
    },
    {
        "id": "035-0816", "jcpds": "035-0816", "cod_id": "9009007",
        "name": "Fluorite (CaF2)", "formula": "CaF2", "system": "Cubic", "space_group": "Fm-3m",
        "subfiles": ["I", "M", "CP"], "density": 3.180,
        "cell": {"a": 5.4631, "b": 5.4631, "c": 5.4631, "alpha": 90.0, "beta": 90.0, "gamma": 90.0},
        "peaks": [
            {"two_theta": 28.27, "intensity": 92.0, "hkl": [1, 1, 1], "d": 3.1541},
            {"two_theta": 47.00, "intensity": 100.0, "hkl": [2, 2, 0], "d": 1.9315},
            {"two_theta": 55.76, "intensity": 33.0, "hkl": [3, 1, 1], "d": 1.6472},
            {"two_theta": 68.68, "intensity": 10.0, "hkl": [4, 0, 0], "d": 1.3658},
            {"two_theta": 75.86, "intensity": 23.0, "hkl": [3, 3, 1], "d": 1.2531}
        ]
    },
    {
        "id": "005-0566", "jcpds": "005-0566", "cod_id": "1100043",
        "name": "Sphalerite (ZnS)", "formula": "ZnS", "system": "Cubic", "space_group": "F-43m",
        "subfiles": ["I", "M", "CP"], "density": 4.090,
        "cell": {"a": 5.4060, "b": 5.4060, "c": 5.4060, "alpha": 90.0, "beta": 90.0, "gamma": 90.0},
        "peaks": [
            {"two_theta": 28.56, "intensity": 100.0, "hkl": [1, 1, 1], "d": 3.1230},
            {"two_theta": 33.09, "intensity": 10.0, "hkl": [2, 0, 0], "d": 2.7050},
            {"two_theta": 47.52, "intensity": 51.0, "hkl": [2, 2, 0], "d": 1.9120},
            {"two_theta": 56.29, "intensity": 30.0, "hkl": [3, 1, 1], "d": 1.6330},
            {"two_theta": 69.59, "intensity": 6.0, "hkl": [4, 0, 0], "d": 1.3500}
        ]
    },
    {
        "id": "005-0592", "jcpds": "005-0592", "cod_id": "9008694",
        "name": "Galena (PbS)", "formula": "PbS", "system": "Cubic", "space_group": "Fm-3m",
        "subfiles": ["I", "M"], "density": 7.597,
        "cell": {"a": 5.9362, "b": 5.9362, "c": 5.9362, "alpha": 90.0, "beta": 90.0, "gamma": 90.0},
        "peaks": [
            {"two_theta": 25.98, "intensity": 84.0, "hkl": [1, 1, 1], "d": 3.4290},
            {"two_theta": 30.07, "intensity": 100.0, "hkl": [2, 0, 0], "d": 2.9690},
            {"two_theta": 43.05, "intensity": 57.0, "hkl": [2, 2, 0], "d": 2.0990},
            {"two_theta": 50.98, "intensity": 35.0, "hkl": [3, 1, 1], "d": 1.7900},
            {"two_theta": 53.41, "intensity": 16.0, "hkl": [2, 2, 2], "d": 1.7140},
            {"two_theta": 62.54, "intensity": 10.0, "hkl": [4, 0, 0], "d": 1.4840}
        ]
    },
    {
        "id": "004-0850", "jcpds": "004-0850", "cod_id": "9012971",
        "name": "Nickel (Ni)", "formula": "Ni", "system": "Cubic", "space_group": "Fm-3m",
        "subfiles": ["I", "A", "CP"], "density": 8.910,
        "cell": {"a": 3.5238, "b": 3.5238, "c": 3.5238, "alpha": 90.0, "beta": 90.0, "gamma": 90.0},
        "peaks": [
            {"two_theta": 44.51, "intensity": 100.0, "hkl": [1, 1, 1], "d": 2.0340},
            {"two_theta": 51.85, "intensity": 42.0, "hkl": [2, 0, 0], "d": 1.7620},
            {"two_theta": 76.37, "intensity": 21.0, "hkl": [2, 2, 0], "d": 1.2460}
        ]
    },
    {
        "id": "006-0696", "jcpds": "006-0696", "cod_id": "9008536",
        "name": "Iron (alpha-Fe)", "formula": "Fe", "system": "Cubic", "space_group": "Im-3m",
        "subfiles": ["I", "A", "CP"], "density": 7.874,
        "cell": {"a": 2.8664, "b": 2.8664, "c": 2.8664, "alpha": 90.0, "beta": 90.0, "gamma": 90.0},
        "peaks": [
            {"two_theta": 44.67, "intensity": 100.0, "hkl": [1, 1, 0], "d": 2.0268},
            {"two_theta": 65.02, "intensity": 20.0, "hkl": [2, 0, 0], "d": 1.4332},
            {"two_theta": 82.33, "intensity": 30.0, "hkl": [2, 1, 1], "d": 1.1702}
        ]
    },
    {
        "id": "009-0432", "jcpds": "009-0432", "cod_id": "9002213",
        "name": "Hydroxyapatite (Ca5(PO4)3OH)", "formula": "Ca5P3O13H", "system": "Hexagonal", "space_group": "P63/m",
        "subfiles": ["I", "M", "C"], "density": 3.156,
        "cell": {"a": 9.4180, "b": 9.4180, "c": 6.8840, "alpha": 90.0, "beta": 90.0, "gamma": 120.0},
        "peaks": [
            {"two_theta": 25.88, "intensity": 40.0, "hkl": [0, 0, 2], "d": 3.4400},
            {"two_theta": 31.77, "intensity": 100.0, "hkl": [2, 1, 1], "d": 2.8140},
            {"two_theta": 32.20, "intensity": 60.0, "hkl": [1, 1, 2], "d": 2.7780},
            {"two_theta": 32.90, "intensity": 60.0, "hkl": [3, 0, 0], "d": 2.7200},
            {"two_theta": 39.82, "intensity": 20.0, "hkl": [3, 1, 0], "d": 2.2620},
            {"two_theta": 46.71, "intensity": 30.0, "hkl": [2, 2, 2], "d": 1.9430},
            {"two_theta": 49.47, "intensity": 40.0, "hkl": [2, 1, 3], "d": 1.8410}
        ]
    },
    {
        "id": "031-1975", "jcpds": "031-1975", "cod_id": "2106155",
        "name": "Urea (CH4N2O)", "formula": "CH4N2O", "system": "Tetragonal", "space_group": "P-421m",
        "subfiles": ["O", "CP"], "density": 1.335,
        "cell": {"a": 5.6610, "b": 5.6610, "c": 4.7120, "alpha": 90.0, "beta": 90.0, "gamma": 90.0},
        "peaks": [
            {"two_theta": 22.25, "intensity": 100.0, "hkl": [1, 1, 0], "d": 3.9920},
            {"two_theta": 24.62, "intensity": 28.0, "hkl": [1, 0, 1], "d": 3.6130},
            {"two_theta": 29.32, "intensity": 24.0, "hkl": [1, 1, 1], "d": 3.0440},
            {"two_theta": 31.59, "intensity": 12.0, "hkl": [2, 0, 0], "d": 2.8300},
            {"two_theta": 35.53, "intensity": 16.0, "hkl": [2, 1, 0], "d": 2.5240},
            {"two_theta": 37.13, "intensity": 10.0, "hkl": [0, 0, 2], "d": 2.4200}
        ]
    }
]


def create_sq_database(sq_path: str, phases: List[Dict[str, Any]]) -> None:
    """Creates a QualX-compatible SQLite3 .sq database with `id`, `chemical`, `subfiles`, and `infodb` tables."""
    os.makedirs(os.path.dirname(os.path.abspath(sq_path)), exist_ok=True)
    if os.path.exists(sq_path):
        os.remove(sq_path)

    conn = sqlite3.connect(sq_path)
    try:
        cur = conn.cursor()
        cur.execute("CREATE TABLE infodb (version TEXT, name TEXT, description TEXT)")
        cur.execute(
            "INSERT INTO infodb VALUES (?, ?, ?)",
            ("2.0", os.path.basename(sq_path), "Diffracta / QualX SQLite Powder Diffraction Reference Database")
        )
        cur.execute(
            """
            CREATE TABLE id (
                id TEXT PRIMARY KEY,
                jcpds TEXT,
                cod_id TEXT,
                name TEXT,
                formula TEXT,
                syngony TEXT,
                spgr TEXT,
                a REAL,
                b REAL,
                c REAL,
                alpha REAL,
                beta REAL,
                gamma REAL,
                volume REAL,
                density REAL,
                dval TEXT,
                intens TEXT,
                hkl TEXT
            )
            """
        )
        cur.execute("CREATE TABLE chemical (id TEXT, chemical_element TEXT, atomic_number INTEGER)")
        cur.execute("CREATE INDEX idx_chem_el ON chemical (chemical_element)")
        cur.execute("CREATE INDEX idx_chem_id ON chemical (id)")
        cur.execute("CREATE TABLE subfiles (id TEXT, subfile TEXT)")
        cur.execute("CREATE INDEX idx_sub_code ON subfiles (subfile)")
        cur.execute("CREATE INDEX idx_sub_id ON subfiles (id)")

        for raw_p in phases:
            p = enrich_phase_metadata(raw_p)
            pid = str(p.get("id", ""))
            cell = p.get("cell") or {}
            peaks = p.get("peaks") or []
            d_str = ",".join(f"{pk.get('d', 0.0):.4f}" for pk in peaks)
            i_str = ",".join(f"{pk.get('intensity', 0.0):.1f}" for pk in peaks)
            hkl_str = ";".join(
                f"{pk['hkl'][0]} {pk['hkl'][1]} {pk['hkl'][2]}" if pk.get("hkl") and len(pk["hkl"]) >= 3 else "0 0 0"
                for pk in peaks
            )
            cur.execute(
                """
                INSERT OR REPLACE INTO id
                (id, jcpds, cod_id, name, formula, syngony, spgr, a, b, c, alpha, beta, gamma, volume, density, dval, intens, hkl)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    pid,
                    str(p.get("jcpds", pid)),
                    str(p.get("cod_id", "")),
                    str(p.get("name", p.get("formula", pid))),
                    str(p.get("formula", "")),
                    str(p.get("system", "Hexagonal")),
                    str(p.get("space_group", "")),
                    float(cell.get("a", 0.0)),
                    float(cell.get("b", cell.get("a", 0.0))),
                    float(cell.get("c", cell.get("a", 0.0))),
                    float(cell.get("alpha", 90.0)),
                    float(cell.get("beta", 90.0)),
                    float(cell.get("gamma", 90.0)),
                    float(p.get("volume") or 0.0),
                    float(p.get("density") or 0.0),
                    d_str,
                    i_str,
                    hkl_str
                )
            )
            for el in p.get("elements", []):
                cur.execute(
                    "INSERT INTO chemical (id, chemical_element, atomic_number) VALUES (?, ?, ?)",
                    (pid, el, ELEMENT_TO_Z.get(el, 0))
                )
            for sf in p.get("subfiles", []):
                cur.execute("INSERT INTO subfiles (id, subfile) VALUES (?, ?)", (pid, sf))

        conn.commit()
    finally:
        conn.close()


def seed_sample_sq_database(sq_path: str) -> None:
    """Seeds sample_data/pdf2-1.sq with 24 curated inorganic, mineral, alloy, and organic phases."""
    combined = list(SEED_PHASES) + list(EXTRA_SQ_PHASES)
    create_sq_database(sq_path, combined)


def get_desktop_directories() -> List[str]:
    """Returns existing local Desktop folders (standard and OneDrive) on the host machine."""
    home = os.path.expanduser("~")
    candidates = [
        os.path.join(home, "Desktop"),
        os.path.join(home, "OneDrive", "Desktop"),
    ]
    out = []
    for c in candidates:
        if os.path.isdir(c) and c not in out:
            out.append(c)
    if not out and os.path.isdir(home):
        out.append(home)
    return out


def load_sq_index_config() -> Dict[str, Any]:
    """Reads persisted .sq database index configuration."""
    if os.path.exists(SQ_CONFIG_PATH):
        try:
            with open(SQ_CONFIG_PATH, "r", encoding="utf-8") as f:
                cfg = json.load(f)
                paths = [p for p in cfg.get("sq_paths", []) if os.path.isfile(p)]
                return {"raw_path": cfg.get("raw_path", ""), "sq_paths": paths}
        except Exception:
            pass
    return {"raw_path": "", "sq_paths": []}


def save_sq_index_config(raw_path: str, sq_paths: List[str]) -> None:
    os.makedirs(DATABASE_DIR, exist_ok=True)
    if not raw_path and not sq_paths:
        if os.path.exists(SQ_CONFIG_PATH):
            os.remove(SQ_CONFIG_PATH)
        return
    with open(SQ_CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump({"raw_path": raw_path, "sq_paths": sq_paths}, f, indent=2)


def resolve_sq_paths(raw_path: str) -> List[str]:
    """Resolves a user-supplied .sq file or folder path (checking Desktop folders when relative)."""
    if not raw_path or not raw_path.strip():
        return []
    cleaned = os.path.expandvars(os.path.expanduser(raw_path.strip().strip('"').strip("'")))

    search_roots = [""] + get_desktop_directories() + [DATABASE_DIR, SAMPLE_DIR]
    matched_target = None

    for root in search_roots:
        cand = os.path.abspath(os.path.join(root, cleaned)) if root else os.path.abspath(cleaned)
        if os.path.exists(cand):
            matched_target = cand
            break

    # If bare filename given (e.g. "pdf2-1.sq"), also check 1 level inside Desktop subfolders
    if not matched_target and os.path.basename(cleaned) == cleaned:
        for desk in get_desktop_directories():
            try:
                for entry in os.scandir(desk):
                    if entry.is_dir():
                        sub_cand = os.path.join(entry.path, cleaned)
                        if os.path.isfile(sub_cand):
                            matched_target = sub_cand
                            break
                if matched_target:
                    break
            except Exception:
                continue

    if not matched_target:
        return []

    if os.path.isfile(matched_target):
        return [matched_target]

    if os.path.isdir(matched_target):
        found = sorted(glob.glob(os.path.join(matched_target, "*.sq")))
        if not found:
            found = sorted(glob.glob(os.path.join(matched_target, "**", "*.sq"), recursive=True))
        return [f for f in found if os.path.isfile(f)]

    return []


def scan_sq_directory(target_dir: Optional[str] = None) -> Dict[str, Any]:
    """Lists .sq files and subdirectories in the given folder (defaults to local Desktop)."""
    desktops = get_desktop_directories()
    default_dir = desktops[0] if desktops else SAMPLE_DIR
    browse_dir = os.path.abspath(os.path.expandvars(os.path.expanduser(target_dir))) if target_dir else default_dir
    if not os.path.isdir(browse_dir):
        browse_dir = default_dir

    sq_files = []
    subdirs = []
    try:
        for entry in sorted(os.scandir(browse_dir), key=lambda e: e.name.lower()):
            if entry.name.startswith("."):
                continue
            if entry.is_dir():
                subdirs.append({"name": entry.name, "path": entry.path})
            elif entry.is_file() and entry.name.lower().endswith((".sq", ".sqlite", ".sqlite3", ".db")):
                sq_files.append({
                    "name": entry.name,
                    "path": entry.path,
                    "size_kb": round(entry.stat().st_size / 1024.0, 1)
                })
    except Exception:
        pass

    # Also collect any .sq files in Desktop (1 level deep), sample_data/, and database/ for quick-pick
    quick_sq = []
    seen_paths = set()
    for folder in desktops + [DATABASE_DIR, SAMPLE_DIR]:
        if not os.path.isdir(folder):
            continue
        for pat in [os.path.join(folder, "*.sq"), os.path.join(folder, "*", "*.sq")]:
            for fpath in sorted(glob.glob(pat)):
                ap = os.path.abspath(fpath)
                if ap not in seen_paths and os.path.isfile(ap):
                    seen_paths.add(ap)
                    quick_sq.append({
                        "name": os.path.basename(ap),
                        "path": ap,
                        "size_kb": round(os.path.getsize(ap) / 1024.0, 1)
                    })

    parent_dir = os.path.dirname(browse_dir)
    return {
        "current_dir": browse_dir,
        "parent_dir": parent_dir if parent_dir != browse_dir else None,
        "desktop_dir": desktops[0] if desktops else "",
        "subdirs": subdirs[:80],
        "sq_files": sq_files,
        "discovered_sq_files": quick_sq
    }


def _normalize_crystal_system(raw_sys: Any, cell: Dict[str, float]) -> str:
    s = str(raw_sys or "").strip().lower()
    mapping = {
        "c": "Cubic", "cubic": "Cubic", "7": "Cubic",
        "t": "Tetragonal", "tetragonal": "Tetragonal", "4": "Tetragonal",
        "h": "Hexagonal", "hexagonal": "Hexagonal", "6": "Hexagonal",
        "r": "Trigonal", "tr": "Trigonal", "trigonal": "Trigonal", "rhombohedral": "Trigonal", "5": "Trigonal",
        "o": "Orthorhombic", "orthorhombic": "Orthorhombic", "3": "Orthorhombic",
        "m": "Monoclinic", "monoclinic": "Monoclinic", "2": "Monoclinic",
        "a": "Triclinic", "tc": "Triclinic", "triclinic": "Triclinic", "anorthic": "Triclinic", "1": "Triclinic",
    }
    if s in mapping:
        return mapping[s]
    for k, v in mapping.items():
        if len(k) > 2 and k in s:
            return v
    a, b, c = cell.get("a", 4.0), cell.get("b", 4.0), cell.get("c", 4.0)
    al, be, ga = cell.get("alpha", 90.0), cell.get("beta", 90.0), cell.get("gamma", 90.0)
    if abs(al - 90) < 0.2 and abs(be - 90) < 0.2 and abs(ga - 120) < 0.2:
        return "Hexagonal"
    if abs(a - b) < 0.01 and abs(b - c) < 0.01 and abs(al - 90) < 0.2 and abs(be - 90) < 0.2 and abs(ga - 90) < 0.2:
        return "Cubic"
    if abs(a - b) < 0.01 and abs(al - 90) < 0.2 and abs(be - 90) < 0.2 and abs(ga - 90) < 0.2:
        return "Tetragonal"
    if abs(al - 90) < 0.2 and abs(be - 90) < 0.2 and abs(ga - 90) < 0.2:
        return "Orthorhombic"
    if abs(al - 90) < 0.2 and abs(ga - 90) < 0.2:
        return "Monoclinic"
    return "Triclinic"


def _decode_numeric_array(val: Any) -> List[float]:
    if val is None:
        return []
    if isinstance(val, (list, tuple)):
        return [float(x) for x in val if x is not None]
    if isinstance(val, (int, float)):
        return [float(val)]
    if isinstance(val, bytes):
        if not val:
            return []
        try:
            txt = val.decode("utf-8")
            if all(ch.isprintable() or ch in "\r\n\t" for ch in txt):
                nums = [float(x) for x in re.findall(r"[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?", txt)]
                if nums:
                    return nums
        except UnicodeDecodeError:
            pass
        if len(val) % 8 == 0:
            arr8 = np.frombuffer(val, dtype="<f8")
            if np.all(np.isfinite(arr8)) and np.all(np.abs(arr8) < 1e6) and np.any(arr8 > 0.05):
                return [float(x) for x in arr8]
        if len(val) % 4 == 0:
            arr4 = np.frombuffer(val, dtype="<f4")
            if np.all(np.isfinite(arr4)) and np.all(np.abs(arr4) < 1e6):
                return [float(x) for x in arr4]
        return []
    s = str(val).strip()
    if not s:
        return []
    if s.startswith("["):
        try:
            parsed = json.loads(s)
            if isinstance(parsed, list):
                return [float(x) for x in parsed]
        except Exception:
            pass
    return [float(x) for x in re.findall(r"[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?", s)]


def _decode_hkl_array(val: Any, count: int) -> List[List[int]]:
    if val is None:
        return [[0, 0, 0] for _ in range(count)]
    if isinstance(val, bytes):
        try:
            val = val.decode("utf-8", errors="ignore")
        except Exception:
            return [[0, 0, 0] for _ in range(count)]
    s = str(val).strip()
    if not s:
        return [[0, 0, 0] for _ in range(count)]
    if s.startswith("["):
        try:
            arr = json.loads(s)
            if isinstance(arr, list):
                return [[int(x) for x in item[:3]] if isinstance(item, list) and len(item) >= 3 else [0, 0, 0] for item in arr]
        except Exception:
            pass
    groups = [g.strip() for g in re.split(r"[;|/]+", s) if g.strip()]
    if len(groups) == count:
        out = []
        for g in groups:
            ints = [int(x) for x in re.findall(r"[-+]?\d+", g)]
            out.append(ints[:3] if len(ints) >= 3 else [0, 0, 0])
        return out
    all_ints = [int(x) for x in re.findall(r"[-+]?\d+", s)]
    if len(all_ints) >= count * 3:
        return [all_ints[3 * i: 3 * i + 3] for i in range(count)]
    return [[0, 0, 0] for _ in range(count)]


def _infer_system_from_spacegroup(sg: str) -> str:
    s = re.sub(r"\s+", "", str(sg or "")).strip()
    if not s:
        return ""
    # Cubic space groups (have 3-fold along body diagonal, e.g., Pm-3m, Fm-3m, Fd-3m, Ia-3d, I-43d, P213, F23)
    if re.search(r"[-]?3[mncd]|23$|432$|[-]?43[mn]", s, re.IGNORECASE) and not s.upper().startswith(("R", "P3", "P-3", "P6", "H")):
        return "Cubic"
    if s[0] in ("P", "I") and ("4" in s[:4]):
        return "Tetragonal"
    if s.startswith(("P6", "P-6")):
        return "Hexagonal"
    if s.startswith(("R", "P3", "P-3")):
        return "Hexagonal"
    if s.startswith(("P21/c", "P21/n", "P21/m", "P2/m", "P2/c", "C2/", "I2/", "Cc", "Cm", "Pc", "Pm", "P21", "C2")):
        return "Monoclinic"
    if s in ("P1", "P-1"):
        return "Triclinic"
    if s[0] in ("P", "C", "I", "F", "A", "B") and len(s) >= 3:
        return "Orthorhombic"
    return ""


def _format_pdf2_jcpds_id(raw_id: Any, is_pdf_db: bool = False) -> str:
    s = str(raw_id or "").strip()
    if re.match(r"^\d{2,3}-\d{4}$", s):
        parts = s.split("-")
        return f"{int(parts[0]):03d}-{int(parts[1]):04d}"
    if is_pdf_db and s.isdigit():
        num = int(s)
        if 10001 <= num <= 999999:
            return f"{num // 10000:03d}-{num % 10000:04d}"
    return s


def _parse_jcpds_to_sq_int(token: str) -> Optional[int]:
    t = str(token or "").strip()
    m3 = re.match(r"^(\d{2})-(\d{2,3})-(\d{4})$", t)
    if m3:
        return int(m3.group(2)) * 10000 + int(m3.group(3))
    m2 = re.match(r"^(\d{1,3})-(\d{4})$", t)
    if m2:
        return int(m2.group(1)) * 10000 + int(m2.group(2))
    if t.isdigit() and 10001 <= int(t) <= 999999:
        return int(t)
    return None


def _find_companion_pdf2_dat(sq_path: str) -> Optional[str]:
    folder = os.path.dirname(os.path.abspath(sq_path))
    if not os.path.isdir(folder):
        return None
    for fname in ("PDF2.DAT", "pdf2.dat"):
        cand = os.path.join(folder, fname)
        if os.path.isfile(cand):
            return cand
    return None


def _enrich_from_pdf2_dat(dat_file, nrec: int, wavelength: float = 1.5406) -> Dict[str, Any]:
    """Reads unit cell, crystal system, density/volume, and (hkl)-indexed reflections from NBS*AIDS83 PDF2.DAT."""
    if nrec <= 0:
        return {}
    sys_codes = {
        "C": "Cubic",
        "T": "Tetragonal",
        "H": "Hexagonal",
        "R": "Hexagonal",
        "O": "Orthorhombic",
        "M": "Monoclinic",
        "A": "Triclinic",
    }

    def safe_f(sub: str, default: float = 0.0) -> float:
        sub_s = sub.strip()
        if not sub_s:
            return default
        try:
            return float(sub_s)
        except ValueError:
            return default

    try:
        dat_file.seek((nrec - 1) * 80)
        first = dat_file.read(80).decode("ascii", errors="replace")
        if len(first) < 80:
            return {}
        card_key = first[72:78]
        lines = [first]
        for _ in range(120):
            ln = dat_file.read(80).decode("ascii", errors="replace")
            if len(ln) < 80 or ln[72:78] != card_key:
                break
            lines.append(ln)

        out: Dict[str, Any] = {}
        sys_char = first[78].upper()
        if sys_char in sys_codes:
            out["system"] = sys_codes[sys_char]

        a = safe_f(first[0:9], 0.0)
        b = safe_f(first[9:18], 0.0)
        c = safe_f(first[18:27], 0.0)
        al = safe_f(first[27:35], 90.0)
        be = safe_f(first[35:43], 90.0)
        ga = safe_f(first[43:51], 90.0)
        if a > 0:
            if sys_char == "C":
                b = b or a
                c = c or a
            elif sys_char in ("T", "H", "R"):
                b = b or a
                c = c or a
                if sys_char in ("H", "R") and ga == 90.0:
                    ga = 120.0
            else:
                b = b or a
                c = c or a
            out["cell"] = {
                "a": round(a, 4),
                "b": round(b, 4),
                "c": round(c, 4),
                "alpha": round(al, 2),
                "beta": round(be, 2),
                "gamma": round(ga, 2),
            }

        peaks = []
        for ln in lines:
            rec_type = ln[79]
            if rec_type == "4":
                sg_s = ln[0:11].strip()
                if sg_s:
                    out["space_group"] = sg_s
                dx = safe_f(ln[38:46], 0.0)
                vol = safe_f(ln[64:71], 0.0)
                if dx > 0:
                    out["density"] = round(dx, 3)
                if vol > 0:
                    out["volume"] = round(vol, 2)
            elif rec_type == "I":
                for off in (0, 23, 46):
                    seg = ln[off: off + 23]
                    if len(seg) < 10 or not seg[0:7].strip():
                        continue
                    d_v = safe_f(seg[0:7], 0.0)
                    int_s = re.sub(r"[^0-9.]", "", seg[7:10])
                    i_v = float(int_s) if int_s else 1.0
                    hkl_ints = [int(x) for x in re.findall(r"[-+]?\d+", seg[10:20])]
                    hkl = hkl_ints[:3] if len(hkl_ints) >= 3 else [0, 0, 0]
                    if d_v > 0:
                        s_th = wavelength / (2.0 * d_v)
                        if 0.0 < s_th < 0.998:
                            tt_v = 2.0 * math.degrees(math.asin(s_th))
                            if 2.0 <= tt_v <= 140.0:
                                peaks.append({
                                    "two_theta": round(tt_v, 3),
                                    "d": round(d_v, 4),
                                    "intensity": round(i_v, 1),
                                    "hkl": hkl,
                                })
        if peaks:
            mx_i = max(p["intensity"] for p in peaks) or 100.0
            if mx_i > 100.5:
                for p in peaks:
                    p["intensity"] = round((p["intensity"] / mx_i) * 100.0, 1)
            peaks.sort(key=lambda p: p["two_theta"])
            out["peaks"] = peaks
        return out
    except Exception:
        return {}


def _open_sq_connection(sq_path: str) -> sqlite3.Connection:
    with open(sq_path, "rb") as fb:
        magic = fb.read(16)
    if not magic.startswith(b"SQLite format 3"):
        raise ValueError(f"Not a valid SQLite3 .sq database file: {os.path.basename(sq_path)}")
    try:
        conn = sqlite3.connect(f"file:{sq_path}?mode=ro", uri=True)
    except Exception:
        conn = sqlite3.connect(sq_path)
    conn.row_factory = sqlite3.Row
    # Attach QualX companion files (.sq.info, .sq.infostat, .sq.search) if present alongside .sq
    for suffix, alias in [(".info", "qinfo"), (".infostat", "qstat"), (".search", "qsearch")]:
        comp = sq_path + suffix
        if os.path.isfile(comp) and os.path.getsize(comp) >= 100:
            try:
                conn.execute(f"ATTACH DATABASE ? AS {alias}", (comp,))
            except Exception:
                pass
    return conn


def load_phases_from_sq(
    sq_path: str,
    restraints: Optional[Dict[str, Any]] = None,
    query: str = "",
    limit: int = 500,
    wavelength: float = 1.5406,
    exp_peaks: Optional[List[Dict[str, Any]]] = None,
    tolerance_deg: float = 0.45
) -> Tuple[List[Dict[str, Any]], int]:
    """
    Reads reference phases from a QualX / PDF-2 / POW_COD SQLite .sq database file.
    Supports `dvalue`/`intensita` (QualX PDF-2), `dval`/`intens`, `.sq.search` Hanawalt index,
    and companion `PDF2.DAT` NBS*AIDS83 records for unit cells and (hkl) indices.
    """
    if not os.path.isfile(sq_path):
        return [], 0

    # Fallback if user supplies a JSON-formatted .sq file
    with open(sq_path, "rb") as fb:
        head = fb.read(32)
    if not head.startswith(b"SQLite format 3"):
        try:
            text = open(sq_path, "r", encoding="utf-8", errors="ignore").read()
            data = json.loads(text)
            raw_list = data if isinstance(data, list) else data.get("phases", [])
            enriched = [enrich_phase_metadata({**p, "source": os.path.basename(sq_path)}) for p in raw_list]
            filtered = filter_phases_by_restraints(enriched, restraints, query=query)
            return filtered[:limit], len(enriched)
        except Exception as exc:
            raise ValueError(f"Unsupported .sq file format in {os.path.basename(sq_path)}: {exc}")

    conn = _open_sq_connection(sq_path)
    dat_fp = None
    try:
        cur = conn.cursor()
        schemas_to_check = ["main"]
        for row in cur.execute("PRAGMA database_list").fetchall():
            if row[1] not in schemas_to_check:
                schemas_to_check.append(row[1])

        tables: Dict[str, List[str]] = {}
        for sch in schemas_to_check:
            for trow in cur.execute(f"SELECT name FROM {sch}.sqlite_master WHERE type='table'").fetchall():
                tname = trow[0]
                if tname.startswith("sqlite_"):
                    continue
                full_t = f"{sch}.{tname}" if sch != "main" else tname
                cols = [c[1] for c in cur.execute(f"PRAGMA {sch}.table_info('{tname}')").fetchall()]
                tables[full_t] = cols

        if not tables:
            return [], 0

        # Identify main card table
        preferred = ["id", "phases", "cards", "entries", "pdf", "structures", "main", "info"]
        aux_names = {"chemical", "subfiles", "infodb", "warningcif", "warn", "peaks", "lines", "reflections", "top"}
        main_table = None
        for pref in preferred:
            for tname in tables:
                base_t = tname.split(".")[-1].lower()
                if base_t == pref and tables[tname]:
                    main_table = tname
                    break
            if main_table:
                break
        if not main_table:
            non_aux = [t for t in tables if t.split(".")[-1].lower() not in aux_names]
            main_table = non_aux[0] if non_aux else next(iter(tables.keys()))

        main_cols = tables[main_table]
        col_map = {c.lower(): c for c in main_cols}

        def pick_col(*cands: str) -> Optional[str]:
            for c in cands:
                if c in col_map:
                    return col_map[c]
            return None

        id_col = pick_col("id", "card_id", "pdf_id", "jcpds", "entry_id", "code", "num", "cod_id")
        chem_table = next((t for t in tables if t.split(".")[-1].lower() == "chemical"), None)
        sub_table = next((t for t in tables if t.split(".")[-1].lower() == "subfiles"), None)
        peaks_table = next((t for t in tables if t.split(".")[-1].lower() in ("peaks", "lines", "reflections", "dlist")), None)
        infodb_table = next((t for t in tables if t.split(".")[-1].lower() == "infodb"), None)
        qsearch_top = "qsearch.top" if "qsearch.top" in tables else None

        is_pdf_db = os.path.basename(sq_path).lower().startswith("pdf")
        if infodb_table and not is_pdf_db:
            try:
                db_type_row = cur.execute(f"SELECT * FROM {infodb_table} LIMIT 1").fetchone()
                if db_type_row and "pdf" in " ".join(str(x) for x in db_type_row).lower():
                    is_pdf_db = True
            except Exception:
                pass

        total_count = int(cur.execute(f"SELECT COUNT(*) FROM {main_table}").fetchone()[0])

        name_col = pick_col("name", "chem_name", "chemical_name", "compound", "cname", "title")
        mineral_col = pick_col("mineralname", "mineral_name", "mineral")
        formula_col = pick_col("formula", "chemical_formula", "chem_formula", "chemical", "formula_sum", "comp")
        sys_col = pick_col("system", "syngony", "crystal_system", "csys", "sym", "symmetry", "sy")
        sg_col = pick_col("space_group", "spacegroup", "spgr", "sg", "sgroup", "spg")
        a_col, b_col, c_col = pick_col("a", "cell_a"), pick_col("b", "cell_b"), pick_col("c", "cell_c")
        al_col, be_col, ga_col = pick_col("alpha", "al"), pick_col("beta", "be"), pick_col("gamma", "ga")
        vol_col = pick_col("volume", "vol", "v")
        dens_col = pick_col("density", "dcalc", "rho", "dens", "dmeas")
        sub_col = pick_col("subfile", "subfiles", "sub", "category")
        el_col = pick_col("elements", "els")
        peaks_json_col = pick_col("peaks", "reflections", "lines_json")
        d_col = pick_col("dval", "dvalue", "d", "d_values", "d_spacings", "dsp", "dlist")
        bestd_col = pick_col("bestdval", "top_d")
        int_col = pick_col("intens", "intensita", "intensity", "intensities", "int", "ival", "ilist", "rel_int")
        tt_col = pick_col("two_theta", "theta2", "tth", "tt", "twotheta")
        hkl_col = pick_col("hkl", "miller", "hkls", "indices")
        nrec_col = pick_col("nrec")

        where_clauses = []
        sql_params: List[Any] = []

        # 1. Push down SQL composition filter via `chemical` table
        comp = (restraints or {}).get("composition") or {}
        if chem_table and id_col:
            chem_cols_low = {c.lower(): c for c in tables[chem_table]}
            chem_id_col = chem_cols_low.get("id") or chem_cols_low.get("card_id") or chem_cols_low.get("phase_id")
            chem_el_col = (
                chem_cols_low.get("chemical_element")
                or chem_cols_low.get("element")
                or chem_cols_low.get("el")
                or chem_cols_low.get("symbol")
            )
            if chem_id_col and chem_el_col:
                for req_el in comp.get("and_elements") or []:
                    where_clauses.append(
                        f"{id_col} IN (SELECT {chem_id_col} FROM {chem_table} WHERE {chem_el_col} = ?)"
                    )
                    sql_params.append(req_el)
                for exc_el in comp.get("not_elements") or []:
                    where_clauses.append(
                        f"{id_col} NOT IN (SELECT {chem_id_col} FROM {chem_table} WHERE {chem_el_col} = ?)"
                    )
                    sql_params.append(exc_el)
                or_els = comp.get("or_elements") or []
                if or_els:
                    marks = ",".join("?" for _ in or_els)
                    where_clauses.append(
                        f"{id_col} IN (SELECT {chem_id_col} FROM {chem_table} WHERE {chem_el_col} IN ({marks}))"
                    )
                    sql_params.extend(or_els)
                only_els = comp.get("only_elements") or []
                if only_els:
                    marks = ",".join("?" for _ in only_els)
                    where_clauses.append(
                        f"{id_col} NOT IN (SELECT {chem_id_col} FROM {chem_table} WHERE {chem_el_col} NOT IN ({marks}))"
                    )
                    sql_params.extend(only_els)
                just_els = comp.get("just_elements") or []
                if just_els:
                    for jel in just_els:
                        where_clauses.append(
                            f"{id_col} IN (SELECT {chem_id_col} FROM {chem_table} WHERE {chem_el_col} = ?)"
                        )
                        sql_params.append(jel)
                    marks = ",".join("?" for _ in just_els)
                    where_clauses.append(
                        f"{id_col} NOT IN (SELECT {chem_id_col} FROM {chem_table} WHERE {chem_el_col} NOT IN ({marks}))"
                    )
                    sql_params.extend(just_els)

        # 2. Push down Subfiles restraint via `subfiles` table
        sub_cfg = (restraints or {}).get("subfiles") or {}
        sel_subs = [str(s).strip().upper() for s in (sub_cfg.get("selected") or []) if str(s).strip()]
        sub_mode = str(sub_cfg.get("mode") or "or").lower()
        if sel_subs and sub_table and id_col:
            sc_low = {c.lower(): c for c in tables[sub_table]}
            sid_c = sc_low.get("id") or sc_low.get("card_id")
            ssf_c = sc_low.get("subfile") or sc_low.get("sub") or sc_low.get("code")
            if sid_c and ssf_c:
                if sub_mode == "and":
                    for s_code in sel_subs:
                        where_clauses.append(f"{id_col} IN (SELECT {sid_c} FROM {sub_table} WHERE {ssf_c} = ?)")
                        sql_params.append(s_code)
                elif sub_mode == "not":
                    marks = ",".join("?" for _ in sel_subs)
                    where_clauses.append(f"{id_col} NOT IN (SELECT {sid_c} FROM {sub_table} WHERE {ssf_c} IN ({marks}))")
                    sql_params.extend(sel_subs)
                else:
                    marks = ",".join("?" for _ in sel_subs)
                    where_clauses.append(f"{id_col} IN (SELECT {sid_c} FROM {sub_table} WHERE {ssf_c} IN ({marks}))")
                    sql_params.extend(sel_subs)

        # 3. Push down Chemical Name restraint
        cname_cfg = (restraints or {}).get("chemical_name") or {}
        cname_q = str(cname_cfg.get("query") or "").strip()
        if cname_q:
            cname_mode = str(cname_cfg.get("mode") or "contains").lower()
            like_pat = f"{cname_q}%" if cname_mode == "starts_with" else f"%{cname_q}%"
            text_cols = [c for c in (name_col, mineral_col, formula_col) if c]
            if text_cols and cname_mode != "exclude":
                sub_or = []
                for tc in text_cols:
                    sub_or.append(f"TRIM({tc}) LIKE ?")
                    sql_params.append(like_pat)
                if formula_col:
                    sub_or.append(f"REPLACE({formula_col}, ' ', '') LIKE ?")
                    sql_params.append(f"%{re.sub(r'\\s+', '', cname_q)}%")
                where_clauses.append("(" + " OR ".join(sub_or) + ")")

        # 4. Push down Entries / JCPDS ID restraint
        ent_cfg = (restraints or {}).get("entries") or {}
        ids_text = str(ent_cfg.get("ids_text") or "").strip()
        if ids_text and id_col:
            tokens = [t.strip() for t in re.split(r"[,;\s]+", ids_text) if t.strip()]
            id_ors = []
            for tok in tokens:
                if "*" in tok:
                    # e.g. 021-* -> integer range 210000..219999 OR string LIKE
                    m_set = re.match(r"^0*(\d{1,3})-\*$", tok)
                    if m_set and is_pdf_db:
                        s_num = int(m_set.group(1))
                        id_ors.append(f"({id_col} BETWEEN ? AND ?)")
                        sql_params.extend([s_num * 10000, s_num * 10000 + 9999])
                    id_ors.append(f"CAST({id_col} AS TEXT) LIKE ?")
                    sql_params.append(tok.replace("*", "%"))
                else:
                    sq_int = _parse_jcpds_to_sq_int(tok)
                    if sq_int is not None:
                        id_ors.append(f"{id_col} = ?")
                        sql_params.append(sq_int)
                    id_ors.append(f"CAST({id_col} AS TEXT) LIKE ?")
                    sql_params.append(f"%{tok}%")
            if id_ors:
                where_clauses.append("(" + " OR ".join(id_ors) + ")")

        # 5. Push down user search `query` (JCPDS number, formula with/without spaces, mineral/chemical name)
        q_clean = (query or "").strip()
        if q_clean:
            q_ors = []
            sq_int_q = _parse_jcpds_to_sq_int(q_clean)
            if id_col:
                if sq_int_q is not None:
                    q_ors.append(f"{id_col} = ?")
                    sql_params.append(sq_int_q)
                q_ors.append(f"CAST({id_col} AS TEXT) LIKE ?")
                sql_params.append(f"%{q_clean}%")
            for tc in (name_col, mineral_col, formula_col):
                if tc:
                    q_ors.append(f"{tc} LIKE ?")
                    sql_params.append(f"%{q_clean}%")
            if formula_col:
                q_nospace = re.sub(r"\s+", "", q_clean)
                q_ors.append(f"REPLACE({formula_col}, ' ', '') LIKE ?")
                sql_params.append(f"%{q_nospace}%")
            if q_ors:
                where_clauses.append("(" + " OR ".join(q_ors) + ")")

        # 6. Hanawalt d-spacing index prefilter on large (>5,000 card) databases during Search-Match
        if total_count > 5000 and exp_peaks and not q_clean and len(where_clauses) == 0 and id_col:
            strong_exp = sorted(exp_peaks, key=lambda p: float(p.get("intensity", 50.0)), reverse=True)[:6]
            peak_case_exprs = []
            peak_params: List[Any] = []
            target_d_col = "dval" if qsearch_top else bestd_col
            if target_d_col:
                for ep in strong_exp:
                    tt_v = float(ep.get("two_theta", 0.0))
                    if not (3.0 <= tt_v <= 140.0):
                        continue
                    tol = max(0.25, min(tolerance_deg, 0.55))
                    d_hi = wavelength / (2.0 * math.sin(math.radians(max(1.0, tt_v - tol) / 2.0)))
                    d_lo = wavelength / (2.0 * math.sin(math.radians(min(155.0, tt_v + tol) / 2.0)))
                    p_list = [f"{v / 100.0:.2f}" for v in range(int(math.floor(d_lo * 100)), int(math.ceil(d_hi * 100)) + 1)]
                    if len(p_list) > 10:
                        p_list = sorted({f"{v / 10.0:.1f}" for v in range(int(math.floor(d_lo * 10)), int(math.ceil(d_hi * 10)) + 1)})
                    if p_list:
                        or_sub = " OR ".join([f"(',' || {target_d_col}) LIKE ?" for _ in p_list])
                        peak_case_exprs.append(f"(CASE WHEN ({or_sub}) THEN 1 ELSE 0 END)")
                        peak_params.extend([f"%,{p}%" for p in p_list])

                if peak_case_exprs:
                    hit_sum = " + ".join(peak_case_exprs)
                    min_hits = 2 if len(peak_case_exprs) >= 3 else 1
                    if qsearch_top:
                        cand_sql = (
                            f"SELECT id FROM {qsearch_top} "
                            f"WHERE ({hit_sum}) >= {min_hits} "
                            f"ORDER BY ({hit_sum}) DESC, id DESC LIMIT 400"
                        )
                        cand_ids = [r[0] for r in cur.execute(cand_sql, peak_params * 2).fetchall()]
                        if cand_ids:
                            marks = ",".join("?" for _ in cand_ids)
                            where_clauses.append(f"{id_col} IN ({marks})")
                            sql_params.extend(cand_ids)
                    elif bestd_col:
                        where_clauses.append(f"({hit_sum}) >= {min_hits}")
                        sql_params.extend(peak_params)

        sql = f"SELECT rowid AS _rowid_, * FROM {main_table}"
        if where_clauses:
            sql += " WHERE " + " AND ".join(where_clauses)
        scan_cap = max(limit * 6, 3000)
        sql += f" LIMIT {scan_cap}"

        rows = cur.execute(sql, sql_params).fetchall()
        if not rows:
            return [], total_count

        row_ids = [str(r[id_col] if id_col and r[id_col] is not None else r["_rowid_"]) for r in rows]

        # Batch load elements from `chemical` table if available
        chem_by_id: Dict[str, List[str]] = {}
        if chem_table and id_col and len(row_ids) <= 5000:
            chem_cols_low = {c.lower(): c for c in tables[chem_table]}
            cid_c = chem_cols_low.get("id") or chem_cols_low.get("card_id") or chem_cols_low.get("phase_id")
            cel_c = (
                chem_cols_low.get("chemical_element")
                or chem_cols_low.get("element")
                or chem_cols_low.get("el")
                or chem_cols_low.get("symbol")
            )
            cz_c = chem_cols_low.get("atomic_number") or chem_cols_low.get("z")
            if cid_c and (cel_c or cz_c):
                for chunk_start in range(0, len(row_ids), 800):
                    chunk = row_ids[chunk_start: chunk_start + 800]
                    marks = ",".join("?" for _ in chunk)
                    val_expr = cel_c if cel_c else cz_c
                    for cr in cur.execute(f"SELECT {cid_c}, {val_expr} FROM {chem_table} WHERE {cid_c} IN ({marks})", chunk):
                        k = str(cr[0])
                        raw_el = cr[1]
                        sym = Z_TO_ELEMENT.get(int(raw_el), "") if isinstance(raw_el, int) or str(raw_el).isdigit() else str(raw_el).strip()
                        if sym in VALID_ELEMENTS_SET:
                            chem_by_id.setdefault(k, [])
                            if sym not in chem_by_id[k]:
                                chem_by_id[k].append(sym)

        # Batch load subfiles from `subfiles` table if available
        sub_by_id: Dict[str, List[str]] = {}
        if sub_table and id_col and len(row_ids) <= 5000:
            sub_cols_low = {c.lower(): c for c in tables[sub_table]}
            sid_c = sub_cols_low.get("id") or sub_cols_low.get("card_id")
            ssf_c = sub_cols_low.get("subfile") or sub_cols_low.get("sub") or sub_cols_low.get("code")
            if sid_c and ssf_c:
                for chunk_start in range(0, len(row_ids), 800):
                    chunk = row_ids[chunk_start: chunk_start + 800]
                    marks = ",".join("?" for _ in chunk)
                    for sr in cur.execute(f"SELECT {sid_c}, {ssf_c} FROM {sub_table} WHERE {sid_c} IN ({marks})", chunk):
                        k = str(sr[0])
                        code = str(sr[1]).strip().upper()
                        if code:
                            sub_by_id.setdefault(k, [])
                            if code not in sub_by_id[k]:
                                sub_by_id[k].append(code)

        # Batch load child `peaks` table if peaks are stored row-wise
        child_peaks_by_id: Dict[str, List[Dict[str, Any]]] = {}
        if peaks_table and id_col and len(row_ids) <= 2500:
            pcols = {c.lower(): c for c in tables[peaks_table]}
            pid_c = pcols.get("id") or pcols.get("card_id") or pcols.get("phase_id") or pcols.get("entry_id")
            pd_c = pcols.get("d") or pcols.get("dval")
            ptt_c = pcols.get("two_theta") or pcols.get("theta2") or pcols.get("tt")
            pint_c = pcols.get("intensity") or pcols.get("intens") or pcols.get("int")
            ph_c, pk_c, pl_c = pcols.get("h"), pcols.get("k"), pcols.get("l")
            if pid_c and (pd_c or ptt_c) and pint_c:
                sel_cols = [pid_c, pd_c or "NULL", ptt_c or "NULL", pint_c, ph_c or "0", pk_c or "0", pl_c or "0"]
                for chunk_start in range(0, len(row_ids), 500):
                    chunk = row_ids[chunk_start: chunk_start + 500]
                    marks = ",".join("?" for _ in chunk)
                    q_pk = f"SELECT {', '.join(sel_cols)} FROM {peaks_table} WHERE {pid_c} IN ({marks})"
                    for pr in cur.execute(q_pk, chunk):
                        cid_str = str(pr[0])
                        d_v = float(pr[1]) if pr[1] is not None else 0.0
                        tt_v = float(pr[2]) if pr[2] is not None else 0.0
                        int_v = float(pr[3]) if pr[3] is not None else 0.0
                        if tt_v <= 0 and d_v > 0:
                            s_th = wavelength / (2.0 * d_v)
                            if 0.0 < s_th < 0.998:
                                tt_v = 2.0 * math.degrees(math.asin(s_th))
                        elif d_v <= 0 and tt_v > 0:
                            d_v = wavelength / (2.0 * math.sin(math.radians(tt_v / 2.0)))
                        if tt_v > 0:
                            child_peaks_by_id.setdefault(cid_str, []).append({
                                "two_theta": round(tt_v, 3),
                                "d": round(d_v, 4),
                                "intensity": round(int_v, 1),
                                "hkl": [int(pr[4] or 0), int(pr[5] or 0), int(pr[6] or 0)]
                            })

        sq_badge = os.path.basename(sq_path)
        dat_path = _find_companion_pdf2_dat(sq_path) if nrec_col else None
        if dat_path:
            try:
                dat_fp = open(dat_path, "rb")
            except Exception:
                dat_fp = None

        need_early_dat = bool(
            dat_fp and len(rows) <= 1500 and restraints and (
                (restraints.get("symmetry") and (restraints["symmetry"].get("systems") or restraints["symmetry"].get("space_group")))
                or (restraints.get("cell") and any(v is not None and v != "" for v in restraints["cell"].values()))
            )
        )

        phases: List[Dict[str, Any]] = []
        for r in rows:
            raw_pid = str(r[id_col] if id_col and r[id_col] is not None else r["_rowid_"]).strip()
            jcpds_val = (
                str(r[col_map["jcpds"]]).strip()
                if "jcpds" in col_map and r[col_map["jcpds"]]
                else _format_pdf2_jcpds_id(raw_pid, is_pdf_db=is_pdf_db)
            )
            card_id = jcpds_val or raw_pid

            raw_formula = str(r[formula_col] or "").strip() if formula_col else ""
            # Compact spaced QualX formulas like "Zn O" -> "ZnO", "C10 H8 !4 H2 O" -> "C10H8·4H2O"
            if raw_formula:
                formula_clean = re.sub(r"\s+", "", raw_formula).replace("!", "·")
            else:
                formula_clean = ""

            raw_name = str(r[name_col] or "").strip() if name_col else ""
            raw_min = str(r[mineral_col] or "").strip() if mineral_col else ""
            # Strip QualX Greek macros e.g. $GA -> alpha-
            raw_name = raw_name.replace("$GA-", "α-").replace("$GB-", "β-").replace("$GG-", "γ-").replace("$GD-", "δ-")
            if raw_min and raw_name and raw_min.lower() not in raw_name.lower():
                base_title = f"{raw_min} — {raw_name}"
            else:
                base_title = raw_min or raw_name or formula_clean or f"Card {card_id}"
            disp_name = f"{base_title} ({formula_clean})" if (formula_clean and formula_clean not in base_title) else base_title

            has_explicit_cell = bool(a_col and r[a_col] is not None and float(r[a_col] or 0) > 0)
            a_v = float(r[a_col]) if has_explicit_cell else 0.0
            b_v = float(r[b_col] or a_v) if (b_col and r[b_col] is not None and a_v > 0) else a_v
            c_v = float(r[c_col] or a_v) if (c_col and r[c_col] is not None and a_v > 0) else a_v
            al_v = float(r[al_col] or 90.0) if al_col and r[al_col] is not None else 90.0
            be_v = float(r[be_col] or 90.0) if be_col and r[be_col] is not None else 90.0
            ga_v = float(r[ga_col] or 90.0) if ga_col and r[ga_col] is not None else 90.0
            cell = {
                "a": round(a_v, 4) if a_v > 0 else 4.0,
                "b": round(b_v, 4) if b_v > 0 else 4.0,
                "c": round(c_v, 4) if c_v > 0 else 4.0,
                "alpha": round(al_v, 2),
                "beta": round(be_v, 2),
                "gamma": round(ga_v, 2)
            }

            sg = str(r[sg_col] or "").strip() if sg_col and r[sg_col] is not None else ""
            if sys_col and r[sys_col]:
                system = _normalize_crystal_system(r[sys_col], cell)
            elif has_explicit_cell:
                system = _normalize_crystal_system("", cell)
            else:
                system = _infer_system_from_spacegroup(sg) or "Orthorhombic"

            cod_val = str(r[col_map["cod_id"]] if "cod_id" in col_map and r[col_map["cod_id"]] else "")
            nrec_val = int(r[nrec_col]) if (nrec_col and r[nrec_col] is not None and str(r[nrec_col]).strip().isdigit()) else 0

            peaks: List[Dict[str, Any]] = []
            if peaks_json_col and r[peaks_json_col]:
                try:
                    raw_pks = json.loads(r[peaks_json_col])
                    if isinstance(raw_pks, list):
                        peaks = raw_pks
                except Exception:
                    peaks = []

            if not peaks and raw_pid in child_peaks_by_id:
                peaks = child_peaks_by_id[raw_pid]

            if not peaks and (d_col or tt_col):
                d_vals = _decode_numeric_array(r[d_col]) if d_col else []
                tt_vals = _decode_numeric_array(r[tt_col]) if tt_col else []
                i_vals = _decode_numeric_array(r[int_col]) if int_col else []
                n_lines = max(len(d_vals), len(tt_vals))
                hkls = _decode_hkl_array(r[hkl_col] if hkl_col else None, n_lines)
                max_i = max(i_vals) if i_vals and max(i_vals) > 0 else 100.0
                scale_factor = (100.0 / max_i) if max_i > 100.5 else 1.0

                for idx_l in range(n_lines):
                    d_item = d_vals[idx_l] if idx_l < len(d_vals) else 0.0
                    tt_item = tt_vals[idx_l] if idx_l < len(tt_vals) else 0.0
                    i_item = (i_vals[idx_l] * scale_factor) if idx_l < len(i_vals) else 50.0
                    if tt_item <= 0 and d_item > 0:
                        s_th = wavelength / (2.0 * d_item)
                        if 0.0 < s_th < 0.998:
                            tt_item = 2.0 * math.degrees(math.asin(s_th))
                    elif d_item <= 0 and tt_item > 0:
                        d_item = wavelength / (2.0 * math.sin(math.radians(tt_item / 2.0)))
                    if 2.0 <= tt_item <= 140.0 and i_item > 0:
                        peaks.append({
                            "two_theta": round(tt_item, 3),
                            "d": round(d_item, 4),
                            "intensity": round(i_item, 1),
                            "hkl": hkls[idx_l] if idx_l < len(hkls) else [0, 0, 0]
                        })

            if not peaks and has_explicit_cell and a_v > 0:
                calc_pks = compute_d_spacings_for_cell(system, cell, wavelength=wavelength, min_2theta=15.0, max_2theta=80.0, max_index=4)
                peaks = sorted(sorted(calc_pks, key=lambda x: x["intensity"], reverse=True)[:16], key=lambda x: x["two_theta"])

            if peaks:
                mx_p = max(pk.get("intensity", 0.0) for pk in peaks)
                if mx_p > 100.5:
                    for pk in peaks:
                        pk["intensity"] = round((pk["intensity"] / mx_p) * 100.0, 1)
                peaks.sort(key=lambda pk: pk["two_theta"])

            els = chem_by_id.get(raw_pid) or (
                [e for e in re.findall(r"[A-Z][a-z]?", str(r[el_col])) if e in VALID_ELEMENTS_SET]
                if el_col and r[el_col] else []
            ) or extract_formula_elements(raw_formula)

            sfs = sub_by_id.get(raw_pid) or (
                [s.strip().upper() for s in re.split(r"[,;\s]+", str(r[sub_col])) if s.strip()]
                if sub_col and r[sub_col] else []
            )

            vol_val = float(r[vol_col]) if vol_col and r[vol_col] else (compute_cell_volume(cell, system) if has_explicit_cell else 0.0)
            dens_val = float(r[dens_col]) if dens_col and r[dens_col] else None

            phase_dict: Dict[str, Any] = {
                "id": card_id,
                "raw_sq_id": raw_pid,
                "jcpds": jcpds_val,
                "cod_id": cod_val,
                "name": disp_name,
                "formula": formula_clean or raw_formula or disp_name,
                "system": system,
                "space_group": sg,
                "cell": cell,
                "volume": round(vol_val, 2) if vol_val else None,
                "density": round(dens_val, 3) if dens_val else None,
                "elements": els,
                "subfiles": sfs,
                "peaks": peaks,
                "source": f"Local SQ ({sq_badge})",
                "sq_file": sq_badge,
                "_nrec": nrec_val,
            }

            if need_early_dat and dat_fp and nrec_val > 0:
                dat_extra = _enrich_from_pdf2_dat(dat_fp, nrec_val, wavelength=wavelength)
                if dat_extra:
                    phase_dict.update(dat_extra)

            phases.append(enrich_phase_metadata(phase_dict))

        filtered = filter_phases_by_restraints(phases, restraints, query=query)
        result_slice = filtered[:limit]

        # Enrich final returned cards from companion PDF2.DAT (unit cell + (hkl) Miller indices) if not already enriched
        if dat_fp and not need_early_dat:
            for p_item in result_slice:
                nrec_v = p_item.get("_nrec", 0)
                if nrec_v and nrec_v > 0:
                    dat_extra = _enrich_from_pdf2_dat(dat_fp, nrec_v, wavelength=wavelength)
                    if dat_extra:
                        p_item.update(dat_extra)
                        if p_item.get("cell") and not p_item.get("volume"):
                            p_item["volume"] = compute_cell_volume(p_item["cell"], p_item.get("system", ""))
        for p_item in result_slice:
            p_item.pop("_nrec", None)

        return result_slice, total_count
    finally:
        if dat_fp:
            try:
                dat_fp.close()
            except Exception:
                pass
        conn.close()


def set_sq_database_path(raw_path: Optional[str]) -> Dict[str, Any]:
    """Validates and sets the active .sq database path(s) (file or folder), or clears when empty."""
    if not raw_path or not raw_path.strip():
        save_sq_index_config("", [])
        return get_sq_database_status()

    resolved = resolve_sq_paths(raw_path)
    if not resolved:
        raise ValueError(f"No .sq database file found at path: {raw_path}")

    total_cards = 0
    file_summaries = []
    preview_phases: List[Dict[str, Any]] = []
    for sp in resolved:
        loaded, cnt = load_phases_from_sq(sp, limit=150)
        total_cards += cnt
        file_summaries.append({"name": os.path.basename(sp), "path": sp, "cards": cnt})
        for p in loaded:
            if len(preview_phases) < 200:
                preview_phases.append(p)

    save_sq_index_config(raw_path.strip(), resolved)
    status = get_sq_database_status()
    status["preview_phases"] = preview_phases
    status["files"] = file_summaries
    status["total_sq_cards"] = total_cards
    return status


def get_sq_database_status() -> Dict[str, Any]:
    """Returns current .sq index config, total card counts, and Desktop .sq scan info."""
    cfg = load_sq_index_config()
    files = []
    total_sq_cards = 0
    for sp in cfg["sq_paths"]:
        try:
            _, cnt = load_phases_from_sq(sp, limit=1)
            files.append({"name": os.path.basename(sp), "path": sp, "cards": cnt})
            total_sq_cards += cnt
        except Exception:
            continue
    scan = scan_sq_directory()
    return {
        "raw_path": cfg["raw_path"],
        "sq_paths": [f["path"] for f in files],
        "files": files,
        "total_sq_cards": total_sq_cards,
        "desktop_dir": scan["desktop_dir"],
        "discovered_sq_files": scan["discovered_sq_files"]
    }


def filter_phases_by_restraints(
    phases: List[Dict[str, Any]],
    restraints: Optional[Dict[str, Any]] = None,
    query: str = ""
) -> List[Dict[str, Any]]:
    """Filters candidate phases using the 6 QualX-style Restraints tabs plus optional search query."""
    q_low = (query or "").strip().lower()
    out = []

    comp = (restraints or {}).get("composition") or {}
    and_els = set(comp.get("and_elements") or [])
    or_els = set(comp.get("or_elements") or [])
    not_els = set(comp.get("not_elements") or [])
    only_els = set(comp.get("only_elements") or [])
    just_els = set(comp.get("just_elements") or [])
    min_el = comp.get("min_elements")
    max_el = comp.get("max_elements")

    sub_cfg = (restraints or {}).get("subfiles") or {}
    sel_subs = {str(s).upper() for s in (sub_cfg.get("selected") or []) if s}
    sub_mode = str(sub_cfg.get("mode") or "or").lower()

    cname_cfg = (restraints or {}).get("chemical_name") or {}
    cname_q = str(cname_cfg.get("query") or "").strip().lower()
    cname_mode = str(cname_cfg.get("mode") or "contains").lower()

    ent_cfg = (restraints or {}).get("entries") or {}
    ids_text = str(ent_cfg.get("ids_text") or "").strip()
    id_tokens = [t.strip().lower() for t in re.split(r"[,;\s]+", ids_text) if t.strip()]
    ent_min = ent_cfg.get("min_num")
    ent_max = ent_cfg.get("max_num")

    sym_cfg = (restraints or {}).get("symmetry") or {}
    sym_systems = {str(s).lower() for s in (sym_cfg.get("systems") or []) if s}
    sg_query = re.sub(r"\s+", "", str(sym_cfg.get("space_group") or "")).lower()

    cell_cfg = (restraints or {}).get("cell") or {}

    def in_range(val: Optional[float], lo: Any, hi: Any) -> bool:
        if lo is not None and lo != "":
            if val is None or val < float(lo):
                return False
        if hi is not None and hi != "":
            if val is None or val > float(hi):
                return False
        return True

    q_stoich = parse_formula_stoichiometry(query) if q_low else None

    def _norm_stoich(st: Optional[Dict[str, float]]) -> Optional[Dict[str, float]]:
        if not st:
            return None
        min_v = min(st.values()) if st.values() else 1.0
        if min_v <= 0:
            return st
        return {k: round(v / min_v, 2) for k, v in st.items()}

    q_stoich_norm = _norm_stoich(q_stoich)

    for raw_p in phases:
        p = enrich_phase_metadata(raw_p)

        # Text query filter (with Hill/Z-multiplied stoichiometric equivalence for COD/CIF formulas)
        if q_low:
            hay = " ".join([
                str(p.get("name", "")),
                str(p.get("formula", "")),
                re.sub(r"\s+", "", str(p.get("formula", ""))),
                str(p.get("id", "")),
                str(p.get("raw_sq_id", "")),
                str(p.get("jcpds", "")),
                str(p.get("cod_id", ""))
            ]).lower()
            q_alt = str(_parse_jcpds_to_sq_int(q_low) or "")
            matched_text = (q_low in hay) or bool(q_alt and q_alt in hay)
            if not matched_text and q_stoich_norm:
                p_stoich_norm = _norm_stoich(parse_formula_stoichiometry(str(p.get("formula", ""))))
                if p_stoich_norm and p_stoich_norm == q_stoich_norm:
                    matched_text = True
            if not matched_text:
                continue

        # 1. Composition restraints
        p_els = set(p.get("elements") or [])
        if and_els and not and_els.issubset(p_els):
            continue
        if or_els and not (p_els & or_els):
            continue
        if not_els and (p_els & not_els):
            continue
        if only_els and (not p_els or not p_els.issubset(only_els)):
            continue
        if just_els and p_els != just_els:
            continue
        if min_el is not None and min_el != "" and len(p_els) < int(min_el):
            continue
        if max_el is not None and max_el != "" and len(p_els) > int(max_el):
            continue

        # 2. Subfiles restraints
        if sel_subs:
            p_subs = {str(s).upper() for s in (p.get("subfiles") or [])}
            if sub_mode == "and" and not sel_subs.issubset(p_subs):
                continue
            elif sub_mode == "not" and (p_subs & sel_subs):
                continue
            elif sub_mode not in ("and", "not") and not (p_subs & sel_subs):
                continue

        # 3. Chemical name restraints
        if cname_q:
            nm = str(p.get("name", "")).lower()
            fm = str(p.get("formula", "")).lower()
            if cname_mode == "exact" and cname_q not in (nm, fm):
                continue
            elif cname_mode == "starts_with" and not (nm.startswith(cname_q) or fm.startswith(cname_q)):
                continue
            elif cname_mode == "exclude" and (cname_q in nm or cname_q in fm):
                continue
            elif cname_mode == "contains" and cname_q not in nm and cname_q not in fm:
                continue

        # 4. Entries restraints
        if id_tokens:
            cand_ids = [
                str(p.get("id", "")).lower(),
                str(p.get("raw_sq_id", "")).lower(),
                str(p.get("jcpds", "")).lower(),
                str(p.get("cod_id", "")).lower()
            ]
            matched_tok = False
            for tok in id_tokens:
                if "*" in tok or "?" in tok:
                    if any(fnmatch.fnmatch(cid, tok) for cid in cand_ids if cid):
                        matched_tok = True
                        break
                elif any(tok in cid for cid in cand_ids if cid):
                    matched_tok = True
                    break
            if not matched_tok:
                continue

        if (ent_min is not None and ent_min != "") or (ent_max is not None and ent_max != ""):
            digits = re.sub(r"\D", "", str(p.get("id", "")))
            num_id = int(digits) if digits else None
            if not in_range(float(num_id) if num_id is not None else None, ent_min, ent_max):
                continue

        # 5. Symmetry restraints
        if sym_systems:
            p_sys = str(p.get("system", "")).lower()
            if p_sys not in sym_systems:
                continue
        if sg_query:
            p_sg = re.sub(r"\s+", "", str(p.get("space_group", ""))).lower()
            if sg_query not in p_sg:
                continue

        # 6. Cell and properties restraints
        cell = p.get("cell") or {}
        if not in_range(cell.get("a"), cell_cfg.get("a_min"), cell_cfg.get("a_max")):
            continue
        if not in_range(cell.get("b", cell.get("a")), cell_cfg.get("b_min"), cell_cfg.get("b_max")):
            continue
        if not in_range(cell.get("c", cell.get("a")), cell_cfg.get("c_min"), cell_cfg.get("c_max")):
            continue
        if not in_range(cell.get("alpha", 90.0), cell_cfg.get("alpha_min"), cell_cfg.get("alpha_max")):
            continue
        if not in_range(cell.get("beta", 90.0), cell_cfg.get("beta_min"), cell_cfg.get("beta_max")):
            continue
        if not in_range(cell.get("gamma", 90.0), cell_cfg.get("gamma_min"), cell_cfg.get("gamma_max")):
            continue
        if not in_range(p.get("volume"), cell_cfg.get("vol_min"), cell_cfg.get("vol_max")):
            continue
        if not in_range(p.get("density"), cell_cfg.get("density_min"), cell_cfg.get("density_max")):
            continue

        out.append(p)

    return out


def load_local_database(
    include_sq: bool = True,
    restraints: Optional[Dict[str, Any]] = None,
    query: str = "",
    exp_peaks: Optional[List[Dict[str, Any]]] = None,
    tolerance_deg: float = 0.45
) -> List[Dict[str, Any]]:
    """Loads reference phases from database/ (.json, .cif, .sq) plus any indexed local .sq databases."""
    ensure_directories_and_seed()
    phases_by_id: Dict[str, Dict[str, Any]] = {}

    # 1. Load JSON cards first
    for jpath in sorted(glob.glob(os.path.join(DATABASE_DIR, "*.json"))):
        if os.path.basename(jpath).startswith("."):
            continue
        try:
            with open(jpath, "r", encoding="utf-8") as f:
                data = json.load(f)
                pid = str(data.get("id") or os.path.splitext(os.path.basename(jpath))[0])
                data["source"] = "Local DB"
                data["file"] = os.path.basename(jpath)
                phases_by_id[pid] = enrich_phase_metadata(data)
        except Exception:
            continue

    # 2. Load any standalone .cif files in database/ that don't have a matching JSON card
    for cpath in sorted(glob.glob(os.path.join(DATABASE_DIR, "*.cif"))):
        stem = os.path.splitext(os.path.basename(cpath))[0]
        already = any(stem.endswith(pid) or pid == stem for pid in phases_by_id)
        if already:
            continue
        try:
            with open(cpath, "r", encoding="utf-8") as f:
                parsed = parse_cif_string(f.read(), source_id=stem)
                if parsed:
                    parsed["file"] = os.path.basename(cpath)
                    phases_by_id[stem] = enrich_phase_metadata(parsed)
        except Exception:
            continue

    # 3. Load any .sq files placed in database/ and any .sq files indexed via `db index`
    if include_sq:
        sq_candidates = sorted(glob.glob(os.path.join(DATABASE_DIR, "*.sq")))
        cfg = load_sq_index_config()
        for p_sq in cfg.get("sq_paths", []):
            if p_sq not in sq_candidates and os.path.isfile(p_sq):
                sq_candidates.append(p_sq)

        for sq_file in sq_candidates:
            try:
                sq_phases, _ = load_phases_from_sq(
                    sq_file,
                    restraints=restraints,
                    query=query,
                    limit=600,
                    exp_peaks=exp_peaks,
                    tolerance_deg=tolerance_deg,
                )
                for sp in sq_phases:
                    key = str(sp.get("id", ""))
                    if key and (key not in phases_by_id or sp.get("peaks")):
                        phases_by_id[key] = sp
            except Exception:
                continue

    all_phases = list(phases_by_id.values())
    if restraints or query:
        all_phases = filter_phases_by_restraints(all_phases, restraints=restraints, query=query)
    return all_phases


_COD_BASE_MIRRORS = (
    "https://www.crystallography.net/cod",
    "https://qiserver.ugr.es/cod",
    "http://www.crystallography.net/cod",
)


def _create_resilient_http_session() -> requests.Session:
    from requests.adapters import HTTPAdapter
    from urllib3.util.retry import Retry

    sess = requests.Session()
    sess.headers.update({"User-Agent": "Diffracta-XRD/1.0"})
    retry_cfg = Retry(
        total=2,
        connect=2,
        read=2,
        backoff_factor=0.25,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"],
    )
    adapter = HTTPAdapter(max_retries=retry_cfg, pool_connections=6, pool_maxsize=6)
    sess.mount("https://", adapter)
    sess.mount("http://", adapter)
    return sess


def _has_positive_remote_restraints(restraints: Optional[Dict[str, Any]]) -> bool:
    """Returns True when restraints provide enough narrowing criteria to query COD/OPTIMADE without a text query."""
    if not restraints:
        return False
    comp = restraints.get("composition") or {}
    if any(comp.get(k) for k in ("and_elements", "just_elements", "only_elements", "or_elements")):
        return True
    cname = restraints.get("chemical_name") or {}
    if str(cname.get("query") or "").strip():
        return True
    ent = restraints.get("entries") or {}
    if str(ent.get("ids_text") or "").strip():
        return True
    cell = restraints.get("cell") or {}
    if any(cell.get(k) not in (None, "") for k in ("a_min", "a_max", "b_min", "b_max", "c_min", "c_max", "vol_min", "vol_max")):
        return True
    return False


def _fetch_cod_cif_text(cid: str, session: Optional[requests.Session] = None) -> Optional[str]:
    """Downloads a COD .cif file with local disk cache and official mirror failover."""
    clean_id = re.sub(r"\D", "", str(cid))
    if not clean_id:
        return None
    cache_dir = os.path.join(DATABASE_DIR, ".cod_cache")
    cache_path = os.path.join(cache_dir, f"{clean_id}.cif")
    if os.path.isfile(cache_path) and os.path.getsize(cache_path) > 80:
        try:
            with open(cache_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        except Exception:
            pass

    sess = session or _create_resilient_http_session()
    for base_url in _COD_BASE_MIRRORS:
        try:
            resp = sess.get(f"{base_url}/{clean_id}.cif", timeout=4.5)
            if resp.status_code == 200 and "_cell_length_a" in resp.text:
                try:
                    os.makedirs(cache_dir, exist_ok=True)
                    with open(cache_path, "w", encoding="utf-8") as f:
                        f.write(resp.text)
                except Exception:
                    pass
                return resp.text
        except Exception:
            continue
    return None


def _phase_from_cod_json_record(rec: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Builds a fallback COD phase from a /cod/result JSON metadata record if .cif download fails."""
    cid = str(rec.get("file") or "").strip()
    a = _clean_cif_number(rec.get("a"), 0.0)
    if not cid or a <= 0:
        return None
    b = _clean_cif_number(rec.get("b"), a)
    c = _clean_cif_number(rec.get("c"), a)
    alpha = _clean_cif_number(rec.get("alpha"), 90.0)
    beta = _clean_cif_number(rec.get("beta"), 90.0)
    gamma = _clean_cif_number(rec.get("gamma"), 90.0)
    cell = {"a": a, "b": b, "c": c, "alpha": alpha, "beta": beta, "gamma": gamma}
    system = _normalize_crystal_system("", cell)
    raw_formula = re.sub(r"^[\-\s]+|[\-\s]+$", "", str(rec.get("formula") or cid)).strip() or cid
    mineral = str(rec.get("mineral") or rec.get("chemname") or "").strip()
    sg = str(rec.get("sg") or system).strip()
    peaks = compute_d_spacings_for_cell(system, cell, min_2theta=5.0, max_2theta=85.0, max_index=5)
    peaks = sorted(peaks, key=lambda p: p["intensity"], reverse=True)[:24]
    peaks = sorted(peaks, key=lambda p: p["two_theta"])
    return enrich_phase_metadata({
        "id": f"COD-{cid}",
        "jcpds": f"COD {cid}",
        "cod_id": cid,
        "name": f"{mineral} ({raw_formula})" if mineral and mineral != raw_formula else raw_formula,
        "formula": raw_formula,
        "system": system,
        "space_group": sg,
        "cell": cell,
        "peaks": peaks,
        "source": "COD",
    })


def _phase_from_optimade_item(
    item: Dict[str, Any],
    provider_name: str,
    fallback_formula: str = "",
    id_prefix: str = "OPT",
) -> Optional[Dict[str, Any]]:
    """Builds a phase from an OPTIMADE structure entry, computing |F_hkl|^2 peaks when site coordinates exist."""
    attrs = item.get("attributes") or {}
    vecs = attrs.get("lattice_vectors")
    if not vecs or len(vecs) != 3:
        return None
    lat_mat = np.array(vecs, dtype=float)
    v1, v2, v3 = lat_mat[0], lat_mat[1], lat_mat[2]
    a = float(np.linalg.norm(v1))
    b = float(np.linalg.norm(v2))
    c = float(np.linalg.norm(v3))
    if a <= 0 or b <= 0 or c <= 0:
        return None
    alpha = math.degrees(math.acos(np.clip(np.dot(v2, v3) / (b * c), -1.0, 1.0)))
    beta = math.degrees(math.acos(np.clip(np.dot(v1, v3) / (a * c), -1.0, 1.0)))
    gamma = math.degrees(math.acos(np.clip(np.dot(v1, v2) / (a * b), -1.0, 1.0)))

    cell = {
        "a": round(a, 4), "b": round(b, 4), "c": round(c, 4),
        "alpha": round(alpha, 2), "beta": round(beta, 2), "gamma": round(gamma, 2),
    }
    system = _normalize_crystal_system("", cell)
    formula = str(attrs.get("chemical_formula_reduced") or attrs.get("chemical_formula_descriptive") or fallback_formula or "Phase").strip()
    formula = re.sub(r"^[\-\s]+|[\-\s]+$", "", formula)
    item_id = str(item.get("id", "0"))

    # Compute exact structure-factor peaks from cartesian_site_positions when available
    peaks: List[Dict[str, Any]] = []
    cart_sites = attrs.get("cartesian_site_positions")
    species_sites = attrs.get("species_at_sites")
    if cart_sites and species_sites and len(cart_sites) == len(species_sites) and len(cart_sites) <= 400:
        try:
            inv_lat_t = np.linalg.inv(lat_mat.T)
            cart_arr = np.array(cart_sites, dtype=float)
            fract_arr = (inv_lat_t @ cart_arr.T).T % 1.0
            species_defs = {sp.get("name"): sp for sp in (attrs.get("species") or []) if isinstance(sp, dict)}
            atoms_list: List[Tuple[int, float, float, float, float]] = []
            for idx_s, sp_name in enumerate(species_sites):
                sp_info = species_defs.get(sp_name)
                fx, fy, fz = float(fract_arr[idx_s, 0]), float(fract_arr[idx_s, 1]), float(fract_arr[idx_s, 2])
                if sp_info and sp_info.get("chemical_symbols"):
                    syms = sp_info["chemical_symbols"]
                    concs = sp_info.get("concentration") or [1.0] * len(syms)
                    for sym_el, conc_val in zip(syms, concs):
                        if sym_el in ELEMENT_TO_Z and float(conc_val) > 0:
                            atoms_list.append((ELEMENT_TO_Z[sym_el], float(conc_val), fx, fy, fz))
                else:
                    m_el = re.match(r"([A-Z][a-z]?)", str(sp_name))
                    el = m_el.group(1) if m_el else "Si"
                    atoms_list.append((ELEMENT_TO_Z.get(el, 14), 1.0, fx, fy, fz))
            if atoms_list:
                peaks = _compute_structure_factor_peaks(cell, atoms_list, min_2theta=5.0, max_2theta=85.0, max_peaks=45)
        except Exception:
            peaks = []

    if not peaks:
        peaks = compute_d_spacings_for_cell(system, cell, min_2theta=5.0, max_2theta=85.0, max_index=5)
        peaks = sorted(peaks, key=lambda p: p["intensity"], reverse=True)[:24]
        peaks = sorted(peaks, key=lambda p: p["two_theta"])

    jcpds_str = f"COD {item_id}" if id_prefix == "COD" else f"{id_prefix}-{item_id}"
    return enrich_phase_metadata({
        "id": f"{id_prefix}-{item_id}",
        "jcpds": jcpds_str,
        "cod_id": item_id,
        "name": f"{formula} ({provider_name})",
        "formula": formula,
        "system": system,
        "space_group": system,
        "cell": cell,
        "peaks": peaks,
        "source": provider_name,
    })


def _build_optimade_filter(
    query: str = "",
    restraints: Optional[Dict[str, Any]] = None,
    sample_hint: str = "",
) -> str:
    """Constructs an OPTIMADE v1 filter string from query, Restraints, or sample_hint."""
    q = (query or "").strip()
    comp = (restraints or {}).get("composition") or {}
    just_els = [e for e in (comp.get("just_elements") or []) if e in VALID_ELEMENTS_SET]
    only_els = [e for e in (comp.get("only_elements") or []) if e in VALID_ELEMENTS_SET]
    and_els = [e for e in (comp.get("and_elements") or []) if e in VALID_ELEMENTS_SET]
    or_els = [e for e in (comp.get("or_elements") or []) if e in VALID_ELEMENTS_SET]
    not_els = [e for e in (comp.get("not_elements") or []) if e in VALID_ELEMENTS_SET]
    min_el = comp.get("min_elements")
    max_el = comp.get("max_elements")

    clauses: List[str] = []
    q_cod_match = re.match(r"^(?:cod[\s\-]*)?(\d{7})$", q, re.IGNORECASE)
    if q_cod_match:
        return f'id="{q_cod_match.group(1)}"'

    req_elems: List[str] = []
    exact_nelems: Optional[int] = None

    if just_els:
        req_elems = list(just_els)
        exact_nelems = len(just_els)
    elif only_els:
        req_elems = list(only_els)
        if max_el in (None, ""):
            max_el = len(only_els)
    elif and_els:
        req_elems = list(and_els)
    elif len(or_els) == 1:
        req_elems = list(or_els)

    if q:
        q_stoich = parse_formula_stoichiometry(q)
        if q_stoich:
            for el in q_stoich.keys():
                if el not in req_elems:
                    req_elems.append(el)
            if not (just_els or only_els or and_els) and min_el in (None, "") and max_el in (None, ""):
                exact_nelems = len(q_stoich)
        elif not req_elems:
            safe_q = q.replace('"', "")
            clauses.append(f'chemical_formula_descriptive CONTAINS "{safe_q}"')
    elif not req_elems and not _has_positive_remote_restraints(restraints):
        hint_formula = extract_clean_formula_hint(sample_hint)
        hint_stoich = parse_formula_stoichiometry(hint_formula) if hint_formula else None
        if hint_stoich:
            req_elems = list(hint_stoich.keys())
            exact_nelems = len(req_elems)

    if req_elems:
        has_all = ",".join(f'"{e}"' for e in req_elems[:8])
        clauses.append(f"elements HAS ALL {has_all}")
    if not_els:
        for ne in not_els[:6]:
            clauses.append(f' NOT (elements HAS "{ne}")')
    if exact_nelems is not None:
        clauses.append(f"nelements={exact_nelems}")
    else:
        if min_el not in (None, ""):
            clauses.append(f"nelements>={int(min_el)}")
        if max_el not in (None, ""):
            clauses.append(f"nelements<={int(max_el)}")

    return " AND ".join(clauses)


def query_cod_database(
    query: str = "",
    max_results: int = 10,
    restraints: Optional[Dict[str, Any]] = None,
    sample_hint: str = "",
) -> List[Dict[str, Any]]:
    """Queries the Crystallography Open Database (COD) live REST/OPTIMADE APIs with Restraints & computes |F_hkl|^2 XRD patterns."""
    results: List[Dict[str, Any]] = []
    q = (query or "").strip()
    effective_query_for_filter = q

    comp = (restraints or {}).get("composition") or {}
    just_els = [e for e in (comp.get("just_elements") or []) if e in VALID_ELEMENTS_SET]
    only_els = [e for e in (comp.get("only_elements") or []) if e in VALID_ELEMENTS_SET]
    and_els = [e for e in (comp.get("and_elements") or []) if e in VALID_ELEMENTS_SET]
    or_els = [e for e in (comp.get("or_elements") or []) if e in VALID_ELEMENTS_SET]
    not_els = [e for e in (comp.get("not_elements") or []) if e in VALID_ELEMENTS_SET]
    min_el = comp.get("min_elements")
    max_el = comp.get("max_elements")

    cname_q = str(((restraints or {}).get("chemical_name") or {}).get("query") or "").strip()
    ent_ids_raw = str(((restraints or {}).get("entries") or {}).get("ids_text") or "").strip()
    cell_cfg = (restraints or {}).get("cell") or {}

    # 1. Direct 7-digit COD IDs from query or Restraints -> Entries
    explicit_cod_ids: List[str] = []
    q_cod_match = re.match(r"^(?:cod[\s\-]*)?(\d{7})$", q, re.IGNORECASE)
    if q_cod_match:
        explicit_cod_ids.append(q_cod_match.group(1))
        effective_query_for_filter = q_cod_match.group(1)

    if ent_ids_raw:
        for tok in re.split(r"[,;\s]+", ent_ids_raw):
            m_id = re.match(r"^(?:cod[\s\-]*)?(\d{7})$", tok.strip(), re.IGNORECASE)
            if m_id and m_id.group(1) not in explicit_cod_ids:
                explicit_cod_ids.append(m_id.group(1))

    # 2. If neither query nor positive restraints are set, infer formula from sample_hint (e.g. "Cs3Bi2I9")
    inferred_hint = ""
    if not q and not explicit_cod_ids and not _has_positive_remote_restraints(restraints):
        inferred_hint = extract_clean_formula_hint(sample_hint)

    search_q = q or inferred_hint
    if not search_q and not explicit_cod_ids and not _has_positive_remote_restraints(restraints):
        return results

    session = _create_resilient_http_session()
    records_by_id: Dict[str, Dict[str, Any]] = {}
    cod_ids: List[str] = list(explicit_cod_ids)

    if not cod_ids:
        params: Dict[str, str] = {"format": "json"}
        req_elems: List[str] = []
        strict_min: Optional[int] = int(min_el) if min_el not in (None, "") else None
        strict_max: Optional[int] = int(max_el) if max_el not in (None, "") else None

        if just_els:
            req_elems = list(just_els)
            strict_min = len(just_els)
            strict_max = len(just_els)
        elif only_els:
            # When 1-3 elements are in Only, require at least one or bound max distinct elements
            if len(only_els) == 1:
                req_elems = list(only_els)
                strict_min = 1
                strict_max = 1
            else:
                strict_max = min(strict_max, len(only_els)) if strict_max is not None else len(only_els)
                if len(only_els) <= 4 and not search_q:
                    req_elems = list(only_els)
        elif and_els:
            req_elems = list(and_els)
        elif len(or_els) == 1:
            req_elems = list(or_els)

        if search_q:
            q_stoich = parse_formula_stoichiometry(search_q)
            if q_stoich:
                for el in q_stoich.keys():
                    if el not in req_elems:
                        req_elems.append(el)
                if not (just_els or only_els or and_els) and strict_min is None and strict_max is None:
                    strict_min = len(q_stoich)
                    strict_max = len(q_stoich)
            else:
                params["text"] = search_q

        if cname_q and "text" not in params:
            params["text"] = cname_q

        for idx, el in enumerate(req_elems[:8], start=1):
            params[f"el{idx}"] = el
        for idx, nel in enumerate(not_els[:8], start=1):
            params[f"nel{idx}"] = nel

        if strict_min is not None:
            params["strictmin"] = str(strict_min)
        if strict_max is not None:
            params["strictmax"] = str(strict_max)

        cell_param_map = [
            ("a_min", "amin"), ("a_max", "amax"),
            ("b_min", "bmin"), ("b_max", "bmax"),
            ("c_min", "cmin"), ("c_max", "cmax"),
            ("vol_min", "vmin"), ("vol_max", "vmax"),
        ]
        for local_key, cod_key in cell_param_map:
            val = cell_cfg.get(local_key)
            if val not in (None, ""):
                params[cod_key] = str(val)

        # Query COD REST mirrors
        for base_url in _COD_BASE_MIRRORS:
            try:
                resp = session.get(f"{base_url}/result", params=params, timeout=6.5)
                if resp.status_code == 200:
                    recs = resp.json()
                    if isinstance(recs, list):
                        for r in recs[:max_results]:
                            fid = str(r.get("file") or "").strip()
                            if fid and fid not in records_by_id:
                                records_by_id[fid] = r
                                cod_ids.append(fid)
                        break
            except Exception:
                continue

    if cod_ids:
        target_ids = cod_ids[:max_results]
        cif_texts: Dict[str, Optional[str]] = {}
        with concurrent.futures.ThreadPoolExecutor(max_workers=min(3, len(target_ids))) as pool:
            fut_map = {pool.submit(_fetch_cod_cif_text, cid, None): cid for cid in target_ids}
            for fut in concurrent.futures.as_completed(fut_map):
                cid = fut_map[fut]
                try:
                    cif_texts[cid] = fut.result()
                except Exception:
                    cif_texts[cid] = None

        for cid in target_ids:
            ctext = cif_texts.get(cid)
            parsed = parse_cif_string(ctext, source_id=f"COD-{cid}") if ctext else None
            if parsed:
                parsed["cod_id"] = cid
                parsed["jcpds"] = f"COD {cid}"
                parsed["source"] = "COD"
                results.append(enrich_phase_metadata(parsed))
            elif cid in records_by_id:
                fb = _phase_from_cod_json_record(records_by_id[cid])
                if fb:
                    results.append(fb)

    # Secondary live fallback: COD OPTIMADE endpoint if /cod/result returned nothing
    if not results:
        opt_filter = _build_optimade_filter(query=q, restraints=restraints, sample_hint=sample_hint)
        if opt_filter:
            try:
                opt_resp = session.get(
                    "https://www.crystallography.net/cod/optimade/v1/structures",
                    params={"filter": opt_filter, "page_limit": min(max_results, 8)},
                    timeout=6.5,
                )
                if opt_resp.status_code == 200:
                    for item in (opt_resp.json().get("data") or [])[:max_results]:
                        ph = _phase_from_optimade_item(item, provider_name="COD", fallback_formula=search_q, id_prefix="COD")
                        if ph:
                            results.append(ph)
            except Exception:
                pass

    # Offline / seeded fallback against curated COD cards
    if not results:
        seed_candidates = []
        for p in SEED_PHASES + EXTRA_SQ_PHASES:
            if p.get("cod_id"):
                copy_p = dict(p)
                copy_p["id"] = f"COD-{p['cod_id']}"
                copy_p["jcpds"] = f"COD {p['cod_id']}"
                copy_p["source"] = "COD"
                seed_candidates.append(enrich_phase_metadata(copy_p))
        results = filter_phases_by_restraints(
            seed_candidates,
            restraints=restraints,
            query=effective_query_for_filter or inferred_hint,
        )[:max_results]
        return results

    if restraints or effective_query_for_filter:
        filtered = filter_phases_by_restraints(results, restraints=restraints, query=effective_query_for_filter)
        if filtered or restraints:
            return filtered[:max_results]

    return results[:max_results]


def query_optimade_database(
    query: str = "",
    max_results: int = 8,
    restraints: Optional[Dict[str, Any]] = None,
    sample_hint: str = "",
) -> List[Dict[str, Any]]:
    """Queries public OPTIMADE crystallographic providers (COD OPTIMADE / Materials Cloud / RRUFF)."""
    results: List[Dict[str, Any]] = []
    q = (query or "").strip()
    inferred_hint = ""
    if not q and not _has_positive_remote_restraints(restraints):
        inferred_hint = extract_clean_formula_hint(sample_hint)

    filter_expr = _build_optimade_filter(query=q, restraints=restraints, sample_hint=sample_hint)
    if not filter_expr:
        return results

    endpoints = [
        ("COD OPTIMADE", "https://www.crystallography.net/cod/optimade/v1/structures"),
        ("Materials Cloud", "https://optimade.materialscloud.org/main/mc3d-pbe-v1/v1/structures"),
    ]

    session = _create_resilient_http_session()
    for provider_name, url in endpoints:
        try:
            resp = session.get(
                url,
                params={"filter": filter_expr, "page_limit": min(max_results, 8)},
                timeout=6.0,
            )
            if resp.status_code != 200:
                continue
            payload = resp.json()
            for item in payload.get("data") or []:
                ph = _phase_from_optimade_item(item, provider_name=provider_name, fallback_formula=q or inferred_hint, id_prefix="OPT")
                if ph:
                    results.append(ph)
            if results:
                break
        except Exception:
            continue

    # Offline fallback against built-in RRUFF/ICDD reference entries
    if not results:
        seed_cands = []
        for p in SEED_PHASES:
            cp = dict(p)
            cp["source"] = "RRUFF / ICDD"
            seed_cands.append(enrich_phase_metadata(cp))
        results = filter_phases_by_restraints(seed_cands, restraints=restraints, query=q or inferred_hint)
        return results[:max_results]

    if restraints or q:
        filtered = filter_phases_by_restraints(results, restraints=restraints, query=q)
        if filtered or restraints:
            return filtered[:max_results]

    return results[:max_results]


def _score_candidate_phases(
    candidates: List[Dict[str, Any]],
    exp_peaks: List[Dict[str, Any]],
    t_min: float,
    t_max: float,
    tolerance_deg: float,
) -> List[Dict[str, Any]]:
    total_exp_weight = sum(max(ep.get("intensity", 10.0), 5.0) for ep in exp_peaks) or 1.0
    ranked: List[Dict[str, Any]] = []

    for phase in candidates:
        ref_in_range = [p for p in phase.get("peaks", []) if t_min - 0.5 <= p["two_theta"] <= t_max + 0.5]
        if not ref_in_range:
            continue

        matched_ref_weight = 0.0
        total_ref_weight = sum(p.get("intensity", 10.0) for p in ref_in_range) or 1.0
        pos_errors = []
        matched_count = 0

        for rp in ref_in_range:
            best_ep = min(exp_peaks, key=lambda ep: abs(ep["two_theta"] - rp["two_theta"]), default=None)
            best_diff = abs(best_ep["two_theta"] - rp["two_theta"]) if best_ep else 999.0
            if best_diff <= tolerance_deg and best_ep is not None:
                matched_count += 1
                pos_errors.append(best_diff)
                prox_factor = 1.0 - 0.30 * (best_diff / tolerance_deg)
                int_sim = 1.0 - 0.15 * (abs(float(best_ep.get("intensity", 50.0)) - float(rp.get("intensity", 50.0))) / 100.0)
                matched_ref_weight += rp["intensity"] * max(0.2, prox_factor * int_sim)

        if matched_count == 0:
            continue

        matched_exp_weight = 0.0
        matched_exp_count = 0
        for ep in exp_peaks:
            best_rp_diff = min((abs(ep["two_theta"] - rp["two_theta"]) for rp in ref_in_range), default=999.0)
            if best_rp_diff <= tolerance_deg:
                matched_exp_count += 1
                prox = 1.0 - 0.25 * (best_rp_diff / tolerance_deg)
                matched_exp_weight += max(ep.get("intensity", 10.0), 5.0) * prox

        ref_score = (matched_ref_weight / total_ref_weight) * 100.0
        exp_score = (matched_exp_weight / total_exp_weight) * 100.0
        fom = 0.68 * ref_score + 0.32 * exp_score

        ranked.append({
            **phase,
            "fom": round(min(100.0, fom), 1),
            "matched_peaks": matched_count,
            "total_ref_peaks": len(ref_in_range),
            "matched_exp_peaks": matched_exp_count,
            "total_exp_peaks": len(exp_peaks),
            "mean_delta_2theta": round(float(np.mean(pos_errors)), 3)
        })

    ranked.sort(key=lambda r: r["fom"], reverse=True)
    return ranked


def search_match_phases(
    two_theta: List[float],
    intensity: List[float],
    tolerance_deg: float = 0.45,
    extra_phases: Optional[List[Dict[str, Any]]] = None,
    identified_peaks: Optional[List[Dict[str, Any]]] = None,
    restraints: Optional[Dict[str, Any]] = None,
    query: str = "",
    source: str = "all",
    sample_hint: str = "",
) -> List[Dict[str, Any]]:
    """
    Compares identified experimental XRD peaks against reference peaks in Local DB,
    indexed .sq database(s), COD, OPTIMADE, and external phases, applying optional Restraints.
    """
    if identified_peaks and len(identified_peaks) > 0:
        exp_peaks = [
            {
                "two_theta": float(pk.get("two_theta", 0.0)),
                "intensity": float(pk.get("intensity", 50.0)),
                "d": float(pk.get("d") or pk.get("d_obs") or 0.0)
            }
            for pk in identified_peaks
            if pk.get("two_theta") is not None
        ]
    else:
        exp_peaks = detect_experimental_peaks(two_theta, intensity, prominence_pct=5.0)

    if not exp_peaks:
        return []

    t_min, t_max = min(two_theta), max(two_theta)
    src_norm = (source or "all").strip().lower()
    candidates: List[Dict[str, Any]] = []
    seen_ids: set = set()

    def _add_candidates(items: List[Dict[str, Any]]) -> None:
        for item in items:
            pid = str(item.get("id", ""))
            if pid and pid not in seen_ids:
                candidates.append(enrich_phase_metadata(item))
                seen_ids.add(pid)

    if src_norm in ("local", "all", "sq"):
        _add_candidates(
            load_local_database(
                include_sq=True,
                restraints=restraints,
                query=query,
                exp_peaks=exp_peaks,
                tolerance_deg=tolerance_deg,
            )
        )

    if src_norm == "cod":
        _add_candidates(
            query_cod_database(
                query=query,
                max_results=12,
                restraints=restraints,
                sample_hint=sample_hint,
            )
        )
    elif src_norm == "optimade":
        _add_candidates(
            query_optimade_database(
                query=query,
                max_results=12,
                restraints=restraints,
                sample_hint=sample_hint,
            )
        )
    elif src_norm == "all" and (query.strip() or _has_positive_remote_restraints(restraints)):
        _add_candidates(
            query_cod_database(
                query=query,
                max_results=8,
                restraints=restraints,
                sample_hint=sample_hint,
            )
        )

    if extra_phases:
        for ep in extra_phases:
            ep_src = str(ep.get("source", "")).lower()
            if src_norm == "local" and not ("local" in ep_src or ".sq" in ep_src):
                continue
            if src_norm == "cod" and "cod" not in ep_src:
                continue
            if src_norm == "optimade" and not any(k in ep_src for k in ("optimade", "materials cloud", "rruff")):
                continue
            _add_candidates([ep])

    if restraints or query:
        candidates = filter_phases_by_restraints(candidates, restraints=restraints, query=query)

    ranked = _score_candidate_phases(candidates, exp_peaks, t_min, t_max, tolerance_deg)

    # When source="all" with no explicit query/restraints, also try COD via sample_hint if local match is weak
    if src_norm == "all" and not query.strip() and not _has_positive_remote_restraints(restraints):
        best_local_fom = ranked[0]["fom"] if ranked else 0.0
        if best_local_fom < 70.0 and extract_clean_formula_hint(sample_hint):
            cod_extra = query_cod_database(
                query="",
                max_results=8,
                restraints=restraints,
                sample_hint=sample_hint,
            )
            if cod_extra:
                _add_candidates(cod_extra)
                if restraints:
                    candidates = filter_phases_by_restraints(candidates, restraints=restraints, query=query)
                ranked = _score_candidate_phases(candidates, exp_peaks, t_min, t_max, tolerance_deg)

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
    calc_cell_peaks = None
    if any(tuple(rp.get("hkl") or (0, 0, 0)) == (0, 0, 0) for rp in ref_peaks) and used_Cell and float(used_Cell.get("a") or 0) > 0:
        try:
            calc_cell_peaks = compute_d_spacings_for_cell(
                used_System,
                used_Cell,
                min_2theta=min(two_theta),
                max_2theta=max(two_theta),
            )
        except Exception:
            calc_cell_peaks = None

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
            hkl_tuple = tuple(best.get("hkl") or (0, 0, 0))
            if hkl_tuple == (0, 0, 0) and calc_cell_peaks:
                near_cp = min(
                    calc_cell_peaks,
                    key=lambda cp: abs(cp["two_theta"] - best["two_theta"]),
                    default=None,
                )
                if near_cp and abs(near_cp["two_theta"] - best["two_theta"]) <= 0.40:
                    hkl_tuple = tuple(near_cp.get("hkl") or (0, 0, 0))
            has_valid_hkl = hkl_tuple != (0, 0, 0)
            hkl_label = f"({hkl_tuple[0]}{hkl_tuple[1]}{hkl_tuple[2]})" if has_valid_hkl else ""
            show_on_plot = has_valid_hkl and hkl_tuple not in used_hkls and best.get("intensity", 100.0) >= 15.0
            if has_valid_hkl:
                used_hkls.add(hkl_tuple)
            indexed_peaks.append({
                "two_theta": ep["two_theta"],
                "two_theta_calc": round(best["two_theta"], 3),
                "delta_2theta": round(ep["two_theta"] - best["two_theta"], 4),
                "d_obs": ep["d"],
                "d_calc": best["d"],
                "fwhm": ep.get("fwhm", 0.24),
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
                "fwhm": ep.get("fwhm", 0.24),
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


def _compute_inv_d2_array(
    h_arr: np.ndarray,
    k_arr: np.ndarray,
    l_arr: np.ndarray,
    d_fallback: np.ndarray,
    a: float,
    b: float,
    c: float,
    alpha_deg: float,
    beta_deg: float,
    gamma_deg: float,
    eps_iso: float = 0.0,
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Vectorized reciprocal metric tensor G* evaluation for all 7 crystal systems.
    Returns (inv_d2, cos_phi_001) where cos_phi_001 is the angle cosine to c* for March-Dollase texture.
    """
    alpha = math.radians(alpha_deg)
    beta = math.radians(beta_deg)
    gamma = math.radians(gamma_deg)
    ca, cb, cg = math.cos(alpha), math.cos(beta), math.cos(gamma)
    sa, sb, sg = math.sin(alpha), math.sin(beta), math.sin(gamma)

    vol_sq = max(1.0 - ca * ca - cb * cb - cg * cg + 2.0 * ca * cb * cg, 1e-8)
    vol = max(a * b * c * math.sqrt(vol_sq), 1e-6)

    a_st = (b * c * sa) / vol
    b_st = (a * c * sb) / vol
    c_st = (a * b * sg) / vol
    ca_st = (cb * cg - ca) / (sb * sg) if abs(sb * sg) > 1e-8 else 0.0
    cb_st = (ca * cg - cb) / (sa * sg) if abs(sa * sg) > 1e-8 else 0.0
    cg_st = (ca * cb - cg) / (sa * sb) if abs(sa * sb) > 1e-8 else 0.0

    has_hkl = (h_arr != 0) | (k_arr != 0) | (l_arr != 0)
    inv_d2_calc = (
        (h_arr * a_st) ** 2
        + (k_arr * b_st) ** 2
        + (l_arr * c_st) ** 2
        + 2.0 * h_arr * k_arr * a_st * b_st * cg_st
        + 2.0 * k_arr * l_arr * b_st * c_st * ca_st
        + 2.0 * h_arr * l_arr * a_st * c_st * cb_st
    )
    inv_d2_fb = 1.0 / np.maximum(d_fallback * (1.0 + eps_iso), 0.1) ** 2
    inv_d2 = np.where(has_hkl & (inv_d2_calc > 1e-8), inv_d2_calc, inv_d2_fb)

    # Projection onto c* (or [100]* for cubic) for March-Dollase preferred orientation
    inv_d = np.sqrt(np.maximum(inv_d2, 1e-8))
    proj_c = h_arr * a_st * cb_st + k_arr * b_st * ca_st + l_arr * c_st
    cos_phi = np.where(has_hkl, np.clip(np.abs(proj_c) / inv_d, 0.0, 1.0), 0.57735)
    return inv_d2, cos_phi


def _tch_pseudo_voigt_params(
    theta_rad: np.ndarray, U: float, V_p: float, W: float, X_l: float, Y_l: float
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """
    Thompson-Cox-Hastings (TCH) pseudo-Voigt FWHM & mixing parameter from
    Gaussian Caglioti (U, V, W) and Lorentzian Scherrer/strain (X, Y) components.
    """
    tan_th = np.tan(theta_rad)
    cos_th = np.maximum(np.cos(theta_rad), 0.15)

    hg_sq = np.maximum(U * (tan_th ** 2) + V_p * tan_th + W, 1e-4)
    hg = np.sqrt(hg_sq)
    hl = np.maximum(X_l / cos_th + Y_l * tan_th, 1e-4)

    h5 = (
        hg ** 5
        + 2.69269 * (hg ** 4) * hl
        + 2.42843 * (hg ** 3) * (hl ** 2)
        + 4.47163 * (hg ** 2) * (hl ** 3)
        + 0.07842 * hg * (hl ** 4)
        + hl ** 5
    )
    fwhm = np.maximum(h5 ** 0.2, 0.02)
    q = np.clip(hl / fwhm, 0.0, 1.0)
    eta = np.clip(1.36603 * q - 0.47719 * (q ** 2) + 0.11116 * (q ** 3), 0.01, 0.99)
    return fwhm, eta, hg, hl


def run_rietveld_refinement(
    two_theta: List[float],
    intensity: List[float],
    phase: Dict[str, Any],
    wavelength: float = 1.5406
) -> Dict[str, Any]:
    """
    Two-stage crystallographic full-profile Rietveld least-squares refinement:
      - Stage 1: Locks scale, 6-term Chebyshev background, goniometer zero-shift, and symmetry-adapted unit cell.
      - Stage 2: Jointly refines unit cell (all 7 crystal systems via exact G* metric tensor),
        zero-shift + Bragg-Brentano specimen displacement (-2s/R cos theta), Thompson-Cox-Hastings (TCH)
        Gaussian/Lorentzian size-strain profile (U, V, W, X, Y), Cu Ka1/Ka2 doublet splitting,
        March-Dollase preferred orientation, and overall Debye-Waller/attenuation factor.
      - Computes Rwp, Rp, Rexp, Chi2 (GOF), Rietveld Bragg R-factor (R_B), instrumental-corrected
        Scherrer crystallite size D (nm), and Stokes-Wilson microstrain (%).
    """
    x = np.asarray(two_theta, dtype=float)
    y_obs = np.asarray(intensity, dtype=float)
    valid = np.isfinite(x) & np.isfinite(y_obs)
    x = x[valid]
    y_obs = y_obs[valid]
    if len(x) > 1 and np.any(np.diff(x) < 0):
        order = np.argsort(x)
        x = x[order]
        y_obs = y_obs[order]

    n_pts = len(x)
    x_min, x_max = float(x[0]), float(x[-1])
    span_x = max(x_max - x_min, 1e-5)
    x_norm = 2.0 * (x - x_min) / span_x - 1.0

    # 6-term Chebyshev orthogonal polynomial basis T0..T5
    T = np.column_stack([
        np.ones_like(x_norm),
        x_norm,
        2.0 * x_norm**2 - 1.0,
        4.0 * x_norm**3 - 3.0 * x_norm,
        8.0 * x_norm**4 - 8.0 * x_norm**2 + 1.0,
        16.0 * x_norm**5 - 20.0 * x_norm**3 + 5.0 * x_norm,
    ])
    n_bg = T.shape[1]

    sys_display = str(phase.get("system") or "Hexagonal")
    sys_name = sys_display.strip().lower()
    cell0 = dict(phase.get("cell") or {})
    a0 = float(cell0.get("a") or 3.2498)
    b0_cell = float(cell0.get("b") or a0)
    c0 = float(cell0.get("c") or (a0 if sys_name == "cubic" else 5.2066))
    alpha0 = float(cell0.get("alpha") or 90.0)
    beta0 = float(cell0.get("beta") or 90.0)
    gamma0 = float(cell0.get("gamma") or (120.0 if sys_name in ("hexagonal", "trigonal") else 90.0))

    raw_peaks = [p for p in (phase.get("peaks") or []) if x_min - 1.2 <= float(p.get("two_theta", 0.0)) <= x_max + 1.2]
    calc_cell_refs = compute_d_spacings_for_cell(
        sys_display,
        {"a": a0, "b": b0_cell, "c": c0, "alpha": alpha0, "beta": beta0, "gamma": gamma0},
        wavelength=wavelength,
        min_2theta=max(3.0, x_min - 1.5),
        max_2theta=min(145.0, x_max + 1.5),
        max_index=6,
    )
    if not raw_peaks:
        raw_peaks = calc_cell_refs

    # Populate missing (hkl) indices on reference peaks (e.g. from minimal .sq cards) so anisotropic cell refinement works
    ref_peaks: List[Dict[str, Any]] = []
    for pk in raw_peaks:
        pk_copy = dict(pk)
        hkl_raw = pk_copy.get("hkl") or [0, 0, 0]
        h_i, k_i, l_i = (int(hkl_raw[0]), int(hkl_raw[1]), int(hkl_raw[2])) if len(hkl_raw) >= 3 else (0, 0, 0)
        if h_i == 0 and k_i == 0 and l_i == 0 and calc_cell_refs:
            best_cp = min(calc_cell_refs, key=lambda cp: abs(cp["two_theta"] - float(pk_copy["two_theta"])))
            if abs(best_cp["two_theta"] - float(pk_copy["two_theta"])) <= 0.45:
                h_i, k_i, l_i = best_cp["hkl"]
        pk_copy["hkl"] = [h_i, k_i, l_i]
        tt_val = float(pk_copy["two_theta"])
        if not pk_copy.get("d") or float(pk_copy["d"]) <= 0:
            pk_copy["d"] = wavelength / (2.0 * max(math.sin(math.radians(tt_val / 2.0)), 1e-4))
        ref_peaks.append(pk_copy)

    n_ref = len(ref_peaks)
    h_arr = np.array([p["hkl"][0] for p in ref_peaks], dtype=float)
    k_arr = np.array([p["hkl"][1] for p in ref_peaks], dtype=float)
    l_arr = np.array([p["hkl"][2] for p in ref_peaks], dtype=float)
    d0_arr = np.array([float(p["d"]) for p in ref_peaks], dtype=float)
    tt0_arr = np.array([float(p["two_theta"]) for p in ref_peaks], dtype=float)
    int_arr = np.array([max(float(p.get("intensity", 10.0)), 0.5) for p in ref_peaks], dtype=float)

    # Statistical weights: Poisson counting weights for raw counts, or empirical MAD noise weights for pre-normalized scans
    max_obs = float(np.max(y_obs)) if n_pts else 100.0
    min_obs = float(np.min(y_obs)) if n_pts else 0.0
    if max_obs >= 25.0 and min_obs >= 0.0:
        sqrt_w = 1.0 / np.sqrt(np.maximum(y_obs, 1.0))
    else:
        d2 = np.diff(y_obs, n=2) if n_pts >= 5 else np.array([1.0])
        sigma_bg = max(float(np.median(np.abs(d2))) / (math.sqrt(6.0) * 0.6745), max(abs(max_obs), 1e-3) * 0.006)
        rel_profile = np.maximum((y_obs - min_obs) / max(max_obs - min_obs, 1e-6), 0.15)
        sqrt_w = 1.0 / np.maximum(sigma_bg * np.sqrt(rel_profile / 0.15), 1e-5)

    # Estimate initial Chebyshev background on baseline points outside Bragg reflections
    bg_mask = np.ones(n_pts, dtype=bool)
    for tt_ref in tt0_arr:
        bg_mask &= np.abs(x - tt_ref) > 0.95
    if int(np.sum(bg_mask)) < 12:
        thresh = float(np.percentile(y_obs, 25))
        bg_mask = y_obs <= thresh
    if int(np.sum(bg_mask)) >= n_bg:
        Tw = T[bg_mask] * sqrt_w[bg_mask, None]
        yw = y_obs[bg_mask] * sqrt_w[bg_mask]
        b_init, _, _, _ = np.linalg.lstsq(Tw, yw, rcond=1e-4)
    else:
        b_init = np.zeros(n_bg, dtype=float)
        b_init[0] = float(np.percentile(y_obs, 12))

    y_bg_init = T @ b_init
    max_net = max(float(np.max(y_obs - y_bg_init)), max(abs(max_obs) * 0.1, 1e-3))
    max_ref_i = float(np.max(int_arr)) if n_ref else 100.0
    scale0 = max_net / max(max_ref_i, 1.0)

    # Coarse zero-shift lock in [-0.30, +0.30] deg so Stage 1 always starts in the global basin
    zero0 = 0.0
    if n_ref > 0:
        best_corr = -1e30
        y_net_clip = np.maximum(y_obs - y_bg_init, 0.0)
        for z_cand in np.linspace(-0.30, 0.30, 25):
            idx_near = np.searchsorted(x, tt0_arr + z_cand)
            idx_near = np.clip(idx_near, 0, n_pts - 1)
            score = float(np.sum(y_net_clip[idx_near] * int_arr))
            if score > best_corr:
                best_corr = score
                zero0 = float(z_cand)

    # Symmetry-constrained cell parameter mapping
    is_rhomb = sys_name == "trigonal" and abs(gamma0 - 120.0) > 1.5 and abs(alpha0 - 90.0) > 0.2
    if sys_name == "cubic":
        n_cell = 1
    elif sys_name in ("tetragonal", "hexagonal") or (sys_name == "trigonal" and not is_rhomb):
        n_cell = 2
    elif is_rhomb:
        n_cell = 2
    elif sys_name == "orthorhombic":
        n_cell = 3
    elif sys_name == "monoclinic":
        n_cell = 4
    else:  # triclinic
        n_cell = 6

    def unpack_cell(c_vec: np.ndarray) -> Tuple[float, float, float, float, float, float]:
        if sys_name == "cubic":
            a_v = a0 * (1.0 + c_vec[0])
            return a_v, a_v, a_v, 90.0, 90.0, 90.0
        if sys_name == "tetragonal":
            a_v = a0 * (1.0 + c_vec[0])
            c_v = c0 * (1.0 + c_vec[1])
            return a_v, a_v, c_v, 90.0, 90.0, 90.0
        if sys_name == "hexagonal" or (sys_name == "trigonal" and not is_rhomb):
            a_v = a0 * (1.0 + c_vec[0])
            c_v = c0 * (1.0 + c_vec[1])
            return a_v, a_v, c_v, 90.0, 90.0, 120.0
        if is_rhomb:
            a_v = a0 * (1.0 + c_vec[0])
            al_v = alpha0 + c_vec[1]
            return a_v, a_v, a_v, al_v, al_v, al_v
        if sys_name == "orthorhombic":
            return a0 * (1.0 + c_vec[0]), b0_cell * (1.0 + c_vec[1]), c0 * (1.0 + c_vec[2]), 90.0, 90.0, 90.0
        if sys_name == "monoclinic":
            return (
                a0 * (1.0 + c_vec[0]),
                b0_cell * (1.0 + c_vec[1]),
                c0 * (1.0 + c_vec[2]),
                90.0,
                beta0 + c_vec[3],
                90.0,
            )
        return (
            a0 * (1.0 + c_vec[0]),
            b0_cell * (1.0 + c_vec[1]),
            c0 * (1.0 + c_vec[2]),
            alpha0 + c_vec[3],
            beta0 + c_vec[4],
            gamma0 + c_vec[5],
        )

    cell_p0 = np.zeros(n_cell, dtype=float)
    cell_lb = np.array(
        [-0.035] * min(n_cell, 3) + ([-2.5] * max(0, n_cell - 3))
        if not is_rhomb
        else [-0.035, -2.5],
        dtype=float,
    )
    cell_ub = -cell_lb

    # Cu Ka2 / Ka1 wavelength ratio (1.544426 / 1.540598) when using Cu radiation
    is_cu_rad = 1.535 <= wavelength <= 1.546
    ka2_wl_ratio = 1.544426 / 1.540598

    # Full parameter vector layout:
    # [scale, zero, disp, U, V, W, X_l, Y_l, ka2_ratio, r_md, b_att, *cell_params, *bg_coeffs]
    # Header has 11 parameters:
    # 0: scale, 1: zero, 2: disp, 3: U, 4: V, 5: W, 6: X_l, 7: Y_l, 8: ka2_ratio, 9: r_md, 10: b_att
    bg_span = max(abs(max_obs), 50.0) * 2.5
    hdr_p0 = np.array([scale0, zero0, 0.0, 0.010, 0.001, 0.024, 0.110, 0.005, 0.0, 1.0, 0.0], dtype=float)
    hdr_lb = np.array([scale0 * 0.05, -0.45, -0.25, 0.0, -0.06, 0.0005, 0.001, 0.0, 0.0, 0.68, -1.5], dtype=float)
    hdr_ub = np.array([scale0 * 6.0, 0.45, 0.25, 0.60, 0.12, 0.350, 0.850, 0.40, 0.52 if is_cu_rad else 1e-6, 1.42, 3.5], dtype=float)

    bg_lb = np.full(n_bg, -bg_span, dtype=float)
    bg_ub = np.full(n_bg, bg_span, dtype=float)
    bg_p0 = np.clip(b_init, bg_lb * 0.8, bg_ub * 0.8)

    p0_full = np.concatenate([hdr_p0, cell_p0, bg_p0])
    lb_full = np.concatenate([hdr_lb, cell_lb, bg_lb])
    ub_full = np.concatenate([hdr_ub, cell_ub, bg_ub])

    def eval_full_profile(p: np.ndarray, return_details: bool = False):
        scale, zero, disp, U, V_p, W, X_l, Y_l, ka2_r, r_md, b_att = p[:11]
        c_vec = p[11 : 11 + n_cell]
        b_coeffs = p[11 + n_cell :]

        y_bkg = T @ b_coeffs
        if n_ref == 0:
            if return_details:
                return y_bkg.copy(), y_bkg, [], np.zeros((0, n_pts))
            return y_bkg

        a_c, b_c, c_c, al_c, be_c, ga_c = unpack_cell(c_vec)
        inv_d2, cos_phi = _compute_inv_d2_array(
            h_arr, k_arr, l_arr, d0_arr, a_c, b_c, c_c, al_c, be_c, ga_c, float(c_vec[0])
        )
        d_cur = 1.0 / np.sqrt(np.maximum(inv_d2, 1e-8))
        sin_th1 = wavelength / (2.0 * d_cur)
        valid_bragg = (sin_th1 > 0.0) & (sin_th1 < 0.996)

        bragg_deg = np.where(valid_bragg, 2.0 * np.degrees(np.arcsin(np.clip(sin_th1, 0.0, 0.996))), tt0_arr)
        th_rad = np.radians(np.maximum(bragg_deg / 2.0, 1.0))
        cos_mean = float(np.mean(np.cos(th_rad))) if len(th_rad) else 0.9
        # Orthogonalize specimen displacement (cos(theta) - <cos(theta)>) from zero_shift to prevent collinearity
        pos1 = bragg_deg + zero + disp * (np.cos(th_rad) - cos_mean)

        fwhm, eta, hg, hl = _tch_pseudo_voigt_params(th_rad, U, V_p, W, X_l, Y_l)

        # March-Dollase preferred orientation + Debye-Waller / angular attenuation
        sin2_phi = 1.0 - cos_phi ** 2
        md_base = np.maximum((r_md ** 2) * (cos_phi ** 2) + sin2_phi / max(r_md, 0.2), 0.15)
        p_md = md_base ** (-1.5)
        s_over_lam_sq = ( np.sin(th_rad) / wavelength ) ** 2
        atten = np.exp(-b_att * s_over_lam_sq)

        amps = scale * int_arr * p_md * atten
        y_peaks = np.zeros_like(x)
        comp_matrix = np.zeros((n_ref, n_pts), dtype=float) if return_details else None

        for idx_pk in range(n_ref):
            pos_k = float(pos1[idx_pk])
            w_k = float(fwhm[idx_pk])
            eta_k = float(eta[idx_pk])
            amp_k = float(amps[idx_pk])
            win = max(w_k * 9.5, 0.8)

            i0 = int(np.searchsorted(x, pos_k - win, side="left"))
            i1 = int(np.searchsorted(x, pos_k + win, side="right"))
            if i1 > i0:
                prof1 = pseudo_voigt(x[i0:i1], pos_k, amp_k, w_k, eta_k)
                y_peaks[i0:i1] += prof1
                if comp_matrix is not None:
                    comp_matrix[idx_pk, i0:i1] += prof1

            if is_cu_rad and ka2_r > 1e-4 and valid_bragg[idx_pk]:
                sin_th2 = sin_th1[idx_pk] * ka2_wl_ratio
                if sin_th2 < 0.996:
                    pos2_k = 2.0 * math.degrees(math.asin(float(sin_th2))) + zero + disp * (float(np.cos(th_rad[idx_pk])) - cos_mean)
                    j0 = int(np.searchsorted(x, pos2_k - win, side="left"))
                    j1 = int(np.searchsorted(x, pos2_k + win, side="right"))
                    if j1 > j0:
                        prof2 = pseudo_voigt(x[j0:j1], pos2_k, amp_k * ka2_r, w_k, eta_k)
                        y_peaks[j0:j1] += prof2
                        if comp_matrix is not None:
                            comp_matrix[idx_pk, j0:j1] += prof2

        if not return_details:
            return y_bkg + y_peaks

        ticks = []
        for idx_pk in range(n_ref):
            h_i, k_i, l_i = ref_peaks[idx_pk]["hkl"]
            has_hkl = not (h_i == 0 and k_i == 0 and l_i == 0)
            ticks.append({
                "two_theta": round(float(pos1[idx_pk]), 3),
                "hkl": [h_i, k_i, l_i],
                "hkl_str": f"({h_i}{k_i}{l_i})" if has_hkl else "",
                "intensity": round(float(int_arr[idx_pk]), 1),
                "fwhm": round(float(fwhm[idx_pk]), 4),
                "eta": round(float(eta[idx_pk]), 3),
                "hg": round(float(hg[idx_pk]), 4),
                "hl": round(float(hl[idx_pk]), 4),
            })
        return y_bkg + y_peaks, y_bkg, ticks, comp_matrix

    # Stage 1: Refine scale, zero-shift, unit cell, and Chebyshev background (keep profile & modifiers stabilized)
    s1_indices = [0, 1] + list(range(11, 11 + n_cell + n_bg))
    p_work = p0_full.copy()

    def res_stage1(sub_p: np.ndarray) -> np.ndarray:
        p_tmp = p_work.copy()
        p_tmp[s1_indices] = sub_p
        return (y_obs - eval_full_profile(p_tmp)) * sqrt_w

    r1 = least_squares(
        res_stage1,
        p_work[s1_indices],
        bounds=(lb_full[s1_indices], ub_full[s1_indices]),
        x_scale="jac",
        max_nfev=80,
        ftol=1e-4,
        xtol=1e-4,
    )
    p_work[s1_indices] = r1.x

    # Stage 2: Joint refinement of all crystallographic, profile, doublet, displacement, and texture parameters
    # Scale physical priors by sqrt(n_pts / 400) so correlated displacement/texture stay well-posed on narrow 2theta windows
    reg_scale = math.sqrt(max(n_pts, 100) / 400.0)

    def res_stage2(p: np.ndarray) -> np.ndarray:
        w_res = (y_obs - eval_full_profile(p)) * sqrt_w
        reg = reg_scale * np.array([
            p[1] / 0.12,              # goniometer zero-shift prior
            p[2] / 0.04,              # orthogonalized specimen displacement prior
            (p[9] - 1.0) / 0.18,      # March-Dollase r=1 random-powder prior
            p[10] / 1.2,              # overall attenuation B=0 prior
        ], dtype=float)
        return np.concatenate([w_res, reg])

    res = least_squares(
        res_stage2,
        p_work,
        bounds=(lb_full, ub_full),
        x_scale="jac",
        max_nfev=160,
        ftol=1e-5,
        xtol=1e-5,
    )
    p_opt = res.x
    y_calc, y_bkg, bragg_ticks, comp_matrix = eval_full_profile(p_opt, return_details=True)
    y_diff = y_obs - y_calc

    # Crystallographic agreement indices: Rp, Rwp, Rexp, Chi2, and Rietveld Bragg R_B
    denom_rp = float(np.sum(np.abs(y_obs))) or 1.0
    rp = (float(np.sum(np.abs(y_diff))) / denom_rp) * 100.0

    w = sqrt_w ** 2
    num_rwp = float(np.sum(w * (y_diff ** 2)))
    den_rwp = float(np.sum(w * (y_obs ** 2))) or 1.0
    rwp = math.sqrt(num_rwp / den_rwp) * 100.0

    n_params = len(p_opt)
    rexp = math.sqrt(max(n_pts - n_params, 1) / den_rwp) * 100.0
    chi2 = (rwp / max(rexp, 1e-4)) ** 2

    # Rietveld Bragg R-factor (R_B): partition net observed counts across overlapping reflections
    y_peaks_tot = np.maximum(y_calc - y_bkg, 0.0)
    y_obs_net = np.maximum(y_obs - y_bkg, 0.0)
    if comp_matrix is not None and comp_matrix.shape[0] > 0 and float(np.sum(y_peaks_tot)) > 0:
        safe_tot = np.where(y_peaks_tot > 1e-6, y_peaks_tot, 1.0)
        frac_k = np.where(y_peaks_tot > 1e-6, comp_matrix / safe_tot[None, :], 0.0)
        i_k_calc = np.sum(comp_matrix, axis=1)
        i_k_obs = np.sum(frac_k * y_obs_net[None, :], axis=1)
        r_bragg = (float(np.sum(np.abs(i_k_obs - i_k_calc))) / max(float(np.sum(i_k_obs)), 1e-6)) * 100.0
    else:
        r_bragg = rp

    a_ref, b_ref, c_ref, alpha_ref, beta_ref, gamma_ref = unpack_cell(p_opt[11 : 11 + n_cell])
    refined_cell_dict = {
        "a": a_ref,
        "b": b_ref,
        "c": c_ref,
        "alpha": alpha_ref,
        "beta": beta_ref,
        "gamma": gamma_ref,
    }
    vol = compute_cell_volume(refined_cell_dict, sys_display)

    # Instrumental-corrected coherent crystallite size D (nm) & Stokes-Wilson microstrain (%)
    # Standard Bragg-Brentano instrumental resolution H_inst ~ 0.065 deg
    h_inst_deg = 0.065
    if bragg_ticks:
        d_estimates = []
        eta_vals = []
        for tk in bragg_ticks:
            th_r = math.radians(max(tk["two_theta"] / 2.0, 2.0))
            h_tot = float(tk["fwhm"])
            eta_vals.append(float(tk["eta"]))
            # Subtract instrumental broadening in quadrature for Gaussian + linear for Lorentzian (Voigt approx)
            beta_sample_deg = math.sqrt(max(h_tot ** 2 - h_inst_deg ** 2, 0.0004))
            d_k = (0.89 * (wavelength / 10.0)) / (math.radians(beta_sample_deg) * max(math.cos(th_r), 0.2))
            d_estimates.append(d_k)
        crystallite_nm = float(np.median(d_estimates))
        mean_eta = float(np.mean(eta_vals))
    else:
        mean_fwhm_deg = math.sqrt(max(float(p_opt[5]), 0.004))
        crystallite_nm = float((0.89 * (wavelength / 10.0)) / (math.radians(mean_fwhm_deg) * math.cos(math.radians(18.0))))
        mean_eta = 0.55

    crystallite_nm = float(np.clip(crystallite_nm, 1.5, 500.0))

    # Microstrain (%) combining Gaussian Caglioti U (instrument-corrected) and Lorentzian strain Y_l
    u_inst = 0.0015
    u_sample = max(float(p_opt[3]) - u_inst, 0.0)
    y_strain = max(float(p_opt[7]), 0.0)
    fwhm_strain_deg = math.sqrt(u_sample) + 0.5 * y_strain
    microstrain_pct = float((math.radians(max(fwhm_strain_deg, 0.005)) / 4.0) * 100.0)

    # Degree of crystallinity (%) via Hermans-Weidinger / Ruland separation:
    # Subtract flat air-scatter/electronic baseline offset y_flat = percentile(y_bkg, 5) so constant detector
    # dark counts are not misclassified as an amorphous halo, while genuine broad amorphous humps reduce X_c.
    cryst_area = float(np.sum(np.maximum(y_calc - y_bkg, 0.0)))
    y_flat = float(np.percentile(y_bkg, 5))
    amorph_halo_area = float(np.sum(np.maximum(y_bkg - y_flat, 0.0)))
    crystallinity_pct = float(
        np.clip((cryst_area / max(cryst_area + amorph_halo_area, 1e-6)) * 100.0, 15.0, 99.8)
    )

    return {
        "phase_name": phase.get("name", "Refined Phase"),
        "phase_id": phase.get("jcpds", phase.get("id", "")),
        "system": sys_display,
        "space_group": phase.get("space_group", ""),
        "two_theta": x.tolist(),
        "y_obs": np.round(y_obs, 4 if max_obs < 25.0 else 2).tolist(),
        "y_calc": np.round(y_calc, 4 if max_obs < 25.0 else 2).tolist(),
        "y_bkg": np.round(y_bkg, 4 if max_obs < 25.0 else 2).tolist(),
        "y_diff": np.round(y_diff, 4 if max_obs < 25.0 else 2).tolist(),
        "bragg_ticks": bragg_ticks,
        "metrics": {
            "rwp": round(float(rwp), 2),
            "rp": round(float(rp), 2),
            "rexp": round(float(rexp), 2),
            "chi2": round(float(chi2), 2),
            "r_bragg": round(float(r_bragg), 2),
            "a": round(float(a_ref), 4),
            "b": round(float(b_ref), 4),
            "c": round(float(c_ref), 4),
            "alpha": round(float(alpha_ref), 3),
            "beta": round(float(beta_ref), 3),
            "gamma": round(float(gamma_ref), 3),
            "volume": round(float(vol), 2),
            "zero_shift": round(float(p_opt[1]), 4),
            "displacement": round(float(p_opt[2]), 4),
            "eta": round(float(mean_eta), 3),
            "U": round(float(p_opt[3]), 4),
            "V": round(float(p_opt[4]), 4),
            "W": round(float(p_opt[5]), 4),
            "ka2_ratio": round(float(p_opt[8]), 3),
            "march_dollase": round(float(p_opt[9]), 3),
            "crystallite_nm": round(float(crystallite_nm), 1),
            "microstrain_pct": round(float(microstrain_pct), 4),
            "crystallinity_pct": round(float(crystallinity_pct), 1)
        }
    }


def generate_full_report(
    two_theta: List[float],
    intensity: List[float],
    sample_name: str = "Sample",
    wavelength: float = 1.5406,
    phase: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Runs automated phase resolution (if needed), Miller indexing, and Rietveld refinement for a full report."""
    matches = search_match_phases(two_theta, intensity, tolerance_deg=0.45) if phase is None else []
    best_phase = phase or (matches[0] if matches else load_local_database()[0])

    indexed = assign_miller_indices(
        two_theta,
        intensity,
        reference_phase=best_phase,
        tolerance_deg=0.55,
        prominence_pct=5.0
    )
    rietveld = run_rietveld_refinement(
        two_theta,
        intensity,
        best_phase,
        wavelength=wavelength
    )
    return {
        "sample_name": sample_name,
        "wavelength": wavelength,
        "matched_phase": best_phase,
        "candidate_matches": matches[:5],
        "indexed": indexed,
        "rietveld": rietveld
    }
