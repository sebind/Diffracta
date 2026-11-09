/* ============================================================================
   DIFFRACTA — Client-Side & Hybrid XRD Engine (100% GitHub Pages Compatible)
   ============================================================================ */

const SEED_PHASES = [
  {
    id: '036-1451', jcpds: '036-1451', cod_id: '2300450',
    name: 'Zincite (ZnO)', formula: 'ZnO', system: 'Hexagonal', space_group: 'P63mc', source: 'Local DB',
    cell: { a: 3.2498, b: 3.2498, c: 5.2066, alpha: 90.0, beta: 90.0, gamma: 120.0 },
    peaks: [
      { two_theta: 31.77, intensity: 57.0, hkl: [1, 0, 0], d: 2.8143 },
      { two_theta: 34.42, intensity: 44.0, hkl: [0, 0, 2], d: 2.6033 },
      { two_theta: 36.25, intensity: 100.0, hkl: [1, 0, 1], d: 2.4759 },
      { two_theta: 47.54, intensity: 23.0, hkl: [1, 0, 2], d: 1.9111 },
      { two_theta: 56.60, intensity: 32.0, hkl: [1, 1, 0], d: 1.6249 },
      { two_theta: 62.86, intensity: 29.0, hkl: [1, 0, 3], d: 1.4772 },
      { two_theta: 66.38, intensity: 4.0, hkl: [2, 0, 0], d: 1.4072 },
      { two_theta: 67.96, intensity: 23.0, hkl: [1, 1, 2], d: 1.3782 },
      { two_theta: 69.10, intensity: 11.0, hkl: [2, 0, 1], d: 1.3583 },
      { two_theta: 72.56, intensity: 2.0, hkl: [0, 0, 4], d: 1.3017 },
      { two_theta: 76.96, intensity: 4.0, hkl: [2, 0, 2], d: 1.2380 }
    ]
  },
  {
    id: '021-1272', jcpds: '021-1272', cod_id: '9009086',
    name: 'Anatase (TiO2)', formula: 'TiO2', system: 'Tetragonal', space_group: 'I41/amd', source: 'Local DB',
    cell: { a: 3.7852, b: 3.7852, c: 9.5139, alpha: 90.0, beta: 90.0, gamma: 90.0 },
    peaks: [
      { two_theta: 25.28, intensity: 100.0, hkl: [1, 0, 1], d: 3.5200 },
      { two_theta: 36.95, intensity: 10.0, hkl: [1, 0, 3], d: 2.4310 },
      { two_theta: 37.80, intensity: 20.0, hkl: [0, 0, 4], d: 2.3780 },
      { two_theta: 38.58, intensity: 8.0, hkl: [1, 1, 2], d: 2.3320 },
      { two_theta: 48.05, intensity: 35.0, hkl: [2, 0, 0], d: 1.8920 },
      { two_theta: 53.89, intensity: 20.0, hkl: [1, 0, 5], d: 1.6999 },
      { two_theta: 55.06, intensity: 20.0, hkl: [2, 1, 1], d: 1.6665 },
      { two_theta: 62.69, intensity: 14.0, hkl: [2, 0, 4], d: 1.4808 },
      { two_theta: 68.76, intensity: 6.0, hkl: [1, 1, 6], d: 1.3641 },
      { two_theta: 70.31, intensity: 6.0, hkl: [2, 2, 0], d: 1.3378 }
    ]
  },
  {
    id: '021-1276', jcpds: '021-1276', cod_id: '9004141',
    name: 'Rutile (TiO2)', formula: 'TiO2', system: 'Tetragonal', space_group: 'P42/mnm', source: 'Local DB',
    cell: { a: 4.5933, b: 4.5933, c: 2.9592, alpha: 90.0, beta: 90.0, gamma: 90.0 },
    peaks: [
      { two_theta: 27.45, intensity: 100.0, hkl: [1, 1, 0], d: 3.2470 },
      { two_theta: 36.09, intensity: 50.0, hkl: [1, 0, 1], d: 2.4870 },
      { two_theta: 39.19, intensity: 8.0, hkl: [2, 0, 0], d: 2.2970 },
      { two_theta: 41.23, intensity: 25.0, hkl: [1, 1, 1], d: 2.1880 },
      { two_theta: 44.05, intensity: 10.0, hkl: [2, 1, 0], d: 2.0540 },
      { two_theta: 54.32, intensity: 60.0, hkl: [2, 1, 1], d: 1.6874 },
      { two_theta: 56.64, intensity: 20.0, hkl: [2, 2, 0], d: 1.6237 },
      { two_theta: 62.74, intensity: 10.0, hkl: [0, 0, 2], d: 1.4797 },
      { two_theta: 64.04, intensity: 10.0, hkl: [3, 1, 0], d: 1.4528 },
      { two_theta: 69.01, intensity: 20.0, hkl: [3, 0, 1], d: 1.3598 }
    ]
  },
  {
    id: '027-1402', jcpds: '027-1402', cod_id: '9011998',
    name: 'Silicon (Si)', formula: 'Si', system: 'Cubic', space_group: 'Fd-3m', source: 'Local DB',
    cell: { a: 5.4309, b: 5.4309, c: 5.4309, alpha: 90.0, beta: 90.0, gamma: 90.0 },
    peaks: [
      { two_theta: 28.44, intensity: 100.0, hkl: [1, 1, 1], d: 3.1355 },
      { two_theta: 47.30, intensity: 55.0, hkl: [2, 2, 0], d: 1.9201 },
      { two_theta: 56.12, intensity: 30.0, hkl: [3, 1, 1], d: 1.6375 },
      { two_theta: 69.13, intensity: 6.0, hkl: [4, 0, 0], d: 1.3577 },
      { two_theta: 76.38, intensity: 11.0, hkl: [3, 3, 1], d: 1.2459 }
    ]
  },
  {
    id: '046-1212', jcpds: '046-1212', cod_id: '1000032',
    name: 'Corundum (alpha-Al2O3)', formula: 'Al2O3', system: 'Hexagonal', space_group: 'R-3c', source: 'Local DB',
    cell: { a: 4.7587, b: 4.7587, c: 12.9929, alpha: 90.0, beta: 90.0, gamma: 120.0 },
    peaks: [
      { two_theta: 25.58, intensity: 68.0, hkl: [0, 1, 2], d: 3.4799 },
      { two_theta: 35.15, intensity: 100.0, hkl: [1, 0, 4], d: 2.5509 },
      { two_theta: 37.78, intensity: 46.0, hkl: [1, 1, 0], d: 2.3794 },
      { two_theta: 43.35, intensity: 96.0, hkl: [1, 1, 3], d: 2.0854 },
      { two_theta: 52.55, intensity: 47.0, hkl: [0, 2, 4], d: 1.7400 },
      { two_theta: 57.50, intensity: 92.0, hkl: [1, 1, 6], d: 1.6015 },
      { two_theta: 66.52, intensity: 35.0, hkl: [2, 1, 4], d: 1.4045 },
      { two_theta: 68.21, intensity: 52.0, hkl: [3, 0, 0], d: 1.3738 }
    ]
  },
  {
    id: '046-1045', jcpds: '046-1045', cod_id: '9012600',
    name: 'Quartz (alpha-SiO2)', formula: 'SiO2', system: 'Hexagonal', space_group: 'P3221', source: 'Local DB',
    cell: { a: 4.9134, b: 4.9134, c: 5.4052, alpha: 90.0, beta: 90.0, gamma: 120.0 },
    peaks: [
      { two_theta: 20.86, intensity: 22.0, hkl: [1, 0, 0], d: 4.2550 },
      { two_theta: 26.64, intensity: 100.0, hkl: [1, 0, 1], d: 3.3435 },
      { two_theta: 36.54, intensity: 8.0, hkl: [1, 1, 0], d: 2.4567 },
      { two_theta: 39.47, intensity: 7.0, hkl: [1, 0, 2], d: 2.2814 },
      { two_theta: 42.45, intensity: 6.0, hkl: [2, 0, 0], d: 2.1277 },
      { two_theta: 50.14, intensity: 14.0, hkl: [1, 1, 2], d: 1.8179 },
      { two_theta: 59.96, intensity: 9.0, hkl: [2, 1, 1], d: 1.5415 },
      { two_theta: 68.14, intensity: 7.0, hkl: [2, 0, 3], d: 1.3750 }
    ]
  },
  {
    id: '019-0629', jcpds: '019-0629', cod_id: '9005812',
    name: 'Magnetite (Fe3O4)', formula: 'Fe3O4', system: 'Cubic', space_group: 'Fd-3m', source: 'Local DB',
    cell: { a: 8.3960, b: 8.3960, c: 8.3960, alpha: 90.0, beta: 90.0, gamma: 90.0 },
    peaks: [
      { two_theta: 30.10, intensity: 30.0, hkl: [2, 2, 0], d: 2.9684 },
      { two_theta: 35.45, intensity: 100.0, hkl: [3, 1, 1], d: 2.5315 },
      { two_theta: 37.09, intensity: 8.0, hkl: [2, 2, 2], d: 2.4237 },
      { two_theta: 43.09, intensity: 20.0, hkl: [4, 0, 0], d: 2.0990 },
      { two_theta: 53.45, intensity: 10.0, hkl: [4, 2, 2], d: 1.7140 },
      { two_theta: 56.98, intensity: 30.0, hkl: [5, 1, 1], d: 1.6155 },
      { two_theta: 62.57, intensity: 40.0, hkl: [4, 4, 0], d: 1.4842 }
    ]
  },
  {
    id: '033-0664', jcpds: '033-0664', cod_id: '9000139',
    name: 'Hematite (alpha-Fe2O3)', formula: 'Fe2O3', system: 'Hexagonal', space_group: 'R-3c', source: 'Local DB',
    cell: { a: 5.0356, b: 5.0356, c: 13.7489, alpha: 90.0, beta: 90.0, gamma: 120.0 },
    peaks: [
      { two_theta: 24.14, intensity: 30.0, hkl: [0, 1, 2], d: 3.6840 },
      { two_theta: 33.15, intensity: 100.0, hkl: [1, 0, 4], d: 2.7000 },
      { two_theta: 35.61, intensity: 70.0, hkl: [1, 1, 0], d: 2.5190 },
      { two_theta: 40.85, intensity: 20.0, hkl: [1, 1, 3], d: 2.2070 },
      { two_theta: 49.48, intensity: 40.0, hkl: [0, 2, 4], d: 1.8406 },
      { two_theta: 54.09, intensity: 45.0, hkl: [1, 1, 6], d: 1.6941 },
      { two_theta: 62.45, intensity: 30.0, hkl: [2, 1, 4], d: 1.4859 },
      { two_theta: 63.99, intensity: 30.0, hkl: [3, 0, 0], d: 1.4538 }
    ]
  },
  {
    id: '005-0626', jcpds: '005-0626', cod_id: '1507756',
    name: 'Barium Titanate (BaTiO3)', formula: 'BaTiO3', system: 'Tetragonal', space_group: 'P4mm', source: 'Local DB',
    cell: { a: 3.9940, b: 3.9940, c: 4.0380, alpha: 90.0, beta: 90.0, gamma: 90.0 },
    peaks: [
      { two_theta: 22.24, intensity: 25.0, hkl: [1, 0, 0], d: 3.9940 },
      { two_theta: 31.50, intensity: 100.0, hkl: [1, 0, 1], d: 2.8380 },
      { two_theta: 38.89, intensity: 25.0, hkl: [1, 1, 1], d: 2.3140 },
      { two_theta: 45.24, intensity: 35.0, hkl: [2, 0, 0], d: 1.9970 },
      { two_theta: 50.92, intensity: 12.0, hkl: [2, 0, 1], d: 1.7920 },
      { two_theta: 56.18, intensity: 35.0, hkl: [2, 1, 1], d: 1.6360 },
      { two_theta: 65.85, intensity: 20.0, hkl: [2, 2, 0], d: 1.4170 }
    ]
  },
  {
    id: '034-0394', jcpds: '034-0394', cod_id: '9009008',
    name: 'Cerianite (CeO2)', formula: 'CeO2', system: 'Cubic', space_group: 'Fm-3m', source: 'Local DB',
    cell: { a: 5.4113, b: 5.4113, c: 5.4113, alpha: 90.0, beta: 90.0, gamma: 90.0 },
    peaks: [
      { two_theta: 28.55, intensity: 100.0, hkl: [1, 1, 1], d: 3.1242 },
      { two_theta: 33.08, intensity: 30.0, hkl: [2, 0, 0], d: 2.7057 },
      { two_theta: 47.48, intensity: 51.0, hkl: [2, 2, 0], d: 1.9132 },
      { two_theta: 56.34, intensity: 42.0, hkl: [3, 1, 1], d: 1.6316 },
      { two_theta: 59.09, intensity: 8.0, hkl: [2, 2, 2], d: 1.5621 },
      { two_theta: 69.41, intensity: 8.0, hkl: [4, 0, 0], d: 1.3528 }
    ]
  },
  {
    id: '005-0586', jcpds: '005-0586', cod_id: '9009668',
    name: 'Calcite (CaCO3)', formula: 'CaCO3', system: 'Hexagonal', space_group: 'R-3c', source: 'Local DB',
    cell: { a: 4.9896, b: 4.9896, c: 17.0610, alpha: 90.0, beta: 90.0, gamma: 120.0 },
    peaks: [
      { two_theta: 23.05, intensity: 12.0, hkl: [0, 1, 2], d: 3.8550 },
      { two_theta: 29.40, intensity: 100.0, hkl: [1, 0, 4], d: 3.0355 },
      { two_theta: 35.97, intensity: 14.0, hkl: [1, 1, 0], d: 2.4950 },
      { two_theta: 39.41, intensity: 18.0, hkl: [1, 1, 3], d: 2.2845 },
      { two_theta: 43.16, intensity: 18.0, hkl: [2, 0, 2], d: 2.0945 },
      { two_theta: 47.50, intensity: 17.0, hkl: [0, 1, 8], d: 1.9125 },
      { two_theta: 48.51, intensity: 17.0, hkl: [1, 1, 6], d: 1.8750 }
    ]
  },
  {
    id: '004-0836', jcpds: '004-0836', cod_id: '9013014',
    name: 'Copper (Cu)', formula: 'Cu', system: 'Cubic', space_group: 'Fm-3m', source: 'Local DB',
    cell: { a: 3.6150, b: 3.6150, c: 3.6150, alpha: 90.0, beta: 90.0, gamma: 90.0 },
    peaks: [
      { two_theta: 43.30, intensity: 100.0, hkl: [1, 1, 1], d: 2.0871 },
      { two_theta: 50.43, intensity: 46.0, hkl: [2, 0, 0], d: 1.8075 },
      { two_theta: 74.13, intensity: 20.0, hkl: [2, 2, 0], d: 1.2781 }
    ]
  },
  {
    id: '004-0783', jcpds: '004-0783', cod_id: '9008459',
    name: 'Silver (Ag)', formula: 'Ag', system: 'Cubic', space_group: 'Fm-3m', source: 'Local DB',
    cell: { a: 4.0862, b: 4.0862, c: 4.0862, alpha: 90.0, beta: 90.0, gamma: 90.0 },
    peaks: [
      { two_theta: 38.12, intensity: 100.0, hkl: [1, 1, 1], d: 2.3592 },
      { two_theta: 44.28, intensity: 40.0, hkl: [2, 0, 0], d: 2.0431 },
      { two_theta: 64.43, intensity: 25.0, hkl: [2, 2, 0], d: 1.4447 },
      { two_theta: 77.47, intensity: 26.0, hkl: [3, 1, 1], d: 1.2320 }
    ]
  },
  {
    id: '004-0784', jcpds: '004-0784', cod_id: '9008463',
    name: 'Gold (Au)', formula: 'Au', system: 'Cubic', space_group: 'Fm-3m', source: 'Local DB',
    cell: { a: 4.0786, b: 4.0786, c: 4.0786, alpha: 90.0, beta: 90.0, gamma: 90.0 },
    peaks: [
      { two_theta: 38.18, intensity: 100.0, hkl: [1, 1, 1], d: 2.3548 },
      { two_theta: 44.39, intensity: 52.0, hkl: [2, 0, 0], d: 2.0393 },
      { two_theta: 64.58, intensity: 32.0, hkl: [2, 2, 0], d: 1.4420 },
      { two_theta: 77.55, intensity: 36.0, hkl: [3, 1, 1], d: 1.2297 }
    ]
  },
  {
    id: '045-0946', jcpds: '045-0946', cod_id: '9006789',
    name: 'Periclase (MgO)', formula: 'MgO', system: 'Cubic', space_group: 'Fm-3m', source: 'Local DB',
    cell: { a: 4.2112, b: 4.2112, c: 4.2112, alpha: 90.0, beta: 90.0, gamma: 90.0 },
    peaks: [
      { two_theta: 36.94, intensity: 10.0, hkl: [1, 1, 1], d: 2.4313 },
      { two_theta: 42.92, intensity: 100.0, hkl: [2, 0, 0], d: 2.1056 },
      { two_theta: 62.30, intensity: 52.0, hkl: [2, 2, 0], d: 1.4889 },
      { two_theta: 74.69, intensity: 6.0, hkl: [3, 1, 1], d: 1.2697 }
    ]
  },
  {
    id: '034-0427', jcpds: '034-0427', cod_id: '1000057',
    name: 'Lanthanum Hexaboride (LaB6 NIST 660c)', formula: 'LaB6', system: 'Cubic', space_group: 'Pm-3m', source: 'Local DB',
    cell: { a: 4.1569, b: 4.1569, c: 4.1569, alpha: 90.0, beta: 90.0, gamma: 90.0 },
    peaks: [
      { two_theta: 21.36, intensity: 58.0, hkl: [1, 0, 0], d: 4.1569 },
      { two_theta: 30.38, intensity: 100.0, hkl: [1, 1, 0], d: 2.9394 },
      { two_theta: 37.44, intensity: 46.0, hkl: [1, 1, 1], d: 2.4000 },
      { two_theta: 43.51, intensity: 28.0, hkl: [2, 0, 0], d: 2.0785 },
      { two_theta: 48.96, intensity: 48.0, hkl: [2, 1, 0], d: 1.8590 },
      { two_theta: 53.99, intensity: 29.0, hkl: [2, 1, 1], d: 1.6970 },
      { two_theta: 63.22, intensity: 14.0, hkl: [2, 2, 0], d: 1.4697 },
      { two_theta: 67.55, intensity: 23.0, hkl: [3, 0, 0], d: 1.3856 }
    ]
  }
];

const CLASSIC_COLORS = ['#e60000', '#0018c4', '#006b1b', '#8B008B', '#D2691E'];
const THEME_COLORS = ['#C21E56', '#7D6B91', '#18241E', '#A63A69', '#4A6B5B'];

const state = {
  series: [],
  localDb: [],
  dbResults: [],
  activeReference: null,
  indexed: { system: 'Hexagonal', cell: { a: 3.2498, b: 3.2498, c: 5.2066 }, peaks: [] },
  rietveld: null,
  viewMode: 'stacked',
  showHkl: true,
  dbSource: 'all',
  min2Theta: 20,
  max2Theta: 70,
  stackOffset: 1.0,
  useThemeTraceColors: false
};

/* ============================================================================
   CLIENT-SIDE CRYSTALLOGRAPHY & NUMERICAL ENGINE
   ============================================================================ */

function pseudoVoigtScalar(x, x0, amp, fwhm, eta = 0.55) {
  const w = Math.max(fwhm, 0.02);
  const sigma = w / (2.0 * Math.sqrt(2.0 * Math.log(2.0)));
  const gamma = w / 2.0;
  const dx = x - x0;
  const gauss = Math.exp(-0.5 * (dx / sigma) * (dx / sigma));
  const lorentz = 1.0 / (1.0 + (dx / gamma) * (dx / gamma));
  return amp * (eta * lorentz + (1.0 - eta) * gauss);
}

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function synthesizePresetSeries(presetName) {
  const localDb = loadLocalDatabaseClient();
  const presetMap = {
    zno: {
      pid: '036-1451', minX: 20, maxX: 70,
      traces: [
        ['x = 0', 0.00, 0.23, 1.00, '#e60000', 42],
        ['x = 0.1', -0.05, 0.24, 0.96, '#0018c4', 107],
        ['x = 0.2', -0.10, 0.26, 0.90, '#006b1b', 219]
      ]
    },
    tio2: {
      pid: '021-1272', minX: 20, maxX: 75,
      traces: [
        ['x = 0', 0.00, 0.24, 1.00, '#e60000', 55],
        ['x = 0.05', -0.06, 0.25, 0.95, '#0018c4', 89]
      ]
    },
    silicon: {
      pid: '027-1402', minX: 20, maxX: 80,
      traces: [['Si NIST', 0.00, 0.22, 1.00, '#e60000', 77]]
    },
    batio3: {
      pid: '005-0626', minX: 20, maxX: 70,
      traces: [
        ['BaTiO3 300K', 0.00, 0.24, 1.00, '#e60000', 31],
        ['BaTiO3 400K', -0.07, 0.24, 0.94, '#0018c4', 63]
      ]
    },
    al2o3: {
      pid: '046-1212', minX: 20, maxX: 75,
      traces: [['α-Al2O3', 0.00, 0.23, 1.00, '#e60000', 91]]
    }
  };

  const cfg = presetMap[presetName] || presetMap.zno;
  const ref = localDb.find((p) => p.id === cfg.pid) || localDb[0];
  const nPts = 2001;
  const step = (cfg.maxX - cfg.minX) / (nPts - 1);

  const series = cfg.traces.map(([label, shift, baseFwhm, scale, color, seed]) => {
    const rand = seededRandom(seed);
    const two_theta = new Array(nPts);
    const intensity = new Array(nPts);

    for (let i = 0; i < nPts; i++) {
      const tt = cfg.minX + i * step;
      two_theta[i] = Number(tt.toFixed(4));
      let y = 85.0 + 12.0 * Math.exp(-(tt - cfg.minX) / 35.0);
      for (const pk of ref.peaks) {
        const pos = pk.two_theta + shift * (pk.two_theta / 36.25);
        if (Math.abs(tt - pos) <= 2.6) {
          const thRad = (pos / 2.0) * (Math.PI / 180.0);
          const fwhm = Math.sqrt(0.012 * Math.pow(Math.tan(thRad), 2) + 0.002 * Math.tan(thRad) + baseFwhm * baseFwhm);
          y += pseudoVoigtScalar(tt, pos, pk.intensity * 18.0 * scale, fwhm, 0.58);
        }
      }
      // Box-Muller Gaussian noise scaled by Poisson sqrt(y)
      const u1 = Math.max(rand(), 1e-7);
      const u2 = rand();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      y = Math.max(10.0, y + z * Math.sqrt(y) * 0.95);
      intensity[i] = Number(y.toFixed(2));
    }

    return {
      filename: `${label}.xy`,
      label,
      two_theta,
      intensity,
      min_2theta: cfg.minX,
      max_2theta: cfg.maxX,
      num_points: nPts,
      color
    };
  });

  return { series, ref, localDb };
}

function loadLocalDatabaseClient() {
  const customRaw = localStorage.getItem('diffracta_custom_db');
  let customList = [];
  if (customRaw) {
    try {
      customList = JSON.parse(customRaw);
    } catch (_) {
      customList = [];
    }
  }
  const map = new Map();
  SEED_PHASES.forEach((p) => map.set(p.id, p));
  customList.forEach((p) => map.set(p.id, p));
  return Array.from(map.values());
}

function savePhaseToLocalStorage(phase) {
  const customRaw = localStorage.getItem('diffracta_custom_db');
  let customList = [];
  if (customRaw) {
    try {
      customList = JSON.parse(customRaw);
    } catch (_) {
      customList = [];
    }
  }
  const copy = { ...phase, source: 'Local DB' };
  const idx = customList.findIndex((p) => p.id === copy.id);
  if (idx >= 0) customList[idx] = copy;
  else customList.push(copy);
  localStorage.setItem('diffracta_custom_db', JSON.stringify(customList));
  return loadLocalDatabaseClient();
}

function computeDSpacingsClient(system, cell, wavelength = 1.5406, min2T = 15.0, max2T = 80.0, maxIdx = 4) {
  const a = Number(cell.a || 4.0);
  const b = Number(cell.b || a);
  const c = Number(cell.c || a);
  const sysLow = (system || 'Hexagonal').toLowerCase();
  const alpha = ((cell.alpha || 90.0) * Math.PI) / 180.0;
  const beta = ((cell.beta || 90.0) * Math.PI) / 180.0;
  const gamma = (((cell.gamma || (sysLow === 'hexagonal' ? 120.0 : 90.0))) * Math.PI) / 180.0;

  const ca = Math.cos(alpha), cb = Math.cos(beta), cg = Math.cos(gamma);
  const sa = Math.sin(alpha), sb = Math.sin(beta), sg = Math.sin(gamma);
  const volSq = Math.max(1e-6, 1.0 - ca * ca - cb * cb - cg * cg + 2.0 * ca * cb * cg);
  const V = a * b * c * Math.sqrt(volSq);

  const aStar = (b * c * sa) / V;
  const bStar = (a * c * sb) / V;
  const cStar = (a * b * sg) / V;
  const caStar = (cb * cg - ca) / (sb * sg || 1);
  const cbStar = (ca * cg - cb) / (sa * sg || 1);
  const cgStar = (ca * cb - cg) / (sa * sb || 1);

  const byD = new Map();
  for (let h = -maxIdx; h <= maxIdx; h++) {
    for (let k = -maxIdx; k <= maxIdx; k++) {
      for (let l = -maxIdx; l <= maxIdx; l++) {
        if (h === 0 && k === 0 && l === 0) continue;
        const invD2 =
          Math.pow(h * aStar, 2) +
          Math.pow(k * bStar, 2) +
          Math.pow(l * cStar, 2) +
          2 * h * k * aStar * bStar * cgStar +
          2 * k * l * bStar * cStar * caStar +
          2 * h * l * aStar * cStar * cbStar;
        if (invD2 <= 1e-8) continue;
        const d = 1.0 / Math.sqrt(invD2);
        const sinTh = wavelength / (2.0 * d);
        if (sinTh <= 0 || sinTh >= 0.995) continue;
        const twoTheta = (2.0 * Math.asin(sinTh) * 180.0) / Math.PI;
        if (twoTheta < min2T || twoTheta > max2T) continue;

        const dKey = d.toFixed(4);
        const score = (h >= 0 ? 4 : 0) + (k >= 0 ? 2 : 0) + (l >= 0 ? 1 : 0) + (h >= k ? 0.5 : 0);
        if (!byD.has(dKey)) {
          byD.set(dKey, {
            two_theta: Number(twoTheta.toFixed(3)),
            d: Number(d.toFixed(4)),
            hkl: [h, k, l],
            mult: 1,
            bestScore: score
          });
        } else {
          const item = byD.get(dKey);
          item.mult += 1;
          if (score > item.bestScore) {
            item.hkl = [h, k, l];
            item.bestScore = score;
          }
        }
      }
    }
  }

  const out = Array.from(byD.values()).sort((x, y) => x.two_theta - y.two_theta);
  let maxI = 1e-6;
  out.forEach((r) => {
    const th = (r.two_theta / 2.0) * (Math.PI / 180.0);
    const lp = (1 + Math.pow(Math.cos(2 * th), 2)) / (Math.pow(Math.sin(th), 2) * Math.cos(th));
    r.rawI = r.mult * lp;
    if (r.rawI > maxI) maxI = r.rawI;
  });
  out.forEach((r) => {
    r.intensity = Number(((r.rawI / maxI) * 100.0).toFixed(1));
    delete r.rawI;
    delete r.bestScore;
  });
  return out;
}

function parseCifClient(cifText, sourceId = 'CIF') {
  const extractVal = (tag) => {
    const re = new RegExp(tag + "\\s+(['\"].*?['\"]|\\S+)", 'i');
    const m = cifText.match(re);
    return m ? m[1].replace(/^['"]|['"]$/g, '') : null;
  };
  const extractFloat = (tag, defVal) => {
    const raw = extractVal(tag);
    if (!raw) return defVal;
    const num = parseFloat(raw.replace(/\(.*?\)/g, ''));
    return Number.isFinite(num) ? num : defVal;
  };

  const a = extractFloat('_cell_length_a', 0);
  if (a <= 0) return null;
  const b = extractFloat('_cell_length_b', a);
  const c = extractFloat('_cell_length_c', a);
  const alpha = extractFloat('_cell_angle_alpha', 90);
  const beta = extractFloat('_cell_angle_beta', 90);
  const gamma = extractFloat('_cell_angle_gamma', 90);

  const formula = extractVal('_chemical_formula_sum') || extractVal('_chemical_formula_structural') || sourceId;
  const name = extractVal('_chemical_name_mineral') || extractVal('_chemical_name_common') || formula;
  const sg = extractVal('_symmetry_space_group_name_H-M') || extractVal('_space_group_name_H-M_alt') || 'P1';

  let system = 'Orthorhombic';
  if (Math.abs(gamma - 120) < 0.2) system = 'Hexagonal';
  else if (Math.abs(a - b) < 0.01 && Math.abs(b - c) < 0.01) system = 'Cubic';
  else if (Math.abs(a - b) < 0.01) system = 'Tetragonal';

  const cell = { a, b, c, alpha, beta, gamma };
  let peaks = computeDSpacingsClient(system, cell, 1.5406, 15.0, 80.0, 4);
  peaks = peaks.sort((x, y) => y.intensity - x.intensity).slice(0, 15).sort((x, y) => x.two_theta - y.two_theta);

  return {
    id: sourceId,
    jcpds: sourceId,
    cod_id: sourceId,
    name: name !== formula ? `${name} (${formula})` : formula,
    formula,
    system,
    space_group: sg,
    cell,
    peaks,
    source: 'Local DB'
  };
}

function parseXrdContentClient(text, filename = 'scan.xy') {
  const ext = filename.split('.').pop().toLowerCase();
  if (ext === 'xrdml' || text.includes('<xrdMeasurements')) {
    const doc = new DOMParser().parseFromString(text, 'text/xml');
    const intNode = doc.getElementsByTagName('intensities')[0] || doc.getElementsByTagName('counts')[0];
    if (!intNode) throw new Error('Invalid XRDML file');
    const ys = intNode.textContent.trim().split(/\s+/).map(Number);
    const startNode = doc.getElementsByTagName('startPosition')[0];
    const endNode = doc.getElementsByTagName('endPosition')[0];
    const s2t = startNode ? parseFloat(startNode.textContent) : 10.0;
    const e2t = endNode ? parseFloat(endNode.textContent) : 80.0;
    const xs = ys.map((_, i) => Number((s2t + (i / Math.max(ys.length - 1, 1)) * (e2t - s2t)).toFixed(4)));
    return {
      filename,
      label: filename.replace(/\.[^.]+$/, ''),
      two_theta: xs,
      intensity: ys,
      min_2theta: xs[0],
      max_2theta: xs[xs.length - 1],
      num_points: xs.length
    };
  }

  const pairs = [];
  const lines = text.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || /^[#;/_]/.test(line)) continue;
    const parts = line.split(/[\s,;]+/);
    if (parts.length >= 2) {
      const x = parseFloat(parts[0]);
      const y = parseFloat(parts[1]);
      if (Number.isFinite(x) && Number.isFinite(y)) {
        pairs.push([x, y]);
      }
    }
  }
  if (!pairs.length) throw new Error(`Could not parse data from ${filename}`);
  pairs.sort((a, b) => a[0] - b[0]);

  return {
    filename,
    label: filename.replace(/\.[^.]+$/, ''),
    two_theta: pairs.map((p) => p[0]),
    intensity: pairs.map((p) => p[1]),
    min_2theta: pairs[0][0],
    max_2theta: pairs[pairs.length - 1][0],
    num_points: pairs.length
  };
}

function detectPeaksClient(twoTheta, intensity, prominencePct = 5.5, minDistDeg = 0.35) {
  const n = twoTheta.length;
  if (n < 10) return [];

  // 5-point moving smoothing
  const smooth = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let s = 0, c = 0;
    for (let k = -2; k <= 2; k++) {
      const j = i + k;
      if (j >= 0 && j < n) { s += intensity[j]; c++; }
    }
    smooth[i] = s / c;
  }

  const sorted = Array.from(smooth).sort((a, b) => a - b);
  const baseline = sorted[Math.floor(n * 0.15)] || 0;
  const net = new Float64Array(n);
  let maxNet = 1e-6;
  for (let i = 0; i < n; i++) {
    net[i] = Math.max(0, smooth[i] - baseline);
    if (net[i] > maxNet) maxNet = net[i];
  }

  const step = (twoTheta[n - 1] - twoTheta[0]) / Math.max(n - 1, 1);
  const minPts = Math.max(3, Math.round(minDistDeg / Math.max(step, 1e-4)));
  const minHeight = (prominencePct / 100.0) * maxNet;

  const candidates = [];
  for (let i = 2; i < n - 2; i++) {
    if (
      net[i] >= minHeight &&
      net[i] >= net[i - 1] &&
      net[i] >= net[i + 1] &&
      net[i] > net[i - 2] &&
      net[i] > net[i + 2]
    ) {
      candidates.push(i);
    }
  }

  // Non-maximum suppression within minPts
  candidates.sort((a, b) => net[b] - net[a]);
  const kept = [];
  for (const idx of candidates) {
    if (!kept.some((k) => Math.abs(k - idx) < minPts)) {
      kept.push(idx);
    }
  }
  kept.sort((a, b) => a - b);

  const wavelength = 1.5406;
  return kept.map((idx) => {
    const tt = twoTheta[idx];
    const thRad = (tt / 2.0) * (Math.PI / 180.0);
    const d = wavelength / (2.0 * Math.sin(thRad));
    return {
      two_theta: Number(tt.toFixed(3)),
      intensity_raw: Number(intensity[idx].toFixed(2)),
      intensity: Number(((net[idx] / maxNet) * 100.0).toFixed(1)),
      d: Number(d.toFixed(4))
    };
  });
}

function searchMatchClient(twoTheta, intensity, toleranceDeg = 0.45, extraPhases = []) {
  const expPeaks = detectPeaksClient(twoTheta, intensity, 5.0);
  if (!expPeaks.length) return [];
  const tMin = twoTheta[0];
  const tMax = twoTheta[twoTheta.length - 1];

  const poolMap = new Map();
  loadLocalDatabaseClient().forEach((p) => poolMap.set(p.id, p));
  (extraPhases || []).forEach((p) => poolMap.set(p.id, p));

  const ranked = [];
  for (const phase of poolMap.values()) {
    const refInRange = (phase.peaks || []).filter((p) => p.two_theta >= tMin - 0.5 && p.two_theta <= tMax + 0.5);
    if (!refInRange.length) continue;

    let matchedWeight = 0;
    let totalWeight = 0;
    let matchedCount = 0;
    for (const rp of refInRange) {
      totalWeight += rp.intensity;
      let bestDiff = 999;
      for (const ep of expPeaks) {
        const diff = Math.abs(ep.two_theta - rp.two_theta);
        if (diff < bestDiff) bestDiff = diff;
      }
      if (bestDiff <= toleranceDeg) {
        matchedCount++;
        matchedWeight += rp.intensity * (1.0 - 0.35 * (bestDiff / toleranceDeg));
      }
    }
    if (matchedCount > 0 && totalWeight > 0) {
      ranked.push({
        ...phase,
        fom: Number(Math.min(100, (matchedWeight / totalWeight) * 100).toFixed(1)),
        matched_peaks: matchedCount,
        total_ref_peaks: refInRange.length
      });
    }
  }
  return ranked.sort((a, b) => b.fom - a.fom);
}

function assignMillerIndicesClient(twoTheta, intensity, referencePhase, system, cell, toleranceDeg = 0.55) {
  const expPeaks = detectPeaksClient(twoTheta, intensity, 5.5);
  let refPeaks = [];
  let usedSys = system || 'Hexagonal';
  let usedCell = cell || { a: 3.2498, b: 3.2498, c: 5.2066, alpha: 90, beta: 90, gamma: 120 };

  if (referencePhase && referencePhase.peaks && referencePhase.peaks.length) {
    refPeaks = referencePhase.peaks;
    usedSys = referencePhase.system || usedSys;
    usedCell = referencePhase.cell || usedCell;
  } else {
    refPeaks = computeDSpacingsClient(usedSys, usedCell, 1.5406, twoTheta[0], twoTheta[twoTheta.length - 1], 4);
  }

  const usedHkls = new Set();
  const indexed = [];
  const byInt = [...expPeaks].sort((a, b) => b.intensity - a.intensity);

  for (const ep of byInt) {
    const cands = refPeaks.filter((rp) => Math.abs(rp.two_theta - ep.two_theta) <= toleranceDeg);
    if (cands.length) {
      let best = cands[0];
      let bestScore = -1;
      for (const rp of cands) {
        const sc = (rp.intensity || 50) * (1.0 - Math.abs(rp.two_theta - ep.two_theta) / (toleranceDeg * 1.4));
        if (sc > bestScore) { bestScore = sc; best = rp; }
      }
      const hklStr = `(${best.hkl[0]}${best.hkl[1]}${best.hkl[2]})`;
      const showLabel = !usedHkls.has(hklStr) && (best.intensity || 100) >= 15.0;
      usedHkls.add(hklStr);
      indexed.push({
        two_theta: ep.two_theta,
        two_theta_calc: best.two_theta,
        d_obs: ep.d,
        d_calc: best.d,
        intensity: ep.intensity,
        intensity_raw: ep.intensity_raw,
        hkl: best.hkl,
        hkl_str: hklStr,
        indexed: true,
        show_label: showLabel
      });
    } else {
      indexed.push({
        two_theta: ep.two_theta,
        two_theta_calc: null,
        d_obs: ep.d,
        d_calc: null,
        intensity: ep.intensity,
        intensity_raw: ep.intensity_raw,
        hkl: null,
        hkl_str: '',
        indexed: false,
        show_label: false
      });
    }
  }
  indexed.sort((a, b) => a.two_theta - b.two_theta);
  return { system: usedSys, cell: usedCell, peaks: indexed };
}

function runRietveldClient(twoTheta, intensity, phase, wavelength = 1.5406) {
  const n = twoTheta.length;
  const xMin = twoTheta[0];
  const xMax = twoTheta[n - 1];
  const refPeaks = (phase.peaks || []).filter((p) => p.two_theta >= xMin - 1.0 && p.two_theta <= xMax + 1.0);

  const cell0 = phase.cell || { a: 3.2498, b: 3.2498, c: 5.2066, alpha: 90, beta: 90, gamma: 120 };
  const a0 = Number(cell0.a || 3.2498);
  const c0 = Number(cell0.c || 5.2066);
  const sys = (phase.system || 'Hexagonal').toLowerCase();

  const sortedY = [...intensity].sort((a, b) => a - b);
  let bg0 = sortedY[Math.floor(n * 0.12)] || 50.0;
  let bgSlope = (intensity[n - 1] - intensity[0]) / Math.max(xMax - xMin, 1);
  const maxObs = sortedY[n - 1] || 1000.0;
  let scale = Math.max((maxObs - bg0) / 100.0, 0.5);
  let zero = 0.0;
  let epsA = 0.0;
  let epsC = 0.0;
  let W = 0.055;
  let eta = 0.58;

  const evalProfile = (sc, zr, eA, eC, wVal, etaVal, b0, b1) => {
    const yCalc = new Float64Array(n);
    const yBkg = new Float64Array(n);
    const aCur = a0 * (1.0 + eA);
    const cCur = c0 * (1.0 + (sys === 'cubic' ? eA : eC));

    for (let i = 0; i < n; i++) {
      const b = b0 + b1 * (twoTheta[i] - xMin);
      yBkg[i] = b;
      yCalc[i] = b;
    }

    const ticks = [];
    for (const pk of refPeaks) {
      const [h, k, l] = pk.hkl;
      let invD2 = 0;
      if (sys === 'hexagonal' || sys === 'trigonal') {
        invD2 = (4.0 / 3.0) * ((h * h + h * k + k * k) / (aCur * aCur)) + (l * l) / (cCur * cCur);
      } else if (sys === 'tetragonal') {
        invD2 = (h * h + k * k) / (aCur * aCur) + (l * l) / (cCur * cCur);
      } else if (sys === 'cubic') {
        invD2 = (h * h + k * k + l * l) / (aCur * aCur);
      } else {
        invD2 = 1.0 / Math.pow(pk.d * (1.0 + eA), 2);
      }

      let pos = pk.two_theta + zr;
      if (invD2 > 0) {
        const dCur = 1.0 / Math.sqrt(invD2);
        const sTh = wavelength / (2.0 * dCur);
        if (sTh > 0 && sTh < 0.995) {
          pos = (2.0 * Math.asin(sTh) * 180.0) / Math.PI + zr;
        }
      }

      const thRad = (pos / 2.0) * (Math.PI / 180.0);
      const fwhm = Math.sqrt(0.012 * Math.pow(Math.tan(thRad), 2) + Math.max(wVal, 0.003));
      const amp = sc * pk.intensity;
      const win = fwhm * 8.5;

      for (let i = 0; i < n; i++) {
        if (Math.abs(twoTheta[i] - pos) <= win) {
          yCalc[i] += pseudoVoigtScalar(twoTheta[i], pos, amp, fwhm, etaVal);
        }
      }
      ticks.push({
        two_theta: Number(pos.toFixed(3)),
        hkl: pk.hkl,
        hkl_str: `(${h}${k}${l})`,
        intensity: pk.intensity,
        fwhm: Number(fwhm.toFixed(4))
      });
    }

    let wss = 0;
    for (let i = 0; i < n; i++) {
      const diff = intensity[i] - yCalc[i];
      wss += (diff * diff) / Math.max(intensity[i], 1.0);
    }
    return { wss, yCalc, yBkg, ticks };
  };

  // Coordinate-descent refinement over parameters (converges in ~35 ms)
  let best = evalProfile(scale, zero, epsA, epsC, W, eta, bg0, bgSlope);
  const steps = [
    [0.08, 0.02, 0.0012, 0.0012, 0.006, 0.04, 3.0],
    [0.02, 0.006, 0.0004, 0.0004, 0.002, 0.015, 1.0],
    [0.005, 0.002, 0.0001, 0.0001, 0.0006, 0.005, 0.3]
  ];

  for (const [dSc, dZr, dEa, dEc, dW, dEta, dBg] of steps) {
    for (let iter = 0; iter < 4; iter++) {
      for (const dir of [-1, 1]) {
        const cand = evalProfile(scale * (1 + dir * dSc), zero, epsA, epsC, W, eta, bg0, bgSlope);
        if (cand.wss < best.wss) { scale *= (1 + dir * dSc); best = cand; }
      }
      for (const dir of [-1, 1]) {
        const cand = evalProfile(scale, zero + dir * dZr, epsA, epsC, W, eta, bg0, bgSlope);
        if (cand.wss < best.wss) { zero += dir * dZr; best = cand; }
      }
      for (const dir of [-1, 1]) {
        const cand = evalProfile(scale, zero, epsA + dir * dEa, epsC, W, eta, bg0, bgSlope);
        if (cand.wss < best.wss) { epsA += dir * dEa; best = cand; }
      }
      if (sys !== 'cubic') {
        for (const dir of [-1, 1]) {
          const cand = evalProfile(scale, zero, epsA, epsC + dir * dEc, W, eta, bg0, bgSlope);
          if (cand.wss < best.wss) { epsC += dir * dEc; best = cand; }
        }
      }
      for (const dir of [-1, 1]) {
        const nw = Math.max(0.004, W + dir * dW);
        const cand = evalProfile(scale, zero, epsA, epsC, nw, eta, bg0, bgSlope);
        if (cand.wss < best.wss) { W = nw; best = cand; }
      }
      for (const dir of [-1, 1]) {
        const ne = Math.min(0.95, Math.max(0.1, eta + dir * dEta));
        const cand = evalProfile(scale, zero, epsA, epsC, W, ne, bg0, bgSlope);
        if (cand.wss < best.wss) { eta = ne; best = cand; }
      }
      for (const dir of [-1, 1]) {
        const cand = evalProfile(scale, zero, epsA, epsC, W, eta, bg0 + dir * dBg, bgSlope);
        if (cand.wss < best.wss) { bg0 += dir * dBg; best = cand; }
      }
    }
  }

  let sumAbsDiff = 0, sumObs = 0, numRwp = 0, denRwp = 0;
  const yDiff = new Array(n);
  for (let i = 0; i < n; i++) {
    const d = intensity[i] - best.yCalc[i];
    yDiff[i] = Number(d.toFixed(2));
    sumAbsDiff += Math.abs(d);
    sumObs += Math.abs(intensity[i]);
    const w = 1.0 / Math.max(intensity[i], 1.0);
    numRwp += w * d * d;
    denRwp += w * intensity[i] * intensity[i];
  }

  const rp = (sumAbsDiff / Math.max(sumObs, 1)) * 100.0;
  const rwp = Math.sqrt(numRwp / Math.max(denRwp, 1)) * 100.0;
  const rexp = Math.sqrt(Math.max(n - 7, 1) / Math.max(denRwp, 1)) * 100.0;
  const chi2 = Math.pow(rwp / Math.max(rexp, 1e-4), 2);

  const aRef = a0 * (1.0 + epsA);
  const cRef = c0 * (1.0 + (sys === 'cubic' ? epsA : epsC));
  const bRef = aRef;
  const gammaRad = ((cell0.gamma || (sys === 'hexagonal' ? 120.0 : 90.0)) * Math.PI) / 180.0;
  const vol = aRef * bRef * cRef * Math.sin(gammaRad);
  const meanFwhmDeg = Math.sqrt(Math.max(W, 0.004));
  const crystalliteNm = (0.9 * (wavelength / 10.0)) / (((meanFwhmDeg * Math.PI) / 180.0) * Math.cos((18.0 * Math.PI) / 180.0));

  return {
    phase_name: phase.name || phase.formula,
    phase_id: phase.jcpds || phase.id,
    system: phase.system || 'Hexagonal',
    space_group: phase.space_group || '',
    two_theta: twoTheta,
    y_obs: intensity,
    y_calc: Array.from(best.yCalc, (v) => Number(v.toFixed(2))),
    y_bkg: Array.from(best.yBkg, (v) => Number(v.toFixed(2))),
    y_diff: yDiff,
    bragg_ticks: best.ticks,
    metrics: {
      rwp: Number(rwp.toFixed(2)),
      rp: Number(rp.toFixed(2)),
      rexp: Number(rexp.toFixed(2)),
      chi2: Number(chi2.toFixed(2)),
      a: Number(aRef.toFixed(4)),
      b: Number(bRef.toFixed(4)),
      c: Number(cRef.toFixed(4)),
      volume: Number(vol.toFixed(2)),
      zero_shift: Number(zero.toFixed(4)),
      crystallite_nm: Number(crystalliteNm.toFixed(1))
    }
  };
}

async function queryOnlineDatabasesClient(query, source = 'all') {
  const q = query.trim();
  const qLow = q.toLowerCase();
  const results = [];

  if (source === 'local' || source === 'all') {
    for (const p of loadLocalDatabaseClient()) {
      if (
        !qLow ||
        (p.name && p.name.toLowerCase().includes(qLow)) ||
        (p.formula && p.formula.toLowerCase().includes(qLow)) ||
        String(p.id).toLowerCase().includes(qLow) ||
        String(p.cod_id || '').toLowerCase().includes(qLow)
      ) {
        results.push(p);
      }
    }
  }

  if (q && (source === 'cod' || source === 'optimade' || source === 'all')) {
    const elems = Array.from(new Set(q.match(/[A-Z][a-z]?/g) || []));
    const filterExpr = elems.length
      ? `elements HAS ALL ${elems.map((e) => `"${e}"`).join(',')} AND nelements=${elems.length}`
      : `chemical_formula_descriptive CONTAINS "${q}"`;

    const endpoints = [];
    if (source === 'cod' || source === 'all') {
      endpoints.push(['COD', 'https://www.crystallography.net/cod/optimade/v1/structures']);
    }
    if (source === 'optimade' || source === 'all') {
      endpoints.push(['Materials Cloud', 'https://aiida.materialscloud.org/mc3d/optimade/v1/structures']);
    }

    for (const [providerName, url] of endpoints) {
      try {
        const resp = await fetch(`${url}?filter=${encodeURIComponent(filterExpr)}&page_limit=5`);
        if (!resp.ok) continue;
        const payload = await resp.json();
        for (const item of payload.data || []) {
          const attrs = item.attributes || {};
          const vecs = attrs.lattice_vectors;
          if (!vecs || vecs.length !== 3) continue;
          const norm = (v) => Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
          const dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
          const a = norm(vecs[0]), b = norm(vecs[1]), c = norm(vecs[2]);
          if (a <= 0 || b <= 0 || c <= 0) continue;
          const alpha = (Math.acos(Math.min(1, Math.max(-1, dot(vecs[1], vecs[2]) / (b * c)))) * 180) / Math.PI;
          const beta = (Math.acos(Math.min(1, Math.max(-1, dot(vecs[0], vecs[2]) / (a * c)))) * 180) / Math.PI;
          const gamma = (Math.acos(Math.min(1, Math.max(-1, dot(vecs[0], vecs[1]) / (a * b)))) * 180) / Math.PI;

          const cell = {
            a: Number(a.toFixed(4)), b: Number(b.toFixed(4)), c: Number(c.toFixed(4)),
            alpha: Number(alpha.toFixed(2)), beta: Number(beta.toFixed(2)), gamma: Number(gamma.toFixed(2))
          };
          const system = Math.abs(gamma - 120) < 0.5 ? 'Hexagonal' : Math.abs(a - b) < 0.01 && Math.abs(b - c) < 0.01 ? 'Cubic' : Math.abs(a - b) < 0.01 ? 'Tetragonal' : 'Orthorhombic';
          let peaks = computeDSpacingsClient(system, cell, 1.5406, 15.0, 80.0, 4);
          peaks = peaks.sort((x, y) => y.intensity - x.intensity).slice(0, 14).sort((x, y) => x.two_theta - y.two_theta);
          const formula = attrs.chemical_formula_reduced || attrs.chemical_formula_descriptive || q;
          const prefix = providerName === 'COD' ? 'COD' : 'OPT';
          results.push({
            id: `${prefix}-${item.id}`,
            jcpds: `${prefix} ${item.id}`,
            cod_id: String(item.id),
            name: `${formula} (${providerName})`,
            formula,
            system,
            space_group: system,
            cell,
            peaks,
            source: providerName
          });
        }
      } catch (_) {
        // Fallback to embedded COD/RRUFF records if offline or blocked
      }
    }

    // Ensure COD / RRUFF matching cards are always available even offline
    if (results.length === 0) {
      for (const p of SEED_PHASES) {
        if (
          p.name.toLowerCase().includes(qLow) ||
          p.formula.toLowerCase().includes(qLow) ||
          (p.cod_id && p.cod_id.includes(qLow))
        ) {
          results.push({
            ...p,
            id: source === 'cod' ? `COD-${p.cod_id}` : p.id,
            jcpds: source === 'cod' ? `COD ${p.cod_id}` : p.jcpds,
            source: source === 'cod' ? 'COD' : 'RRUFF / ICDD'
          });
        }
      }
    }
  }

  return results;
}

/* ============================================================================
   UI CONTROLLER & APPLICATION BOOTSTRAP
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  bindEvents();
  loadPreset('zno');
});

function loadPreset(presetName) {
  const { series, ref, localDb } = synthesizePresetSeries(presetName);
  state.series = series;
  state.localDb = localDb;
  state.activeReference = ref;
  state.min2Theta = series[0].min_2theta;
  state.max2Theta = series[0].max_2theta;
  document.getElementById('min2ThetaInput').value = state.min2Theta;
  document.getElementById('max2ThetaInput').value = state.max2Theta;

  const topTrace = series[series.length - 1];
  state.indexed = assignMillerIndicesClient(
    topTrace.two_theta,
    topTrace.intensity,
    ref,
    ref.system,
    ref.cell
  );
  state.dbResults = searchMatchClient(series[0].two_theta, series[0].intensity);
  state.rietveld = null;

  syncCellInputsFromReference(ref);
  renderTraceList();
  renderDbResults();
  renderHklTable();
  populateRietveldTraceSelect();
  renderGraph();
}

function bindEvents() {
  document.getElementById('presetSelect').addEventListener('change', (e) => {
    state.viewMode = 'stacked';
    updateViewTabs();
    loadPreset(e.target.value);
  });

  document.getElementById('fileUploadInput').addEventListener('change', async (e) => {
    if (!e.target.files.length) return;
    await uploadXrdFiles(e.target.files, false);
    e.target.value = '';
  });

  document.getElementById('appendUploadInput').addEventListener('change', async (e) => {
    if (!e.target.files.length) return;
    await uploadXrdFiles(e.target.files, true);
    e.target.value = '';
  });

  document.getElementById('paletteToggleBtn').addEventListener('click', (e) => {
    state.useThemeTraceColors = !state.useThemeTraceColors;
    const pal = state.useThemeTraceColors ? THEME_COLORS : CLASSIC_COLORS;
    state.series.forEach((s, idx) => {
      s.color = pal[idx % pal.length];
    });
    e.target.textContent = state.useThemeTraceColors ? 'Classic Colors' : 'Theme Colors';
    renderTraceList();
    renderGraph();
  });

  document.getElementById('dbUploadInput').addEventListener('change', async (e) => {
    if (!e.target.files.length) return;
    for (const file of e.target.files) {
      const text = await file.text();
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'cif') {
        const parsed = parseCifClient(text, file.name.replace(/\.cif$/i, ''));
        if (parsed) state.localDb = savePhaseToLocalStorage(parsed);
      } else if (ext === 'json') {
        try {
          const obj = JSON.parse(text);
          state.localDb = savePhaseToLocalStorage(obj);
        } catch (_) {}
      }
    }
    state.dbResults = state.localDb;
    renderDbResults();
    e.target.value = '';
  });

  document.querySelectorAll('.pill-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pill-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.dbSource = btn.dataset.source;
      runDatabaseQuery();
    });
  });

  document.getElementById('dbSearchBtn').addEventListener('click', runDatabaseQuery);
  document.getElementById('dbSearchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') runDatabaseQuery();
  });

  document.getElementById('searchMatchBtn').addEventListener('click', runSearchMatch);

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.viewMode = btn.dataset.view;
      updateViewTabs();
      if (state.viewMode === 'rietveld' && !state.rietveld) {
        runRietveld();
      } else {
        renderGraph();
      }
    });
  });

  document.getElementById('min2ThetaInput').addEventListener('input', (e) => {
    state.min2Theta = parseFloat(e.target.value) || 20;
    renderGraph();
  });
  document.getElementById('max2ThetaInput').addEventListener('input', (e) => {
    state.max2Theta = parseFloat(e.target.value) || 70;
    renderGraph();
  });
  document.getElementById('stackOffsetInput').addEventListener('input', (e) => {
    state.stackOffset = parseFloat(e.target.value) || 1.0;
    renderGraph();
  });

  document.getElementById('toggleHklBtn').addEventListener('click', (e) => {
    state.showHkl = !state.showHkl;
    e.target.textContent = state.showHkl ? '(hkl) On' : '(hkl) Off';
    renderGraph();
  });

  document.getElementById('assignHklBtn').addEventListener('click', () => runIndexPeaks(false));
  document.getElementById('runRietveldBtn').addEventListener('click', runRietveld);
  document.getElementById('downloadPngBtn').addEventListener('click', download300DpiPng);

  const canvas = document.getElementById('xrdCanvas');
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const cx = (e.clientX - rect.left) * scaleX;
    const left = 165, right = 1735;
    if (cx >= left && cx <= right) {
      const tt = state.min2Theta + ((cx - left) / (right - left)) * (state.max2Theta - state.min2Theta);
      const d = 1.5406 / (2 * Math.sin((tt / 2) * (Math.PI / 180)));
      document.getElementById('cursorReadout').textContent = `2θ: ${tt.toFixed(2)}° | d: ${d.toFixed(3)} Å`;
    } else {
      document.getElementById('cursorReadout').textContent = '2θ: —';
    }
  });
}

function updateViewTabs() {
  document.querySelectorAll('.tab-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.view === state.viewMode);
  });
}

async function uploadXrdFiles(fileList, append = false) {
  const pal = state.useThemeTraceColors ? THEME_COLORS : CLASSIC_COLORS;
  const parsedList = [];

  for (let i = 0; i < fileList.length; i++) {
    const f = fileList[i];
    const text = await f.text();
    const ext = f.name.split('.').pop().toLowerCase();
    if (ext === 'cif') {
      const cifPhase = parseCifClient(text, f.name.replace(/\.cif$/i, ''));
      if (cifPhase) {
        const nPts = 1600;
        const two_theta = new Array(nPts);
        const intensity = new Array(nPts);
        for (let k = 0; k < nPts; k++) {
          const tt = 15.0 + (k / (nPts - 1)) * 65.0;
          two_theta[k] = Number(tt.toFixed(4));
          let y = 80.0;
          for (const pk of cifPhase.peaks) {
            if (Math.abs(tt - pk.two_theta) <= 2.5) {
              y += pseudoVoigtScalar(tt, pk.two_theta, pk.intensity * 18.0, 0.24, 0.55);
            }
          }
          intensity[k] = Number(y.toFixed(2));
        }
        parsedList.push({
          filename: f.name,
          label: cifPhase.formula,
          two_theta,
          intensity,
          min_2theta: 15.0,
          max_2theta: 80.0,
          num_points: nPts,
          color: pal[(append ? state.series.length + parsedList.length : parsedList.length) % pal.length]
        });
      }
    } else {
      try {
        const item = parseXrdContentClient(text, f.name);
        item.color = pal[(append ? state.series.length + parsedList.length : parsedList.length) % pal.length];
        parsedList.push(item);
      } catch (_) {}
    }
  }

  if (!parsedList.length) return;
  if (append) {
    state.series.push(...parsedList);
  } else {
    state.series = parsedList;
  }

  const first = state.series[0];
  state.min2Theta = Math.max(5, Math.floor(first.min_2theta / 5) * 5);
  state.max2Theta = Math.min(100, Math.ceil(first.max_2theta / 5) * 5);
  document.getElementById('min2ThetaInput').value = state.min2Theta;
  document.getElementById('max2ThetaInput').value = state.max2Theta;

  renderTraceList();
  populateRietveldTraceSelect();
  runSearchMatch();
  runIndexPeaks(true);
  renderGraph();
}

function renderTraceList() {
  const container = document.getElementById('traceList');
  container.innerHTML = '';
  state.series.forEach((trace, idx) => {
    const row = document.createElement('div');
    row.className = 'trace-item';
    row.innerHTML = `
      <input type="color" class="trace-color" value="${trace.color || '#e60000'}" data-idx="${idx}" />
      <input type="text" class="trace-label-input" value="${trace.label}" data-idx="${idx}" />
      <button class="icon-btn" data-remove="${idx}" title="Remove">×</button>
    `;
    container.appendChild(row);
  });

  container.querySelectorAll('.trace-color').forEach((inp) => {
    inp.addEventListener('input', (e) => {
      const i = parseInt(e.target.dataset.idx, 10);
      state.series[i].color = e.target.value;
      renderGraph();
    });
  });

  container.querySelectorAll('.trace-label-input').forEach((inp) => {
    inp.addEventListener('input', (e) => {
      const i = parseInt(e.target.dataset.idx, 10);
      state.series[i].label = e.target.value;
      populateRietveldTraceSelect();
      renderGraph();
    });
  });

  container.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (state.series.length <= 1) return;
      const i = parseInt(e.target.dataset.remove, 10);
      state.series.splice(i, 1);
      renderTraceList();
      populateRietveldTraceSelect();
      renderGraph();
    });
  });
}

function populateRietveldTraceSelect() {
  const sel = document.getElementById('rietveldTraceSelect');
  sel.innerHTML = '';
  state.series.forEach((s, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = s.label;
    sel.appendChild(opt);
  });
}

async function runDatabaseQuery() {
  const q = document.getElementById('dbSearchInput').value.trim();
  const btn = document.getElementById('dbSearchBtn');
  btn.textContent = '...';
  try {
    state.dbResults = await queryOnlineDatabasesClient(q, state.dbSource);
    renderDbResults();
  } finally {
    btn.textContent = 'Query';
  }
}

function runSearchMatch() {
  if (!state.series.length) return;
  const primary = state.series[0];
  const matches = searchMatchClient(primary.two_theta, primary.intensity, 0.45, state.dbResults);
  if (matches.length) {
    state.dbResults = matches;
    state.activeReference = matches[0];
    syncCellInputsFromReference(state.activeReference);
    renderDbResults();
    runIndexPeaks(true);
    renderGraph();
  }
}

function syncCellInputsFromReference(ref) {
  if (!ref || !ref.cell) return;
  document.getElementById('crystalSystemSelect').value = ref.system || 'Hexagonal';
  document.getElementById('cellAInput').value = ref.cell.a || 3.2498;
  document.getElementById('cellCInput').value = ref.cell.c || 5.2066;
}

function renderDbResults() {
  const container = document.getElementById('dbResultsList');
  container.innerHTML = '';
  state.dbResults.forEach((phase) => {
    const isSelected = state.activeReference && state.activeReference.id === phase.id;
    const card = document.createElement('div');
    card.className = `db-card ${isSelected ? 'selected' : ''}`;
    const badgeText = phase.fom !== undefined ? `${phase.fom}%` : (phase.source || 'DB');
    card.innerHTML = `
      <div class="db-card-main">
        <div class="db-card-title">${phase.name || phase.formula}</div>
        <div class="db-card-meta">
          <span>${phase.jcpds ? 'JCPDS ' + phase.jcpds : phase.id}</span>
          <span>•</span>
          <span>${phase.system || ''} ${phase.space_group || ''}</span>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:5px;">
        ${phase.source && phase.source !== 'Local DB' ? `<button class="btn btn-sm save-local-btn" title="Save to Local DB">↓</button>` : ''}
        <span class="fom-badge">${badgeText}</span>
      </div>
    `;

    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('save-local-btn')) {
        e.stopPropagation();
        state.localDb = savePhaseToLocalStorage(phase);
        e.target.textContent = '✓';
        return;
      }
      state.activeReference = phase;
      syncCellInputsFromReference(phase);
      renderDbResults();
      runIndexPeaks(true);
      if (state.viewMode === 'rietveld') {
        runRietveld();
      } else {
        renderGraph();
      }
    });

    container.appendChild(card);
  });
}

function runIndexPeaks(useReference = true) {
  if (!state.series.length) return;
  const topTrace = state.series[state.series.length - 1];
  const system = document.getElementById('crystalSystemSelect').value;
  const a = parseFloat(document.getElementById('cellAInput').value) || 3.2498;
  const c = parseFloat(document.getElementById('cellCInput').value) || 5.2066;

  state.indexed = assignMillerIndicesClient(
    topTrace.two_theta,
    topTrace.intensity,
    useReference ? state.activeReference : null,
    system,
    { a, b: a, c, alpha: 90.0, beta: 90.0, gamma: system === 'Hexagonal' ? 120.0 : 90.0 },
    0.55
  );
  renderHklTable();
  renderGraph();
}

function renderHklTable() {
  const tbody = document.getElementById('hklTableBody');
  tbody.innerHTML = '';
  const peaks = (state.indexed && state.indexed.peaks) || [];
  peaks.forEach((pk, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" data-hkl-toggle="${idx}" ${pk.show_label ? 'checked' : ''} /></td>
      <td>${pk.two_theta.toFixed(2)}</td>
      <td>${pk.d_obs.toFixed(3)}</td>
      <td>${pk.intensity.toFixed(0)}</td>
      <td><input type="text" class="hkl-input" data-hkl-edit="${idx}" value="${pk.hkl_str || ''}" /></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('[data-hkl-toggle]').forEach((cb) => {
    cb.addEventListener('change', (e) => {
      const i = parseInt(e.target.dataset.hklToggle, 10);
      state.indexed.peaks[i].show_label = e.target.checked;
      renderGraph();
    });
  });

  tbody.querySelectorAll('[data-hkl-edit]').forEach((inp) => {
    inp.addEventListener('input', (e) => {
      const i = parseInt(e.target.dataset.hklEdit, 10);
      state.indexed.peaks[i].hkl_str = e.target.value;
      state.indexed.peaks[i].show_label = Boolean(e.target.value.trim());
      renderGraph();
    });
  });
}

function runRietveld() {
  if (!state.series.length || !state.activeReference) return;
  const traceIdx = parseInt(document.getElementById('rietveldTraceSelect').value, 10) || 0;
  const trace = state.series[traceIdx] || state.series[0];

  state.rietveld = runRietveldClient(trace.two_theta, trace.intensity, state.activeReference, 1.5406);
  const m = state.rietveld.metrics;
  document.getElementById('statRwp').textContent = m.rwp.toFixed(2);
  document.getElementById('statChi2').textContent = m.chi2.toFixed(2);
  document.getElementById('statRp').textContent = m.rp.toFixed(2);
  document.getElementById('statRexp').textContent = m.rexp.toFixed(2);
  document.getElementById('statCellA').textContent = m.a.toFixed(4);
  document.getElementById('statCellC').textContent = m.c.toFixed(4);
  document.getElementById('statSize').textContent = m.crystallite_nm.toFixed(1);
  document.getElementById('statVol').textContent = m.volume.toFixed(2);
  document.getElementById('statZero').textContent = m.zero_shift.toFixed(4);

  state.viewMode = 'rietveld';
  updateViewTabs();
  renderGraph();
}

/* =========================================================================
   PUBLICATION GRAPH RENDERER (MATCHES PASTED REFERENCE LAYOUT AT 300 DPI)
   ========================================================================= */
function renderGraph() {
  const canvas = document.getElementById('xrdCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width;   // 1800 px (6.0 in @ 300 DPI)
  const H = canvas.height;  // 1575 px (5.25 in @ 300 DPI)

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  if (state.viewMode === 'rietveld' && state.rietveld) {
    drawRietveldPlot(ctx, W, H);
  } else {
    drawReferenceStackedPlot(ctx, W, H, state.viewMode === 'overlay');
  }
}

function drawReferenceStackedPlot(ctx, W, H, isOverlay = false) {
  const left = 165;
  const right = 1735;
  const top = 65;
  const bottom = 1365;
  const plotW = right - left;
  const plotH = bottom - top;

  const minX = state.min2Theta;
  const maxX = state.max2Theta;
  const spanX = Math.max(maxX - minX, 1);
  const xToPx = (tt) => left + ((tt - minX) / spanX) * plotW;

  const stickZoneH = 195;
  if (state.activeReference && state.activeReference.peaks) {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5.5;
    ctx.lineCap = 'butt';

    state.activeReference.peaks.forEach((pk) => {
      if (pk.two_theta >= minX && pk.two_theta <= maxX) {
        const px = xToPx(pk.two_theta);
        const barH = (Math.min(pk.intensity, 100) / 100) * (stickZoneH - 15);
        ctx.beginPath();
        ctx.moveTo(px, bottom);
        ctx.lineTo(px, bottom - barH);
        ctx.stroke();
      }
    });

    ctx.fillStyle = '#000000';
    ctx.font = '43px "Times New Roman", Times, serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    const refId = String(state.activeReference.jcpds || state.activeReference.id || '');
    let line1 = 'JCPDS No.';
    let line2 = refId;
    if (refId.startsWith('COD')) {
      line1 = 'COD No.';
      line2 = refId.replace(/^COD[\s\-]*/, '');
    } else if (refId.startsWith('OPT')) {
      line1 = state.activeReference.formula || 'Ref. ID';
      line2 = refId;
    }
    ctx.fillText(line1, left + 32, bottom - 95);
    ctx.fillText(line2, left + 32, bottom - 34);
  }

  const nTraces = state.series.length;
  if (nTraces > 0) {
    const tracesBottom = bottom - stickZoneH - 28;
    const tracesTop = top + 165;
    const availH = tracesBottom - tracesTop;

    const offsetFactor = isOverlay ? 0.0 : state.stackOffset;
    const stepOffset = nTraces > 1 ? (availH / (nTraces + 0.35)) * offsetFactor : 0;
    const peakAmpH = nTraces > 1 ? Math.min(availH * 0.44, stepOffset * 1.38 || availH * 0.72) : availH * 0.78;

    ctx.save();
    ctx.beginPath();
    ctx.rect(left, top, plotW, plotH);
    ctx.clip();

    const traceApexMap = [];

    state.series.forEach((trace, idx) => {
      const baseLineY = tracesBottom - idx * stepOffset;
      const xs = trace.two_theta;
      const ys = trace.intensity;

      let minVal = Infinity;
      let maxVal = -Infinity;
      for (let i = 0; i < xs.length; i++) {
        if (xs[i] >= minX && xs[i] <= maxX) {
          if (ys[i] < minVal) minVal = ys[i];
          if (ys[i] > maxVal) maxVal = ys[i];
        }
      }
      if (!Number.isFinite(minVal)) minVal = 0;
      const rangeY = Math.max(maxVal - minVal, 1e-3);

      ctx.strokeStyle = trace.color || CLASSIC_COLORS[idx % CLASSIC_COLORS.length];
      ctx.lineWidth = 4.2;
      ctx.lineJoin = 'round';
      ctx.beginPath();

      let started = false;
      for (let i = 0; i < xs.length; i++) {
        const tt = xs[i];
        if (tt < minX || tt > maxX) continue;
        const px = xToPx(tt);
        const normY = (ys[i] - minVal) / rangeY;
        const py = baseLineY - normY * peakAmpH;
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();

      traceApexMap.push({ baseLineY, minVal, rangeY, peakAmpH, xs, ys });
    });

    ctx.restore();

    state.series.forEach((trace, idx) => {
      const info = traceApexMap[idx];
      const labelY = isOverlay
        ? top + 80 + idx * 52
        : info.baseLineY - 36;
      const labelX = left + 36;
      drawFormattedTraceLabel(ctx, trace.label, labelX, labelY, isOverlay ? trace.color : '#000000');
    });

    if (state.showHkl && state.indexed && state.indexed.peaks) {
      const topInfo = traceApexMap[traceApexMap.length - 1];
      const visiblePeaks = state.indexed.peaks.filter(
        (pk) => pk.show_label && pk.hkl_str && pk.two_theta >= minX && pk.two_theta <= maxX
      );

      ctx.fillStyle = '#000000';
      ctx.font = '39px "Times New Roman", Times, serif';

      visiblePeaks.forEach((pk) => {
        let bestY = topInfo.baseLineY;
        let bestX = xToPx(pk.two_theta);
        for (let i = 0; i < topInfo.xs.length; i++) {
          const tt = topInfo.xs[i];
          if (Math.abs(tt - pk.two_theta) <= 0.45) {
            const normY = (topInfo.ys[i] - topInfo.minVal) / topInfo.rangeY;
            const py = topInfo.baseLineY - normY * topInfo.peakAmpH;
            if (py < bestY) {
              bestY = py;
              bestX = xToPx(tt);
            }
          }
        }

        ctx.save();
        const textWidth = ctx.measureText(pk.hkl_str).width;
        if (bestY - textWidth - 28 < top + 12) {
          const sideX = bestX + 44;
          const sideY = Math.max(top + textWidth + 22, bestY + textWidth * 0.65);
          ctx.translate(sideX, sideY);
          ctx.rotate(-Math.PI / 2);
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(pk.hkl_str, 0, 0);
        } else {
          ctx.translate(bestX, bestY - 22);
          ctx.rotate(-Math.PI / 2);
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(pk.hkl_str, 0, 0);
        }
        ctx.restore();
      });
    }
  }

  drawPublicationAxes(ctx, left, right, top, bottom, minX, maxX);
}

function drawFormattedTraceLabel(ctx, text, x, y, color = '#000000') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.textBaseline = 'alphabetic';

  const m = text.match(/^([a-zA-Z])\s*=\s*(.*)$/);
  if (m) {
    const varChar = m[1];
    const rest = ` = ${m[2]}`;
    ctx.font = 'italic 44px "Times New Roman", Times, serif';
    ctx.fillText(varChar, x, y);
    const varW = ctx.measureText(varChar).width;
    ctx.font = '44px "Times New Roman", Times, serif';
    ctx.fillText(rest, x + varW, y);
  } else {
    ctx.font = '42px "Times New Roman", Times, serif';
    ctx.fillText(text, x, y);
  }
  ctx.restore();
}

function drawPublicationAxes(ctx, left, right, top, bottom, minX, maxX) {
  const plotW = right - left;
  const plotH = bottom - top;
  const spanX = Math.max(maxX - minX, 1);
  const xToPx = (tt) => left + ((tt - minX) / spanX) * plotW;

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4.2;
  ctx.strokeRect(left, top, plotW, plotH);

  const majorStep = spanX <= 30 ? 5 : 10;
  const minorStep = majorStep / 2;

  ctx.fillStyle = '#000000';
  ctx.font = '44px "Times New Roman", Times, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  const startTick = Math.ceil(minX / minorStep) * minorStep;
  for (let t = startTick; t <= maxX + 1e-6; t += minorStep) {
    const px = xToPx(t);
    const isMajor = Math.abs(t % majorStep) < 1e-4 || Math.abs((t % majorStep) - majorStep) < 1e-4;
    ctx.beginPath();
    ctx.moveTo(px, bottom);
    ctx.lineTo(px, bottom + (isMajor ? 22 : 12));
    ctx.stroke();

    if (isMajor) {
      ctx.fillText(String(Math.round(t)), px, bottom + 28);
    }
  }

  const centerX = (left + right) / 2;
  const labelY = bottom + 108;
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = '48px "Times New Roman", Times, serif';
  const w2 = ctx.measureText('2').width;
  ctx.font = 'italic 48px "Times New Roman", Times, serif';
  const wTheta = ctx.measureText('θ').width;
  ctx.font = '48px "Times New Roman", Times, serif';
  const wDeg = ctx.measureText(' (degree)').width;
  const totalW = w2 + wTheta + wDeg;
  let curX = centerX - totalW / 2;

  ctx.font = '48px "Times New Roman", Times, serif';
  ctx.fillText('2', curX, labelY + 34);
  curX += w2;
  ctx.font = 'italic 48px "Times New Roman", Times, serif';
  ctx.fillText('θ', curX, labelY + 34);
  curX += wTheta;
  ctx.font = '48px "Times New Roman", Times, serif';
  ctx.fillText(' (degree)', curX, labelY + 34);
  ctx.restore();

  ctx.save();
  ctx.translate(72, (top + bottom) / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.font = '48px "Times New Roman", Times, serif';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Intensity (a.u.)', 0, 0);
  ctx.restore();
}

function drawRietveldPlot(ctx, W, H) {
  const r = state.rietveld;
  const left = 165;
  const right = 1735;
  const top = 65;
  const bottom = 1365;
  const plotW = right - left;
  const plotH = bottom - top;

  const minX = state.min2Theta;
  const maxX = state.max2Theta;
  const spanX = Math.max(maxX - minX, 1);
  const xToPx = (tt) => left + ((tt - minX) / spanX) * plotW;

  const xs = r.two_theta;
  const yObs = r.y_obs;
  const yCalc = r.y_calc;
  const yDiff = r.y_diff;

  let maxY = 1;
  let maxDiff = 1;
  for (let i = 0; i < xs.length; i++) {
    if (xs[i] >= minX && xs[i] <= maxX) {
      if (yObs[i] > maxY) maxY = yObs[i];
      if (yCalc[i] > maxY) maxY = yCalc[i];
      if (Math.abs(yDiff[i]) > maxDiff) maxDiff = Math.abs(yDiff[i]);
    }
  }

  const mainBaseY = bottom - 310;
  const mainHeight = mainBaseY - (top + 140);
  const diffZeroY = bottom - 115;
  const diffScale = 85 / Math.max(maxDiff, 1);

  ctx.save();
  ctx.beginPath();
  ctx.rect(left, top, plotW, plotH);
  ctx.clip();

  ctx.fillStyle = '#18241E';
  for (let i = 0; i < xs.length; i += 2) {
    const tt = xs[i];
    if (tt < minX || tt > maxX) continue;
    const px = xToPx(tt);
    const py = mainBaseY - (yObs[i] / maxY) * mainHeight;
    ctx.beginPath();
    ctx.arc(px, py, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = '#C21E56';
  ctx.lineWidth = 4.0;
  ctx.beginPath();
  let started = false;
  for (let i = 0; i < xs.length; i++) {
    const tt = xs[i];
    if (tt < minX || tt > maxX) continue;
    const px = xToPx(tt);
    const py = mainBaseY - (yCalc[i] / maxY) * mainHeight;
    if (!started) {
      ctx.moveTo(px, py);
      started = true;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  const tickTop = mainBaseY + 28;
  const tickBot = mainBaseY + 68;
  ctx.strokeStyle = '#006b1b';
  ctx.lineWidth = 3.5;
  (r.bragg_ticks || []).forEach((tk) => {
    if (tk.two_theta >= minX && tk.two_theta <= maxX) {
      const px = xToPx(tk.two_theta);
      ctx.beginPath();
      ctx.moveTo(px, tickTop);
      ctx.lineTo(px, tickBot);
      ctx.stroke();
    }
  });

  ctx.strokeStyle = '#0018c4';
  ctx.lineWidth = 3.0;
  ctx.beginPath();
  started = false;
  for (let i = 0; i < xs.length; i++) {
    const tt = xs[i];
    if (tt < minX || tt > maxX) continue;
    const px = xToPx(tt);
    const py = diffZeroY - yDiff[i] * diffScale;
    if (!started) {
      ctx.moveTo(px, py);
      started = true;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  if (state.showHkl && r.bragg_ticks) {
    ctx.fillStyle = '#000000';
    ctx.font = '36px "Times New Roman", Times, serif';
    r.bragg_ticks
      .filter((t) => t.intensity >= 8 && t.two_theta >= minX && t.two_theta <= maxX)
      .forEach((tk) => {
        const px = xToPx(tk.two_theta);
        let apexY = mainBaseY;
        for (let i = 0; i < xs.length; i++) {
          if (Math.abs(xs[i] - tk.two_theta) <= 0.35) {
            const py = mainBaseY - (yCalc[i] / maxY) * mainHeight;
            if (py < apexY) apexY = py;
          }
        }
        ctx.save();
        ctx.translate(px, Math.max(top + 115, apexY - 18));
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(tk.hkl_str, 0, 0);
        ctx.restore();
      });
  }

  ctx.restore();

  ctx.fillStyle = '#000000';
  ctx.font = '38px "Times New Roman", Times, serif';
  ctx.textAlign = 'left';
  ctx.fillText(`${r.phase_name} (${r.phase_id})`, left + 36, top + 64);
  ctx.font = '34px "Times New Roman", Times, serif';
  ctx.fillText(
    `Rwp = ${r.metrics.rwp.toFixed(2)}%   Rp = ${r.metrics.rp.toFixed(2)}%   χ² = ${r.metrics.chi2.toFixed(2)}`,
    left + 36,
    top + 112
  );
  ctx.fillText(
    `a = ${r.metrics.a.toFixed(4)} Å   c = ${r.metrics.c.toFixed(4)} Å   D = ${r.metrics.crystallite_nm.toFixed(1)} nm`,
    left + 36,
    top + 156
  );

  drawPublicationAxes(ctx, left, right, top, bottom, minX, maxX);
}

/* =========================================================================
   TRUE 300 DPI PNG EXPORT (Embeds binary PNG pHYs chunk = 11811 px/meter)
   ========================================================================= */
function download300DpiPng() {
  renderGraph();
  const canvas = document.getElementById('xrdCanvas');
  const dataUrl = canvas.toDataURL('image/png');
  const rawBytes = base64ToUint8Array(dataUrl.split(',')[1]);
  const png300Bytes = injectPngPhys300Dpi(rawBytes);

  const blob = new Blob([png300Bytes], { type: 'image/png' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const refTag = state.activeReference ? state.activeReference.id : 'XRD';
  a.href = url;
  a.download = `XRD_${refTag}_300DPI.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function base64ToUint8Array(base64) {
  const bin = atob(base64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

function injectPngPhys300Dpi(pngBytes) {
  const ppm = 11811;
  const physChunk = new Uint8Array(21);
  const view = new DataView(physChunk.buffer);

  view.setUint32(0, 9, false);
  physChunk[4] = 0x70;
  physChunk[5] = 0x48;
  physChunk[6] = 0x59;
  physChunk[7] = 0x73;
  view.setUint32(8, ppm, false);
  view.setUint32(12, ppm, false);
  physChunk[16] = 1;

  const crc = crc32(physChunk.subarray(4, 17));
  view.setUint32(17, crc, false);

  const insertPos = 33;
  const out = new Uint8Array(pngBytes.length + physChunk.length);
  out.set(pngBytes.subarray(0, insertPos), 0);
  out.set(physChunk, insertPos);
  out.set(pngBytes.subarray(insertPos), insertPos + physChunk.length);
  return out;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}
