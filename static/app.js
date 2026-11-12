/* ============================================================================
   DIFFRACTA — Interactive Single-Pattern XRD, Rietveld & Publication Report
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

function createDefaultRestraints() {
  return {
    composition: {
      and_elements: [],
      or_elements: [],
      not_elements: [],
      only_elements: [],
      just_elements: [],
      min_elements: null,
      max_elements: null
    },
    subfiles: {
      selected: [],
      mode: 'or'
    },
    chemical_name: {
      query: '',
      mode: 'contains'
    },
    entries: {
      ids_text: '',
      min_num: null,
      max_num: null
    },
    symmetry: {
      systems: [],
      space_group: ''
    },
    cell: {
      a_min: null, a_max: null,
      b_min: null, b_max: null,
      c_min: null, c_max: null,
      alpha_min: null, alpha_max: null,
      beta_min: null, beta_max: null,
      gamma_min: null, gamma_max: null,
      vol_min: null, vol_max: null,
      density_min: null, density_max: null
    }
  };
}

const state = {
  pattern: null,           // Single active XRD pattern { filename, label, two_theta, intensity, color }
  localDb: [],
  dbResults: [],
  activeReference: null,
  indexed: { system: 'Hexagonal', cell: { a: 3.2498, b: 3.2498, c: 5.2066 }, peaks: [] },
  rietveld: null,
  viewMode: 'pattern',     // 'pattern' | 'rietveld'
  manualMode: true,        // Interactive Manual Edit Mode for Axis Labels, Legend, & Miller Indices
  showHkl: true,
  dbSource: 'all',
  min2Theta: 20,
  max2Theta: 70,
  useThemeColor: false,
  backendAvailable: false,
  desktopDir: '',
  sqIndex: {
    rawPath: '',
    files: [],
    totalCards: 0,
    clientPhases: []
  },
  compLogicMode: 'and',
  restraints: createDefaultRestraints(),
  labels: {
    xAxis: '2θ (degree)',
    yAxis: 'Intensity (a.u.)',
    legend: 'ZnO',
    refTag: 'JCPDS No. | 036-1451',
    legendOffset: { dx: 0, dy: 0 },
    refOffset: { dx: 0, dy: 0 }
  },
  hitBoxes: [],            // Registered interactive canvas elements for click/drag/hover
  hoveredBox: null,
  draggingItem: null,
  panningRange: null,
  editingTarget: null,
  cursor2Theta: null,
  cursorIntensity: null,
  highlightedPeakIdx: -1
};

let rafRenderPending = false;

function scheduleRenderGraph() {
  if (rafRenderPending) return;
  rafRenderPending = true;
  window.requestAnimationFrame(() => {
    rafRenderPending = false;
    renderGraph();
  });
}

function escapeHtml(val) {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showToast(message, kind = 'info', durationMs = 2800) {
  const container = document.getElementById('toastContainer');
  if (!container || !message) return;
  const el = document.createElement('div');
  el.className = `toast ${kind === 'ok' ? 'toast-ok' : kind === 'err' ? 'toast-err' : ''}`;
  el.textContent = message;
  container.appendChild(el);
  window.setTimeout(() => {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, durationMs);
}

function lowerBound(arr, target) {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function upperBound(arr, target) {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid] <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

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

function synthesizeSinglePreset(presetName) {
  const localDb = loadLocalDatabaseClient();
  const presetMap = {
    zno: { pid: '036-1451', minX: 20, maxX: 70, label: 'ZnO', fwhm: 0.23, seed: 42 },
    tio2: { pid: '021-1272', minX: 20, maxX: 75, label: 'TiO₂ Anatase', fwhm: 0.24, seed: 55 },
    silicon: { pid: '027-1402', minX: 20, maxX: 80, label: 'Si NIST 640d', fwhm: 0.22, seed: 77 },
    batio3: { pid: '005-0626', minX: 20, maxX: 70, label: 'BaTiO₃', fwhm: 0.24, seed: 31 },
    al2o3: { pid: '046-1212', minX: 20, maxX: 75, label: 'α-Al₂O₃', fwhm: 0.23, seed: 91 }
  };

  const cfg = presetMap[presetName] || presetMap.zno;
  const ref = localDb.find((p) => p.id === cfg.pid) || localDb[0];
  const nPts = 2001;
  const step = (cfg.maxX - cfg.minX) / (nPts - 1);
  const rand = seededRandom(cfg.seed);

  const two_theta = new Array(nPts);
  const intensity = new Array(nPts);

  for (let i = 0; i < nPts; i++) {
    const tt = cfg.minX + i * step;
    two_theta[i] = Number(tt.toFixed(4));
    let y = 85.0 + 12.0 * Math.exp(-(tt - cfg.minX) / 35.0);
    for (const pk of ref.peaks) {
      if (Math.abs(tt - pk.two_theta) <= 2.6) {
        const thRad = (pk.two_theta / 2.0) * (Math.PI / 180.0);
        const fwhm = Math.sqrt(0.012 * Math.pow(Math.tan(thRad), 2) + 0.002 * Math.tan(thRad) + cfg.fwhm * cfg.fwhm);
        y += pseudoVoigtScalar(tt, pk.two_theta, pk.intensity * 18.0, fwhm, 0.58);
      }
    }
    const u1 = Math.max(rand(), 1e-7);
    const u2 = rand();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    y = Math.max(10.0, y + z * Math.sqrt(y) * 0.95);
    intensity[i] = Number(y.toFixed(2));
  }

  const pattern = {
    filename: `${cfg.label}.xy`,
    label: cfg.label,
    two_theta,
    intensity,
    min_2theta: cfg.minX,
    max_2theta: cfg.maxX,
    num_points: nPts,
    color: state.useThemeColor ? '#C21E56' : '#e60000'
  };

  return { pattern, ref, localDb };
}

const PERIODIC_TABLE_ELEMENTS = [
  // Period 1 (grid row 2)
  { z: 1, sym: 'H', disp: 'H', row: 2, col: 2, grp: 'IA', per: '1', cat: 'nonmetal' },
  { z: 2, sym: 'He', disp: 'He', row: 2, col: 19, grp: 'VIII', per: '1', cat: 'noble' },
  // Period 2 (grid row 3)
  { z: 3, sym: 'Li', disp: 'Li', row: 3, col: 2, grp: 'IA', per: '2', cat: 'alkali' },
  { z: 4, sym: 'Be', disp: 'Be', row: 3, col: 3, grp: 'IIA', per: '2', cat: 'alkearth' },
  { z: 5, sym: 'B', disp: 'B', row: 3, col: 14, grp: 'IIIA', per: '2', cat: 'metalloid' },
  { z: 6, sym: 'C', disp: 'C', row: 3, col: 15, grp: 'IVA', per: '2', cat: 'nonmetal' },
  { z: 7, sym: 'N', disp: 'N', row: 3, col: 16, grp: 'VA', per: '2', cat: 'nonmetal' },
  { z: 8, sym: 'O', disp: 'O', row: 3, col: 17, grp: 'VIA', per: '2', cat: 'nonmetal' },
  { z: 9, sym: 'F', disp: 'F', row: 3, col: 18, grp: 'VIIA', per: '2', cat: 'halogen' },
  { z: 10, sym: 'Ne', disp: 'Ne', row: 3, col: 19, grp: 'VIII', per: '2', cat: 'noble' },
  // Period 3 (grid row 4)
  { z: 11, sym: 'Na', disp: 'Na', row: 4, col: 2, grp: 'IA', per: '3', cat: 'alkali' },
  { z: 12, sym: 'Mg', disp: 'Mg', row: 4, col: 3, grp: 'IIA', per: '3', cat: 'alkearth' },
  { z: 13, sym: 'Al', disp: 'Al', row: 4, col: 14, grp: 'IIIA', per: '3', cat: 'postmetal' },
  { z: 14, sym: 'Si', disp: 'Si', row: 4, col: 15, grp: 'IVA', per: '3', cat: 'metalloid' },
  { z: 15, sym: 'P', disp: 'P', row: 4, col: 16, grp: 'VA', per: '3', cat: 'nonmetal' },
  { z: 16, sym: 'S', disp: 'S', row: 4, col: 17, grp: 'VIA', per: '3', cat: 'nonmetal' },
  { z: 17, sym: 'Cl', disp: 'Cl', row: 4, col: 18, grp: 'VIIA', per: '3', cat: 'halogen' },
  { z: 18, sym: 'Ar', disp: 'Ar', row: 4, col: 19, grp: 'VIII', per: '3', cat: 'noble' },
  // Period 4 (grid row 5)
  { z: 19, sym: 'K', disp: 'K', row: 5, col: 2, grp: 'IA', per: '4', cat: 'alkali' },
  { z: 20, sym: 'Ca', disp: 'Ca', row: 5, col: 3, grp: 'IIA', per: '4', cat: 'alkearth' },
  { z: 21, sym: 'Sc', disp: 'Sc', row: 5, col: 4, grp: 'IIIB', per: '4', cat: 'trans' },
  { z: 22, sym: 'Ti', disp: 'Ti', row: 5, col: 5, grp: 'IVB', per: '4', cat: 'trans' },
  { z: 23, sym: 'V', disp: 'V', row: 5, col: 6, grp: 'VB', per: '4', cat: 'trans' },
  { z: 24, sym: 'Cr', disp: 'Cr', row: 5, col: 7, grp: 'VIB', per: '4', cat: 'trans' },
  { z: 25, sym: 'Mn', disp: 'Mn', row: 5, col: 8, grp: 'VIIB', per: '4', cat: 'trans' },
  { z: 26, sym: 'Fe', disp: 'Fe', row: 5, col: 9, grp: 'VIIIB', per: '4', cat: 'trans' },
  { z: 27, sym: 'Co', disp: 'Co', row: 5, col: 10, grp: 'VIIIB', per: '4', cat: 'trans' },
  { z: 28, sym: 'Ni', disp: 'Ni', row: 5, col: 11, grp: 'VIIIB', per: '4', cat: 'trans' },
  { z: 29, sym: 'Cu', disp: 'Cu', row: 5, col: 12, grp: 'IB', per: '4', cat: 'trans' },
  { z: 30, sym: 'Zn', disp: 'Zn', row: 5, col: 13, grp: 'IIB', per: '4', cat: 'trans' },
  { z: 31, sym: 'Ga', disp: 'Ga', row: 5, col: 14, grp: 'IIIA', per: '4', cat: 'postmetal' },
  { z: 32, sym: 'Ge', disp: 'Ge', row: 5, col: 15, grp: 'IVA', per: '4', cat: 'metalloid' },
  { z: 33, sym: 'As', disp: 'As', row: 5, col: 16, grp: 'VA', per: '4', cat: 'metalloid' },
  { z: 34, sym: 'Se', disp: 'Se', row: 5, col: 17, grp: 'VIA', per: '4', cat: 'nonmetal' },
  { z: 35, sym: 'Br', disp: 'Br', row: 5, col: 18, grp: 'VIIA', per: '4', cat: 'halogen' },
  { z: 36, sym: 'Kr', disp: 'Kr', row: 5, col: 19, grp: 'VIII', per: '4', cat: 'noble' },
  // Period 5 (grid row 6)
  { z: 37, sym: 'Rb', disp: 'Rb', row: 6, col: 2, grp: 'IA', per: '5', cat: 'alkali' },
  { z: 38, sym: 'Sr', disp: 'Sr', row: 6, col: 3, grp: 'IIA', per: '5', cat: 'alkearth' },
  { z: 39, sym: 'Y', disp: 'Y', row: 6, col: 4, grp: 'IIIB', per: '5', cat: 'trans' },
  { z: 40, sym: 'Zr', disp: 'Zr', row: 6, col: 5, grp: 'IVB', per: '5', cat: 'trans' },
  { z: 41, sym: 'Nb', disp: 'Nb', row: 6, col: 6, grp: 'VB', per: '5', cat: 'trans' },
  { z: 42, sym: 'Mo', disp: 'Mo', row: 6, col: 7, grp: 'VIB', per: '5', cat: 'trans' },
  { z: 43, sym: 'Tc', disp: 'Tc', row: 6, col: 8, grp: 'VIIB', per: '5', cat: 'trans' },
  { z: 44, sym: 'Ru', disp: 'Ru', row: 6, col: 9, grp: 'VIIIB', per: '5', cat: 'trans' },
  { z: 45, sym: 'Rh', disp: 'Rh', row: 6, col: 10, grp: 'VIIIB', per: '5', cat: 'trans' },
  { z: 46, sym: 'Pd', disp: 'Pd', row: 6, col: 11, grp: 'VIIIB', per: '5', cat: 'trans' },
  { z: 47, sym: 'Ag', disp: 'Ag', row: 6, col: 12, grp: 'IB', per: '5', cat: 'trans' },
  { z: 48, sym: 'Cd', disp: 'Cd', row: 6, col: 13, grp: 'IIB', per: '5', cat: 'trans' },
  { z: 49, sym: 'In', disp: 'In', row: 6, col: 14, grp: 'IIIA', per: '5', cat: 'postmetal' },
  { z: 50, sym: 'Sn', disp: 'Sn', row: 6, col: 15, grp: 'IVA', per: '5', cat: 'postmetal' },
  { z: 51, sym: 'Sb', disp: 'Sb', row: 6, col: 16, grp: 'VA', per: '5', cat: 'metalloid' },
  { z: 52, sym: 'Te', disp: 'Te', row: 6, col: 17, grp: 'VIA', per: '5', cat: 'metalloid' },
  { z: 53, sym: 'I', disp: 'I', row: 6, col: 18, grp: 'VIIA', per: '5', cat: 'halogen' },
  { z: 54, sym: 'Xe', disp: 'Xe', row: 6, col: 19, grp: 'VIII', per: '5', cat: 'noble' },
  // Period 6 (grid row 7)
  { z: 55, sym: 'Cs', disp: 'Cs', row: 7, col: 2, grp: 'IA', per: '6', cat: 'alkali' },
  { z: 56, sym: 'Ba', disp: 'Ba', row: 7, col: 3, grp: 'IIA', per: '6', cat: 'alkearth' },
  { z: 72, sym: 'Hf', disp: 'Hf', row: 7, col: 5, grp: 'IVB', per: '6', cat: 'trans' },
  { z: 73, sym: 'Ta', disp: 'Ta', row: 7, col: 6, grp: 'VB', per: '6', cat: 'trans' },
  { z: 74, sym: 'W', disp: 'W', row: 7, col: 7, grp: 'VIB', per: '6', cat: 'trans' },
  { z: 75, sym: 'Re', disp: 'Re', row: 7, col: 8, grp: 'VIIB', per: '6', cat: 'trans' },
  { z: 76, sym: 'Os', disp: 'Os', row: 7, col: 9, grp: 'VIIIB', per: '6', cat: 'trans' },
  { z: 77, sym: 'Ir', disp: 'Ir', row: 7, col: 10, grp: 'VIIIB', per: '6', cat: 'trans' },
  { z: 78, sym: 'Pt', disp: 'Pt', row: 7, col: 11, grp: 'VIIIB', per: '6', cat: 'trans' },
  { z: 79, sym: 'Au', disp: 'Au', row: 7, col: 12, grp: 'IB', per: '6', cat: 'trans' },
  { z: 80, sym: 'Hg', disp: 'Hg', row: 7, col: 13, grp: 'IIB', per: '6', cat: 'trans' },
  { z: 81, sym: 'Tl', disp: 'Tl', row: 7, col: 14, grp: 'IIIA', per: '6', cat: 'postmetal' },
  { z: 82, sym: 'Pb', disp: 'Pb', row: 7, col: 15, grp: 'IVA', per: '6', cat: 'postmetal' },
  { z: 83, sym: 'Bi', disp: 'Bi', row: 7, col: 16, grp: 'VA', per: '6', cat: 'postmetal' },
  { z: 84, sym: 'Po', disp: 'Po', row: 7, col: 17, grp: 'VIA', per: '6', cat: 'metalloid' },
  { z: 85, sym: 'At', disp: 'At', row: 7, col: 18, grp: 'VIIA', per: '6', cat: 'halogen' },
  { z: 86, sym: 'Rn', disp: 'Rn', row: 7, col: 19, grp: 'VIII', per: '6', cat: 'noble' },
  // Period 7 (grid row 8)
  { z: 87, sym: 'Fr', disp: 'Fr', row: 8, col: 2, grp: 'IA', per: '7', cat: 'alkali' },
  { z: 88, sym: 'Ra', disp: 'Ra', row: 8, col: 3, grp: 'IIA', per: '7', cat: 'alkearth' },
  // Lanthanides LN (grid row 9, cols 4..18)
  { z: 57, sym: 'La', disp: '*La', row: 9, col: 4, grp: 'IIIB', per: 'LN', cat: 'lanth' },
  { z: 58, sym: 'Ce', disp: 'Ce', row: 9, col: 5, grp: '', per: 'LN', cat: 'lanth' },
  { z: 59, sym: 'Pr', disp: 'Pr', row: 9, col: 6, grp: '', per: 'LN', cat: 'lanth' },
  { z: 60, sym: 'Nd', disp: 'Nd', row: 9, col: 7, grp: '', per: 'LN', cat: 'lanth' },
  { z: 61, sym: 'Pm', disp: 'Pm', row: 9, col: 8, grp: '', per: 'LN', cat: 'lanth' },
  { z: 62, sym: 'Sm', disp: 'Sm', row: 9, col: 9, grp: '', per: 'LN', cat: 'lanth' },
  { z: 63, sym: 'Eu', disp: 'Eu', row: 9, col: 10, grp: '', per: 'LN', cat: 'lanth' },
  { z: 64, sym: 'Gd', disp: 'Gd', row: 9, col: 11, grp: '', per: 'LN', cat: 'lanth' },
  { z: 65, sym: 'Tb', disp: 'Tb', row: 9, col: 12, grp: '', per: 'LN', cat: 'lanth' },
  { z: 66, sym: 'Dy', disp: 'Dy', row: 9, col: 13, grp: '', per: 'LN', cat: 'lanth' },
  { z: 67, sym: 'Ho', disp: 'Ho', row: 9, col: 14, grp: '', per: 'LN', cat: 'lanth' },
  { z: 68, sym: 'Er', disp: 'Er', row: 9, col: 15, grp: '', per: 'LN', cat: 'lanth' },
  { z: 69, sym: 'Tm', disp: 'Tm', row: 9, col: 16, grp: '', per: 'LN', cat: 'lanth' },
  { z: 70, sym: 'Yb', disp: 'Yb', row: 9, col: 17, grp: '', per: 'LN', cat: 'lanth' },
  { z: 71, sym: 'Lu', disp: 'Lu', row: 9, col: 18, grp: '', per: 'LN', cat: 'lanth' },
  // Actinides AC (grid row 10, cols 4..18)
  { z: 89, sym: 'Ac', disp: '+Ac', row: 10, col: 4, grp: 'IIIB', per: 'AC', cat: 'lanth' },
  { z: 90, sym: 'Th', disp: 'Th', row: 10, col: 5, grp: '', per: 'AC', cat: 'lanth' },
  { z: 91, sym: 'Pa', disp: 'Pa', row: 10, col: 6, grp: '', per: 'AC', cat: 'lanth' },
  { z: 92, sym: 'U', disp: 'U', row: 10, col: 7, grp: '', per: 'AC', cat: 'lanth' },
  { z: 93, sym: 'Np', disp: 'Np', row: 10, col: 8, grp: '', per: 'AC', cat: 'lanth' },
  { z: 94, sym: 'Pu', disp: 'Pu', row: 10, col: 9, grp: '', per: 'AC', cat: 'lanth' },
  { z: 95, sym: 'Am', disp: 'Am', row: 10, col: 10, grp: '', per: 'AC', cat: 'lanth' },
  { z: 96, sym: 'Cm', disp: 'Cm', row: 10, col: 11, grp: '', per: 'AC', cat: 'lanth' },
  { z: 97, sym: 'Bk', disp: 'Bk', row: 10, col: 12, grp: '', per: 'AC', cat: 'lanth' },
  { z: 98, sym: 'Cf', disp: 'Cf', row: 10, col: 13, grp: '', per: 'AC', cat: 'lanth' },
  { z: 99, sym: 'Es', disp: 'Es', row: 10, col: 14, grp: '', per: 'AC', cat: 'lanth' },
  { z: 100, sym: 'Fm', disp: 'Fm', row: 10, col: 15, grp: '', per: 'AC', cat: 'lanth' },
  { z: 101, sym: 'Md', disp: 'Md', row: 10, col: 16, grp: '', per: 'AC', cat: 'lanth' },
  { z: 102, sym: 'No', disp: 'No', row: 10, col: 17, grp: '', per: 'AC', cat: 'lanth' },
  { z: 103, sym: 'Lr', disp: 'Lr', row: 10, col: 18, grp: '', per: 'AC', cat: 'lanth' }
];

const VALID_ELEMENTS_SET = new Set(PERIODIC_TABLE_ELEMENTS.map((e) => e.sym));

function extractFormulaElementsClient(formula) {
  if (!formula) return [];
  const matches = String(formula).match(/[A-Z][a-z]?/g) || [];
  const out = [];
  for (const m of matches) {
    if (VALID_ELEMENTS_SET.has(m) && !out.includes(m)) out.push(m);
  }
  return out;
}

function parseFormulaStoichiometryClient(formula) {
  if (!formula) return null;
  const cleaned = String(formula).replace(/^[-\s]+|[-\s]+$/g, '').replace(/\s+/g, '');
  if (!cleaned || !/^(?:[A-Z][a-z]?\d*(?:\.\d+)?)+$/.test(cleaned)) return null;
  const counts = {};
  const re = /([A-Z][a-z]?)(\d*(?:\.\d+)?)/g;
  let m;
  while ((m = re.exec(cleaned)) !== null) {
    if (!m[1]) continue;
    if (!VALID_ELEMENTS_SET.has(m[1])) return null;
    const amt = m[2] ? parseFloat(m[2]) : 1.0;
    counts[m[1]] = Number(((counts[m[1]] || 0) + amt).toFixed(3));
  }
  const keys = Object.keys(counts);
  if (!keys.length) return null;
  const minVal = Math.min(...Object.values(counts)) || 1.0;
  const norm = {};
  for (const k of keys) norm[k] = Number((counts[k] / minVal).toFixed(2));
  return norm;
}

const AMBIGUOUS_SINGLE_ELEMENT_WORDS = new Set([
  'In', 'As', 'At', 'No', 'Be', 'He', 'Am', 'Ac', 'Pa', 'Po', 'Ra', 'Re', 'Ho', 'Ne', 'Os'
]);

function extractCleanFormulaHintClient(hint) {
  if (!hint) return '';
  const stem = String(hint).trim().replace(/\.(xy|xrdml|raw|csv|txt|dat|asc|cif)$/i, '');
  const tokens = stem.split(/[\s_,\-()[\]/\\]+/);
  for (const rawTok of tokens) {
    const cand = rawTok.trim();
    if (!cand || cand.length < 2) continue;
    const stoich = parseFormulaStoichiometryClient(cand);
    if (!stoich) continue;
    if (Object.keys(stoich).length === 1 && AMBIGUOUS_SINGLE_ELEMENT_WORDS.has(cand) && !/\d/.test(cand)) {
      continue;
    }
    return cand;
  }
  return '';
}

function getCurrentSampleHint() {
  if (!state.pattern) return '';
  return String(state.pattern.label || state.pattern.filename || '').trim();
}

function computeCellVolumeClient(cell, system = '') {
  if (!cell || !cell.a) return 0;
  const a = Number(cell.a || 0);
  const b = Number(cell.b || a);
  const c = Number(cell.c || a);
  const sysLow = String(system || '').toLowerCase();
  const alpha = ((cell.alpha || 90) * Math.PI) / 180;
  const beta = ((cell.beta || 90) * Math.PI) / 180;
  const gamma = ((cell.gamma || (sysLow === 'hexagonal' || sysLow === 'trigonal' ? 120 : 90)) * Math.PI) / 180;
  const ca = Math.cos(alpha), cb = Math.cos(beta), cg = Math.cos(gamma);
  const volSq = Math.max(0, 1 - ca * ca - cb * cb - cg * cg + 2 * ca * cb * cg);
  return Number((a * b * c * Math.sqrt(volSq)).toFixed(2));
}

function formatPdf2JcpdsClient(rawId, isPdfDb = false) {
  const s = String(rawId ?? '').trim();
  if (!s) return s;
  if (/^\d+-\d+$/.test(s)) {
    const [p1, p2] = s.split('-');
    return `${p1.padStart(3, '0')}-${p2.padStart(4, '0')}`;
  }
  if (isPdfDb && /^\d+$/.test(s)) {
    const n = parseInt(s, 10);
    if (n > 0 && n < 10000000) {
      const setNum = Math.floor(n / 10000);
      const cardNum = n % 10000;
      if (setNum >= 1 && setNum <= 999 && cardNum >= 1) {
        return `${String(setNum).padStart(3, '0')}-${String(cardNum).padStart(4, '0')}`;
      }
    }
  }
  return s;
}

function normalizeReferencePhasePeaks(phase, wavelength = 1.5406) {
  if (!phase) return [];
  const rawPeaks = Array.isArray(phase.peaks) ? phase.peaks : [];
  const normalized = [];

  for (const pk of rawPeaks) {
    if (!pk || typeof pk !== 'object') continue;
    let tt = Number(pk.two_theta ?? pk.theta2 ?? pk.tth ?? 0);
    let dVal = Number(pk.d ?? pk.d_obs ?? pk.d_calc ?? 0);
    const rawInt = Number(pk.intensity ?? pk.intens ?? pk.rel_int ?? 50);

    if ((!Number.isFinite(tt) || tt <= 0) && Number.isFinite(dVal) && dVal > 0) {
      const sinTh = wavelength / (2.0 * dVal);
      if (sinTh > 0 && sinTh < 0.998) {
        tt = (2.0 * Math.asin(sinTh) * 180.0) / Math.PI;
      }
    } else if ((!Number.isFinite(dVal) || dVal <= 0) && Number.isFinite(tt) && tt > 0 && tt < 175) {
      const sinTh = Math.sin((tt / 2.0) * (Math.PI / 180.0));
      if (sinTh > 1e-5) {
        dVal = wavelength / (2.0 * sinTh);
      }
    }

    if (!Number.isFinite(tt) || tt <= 0 || tt > 175) continue;

    let hkl = [0, 0, 0];
    if (Array.isArray(pk.hkl) && pk.hkl.length >= 3) {
      const h0 = parseInt(pk.hkl[0], 10);
      const k0 = parseInt(pk.hkl[1], 10);
      const l0 = parseInt(pk.hkl[2], 10);
      if (Number.isFinite(h0) && Number.isFinite(k0) && Number.isFinite(l0)) {
        hkl = [h0, k0, l0];
      }
    }

    normalized.push({
      two_theta: Number(tt.toFixed(3)),
      d: Number((Number.isFinite(dVal) && dVal > 0 ? dVal : 0).toFixed(4)),
      intensity: Number.isFinite(rawInt) && rawInt > 0 ? rawInt : 10.0,
      hkl
    });
  }

  if (!normalized.length && phase.cell && Number(phase.cell.a) > 0) {
    return computeDSpacingsClient(phase.system || 'Orthorhombic', phase.cell, wavelength, 5.0, 95.0, 4).slice(0, 24);
  }

  if (normalized.length) {
    let maxI = 0;
    for (const npk of normalized) {
      if (npk.intensity > maxI) maxI = npk.intensity;
    }
    if (maxI > 100.5 || (maxI > 0 && maxI < 1.0)) {
      for (const npk of normalized) {
        npk.intensity = Number(((npk.intensity / maxI) * 100.0).toFixed(1));
      }
    } else {
      for (const npk of normalized) {
        npk.intensity = Number(npk.intensity.toFixed(1));
      }
    }
    normalized.sort((a, b) => a.two_theta - b.two_theta);
  }
  return normalized;
}

function enrichPhaseClient(phase) {
  const p = { ...phase };
  const isPdfSq = Boolean(
    (p.sq_file && String(p.sq_file).toLowerCase().startsWith('pdf')) ||
    (p.source && String(p.source).toLowerCase().includes('pdf'))
  );
  if (p.id !== undefined && p.id !== null) {
    p.id = formatPdf2JcpdsClient(p.id, isPdfSq);
  }
  if (p.jcpds !== undefined && p.jcpds !== null) {
    p.jcpds = formatPdf2JcpdsClient(p.jcpds, isPdfSq);
  } else if (p.id) {
    p.jcpds = p.id;
  }
  if (!Array.isArray(p.elements) || !p.elements.length) {
    p.elements = extractFormulaElementsClient(p.formula || '');
  }
  if (!Array.isArray(p.subfiles) || !p.subfiles.length) {
    const elSet = new Set(p.elements);
    const subs = new Set();
    if (elSet.has('C') && (elSet.has('H') || elSet.has('N'))) subs.add('O');
    else subs.add('I');
    const metals = new Set(['Al', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Zr', 'Nb', 'Mo', 'Pd', 'Ag', 'Cd', 'Sn', 'W', 'Pt', 'Au', 'Pb', 'Mg', 'Si']);
    if (elSet.size > 0 && [...elSet].every((x) => metals.has(x))) subs.add('A');
    if (elSet.has('O') && elSet.size >= 2 && subs.has('I')) subs.add('C');
    const nm = String(p.name || '').toLowerCase();
    if (/zincite|anatase|rutile|corundum|quartz|magnetite|hematite|calcite|periclase|cerianite|halite|fluorite|galena|sphalerite|apatite/.test(nm)) subs.add('M');
    if (nm.includes('nist') || ['027-1402', '034-0427', '046-1212'].includes(String(p.id))) subs.add('N');
    subs.add('CP');
    p.subfiles = Array.from(subs);
  }
  if (!p.volume && p.cell && Number(p.cell.a) > 0) {
    p.volume = computeCellVolumeClient(p.cell, p.system);
  }
  p.peaks = normalizeReferencePhasePeaks(p);
  return p;
}

function hasActiveRestraints(restraints = state.restraints) {
  return countActiveRestraints(restraints) > 0;
}

function countActiveRestraints(r = state.restraints) {
  if (!r) return 0;
  let cnt = 0;
  const c = r.composition || {};
  if (
    (c.and_elements && c.and_elements.length) ||
    (c.or_elements && c.or_elements.length) ||
    (c.not_elements && c.not_elements.length) ||
    (c.only_elements && c.only_elements.length) ||
    (c.just_elements && c.just_elements.length) ||
    c.min_elements !== null ||
    c.max_elements !== null
  ) cnt++;
  if (r.subfiles && r.subfiles.selected && r.subfiles.selected.length) cnt++;
  if (r.chemical_name && r.chemical_name.query && r.chemical_name.query.trim()) cnt++;
  if (r.entries && ((r.entries.ids_text && r.entries.ids_text.trim()) || r.entries.min_num !== null || r.entries.max_num !== null)) cnt++;
  if (r.symmetry && ((r.symmetry.systems && r.symmetry.systems.length) || (r.symmetry.space_group && r.symmetry.space_group.trim()))) cnt++;
  if (r.cell && Object.values(r.cell).some((v) => v !== null && v !== '' && v !== undefined)) cnt++;
  return cnt;
}

function filterPhasesByRestraintsClient(phases, restraints = state.restraints, query = '') {
  const qLow = (query || '').trim().toLowerCase();
  const comp = (restraints && restraints.composition) || {};
  const andSet = new Set(comp.and_elements || []);
  const orSet = new Set(comp.or_elements || []);
  const notSet = new Set(comp.not_elements || []);
  const onlySet = new Set(comp.only_elements || []);
  const justSet = new Set(comp.just_elements || []);
  const minEl = comp.min_elements !== '' && comp.min_elements !== null && comp.min_elements !== undefined ? Number(comp.min_elements) : null;
  const maxEl = comp.max_elements !== '' && comp.max_elements !== null && comp.max_elements !== undefined ? Number(comp.max_elements) : null;

  const subCfg = (restraints && restraints.subfiles) || {};
  const selSubs = new Set((subCfg.selected || []).map((s) => String(s).toUpperCase()));
  const subMode = (subCfg.mode || 'or').toLowerCase();

  const cnameCfg = (restraints && restraints.chemical_name) || {};
  const cnameQ = String(cnameCfg.query || '').trim().toLowerCase();
  const cnameMode = (cnameCfg.mode || 'contains').toLowerCase();

  const entCfg = (restraints && restraints.entries) || {};
  const idTokens = String(entCfg.ids_text || '').split(/[,;\s]+/).map((s) => s.trim().toLowerCase()).filter(Boolean);
  const entMin = entCfg.min_num !== '' && entCfg.min_num !== null && entCfg.min_num !== undefined ? Number(entCfg.min_num) : null;
  const entMax = entCfg.max_num !== '' && entCfg.max_num !== null && entCfg.max_num !== undefined ? Number(entCfg.max_num) : null;

  const symCfg = (restraints && restraints.symmetry) || {};
  const symSystems = new Set((symCfg.systems || []).map((s) => String(s).toLowerCase()));
  const sgQ = String(symCfg.space_group || '').replace(/\s+/g, '').toLowerCase();

  const cellCfg = (restraints && restraints.cell) || {};
  const inBounds = (val, lo, hi) => {
    if (lo !== null && lo !== '' && lo !== undefined) {
      if (val === null || val === undefined || Number(val) < Number(lo)) return false;
    }
    if (hi !== null && hi !== '' && hi !== undefined) {
      if (val === null || val === undefined || Number(val) > Number(hi)) return false;
    }
    return true;
  };

  const qStoich = qLow ? parseFormulaStoichiometryClient(query) : null;
  const stoichEqual = (a, b) => {
    if (!a || !b) return false;
    const ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    return ka.every((k) => b[k] !== undefined && Math.abs(a[k] - b[k]) < 0.03);
  };

  const out = [];
  for (const raw of phases) {
    const p = enrichPhaseClient(raw);

    if (qLow) {
      const hay = `${p.name || ''} ${p.formula || ''} ${String(p.formula || '').replace(/\s+/g, '')} ${p.id || ''} ${p.jcpds || ''} ${p.cod_id || ''}`.toLowerCase();
      let matchedText = hay.includes(qLow);
      if (!matchedText && qStoich) {
        const pStoich = parseFormulaStoichiometryClient(p.formula || '');
        if (stoichEqual(qStoich, pStoich)) matchedText = true;
      }
      if (!matchedText) continue;
    }

    const pEls = new Set(p.elements || []);
    if (andSet.size && ![...andSet].every((e) => pEls.has(e))) continue;
    if (orSet.size && ![...orSet].some((e) => pEls.has(e))) continue;
    if (notSet.size && [...notSet].some((e) => pEls.has(e))) continue;
    if (onlySet.size && (!pEls.size || ![...pEls].every((e) => onlySet.has(e)))) continue;
    if (justSet.size && (pEls.size !== justSet.size || ![...justSet].every((e) => pEls.has(e)))) continue;
    if (minEl !== null && pEls.size < minEl) continue;
    if (maxEl !== null && pEls.size > maxEl) continue;

    if (selSubs.size) {
      const pSubs = new Set((p.subfiles || []).map((s) => String(s).toUpperCase()));
      if (subMode === 'and' && ![...selSubs].every((s) => pSubs.has(s))) continue;
      if (subMode === 'not' && [...selSubs].some((s) => pSubs.has(s))) continue;
      if (subMode !== 'and' && subMode !== 'not' && ![...selSubs].some((s) => pSubs.has(s))) continue;
    }

    if (cnameQ) {
      const nm = String(p.name || '').toLowerCase();
      const fm = String(p.formula || '').toLowerCase();
      if (cnameMode === 'exact' && nm !== cnameQ && fm !== cnameQ) continue;
      if (cnameMode === 'starts_with' && !nm.startsWith(cnameQ) && !fm.startsWith(cnameQ)) continue;
      if (cnameMode === 'exclude' && (nm.includes(cnameQ) || fm.includes(cnameQ))) continue;
      if (cnameMode === 'contains' && !nm.includes(cnameQ) && !fm.includes(cnameQ)) continue;
    }

    if (idTokens.length) {
      const cids = [String(p.id || '').toLowerCase(), String(p.jcpds || '').toLowerCase(), String(p.cod_id || '').toLowerCase()].filter(Boolean);
      const matchedId = idTokens.some((tok) => {
        if (tok.includes('*')) {
          const rx = new RegExp('^' + tok.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
          return cids.some((c) => rx.test(c));
        }
        return cids.some((c) => c.includes(tok));
      });
      if (!matchedId) continue;
    }

    if (entMin !== null || entMax !== null) {
      const digits = String(p.id || '').replace(/\D/g, '');
      const numId = digits ? parseInt(digits, 10) : null;
      if (!inBounds(numId, entMin, entMax)) continue;
    }

    if (symSystems.size && !symSystems.has(String(p.system || '').toLowerCase())) continue;
    if (sgQ && !String(p.space_group || '').replace(/\s+/g, '').toLowerCase().includes(sgQ)) continue;

    const cell = p.cell || {};
    if (!inBounds(cell.a, cellCfg.a_min, cellCfg.a_max)) continue;
    if (!inBounds(cell.b ?? cell.a, cellCfg.b_min, cellCfg.b_max)) continue;
    if (!inBounds(cell.c ?? cell.a, cellCfg.c_min, cellCfg.c_max)) continue;
    if (!inBounds(cell.alpha ?? 90, cellCfg.alpha_min, cellCfg.alpha_max)) continue;
    if (!inBounds(cell.beta ?? 90, cellCfg.beta_min, cellCfg.beta_max)) continue;
    if (!inBounds(cell.gamma ?? 90, cellCfg.gamma_min, cellCfg.gamma_max)) continue;
    if (!inBounds(p.volume, cellCfg.vol_min, cellCfg.vol_max)) continue;
    if (!inBounds(p.density, cellCfg.density_min, cellCfg.density_max)) continue;

    out.push(p);
  }
  return out;
}

function loadCustomLocalStoragePhasesClient() {
  const customRaw = localStorage.getItem('diffracta_custom_db');
  if (!customRaw) return [];
  try {
    const parsed = JSON.parse(customRaw);
    const list = Array.isArray(parsed) ? parsed : [parsed];
    return list.filter(Boolean).map((p) => enrichPhaseClient(p));
  } catch (_) {
    return [];
  }
}

function loadLocalDatabaseClient() {
  const customList = loadCustomLocalStoragePhasesClient();
  const map = new Map();
  SEED_PHASES.forEach((p) => map.set(p.id, enrichPhaseClient(p)));
  customList.forEach((p) => map.set(p.id, p));
  (state.sqIndex.clientPhases || []).forEach((p) => map.set(p.id, enrichPhaseClient(p)));
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
  const gamma = (((cell.gamma || (sysLow === 'hexagonal' || sysLow === 'trigonal' ? 120.0 : 90.0))) * Math.PI) / 180.0;

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
  if (!pairs.length) throw new Error(`Could not parse numeric data from ${filename}`);
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
    // Estimate local FWHM
    const halfMax = net[idx] * 0.5;
    let leftIdx = idx, rightIdx = idx;
    while (leftIdx > 0 && net[leftIdx] > halfMax) leftIdx--;
    while (rightIdx < n - 1 && net[rightIdx] > halfMax) rightIdx++;
    const fwhm = Math.max(0.08, twoTheta[rightIdx] - twoTheta[leftIdx]);

    return {
      two_theta: Number(tt.toFixed(3)),
      intensity_raw: Number(intensity[idx].toFixed(2)),
      intensity: Number(((net[idx] / maxNet) * 100.0).toFixed(1)),
      d: Number(d.toFixed(4)),
      fwhm: Number(fwhm.toFixed(3))
    };
  });
}

function getIdentifiedPeaksForSearchMatch() {
  if (state.indexed && Array.isArray(state.indexed.peaks) && state.indexed.peaks.length > 0) {
    return state.indexed.peaks.map((pk) => ({
      two_theta: Number(pk.two_theta),
      intensity: Number(pk.intensity ?? 50),
      d: Number(pk.d_obs ?? pk.d ?? 0)
    }));
  }
  if (!state.pattern) return [];
  return detectPeaksClient(state.pattern.two_theta, state.pattern.intensity, 5.0);
}

function searchMatchClient(
  twoTheta,
  intensity,
  toleranceDeg = 0.45,
  extraPhases = [],
  identifiedPeaks = null,
  restraints = null,
  query = '',
  source = 'all'
) {
  const expPeaks = identifiedPeaks && identifiedPeaks.length
    ? identifiedPeaks
    : detectPeaksClient(twoTheta, intensity, 5.0);
  if (!expPeaks.length) return [];
  const tMin = twoTheta[0];
  const tMax = twoTheta[twoTheta.length - 1];

  const poolMap = new Map();
  if (source === 'local' || source === 'all' || source === 'sq') {
    loadLocalDatabaseClient().forEach((p) => poolMap.set(p.id, p));
  }
  (extraPhases || []).forEach((p) => {
    const s = String(p.source || '').toLowerCase();
    if (source === 'local' && !(s.includes('local') || s.includes('.sq'))) return;
    if (source === 'cod' && !s.includes('cod')) return;
    if (source === 'optimade' && !(s.includes('optimade') || s.includes('materials cloud') || s.includes('rruff'))) return;
    poolMap.set(p.id, enrichPhaseClient(p));
  });

  let candidates = Array.from(poolMap.values());
  if ((restraints && hasActiveRestraints(restraints)) || (query && query.trim())) {
    candidates = filterPhasesByRestraintsClient(candidates, restraints, query);
  }

  const totalExpWeight = expPeaks.reduce((acc, ep) => acc + Math.max(Number(ep.intensity || 10), 5), 0) || 1.0;

  const ranked = [];
  for (const phase of candidates) {
    const refInRange = (phase.peaks || []).filter((p) => p.two_theta >= tMin - 0.5 && p.two_theta <= tMax + 0.5);
    if (!refInRange.length) continue;

    let matchedRefWeight = 0;
    let totalRefWeight = 0;
    let matchedCount = 0;
    for (const rp of refInRange) {
      totalRefWeight += rp.intensity || 10;
      let bestDiff = 999;
      let bestEp = null;
      for (const ep of expPeaks) {
        const diff = Math.abs(ep.two_theta - rp.two_theta);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestEp = ep;
        }
      }
      if (bestDiff <= toleranceDeg && bestEp) {
        matchedCount++;
        const prox = 1.0 - 0.30 * (bestDiff / toleranceDeg);
        const intSim = 1.0 - 0.15 * (Math.abs((bestEp.intensity || 50) - (rp.intensity || 50)) / 100.0);
        matchedRefWeight += (rp.intensity || 10) * Math.max(0.2, prox * intSim);
      }
    }

    if (matchedCount > 0 && totalRefWeight > 0) {
      let matchedExpWeight = 0;
      let matchedExpCount = 0;
      for (const ep of expPeaks) {
        let bestRpDiff = 999;
        for (const rp of refInRange) {
          const d = Math.abs(ep.two_theta - rp.two_theta);
          if (d < bestRpDiff) bestRpDiff = d;
        }
        if (bestRpDiff <= toleranceDeg) {
          matchedExpCount++;
          matchedExpWeight += Math.max(Number(ep.intensity || 10), 5) * (1.0 - 0.25 * (bestRpDiff / toleranceDeg));
        }
      }

      const refScore = (matchedRefWeight / totalRefWeight) * 100.0;
      const expScore = (matchedExpWeight / totalExpWeight) * 100.0;
      const fom = 0.68 * refScore + 0.32 * expScore;

      ranked.push({
        ...phase,
        fom: Number(Math.min(100, fom).toFixed(1)),
        matched_peaks: matchedCount,
        total_ref_peaks: refInRange.length,
        matched_exp_peaks: matchedExpCount,
        total_exp_peaks: expPeaks.length
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
  let calcCellPeaks = null;
  const needsCellFallback = refPeaks.some(
    (rp) => !Array.isArray(rp.hkl) || (rp.hkl[0] === 0 && rp.hkl[1] === 0 && rp.hkl[2] === 0)
  );
  if (needsCellFallback && usedCell && Number(usedCell.a) > 0) {
    try {
      calcCellPeaks = computeDSpacingsClient(usedSys, usedCell, 1.5406, twoTheta[0], twoTheta[twoTheta.length - 1], 4);
    } catch (_) {
      calcCellPeaks = null;
    }
  }

  for (const ep of byInt) {
    const cands = refPeaks.filter((rp) => Math.abs(rp.two_theta - ep.two_theta) <= toleranceDeg);
    if (cands.length) {
      let best = cands[0];
      let bestScore = -1;
      for (const rp of cands) {
        const sc = (rp.intensity || 50) * (1.0 - Math.abs(rp.two_theta - ep.two_theta) / (toleranceDeg * 1.4));
        if (sc > bestScore) { bestScore = sc; best = rp; }
      }
      let hklArr = Array.isArray(best.hkl) && best.hkl.length >= 3 ? best.hkl : [0, 0, 0];
      if (hklArr[0] === 0 && hklArr[1] === 0 && hklArr[2] === 0 && calcCellPeaks && calcCellPeaks.length) {
        let nearCp = null;
        let minCpDiff = 0.40;
        for (const cp of calcCellPeaks) {
          const dCp = Math.abs(cp.two_theta - best.two_theta);
          if (dCp <= minCpDiff) {
            minCpDiff = dCp;
            nearCp = cp;
          }
        }
        if (nearCp && Array.isArray(nearCp.hkl)) {
          hklArr = nearCp.hkl;
        }
      }
      const hasValidHkl = hklArr[0] !== 0 || hklArr[1] !== 0 || hklArr[2] !== 0;
      const hklStr = hasValidHkl ? `(${hklArr[0]}${hklArr[1]}${hklArr[2]})` : '';
      const showLabel = hasValidHkl && !usedHkls.has(hklStr) && (best.intensity || 100) >= 15.0;
      if (hasValidHkl) usedHkls.add(hklStr);
      indexed.push({
        two_theta: ep.two_theta,
        two_theta_calc: best.two_theta,
        delta_2theta: Number((ep.two_theta - best.two_theta).toFixed(4)),
        d_obs: ep.d,
        d_calc: best.d,
        fwhm: ep.fwhm || 0.24,
        intensity: ep.intensity,
        intensity_raw: ep.intensity_raw,
        hkl: hklArr,
        hkl_str: hklStr,
        indexed: true,
        show_label: showLabel,
        dx: 0,
        dy: 0
      });
    } else {
      indexed.push({
        two_theta: ep.two_theta,
        two_theta_calc: null,
        delta_2theta: null,
        d_obs: ep.d,
        d_calc: null,
        fwhm: ep.fwhm || 0.24,
        intensity: ep.intensity,
        intensity_raw: ep.intensity_raw,
        hkl: null,
        hkl_str: '',
        indexed: false,
        show_label: false,
        dx: 0,
        dy: 0
      });
    }
  }
  indexed.sort((a, b) => a.two_theta - b.two_theta);
  return { system: usedSys, cell: usedCell, peaks: indexed };
}

function solveLinearSystemClient(A, b) {
  const m = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < m; col++) {
    let piv = col;
    let maxAbs = Math.abs(M[col][col]);
    for (let r = col + 1; r < m; r++) {
      if (Math.abs(M[r][col]) > maxAbs) {
        maxAbs = Math.abs(M[r][col]);
        piv = r;
      }
    }
    if (maxAbs < 1e-12) continue;
    if (piv !== col) {
      const tmp = M[col];
      M[col] = M[piv];
      M[piv] = tmp;
    }
    const diag = M[col][col];
    for (let j = col; j <= m; j++) M[col][j] /= diag;
    for (let r = 0; r < m; r++) {
      if (r === col) continue;
      const factor = M[r][col];
      if (factor === 0) continue;
      for (let j = col; j <= m; j++) M[r][j] -= factor * M[col][j];
    }
  }
  return M.map((row) => (Number.isFinite(row[m]) ? row[m] : 0));
}

function computeMetricInvD2Client(h, k, l, dFallback, a, b, c, alphaDeg, betaDeg, gammaDeg, epsIso = 0) {
  if (h === 0 && k === 0 && l === 0) {
    const df = Math.max((dFallback || 2.5) * (1 + epsIso), 0.1);
    return 1.0 / (df * df);
  }
  const deg = Math.PI / 180.0;
  const al = alphaDeg * deg, be = betaDeg * deg, ga = gammaDeg * deg;
  const ca = Math.cos(al), cb = Math.cos(be), cg = Math.cos(ga);
  const sa = Math.sin(al), sb = Math.sin(be), sg = Math.sin(ga);
  const volSq = Math.max(1.0 - ca * ca - cb * cb - cg * cg + 2.0 * ca * cb * cg, 1e-8);
  const vol = Math.max(a * b * c * Math.sqrt(volSq), 1e-6);
  const aSt = (b * c * sa) / vol;
  const bSt = (a * c * sb) / vol;
  const cSt = (a * b * sg) / vol;
  const caSt = Math.abs(sb * sg) > 1e-8 ? (cb * cg - ca) / (sb * sg) : 0.0;
  const cbSt = Math.abs(sa * sg) > 1e-8 ? (ca * cg - cb) / (sa * sg) : 0.0;
  const cgSt = Math.abs(sa * sb) > 1e-8 ? (ca * cb - cg) / (sa * sb) : 0.0;
  const invD2 =
    h * h * aSt * aSt +
    k * k * bSt * bSt +
    l * l * cSt * cSt +
    2.0 * h * k * aSt * bSt * cgSt +
    2.0 * k * l * bSt * cSt * caSt +
    2.0 * h * l * aSt * cSt * cbSt;
  return invD2 > 1e-8 ? invD2 : 1.0 / Math.pow(Math.max((dFallback || 2.5) * (1 + epsIso), 0.1), 2);
}

function tchPseudoVoigtParamsScalar(thRad, U, Vp, W, Xl) {
  const tanTh = Math.tan(thRad);
  const cosTh = Math.max(Math.cos(thRad), 0.15);
  const hg = Math.sqrt(Math.max(U * tanTh * tanTh + Vp * tanTh + W, 1e-4));
  const hl = Math.max(Xl / cosTh, 1e-4);
  const h5 =
    Math.pow(hg, 5) +
    2.69269 * Math.pow(hg, 4) * hl +
    2.42843 * Math.pow(hg, 3) * Math.pow(hl, 2) +
    4.47163 * Math.pow(hg, 2) * Math.pow(hl, 3) +
    0.07842 * hg * Math.pow(hl, 4) +
    Math.pow(hl, 5);
  const fwhm = Math.max(Math.pow(h5, 0.2), 0.02);
  const q = Math.min(1.0, Math.max(0.0, hl / fwhm));
  const eta = Math.min(0.99, Math.max(0.01, 1.36603 * q - 0.47719 * q * q + 0.11116 * q * q * q));
  return { fwhm, eta, hg, hl };
}

function runRietveldClient(twoTheta, intensity, phase, wavelength = 1.5406) {
  const n = twoTheta.length;
  const xMin = twoTheta[0];
  const xMax = twoTheta[n - 1];
  const spanX = Math.max(xMax - xMin, 1e-5);

  const sysDisplay = phase.system || 'Hexagonal';
  const sys = sysDisplay.toLowerCase();
  const cell0 = phase.cell || { a: 3.2498, b: 3.2498, c: 5.2066, alpha: 90, beta: 90, gamma: 120 };
  const a0 = Number(cell0.a || 3.2498);
  const b0Cell = Number(cell0.b || a0);
  const c0 = Number(cell0.c || (sys === 'cubic' ? a0 : 5.2066));
  const alpha0 = Number(cell0.alpha || 90.0);
  const beta0 = Number(cell0.beta || 90.0);
  const gamma0 = Number(cell0.gamma || (sys === 'hexagonal' || sys === 'trigonal' ? 120.0 : 90.0));

  const calcRefs = computeDSpacingsClient(
    sysDisplay,
    { a: a0, b: b0Cell, c: c0, alpha: alpha0, beta: beta0, gamma: gamma0 },
    wavelength,
    Math.max(3.0, xMin - 1.5),
    Math.min(145.0, xMax + 1.5),
    5
  );
  let rawPeaks = (phase.peaks || []).filter((p) => p.two_theta >= xMin - 1.2 && p.two_theta <= xMax + 1.2);
  if (!rawPeaks.length) rawPeaks = calcRefs;

  const refPeaks = rawPeaks.map((pk) => {
    let hkl = Array.isArray(pk.hkl) && pk.hkl.length >= 3 ? [...pk.hkl] : [0, 0, 0];
    if (hkl[0] === 0 && hkl[1] === 0 && hkl[2] === 0 && calcRefs.length) {
      let bestCp = null;
      let minDiff = 0.45;
      for (const cp of calcRefs) {
        const d = Math.abs(cp.two_theta - pk.two_theta);
        if (d <= minDiff) {
          minDiff = d;
          bestCp = cp;
        }
      }
      if (bestCp) hkl = [...bestCp.hkl];
    }
    const dVal = pk.d && pk.d > 0 ? pk.d : wavelength / (2.0 * Math.max(Math.sin((pk.two_theta / 2.0) * (Math.PI / 180.0)), 1e-4));
    return { ...pk, hkl, d: dVal, intensity: Math.max(Number(pk.intensity || 10), 0.5) };
  });

  // 5-term Chebyshev orthogonal polynomial basis T0..T4
  const nBg = 5;
  const T = new Array(n);
  for (let i = 0; i < n; i++) {
    const u = (2.0 * (twoTheta[i] - xMin)) / spanX - 1.0;
    const u2 = u * u;
    T[i] = [1.0, u, 2.0 * u2 - 1.0, 4.0 * u2 * u - 3.0 * u, 8.0 * u2 * u2 - 8.0 * u2 + 1.0];
  }

  // Statistical weights (Poisson for raw counts, MAD noise estimate for normalized [0..1] scans)
  let maxObs = -Infinity, minObs = Infinity;
  for (let i = 0; i < n; i++) {
    if (intensity[i] > maxObs) maxObs = intensity[i];
    if (intensity[i] < minObs) minObs = intensity[i];
  }
  const wArr = new Float64Array(n);
  if (maxObs >= 25.0 && minObs >= 0.0) {
    for (let i = 0; i < n; i++) wArr[i] = 1.0 / Math.max(intensity[i], 1.0);
  } else {
    const diffs = [];
    for (let i = 1; i < n - 1; i++) diffs.push(Math.abs(intensity[i + 1] - 2 * intensity[i] + intensity[i - 1]));
    diffs.sort((a, b) => a - b);
    const medD2 = diffs.length ? diffs[Math.floor(diffs.length / 2)] : 0.01;
    const sigmaBg = Math.max(medD2 / (Math.sqrt(6.0) * 0.6745), Math.max(Math.abs(maxObs), 1e-3) * 0.006);
    for (let i = 0; i < n; i++) {
      const rel = Math.max((intensity[i] - minObs) / Math.max(maxObs - minObs, 1e-6), 0.15);
      const s = Math.max(sigmaBg * Math.sqrt(rel / 0.15), 1e-5);
      wArr[i] = 1.0 / (s * s);
    }
  }

  const fitChebyshevBg = (targetResidual) => {
    const ATA = Array.from({ length: nBg }, () => new Array(nBg).fill(0));
    const ATy = new Array(nBg).fill(0);
    for (let i = 0; i < n; i++) {
      if (targetResidual === null) {
        let nearPeak = false;
        for (const pk of refPeaks) {
          if (Math.abs(twoTheta[i] - pk.two_theta) <= 0.95) {
            nearPeak = true;
            break;
          }
        }
        if (nearPeak) continue;
      }
      const wi = wArr[i];
      const yi = targetResidual ? targetResidual[i] : intensity[i];
      const ti = T[i];
      for (let r = 0; r < nBg; r++) {
        ATy[r] += wi * ti[r] * yi;
        for (let c = r; c < nBg; c++) ATA[r][c] += wi * ti[r] * ti[c];
      }
    }
    for (let r = 0; r < nBg; r++) {
      ATA[r][r] += 1e-6;
      for (let c = 0; c < r; c++) ATA[r][c] = ATA[c][r];
    }
    return solveLinearSystemClient(ATA, ATy);
  };

  let bgCoeffs = fitChebyshevBg(null);
  if (bgCoeffs.every((v) => v === 0)) {
    const sortedY = [...intensity].sort((a, b) => a - b);
    bgCoeffs[0] = sortedY[Math.floor(n * 0.12)] || 50.0;
  }

  let maxNet = 1e-3;
  for (let i = 0; i < n; i++) {
    let yb = 0;
    for (let k = 0; k < nBg; k++) yb += T[i][k] * bgCoeffs[k];
    if (intensity[i] - yb > maxNet) maxNet = intensity[i] - yb;
  }
  const maxRefI = refPeaks.reduce((m, p) => Math.max(m, p.intensity), 1.0);
  let scale = Math.max(maxNet / maxRefI, 1e-4);

  // Coarse zero-shift search in [-0.30, +0.30] deg
  let zero = 0.0;
  if (refPeaks.length) {
    let bestCorr = -1e30;
    for (let zc = -0.30; zc <= 0.3001; zc += 0.025) {
      let scCorr = 0;
      for (const pk of refPeaks) {
        const idx = Math.min(n - 1, Math.max(0, lowerBound(twoTheta, pk.two_theta + zc)));
        scCorr += Math.max(0, intensity[idx]) * pk.intensity;
      }
      if (scCorr > bestCorr) {
        bestCorr = scCorr;
        zero = zc;
      }
    }
  }

  let disp = 0.0;
  let epsA = 0.0, epsB = 0.0, epsC = 0.0, dBeta = 0.0;
  let U = 0.010, Vp = 0.0, W = 0.026, Xl = 0.110;
  let ka2Ratio = 0.0;
  const isCu = wavelength >= 1.535 && wavelength <= 1.546;
  const ka2WlRatio = 1.544426 / 1.540598;
  const cosMean = refPeaks.length
    ? refPeaks.reduce((acc, p) => acc + Math.cos((p.two_theta / 2.0) * (Math.PI / 180.0)), 0) / refPeaks.length
    : 0.9;
  const regScale = Math.max(n, 100) / 400.0;

  const evalProfile = (sc, zr, dp, eA, eB, eC, dBe, uVal, vVal, wVal, xVal, ka2, bVec, withComp = false) => {
    const yBkg = new Float64Array(n);
    const yPeaks = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const ti = T[i];
      yBkg[i] = ti[0] * bVec[0] + ti[1] * bVec[1] + ti[2] * bVec[2] + ti[3] * bVec[3] + ti[4] * bVec[4];
    }

    const aCur = a0 * (1.0 + eA);
    const bCur = (sys === 'orthorhombic' || sys === 'monoclinic' || sys === 'triclinic') ? b0Cell * (1.0 + eB) : aCur;
    const cCur = sys === 'cubic' ? aCur : c0 * (1.0 + eC);
    const betaCur = (sys === 'monoclinic' || sys === 'triclinic') ? beta0 + dBe : beta0;

    const ticks = [];
    const comp = withComp ? refPeaks.map(() => new Float64Array(n)) : null;

    refPeaks.forEach((pk, idxPk) => {
      const [h, k, l] = pk.hkl;
      const invD2 = computeMetricInvD2Client(h, k, l, pk.d, aCur, bCur, cCur, alpha0, betaCur, gamma0, eA);
      const dCur = 1.0 / Math.sqrt(Math.max(invD2, 1e-8));
      const sTh1 = wavelength / (2.0 * dCur);
      const braggDeg = (sTh1 > 0 && sTh1 < 0.996) ? (2.0 * Math.asin(sTh1) * 180.0) / Math.PI : pk.two_theta;
      const thRad = Math.max((braggDeg / 2.0) * (Math.PI / 180.0), 0.02);
      const dispShift = dp * (Math.cos(thRad) - cosMean);
      const pos1 = braggDeg + zr + dispShift;

      const { fwhm, eta } = tchPseudoVoigtParamsScalar(thRad, uVal, vVal, wVal, xVal);
      const amp = sc * pk.intensity;
      const win = Math.max(fwhm * 9.0, 0.8);

      const i0 = lowerBound(twoTheta, pos1 - win);
      const i1 = upperBound(twoTheta, pos1 + win);
      for (let i = i0; i < i1; i++) {
        const pv = pseudoVoigtScalar(twoTheta[i], pos1, amp, fwhm, eta);
        yPeaks[i] += pv;
        if (comp) comp[idxPk][i] += pv;
      }

      if (isCu && ka2 > 1e-4 && sTh1 > 0 && sTh1 * ka2WlRatio < 0.996) {
        const pos2 = (2.0 * Math.asin(sTh1 * ka2WlRatio) * 180.0) / Math.PI + zr + dispShift;
        const j0 = lowerBound(twoTheta, pos2 - win);
        const j1 = upperBound(twoTheta, pos2 + win);
        for (let i = j0; i < j1; i++) {
          const pv2 = pseudoVoigtScalar(twoTheta[i], pos2, amp * ka2, fwhm, eta);
          yPeaks[i] += pv2;
          if (comp) comp[idxPk][i] += pv2;
        }
      }

      ticks.push({
        two_theta: Number(pos1.toFixed(3)),
        hkl: pk.hkl,
        hkl_str: (h || k || l) ? `(${h}${k}${l})` : '',
        intensity: pk.intensity,
        fwhm: Number(fwhm.toFixed(4)),
        eta: Number(eta.toFixed(3))
      });
    });

    const yCalc = new Float64Array(n);
    let wss = regScale * ((zr / 0.12) * (zr / 0.12) + (dp / 0.04) * (dp / 0.04));
    for (let i = 0; i < n; i++) {
      yCalc[i] = yBkg[i] + yPeaks[i];
      const diff = intensity[i] - yCalc[i];
      wss += wArr[i] * diff * diff;
    }
    return { wss, yCalc, yBkg, yPeaks, ticks, comp };
  };

  let best = evalProfile(scale, zero, disp, epsA, epsB, epsC, dBeta, U, Vp, W, Xl, ka2Ratio, bgCoeffs);
  const stages = [
    { sc: 0.08, zr: 0.02, dp: 0.0, cell: 0.0014, ang: 0.12, w: 0.0, xl: 0.0, u: 0.0, ka2: 0.0, iters: 4 },
    { sc: 0.025, zr: 0.006, dp: 0.008, cell: 0.0005, ang: 0.04, w: 0.004, xl: 0.018, u: 0.003, ka2: 0.08, iters: 4 },
    { sc: 0.006, zr: 0.0018, dp: 0.0025, cell: 0.00015, ang: 0.012, w: 0.0012, xl: 0.005, u: 0.001, ka2: 0.02, iters: 4 }
  ];

  for (const st of stages) {
    for (let iter = 0; iter < st.iters; iter++) {
      for (const dir of [-1, 1]) {
        const ns = Math.max(1e-5, scale * (1 + dir * st.sc));
        const cand = evalProfile(ns, zero, disp, epsA, epsB, epsC, dBeta, U, Vp, W, Xl, ka2Ratio, bgCoeffs);
        if (cand.wss < best.wss) { scale = ns; best = cand; }
      }
      for (const dir of [-1, 1]) {
        const nz = Math.min(0.45, Math.max(-0.45, zero + dir * st.zr));
        const cand = evalProfile(scale, nz, disp, epsA, epsB, epsC, dBeta, U, Vp, W, Xl, ka2Ratio, bgCoeffs);
        if (cand.wss < best.wss) { zero = nz; best = cand; }
      }
      if (st.dp > 0) {
        for (const dir of [-1, 1]) {
          const nd = Math.min(0.20, Math.max(-0.20, disp + dir * st.dp));
          const cand = evalProfile(scale, zero, nd, epsA, epsB, epsC, dBeta, U, Vp, W, Xl, ka2Ratio, bgCoeffs);
          if (cand.wss < best.wss) { disp = nd; best = cand; }
        }
      }
      for (const dir of [-1, 1]) {
        const ne = Math.min(0.035, Math.max(-0.035, epsA + dir * st.cell));
        const cand = evalProfile(scale, zero, disp, ne, epsB, epsC, dBeta, U, Vp, W, Xl, ka2Ratio, bgCoeffs);
        if (cand.wss < best.wss) { epsA = ne; best = cand; }
      }
      if (sys === 'orthorhombic' || sys === 'monoclinic' || sys === 'triclinic') {
        for (const dir of [-1, 1]) {
          const ne = Math.min(0.035, Math.max(-0.035, epsB + dir * st.cell));
          const cand = evalProfile(scale, zero, disp, epsA, ne, epsC, dBeta, U, Vp, W, Xl, ka2Ratio, bgCoeffs);
          if (cand.wss < best.wss) { epsB = ne; best = cand; }
        }
      }
      if (sys !== 'cubic') {
        for (const dir of [-1, 1]) {
          const ne = Math.min(0.035, Math.max(-0.035, epsC + dir * st.cell));
          const cand = evalProfile(scale, zero, disp, epsA, epsB, ne, dBeta, U, Vp, W, Xl, ka2Ratio, bgCoeffs);
          if (cand.wss < best.wss) { epsC = ne; best = cand; }
        }
      }
      if (sys === 'monoclinic' || sys === 'triclinic') {
        for (const dir of [-1, 1]) {
          const nb = Math.min(2.5, Math.max(-2.5, dBeta + dir * st.ang));
          const cand = evalProfile(scale, zero, disp, epsA, epsB, epsC, nb, U, Vp, W, Xl, ka2Ratio, bgCoeffs);
          if (cand.wss < best.wss) { dBeta = nb; best = cand; }
        }
      }
      if (st.w > 0) {
        for (const dir of [-1, 1]) {
          const nw = Math.min(0.35, Math.max(0.0005, W + dir * st.w));
          const cand = evalProfile(scale, zero, disp, epsA, epsB, epsC, dBeta, U, Vp, nw, Xl, ka2Ratio, bgCoeffs);
          if (cand.wss < best.wss) { W = nw; best = cand; }
        }
        for (const dir of [-1, 1]) {
          const nx = Math.min(0.85, Math.max(0.001, Xl + dir * st.xl));
          const cand = evalProfile(scale, zero, disp, epsA, epsB, epsC, dBeta, U, Vp, W, nx, ka2Ratio, bgCoeffs);
          if (cand.wss < best.wss) { Xl = nx; best = cand; }
        }
        for (const dir of [-1, 1]) {
          const nu = Math.min(0.50, Math.max(0.0, U + dir * st.u));
          const cand = evalProfile(scale, zero, disp, epsA, epsB, epsC, dBeta, nu, Vp, W, Xl, ka2Ratio, bgCoeffs);
          if (cand.wss < best.wss) { U = nu; best = cand; }
        }
        if (isCu) {
          for (const dir of [-1, 1]) {
            const nk = Math.min(0.52, Math.max(0.0, ka2Ratio + dir * st.ka2));
            const cand = evalProfile(scale, zero, disp, epsA, epsB, epsC, dBeta, U, Vp, W, Xl, nk, bgCoeffs);
            if (cand.wss < best.wss) { ka2Ratio = nk; best = cand; }
          }
        }
      }
      // Analytical weighted linear least-squares update of Chebyshev background given current Bragg profile
      const targetBg = new Float64Array(n);
      for (let i = 0; i < n; i++) targetBg[i] = intensity[i] - best.yPeaks[i];
      const newBg = fitChebyshevBg(targetBg);
      const candBg = evalProfile(scale, zero, disp, epsA, epsB, epsC, dBeta, U, Vp, W, Xl, ka2Ratio, newBg);
      if (candBg.wss <= best.wss) {
        bgCoeffs = newBg;
        best = candBg;
      }
    }
  }

  best = evalProfile(scale, zero, disp, epsA, epsB, epsC, dBeta, U, Vp, W, Xl, ka2Ratio, bgCoeffs, true);

  const decimals = maxObs < 25.0 ? 4 : 2;
  let sumAbsDiff = 0, sumObs = 0, numRwp = 0, denRwp = 0;
  let crystArea = 0;
  const yDiff = new Array(n);
  const bgSorted = Array.from(best.yBkg).sort((a, b) => a - b);
  const yFlat = bgSorted[Math.floor(n * 0.05)] || 0;
  let amorphArea = 0;

  for (let i = 0; i < n; i++) {
    const d = intensity[i] - best.yCalc[i];
    yDiff[i] = Number(d.toFixed(decimals));
    sumAbsDiff += Math.abs(d);
    sumObs += Math.abs(intensity[i]);
    const w = wArr[i];
    numRwp += w * d * d;
    denRwp += w * intensity[i] * intensity[i];
    crystArea += Math.max(0, best.yCalc[i] - best.yBkg[i]);
    amorphArea += Math.max(0, best.yBkg[i] - yFlat);
  }

  const rp = (sumAbsDiff / Math.max(sumObs, 1e-6)) * 100.0;
  const rwp = Math.sqrt(numRwp / Math.max(denRwp, 1e-6)) * 100.0;
  const rexp = Math.sqrt(Math.max(n - 14, 1) / Math.max(denRwp, 1e-6)) * 100.0;
  const chi2 = Math.pow(rwp / Math.max(rexp, 1e-4), 2);

  // Rietveld Bragg R-factor (R_B)
  let sumIkDiff = 0, sumIkObs = 0;
  if (best.comp && best.comp.length) {
    for (let k = 0; k < best.comp.length; k++) {
      const ck = best.comp[k];
      let ikCalc = 0, ikObs = 0;
      for (let i = 0; i < n; i++) {
        const totPk = best.yPeaks[i];
        if (totPk > 1e-6 && ck[i] > 0) {
          ikCalc += ck[i];
          ikObs += (ck[i] / totPk) * Math.max(0, intensity[i] - best.yBkg[i]);
        }
      }
      sumIkDiff += Math.abs(ikObs - ikCalc);
      sumIkObs += ikObs;
    }
  }
  const rBragg = sumIkObs > 1e-6 ? (sumIkDiff / sumIkObs) * 100.0 : rp;

  const aRef = a0 * (1.0 + epsA);
  const bRef = (sys === 'orthorhombic' || sys === 'monoclinic' || sys === 'triclinic') ? b0Cell * (1.0 + epsB) : aRef;
  const cRef = sys === 'cubic' ? aRef : c0 * (1.0 + epsC);
  const betaRef = (sys === 'monoclinic' || sys === 'triclinic') ? beta0 + dBeta : beta0;
  const vol = computeCellVolumeClient({ a: aRef, b: bRef, c: cRef, alpha: alpha0, beta: betaRef, gamma: gamma0 }, sysDisplay);

  const hInst = 0.065;
  let crystalliteNm = 40.0;
  let meanEta = 0.58;
  if (best.ticks.length) {
    const dList = best.ticks.map((tk) => {
      const thR = Math.max((tk.two_theta / 2.0) * (Math.PI / 180.0), 0.04);
      const betaSample = Math.sqrt(Math.max(tk.fwhm * tk.fwhm - hInst * hInst, 0.0004));
      return (0.89 * (wavelength / 10.0)) / (((betaSample * Math.PI) / 180.0) * Math.max(Math.cos(thR), 0.2));
    }).sort((a, b) => a - b);
    crystalliteNm = Math.min(500.0, Math.max(1.5, dList[Math.floor(dList.length / 2)]));
    meanEta = best.ticks.reduce((s, t) => s + t.eta, 0) / best.ticks.length;
  }

  const uSample = Math.max(U - 0.0015, 0.0);
  const microstrainPct = (((Math.max(Math.sqrt(uSample), 0.005) * Math.PI) / 180.0) / 4.0) * 100.0;
  const crystallinityPct = Math.min(99.8, Math.max(15.0, (crystArea / Math.max(crystArea + amorphArea, 1e-6)) * 100.0));

  return {
    phase_name: phase.name || phase.formula,
    phase_id: phase.jcpds || phase.id,
    system: sysDisplay,
    space_group: phase.space_group || '',
    two_theta: twoTheta,
    y_obs: intensity,
    y_calc: Array.from(best.yCalc, (v) => Number(v.toFixed(decimals))),
    y_bkg: Array.from(best.yBkg, (v) => Number(v.toFixed(decimals))),
    y_diff: yDiff,
    bragg_ticks: best.ticks,
    metrics: {
      rwp: Number(rwp.toFixed(2)),
      rp: Number(rp.toFixed(2)),
      rexp: Number(rexp.toFixed(2)),
      chi2: Number(chi2.toFixed(2)),
      r_bragg: Number(rBragg.toFixed(2)),
      a: Number(aRef.toFixed(4)),
      b: Number(bRef.toFixed(4)),
      c: Number(cRef.toFixed(4)),
      alpha: Number(alpha0.toFixed(3)),
      beta: Number(betaRef.toFixed(3)),
      gamma: Number(gamma0.toFixed(3)),
      volume: Number(vol.toFixed(2)),
      zero_shift: Number(zero.toFixed(4)),
      displacement: Number(disp.toFixed(4)),
      eta: Number(meanEta.toFixed(3)),
      U: Number(U.toFixed(4)),
      V: Number(Vp.toFixed(4)),
      W: Number(W.toFixed(4)),
      ka2_ratio: Number(ka2Ratio.toFixed(3)),
      crystallite_nm: Number(crystalliteNm.toFixed(1)),
      microstrain_pct: Number(microstrainPct.toFixed(4)),
      crystallinity_pct: Number(crystallinityPct.toFixed(1))
    }
  };
}

async function queryOnlineDatabasesClient(query, source = 'all') {
  const q = (query || '').trim();
  const qLow = q.toLowerCase();
  const sampleHint = getCurrentSampleHint();

  // Prefer server-side database filter when FastAPI backend is active (reads Desktop .sq files & live COD CIFs)
  if (state.backendAvailable) {
    try {
      const resp = await fetch('/api/database/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restraints: state.restraints,
          query: q,
          source,
          sample_hint: sampleHint
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        const mergedMap = new Map();
        (data.results || []).forEach((p) => mergedMap.set(p.id, enrichPhaseClient(p)));
        if (source === 'local' || source === 'all') {
          const clientFiltered = filterPhasesByRestraintsClient(loadCustomLocalStoragePhasesClient(), state.restraints, q);
          clientFiltered.forEach((p) => {
            if (!mergedMap.has(p.id)) mergedMap.set(p.id, p);
          });
        }
        return Array.from(mergedMap.values());
      }
    } catch (_) {}
  }

  const results = [];

  if (source === 'local' || source === 'all') {
    const localFiltered = filterPhasesByRestraintsClient(loadLocalDatabaseClient(), state.restraints, q);
    results.push(...localFiltered);
  }

  const comp = (state.restraints && state.restraints.composition) || {};
  const restraintElems = [
    ...(comp.just_elements || []),
    ...(comp.only_elements || []),
    ...(comp.and_elements || [])
  ].filter((e) => VALID_ELEMENTS_SET.has(e));
  const hintFormula = !q && !restraintElems.length ? extractCleanFormulaHintClient(sampleHint) : '';
  const effectiveOnlineQuery = q || (source !== 'all' ? hintFormula : '');

  if ((effectiveOnlineQuery || restraintElems.length) && (source === 'cod' || source === 'optimade' || source === 'all')) {
    const qElems = effectiveOnlineQuery ? extractFormulaElementsClient(effectiveOnlineQuery) : [];
    const elems = Array.from(new Set([...restraintElems, ...qElems]));
    const exactCount = (comp.just_elements && comp.just_elements.length)
      ? comp.just_elements.length
      : (!restraintElems.length && parseFormulaStoichiometryClient(effectiveOnlineQuery) ? elems.length : null);
    let filterExpr = '';
    if (elems.length) {
      filterExpr = `elements HAS ALL ${elems.map((e) => `"${e}"`).join(',')}`;
      if (exactCount) filterExpr += ` AND nelements=${exactCount}`;
    } else if (effectiveOnlineQuery) {
      filterExpr = `chemical_formula_descriptive CONTAINS "${effectiveOnlineQuery.replace(/"/g, '')}"`;
    }

    const endpoints = [];
    if (source === 'cod' || source === 'all') {
      endpoints.push(['COD', 'https://www.crystallography.net/cod/optimade/v1/structures']);
    }
    if (source === 'optimade' || source === 'all') {
      endpoints.push(['Materials Cloud', 'https://optimade.materialscloud.org/main/mc3d-pbe-v1/v1/structures']);
    }

    const remoteHits = [];
    for (const [providerName, url] of endpoints) {
      if (!filterExpr) continue;
      try {
        const resp = await fetch(`${url}?filter=${encodeURIComponent(filterExpr)}&page_limit=6`);
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
          let peaks = computeDSpacingsClient(system, cell, 1.5406, 5.0, 85.0, 5);
          peaks = peaks.sort((x, y) => y.intensity - x.intensity).slice(0, 24).sort((x, y) => x.two_theta - y.two_theta);
          const formula = String(attrs.chemical_formula_reduced || attrs.chemical_formula_descriptive || effectiveOnlineQuery || 'Phase').replace(/^[-\s]+|[-\s]+$/g, '');
          const prefix = providerName === 'COD' ? 'COD' : 'OPT';
          remoteHits.push({
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
      } catch (_) {}
    }

    if (remoteHits.length > 0) {
      results.push(...filterPhasesByRestraintsClient(remoteHits, state.restraints, q));
    } else if (results.length === 0) {
      const seedFallback = SEED_PHASES.map((p) => ({
        ...p,
        id: source === 'cod' ? `COD-${p.cod_id}` : p.id,
        jcpds: source === 'cod' ? `COD ${p.cod_id}` : p.jcpds,
        source: source === 'cod' ? 'COD' : 'RRUFF / ICDD'
      }));
      results.push(...filterPhasesByRestraintsClient(seedFallback, state.restraints, q || effectiveOnlineQuery));
    }
  }

  return results;
}

/* ============================================================================
   UI CONTROLLER & INTERACTIVE CANVAS BOOTSTRAP
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  buildPeriodicTableUI();
  bindEvents();
  bindDbIndexAndRestraintsEvents();
  loadPreset('zno');
  initBackendAndSqStatus();
});

function formatRefTag(phase) {
  if (!phase) return '';
  const refId = String(phase.jcpds || phase.id || '');
  if (refId.startsWith('COD')) {
    return `COD No. | ${refId.replace(/^COD[\s\-]*/, '')}`;
  }
  if (refId.startsWith('OPT')) {
    return `${phase.formula || 'Ref'} | ${refId}`;
  }
  if (phase.sq_file && !/^\d{3}-\d{4}$/.test(refId)) {
    return `SQ (${phase.sq_file}) | ${refId}`;
  }
  return `JCPDS No. | ${refId}`;
}

function resetRietveldStatsUI() {
  [
    'statRwp', 'statChi2', 'statRp', 'statRexp',
    'statCellA', 'statCellC', 'statSize', 'statVol',
    'statStrain', 'statRBragg', 'statCryst'
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = '—';
  });
}

function loadPreset(presetName) {
  const { pattern, ref, localDb } = synthesizeSinglePreset(presetName);
  state.pattern = pattern;
  state.localDb = localDb;
  state.activeReference = ref;
  state.min2Theta = pattern.min_2theta;
  state.max2Theta = pattern.max_2theta;

  document.getElementById('min2ThetaInput').value = state.min2Theta;
  document.getElementById('max2ThetaInput').value = state.max2Theta;

  state.labels.legend = pattern.label;
  state.labels.refTag = formatRefTag(ref);
  state.labels.legendOffset = { dx: 0, dy: 0 };
  state.labels.refOffset = { dx: 0, dy: 0 };
  syncLabelInputs();

  state.indexed = assignMillerIndicesClient(
    pattern.two_theta,
    pattern.intensity,
    ref,
    ref.system,
    ref.cell
  );
  state.dbResults = localDb.map((p) => enrichPhaseClient(p));
  state.rietveld = null;
  resetRietveldStatsUI();

  syncCellInputsFromReference(ref);
  renderTraceList();
  renderDbResults();
  renderHklTable();
  renderGraph();
}

function syncLabelInputs() {
  document.getElementById('xAxisLabelInput').value = state.labels.xAxis;
  document.getElementById('yAxisLabelInput').value = state.labels.yAxis;
  document.getElementById('legendLabelInput').value = state.labels.legend;
  document.getElementById('refLabelInput').value = state.labels.refTag;
}

function bindEvents() {
  document.getElementById('presetSelect').addEventListener('change', (e) => {
    state.viewMode = 'pattern';
    updateViewTabs();
    loadPreset(e.target.value);
  });

  document.getElementById('fileUploadInput').addEventListener('change', async (e) => {
    if (!e.target.files.length) return;
    await uploadSingleXrdFile(e.target.files[0]);
    e.target.value = '';
  });

  document.getElementById('paletteToggleBtn').addEventListener('click', (e) => {
    state.useThemeColor = !state.useThemeColor;
    if (state.pattern) {
      state.pattern.color = state.useThemeColor ? '#C21E56' : '#e60000';
    }
    e.target.textContent = state.useThemeColor ? 'Classic Color' : 'Theme Color';
    renderTraceList();
    renderGraph();
  });

  // Manual Label Inputs
  document.getElementById('xAxisLabelInput').addEventListener('input', (e) => {
    state.labels.xAxis = e.target.value;
    scheduleRenderGraph();
  });
  document.getElementById('yAxisLabelInput').addEventListener('input', (e) => {
    state.labels.yAxis = e.target.value;
    scheduleRenderGraph();
  });
  document.getElementById('legendLabelInput').addEventListener('input', (e) => {
    state.labels.legend = e.target.value;
    if (state.pattern) state.pattern.label = e.target.value;
    renderTraceList();
    scheduleRenderGraph();
  });
  document.getElementById('refLabelInput').addEventListener('input', (e) => {
    state.labels.refTag = e.target.value;
    scheduleRenderGraph();
  });
  document.getElementById('refLabelInput').addEventListener('change', (e) => {
    tryResolveReferenceFromTagText(e.target.value);
  });
  document.getElementById('resetLabelsBtn').addEventListener('click', () => {
    state.labels.xAxis = '2θ (degree)';
    state.labels.yAxis = 'Intensity (a.u.)';
    state.labels.legend = state.pattern ? state.pattern.label : 'Sample';
    state.labels.refTag = formatRefTag(state.activeReference);
    state.labels.legendOffset = { dx: 0, dy: 0 };
    state.labels.refOffset = { dx: 0, dy: 0 };
    (state.indexed.peaks || []).forEach((pk) => { pk.dx = 0; pk.dy = 0; });
    syncLabelInputs();
    renderGraph();
    showToast('Graph labels & positions reset', 'info');
  });

  // Database Upload (.cif, .json, .sq)
  document.getElementById('dbUploadInput').addEventListener('change', async (e) => {
    if (!e.target.files.length) return;
    let hasSq = false;
    let lastUploadedPhase = null;
    for (const file of e.target.files) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'sq' || ext === 'sqlite' || ext === 'sqlite3' || ext === 'db') {
        await handleSqFileObjects([file]);
        hasSq = true;
      } else if (ext === 'cif') {
        const text = await file.text();
        const parsed = parseCifClient(text, file.name.replace(/\.cif$/i, ''));
        if (parsed) {
          lastUploadedPhase = enrichPhaseClient(parsed);
          state.localDb = savePhaseToLocalStorage(lastUploadedPhase);
        }
      } else if (ext === 'json') {
        try {
          const text = await file.text();
          const obj = JSON.parse(text);
          const items = Array.isArray(obj) ? obj : (obj.phases || [obj]);
          for (const item of items) {
            lastUploadedPhase = enrichPhaseClient(item);
            state.localDb = savePhaseToLocalStorage(lastUploadedPhase);
          }
        } catch (_) {}
      }
    }
    if (!hasSq) {
      state.dbResults = state.localDb;
      if (lastUploadedPhase) {
        applyActiveReference(lastUploadedPhase);
        showToast(`Loaded reference phase: ${lastUploadedPhase.formula || lastUploadedPhase.name}`, 'ok');
      } else {
        renderDbResults();
      }
    }
    e.target.value = '';
  });

  // Database Source Pills — Switch active database source without auto-triggering Search-Match
  document.querySelectorAll('.pill-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pill-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.dbSource = btn.dataset.source;
      refreshDbViewWithoutMatch();
    });
  });

  document.getElementById('dbSearchBtn').addEventListener('click', runDatabaseQuery);
  document.getElementById('dbSearchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') runDatabaseQuery();
  });

  document.getElementById('searchMatchBtn').addEventListener('click', () => runSearchMatch());

  // View Mode Tabs (Pattern | Rietveld)
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

  const apply2ThetaInputs = () => {
    const rawMin = parseFloat(document.getElementById('min2ThetaInput').value);
    const rawMax = parseFloat(document.getElementById('max2ThetaInput').value);
    let nextMin = Number.isFinite(rawMin) ? Math.max(2, Math.min(135, rawMin)) : 20;
    let nextMax = Number.isFinite(rawMax) ? Math.max(5, Math.min(140, rawMax)) : 70;
    if (nextMax - nextMin < 2) {
      nextMax = Math.min(140, nextMin + 5);
    }
    state.min2Theta = nextMin;
    state.max2Theta = nextMax;
    scheduleRenderGraph();
  };

  document.getElementById('min2ThetaInput').addEventListener('input', apply2ThetaInputs);
  document.getElementById('max2ThetaInput').addEventListener('input', apply2ThetaInputs);
  document.getElementById('resetZoomBtn').addEventListener('click', () => {
    if (!state.pattern) return;
    state.min2Theta = Math.max(5, Math.floor(state.pattern.min_2theta / 5) * 5);
    state.max2Theta = Math.min(120, Math.ceil(state.pattern.max_2theta / 5) * 5);
    document.getElementById('min2ThetaInput').value = state.min2Theta;
    document.getElementById('max2ThetaInput').value = state.max2Theta;
    renderGraph();
  });

  // Manual Edit Mode Toggle
  const manualBtn = document.getElementById('manualModeBtn');
  manualBtn.classList.toggle('active', state.manualMode);
  manualBtn.addEventListener('click', () => {
    state.manualMode = !state.manualMode;
    manualBtn.textContent = state.manualMode ? 'Manual Edit: ON' : 'Manual Edit: OFF';
    manualBtn.classList.toggle('active', state.manualMode);
    state.hoveredBox = null;
    closeInlineEditor();
    renderGraph();
  });

  document.getElementById('toggleHklBtn').addEventListener('click', (e) => {
    state.showHkl = !state.showHkl;
    e.target.textContent = state.showHkl ? '(hkl) On' : '(hkl) Off';
    renderGraph();
  });

  document.getElementById('crystalSystemSelect').addEventListener('change', () => {
    updateExtraCellRowVisibility();
  });

  document.getElementById('addCustomHklBtn').addEventListener('click', () => {
    if (!state.indexed.peaks) state.indexed.peaks = [];
    const mid2T = Number(((state.min2Theta + state.max2Theta) / 2).toFixed(2));
    const dVal = Number((1.5406 / (2 * Math.sin((mid2T / 2) * (Math.PI / 180)))).toFixed(4));
    state.indexed.peaks.push({
      two_theta: mid2T,
      two_theta_calc: mid2T,
      d_obs: dVal,
      d_calc: dVal,
      fwhm: 0.24,
      intensity: 50,
      intensity_raw: 500,
      hkl: [1, 0, 0],
      hkl_str: '(100)',
      indexed: true,
      show_label: true,
      dx: 0,
      dy: 0
    });
    state.indexed.peaks.sort((a, b) => a.two_theta - b.two_theta);
    renderHklTable();
    renderGraph();
  });

  document.getElementById('assignHklBtn').addEventListener('click', () => runIndexPeaks(false));
  document.getElementById('runRietveldBtn').addEventListener('click', runRietveld);
  document.getElementById('downloadPngBtn').addEventListener('click', download300DpiPng);

  // Automatic Full Report Generator
  document.getElementById('generateReportBtn').addEventListener('click', generateFullReport);
  document.getElementById('closeReportBtn').addEventListener('click', () => {
    document.getElementById('reportModal').hidden = true;
  });
  document.getElementById('reportModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) document.getElementById('reportModal').hidden = true;
  });
  document.getElementById('printReportBtn').addEventListener('click', () => window.print());
  document.getElementById('downloadReportHtmlBtn').addEventListener('click', downloadStandaloneReportHtml);
  document.getElementById('downloadReportCsvBtn').addEventListener('click', downloadReportCsv);

  // Mobile Bottom Navigation
  document.querySelectorAll('.mobile-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mobile-nav-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.target;
      document.querySelectorAll('[data-mobile-pane]').forEach((pane) => {
        pane.classList.toggle('mobile-active', pane.dataset.mobilePane === target);
      });
      if (target === 'graph') renderGraph();
    });
  });

  // Drag-and-drop file upload onto the Graph Viewport
  const viewport = document.getElementById('canvasViewport');
  const dropOverlay = document.getElementById('dropOverlay');
  let dragDepth = 0;
  viewport.addEventListener('dragenter', (e) => {
    if (!e.dataTransfer || !Array.from(e.dataTransfer.types || []).includes('Files')) return;
    e.preventDefault();
    dragDepth++;
    dropOverlay.hidden = false;
  });
  viewport.addEventListener('dragover', (e) => {
    if (!e.dataTransfer || !Array.from(e.dataTransfer.types || []).includes('Files')) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });
  viewport.addEventListener('dragleave', () => {
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) dropOverlay.hidden = true;
  });
  viewport.addEventListener('drop', async (e) => {
    e.preventDefault();
    dragDepth = 0;
    dropOverlay.hidden = true;
    const files = e.dataTransfer && e.dataTransfer.files;
    if (!files || !files.length) return;
    const file = files[0];
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'sq' || ext === 'sqlite' || ext === 'sqlite3' || ext === 'db') {
      await handleSqFileObjects(files);
      showToast(`Indexed database ${file.name}`, 'ok');
    } else {
      await uploadSingleXrdFile(file);
    }
  });

  // Global keyboard shortcuts (Escape closes active popups/modals)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!document.getElementById('canvasInlineEditor').hidden) {
        closeInlineEditor();
        return;
      }
      if (!document.getElementById('reportModal').hidden) {
        document.getElementById('reportModal').hidden = true;
        return;
      }
      if (!document.getElementById('restraintsModal').hidden) {
        readSecondaryRestraintsFromInputs();
        document.getElementById('restraintsModal').hidden = true;
        return;
      }
      if (!document.getElementById('dbIndexModal').hidden) {
        closeDbIndexModal();
      }
    }
  });

  bindInteractiveCanvasEvents();
}

function bindInteractiveCanvasEvents() {
  const canvas = document.getElementById('xrdCanvas');
  const inlineInput = document.getElementById('canvasInlineInput');
  const inlineSave = document.getElementById('canvasInlineSaveBtn');

  const getCanvasCoords = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    return {
      cx: (clientX - rect.left) * (canvas.width / Math.max(rect.width, 1)),
      cy: (clientY - rect.top) * (canvas.height / Math.max(rect.height, 1)),
      relX: clientX - rect.left,
      relY: clientY - rect.top
    };
  };

  const findHitBox = (cx, cy) => {
    for (let i = state.hitBoxes.length - 1; i >= 0; i--) {
      const b = state.hitBoxes[i];
      if (cx >= b.x && cx <= b.x + b.w && cy >= b.y && cy <= b.y + b.h) {
        return b;
      }
    }
    return null;
  };

  canvas.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    const { cx, cy, relX, relY } = getCanvasCoords(e.clientX, e.clientY);
    const left = 165, right = 1735, top = 65, bottom = 1365;

    if (state.manualMode) {
      const hit = findHitBox(cx, cy);
      if (hit) {
        state.draggingItem = {
          box: hit,
          startX: cx,
          startY: cy,
          relX,
          relY,
          moved: false
        };
        try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
        return;
      }
    }

    if (cx >= left && cx <= right && cy >= top && cy <= bottom) {
      state.panningRange = {
        startX: cx,
        startY: cy,
        relX,
        relY,
        origMin: state.min2Theta,
        origMax: state.max2Theta,
        moved: false
      };
      canvas.style.cursor = 'grabbing';
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
    }
  });

  canvas.addEventListener('pointermove', (e) => {
    const { cx, cy } = getCanvasCoords(e.clientX, e.clientY);
    const left = 165, right = 1735;

    if (cx >= left && cx <= right) {
      const tt = state.min2Theta + ((cx - left) / (right - left)) * (state.max2Theta - state.min2Theta);
      state.cursor2Theta = tt;
      const d = 1.5406 / (2 * Math.sin(Math.max(0.01, (tt / 2) * (Math.PI / 180))));
      let intTxt = '';
      if (state.pattern && state.pattern.two_theta && state.pattern.two_theta.length) {
        const xs = state.pattern.two_theta;
        const ys = state.pattern.intensity;
        const idx = Math.min(xs.length - 1, Math.max(0, lowerBound(xs, tt)));
        const bestIdx = idx > 0 && Math.abs(xs[idx - 1] - tt) < Math.abs(xs[idx] - tt) ? idx - 1 : idx;
        state.cursorIntensity = ys[bestIdx];
        intTxt = ` | I: ${ys[bestIdx] >= 100 ? Math.round(ys[bestIdx]) : ys[bestIdx].toFixed(1)}`;
      } else {
        state.cursorIntensity = null;
      }
      document.getElementById('cursorReadout').textContent = `2θ: ${tt.toFixed(2)}° | d: ${d.toFixed(3)} Å${intTxt}`;
      scheduleRenderGraph();
    } else if (state.cursor2Theta !== null) {
      state.cursor2Theta = null;
      state.cursorIntensity = null;
      document.getElementById('cursorReadout').textContent = '2θ: —';
      scheduleRenderGraph();
    }

    if (state.draggingItem) {
      const dx = cx - state.draggingItem.startX;
      const dy = cy - state.draggingItem.startY;
      if (Math.hypot(dx, dy) > 6) {
        state.draggingItem.moved = true;
      }
      if (state.draggingItem.moved) {
        const b = state.draggingItem.box;
        if (b.type === 'hkl' && state.indexed.peaks[b.index]) {
          state.indexed.peaks[b.index].dx = (state.indexed.peaks[b.index].dx || 0) + dx;
          state.indexed.peaks[b.index].dy = (state.indexed.peaks[b.index].dy || 0) + dy;
          state.draggingItem.startX = cx;
          state.draggingItem.startY = cy;
          scheduleRenderGraph();
        } else if (b.type === 'legend') {
          state.labels.legendOffset.dx += dx;
          state.labels.legendOffset.dy += dy;
          state.draggingItem.startX = cx;
          state.draggingItem.startY = cy;
          scheduleRenderGraph();
        } else if (b.type === 'refTag') {
          state.labels.refOffset.dx += dx;
          state.labels.refOffset.dy += dy;
          state.draggingItem.startX = cx;
          state.draggingItem.startY = cy;
          scheduleRenderGraph();
        }
      }
      return;
    }

    if (state.panningRange) {
      const dx = cx - state.panningRange.startX;
      if (Math.abs(dx) > 6) {
        state.panningRange.moved = true;
      }
      if (state.panningRange.moved) {
        const span = state.panningRange.origMax - state.panningRange.origMin;
        const delta2T = -(dx / (right - left)) * span;
        let nextMin = state.panningRange.origMin + delta2T;
        let nextMax = state.panningRange.origMax + delta2T;
        if (nextMin < 5) {
          nextMin = 5;
          nextMax = 5 + span;
        }
        if (nextMax > 120) {
          nextMax = 120;
          nextMin = 120 - span;
        }
        state.min2Theta = Number(nextMin.toFixed(1));
        state.max2Theta = Number(nextMax.toFixed(1));
        document.getElementById('min2ThetaInput').value = state.min2Theta;
        document.getElementById('max2ThetaInput').value = state.max2Theta;
        scheduleRenderGraph();
      }
      return;
    }

    if (state.manualMode) {
      const hit = findHitBox(cx, cy);
      if ((hit ? hit.id : null) !== (state.hoveredBox ? state.hoveredBox.id : null)) {
        state.hoveredBox = hit;
        canvas.style.cursor = hit ? 'pointer' : 'crosshair';
        scheduleRenderGraph();
      }
    } else {
      canvas.style.cursor = cx >= left && cx <= right ? 'grab' : 'default';
    }
  });

  canvas.addEventListener('pointerleave', () => {
    if (state.cursor2Theta !== null) {
      state.cursor2Theta = null;
      state.cursorIntensity = null;
      document.getElementById('cursorReadout').textContent = '2θ: —';
      scheduleRenderGraph();
    }
  });

  canvas.addEventListener('pointerup', () => {
    if (state.draggingItem) {
      const drag = state.draggingItem;
      state.draggingItem = null;
      if (!drag.moved && state.manualMode) {
        openInlineEditor(drag.box, drag.relX, drag.relY);
      }
      return;
    }

    if (state.panningRange) {
      const pan = state.panningRange;
      state.panningRange = null;
      canvas.style.cursor = state.manualMode ? 'crosshair' : 'grab';

      // If clicked without dragging in Pattern + Manual Mode near an unlabeled peak apex, activate its (hkl) label
      const left = 165, right = 1735, top = 65, bottom = 1365;
      if (!pan.moved && state.manualMode && state.viewMode === 'pattern' && pan.startY >= top && pan.startY <= bottom - 220) {
        const clicked2T = state.min2Theta + ((pan.startX - left) / (right - left)) * (state.max2Theta - state.min2Theta);
        const peaks = (state.indexed && state.indexed.peaks) || [];
        let nearIdx = -1;
        let minDiff = 0.85;
        peaks.forEach((pk, idx) => {
          const d = Math.abs(pk.two_theta - clicked2T);
          if (d < minDiff) {
            minDiff = d;
            nearIdx = idx;
          }
        });

        if (nearIdx >= 0) {
          peaks[nearIdx].show_label = true;
          if (!peaks[nearIdx].hkl_str) peaks[nearIdx].hkl_str = '(100)';
          renderHklTable();
          renderGraph();
          openInlineEditor({ type: 'hkl', index: nearIdx }, pan.relX, pan.relY);
        }
      }
    }
  });

  // Mouse wheel zoom on 2theta axis
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const { cx } = getCanvasCoords(e.clientX, e.clientY);
    const left = 165, right = 1735;
    if (cx < left || cx > right) return;

    const frac = (cx - left) / (right - left);
    const span = Math.max(2, state.max2Theta - state.min2Theta);
    const factor = e.deltaY > 0 ? 1.12 : 0.88;
    const newSpan = Math.min(100, Math.max(6, span * factor));
    const center2T = state.min2Theta + frac * span;
    let nextMin = Math.max(5, center2T - frac * newSpan);
    let nextMax = Math.min(120, nextMin + newSpan);
    if (nextMax - nextMin < 6) {
      nextMin = Math.max(5, nextMax - 6);
    }
    state.min2Theta = Number(nextMin.toFixed(1));
    state.max2Theta = Number(nextMax.toFixed(1));

    document.getElementById('min2ThetaInput').value = state.min2Theta;
    document.getElementById('max2ThetaInput').value = state.max2Theta;
    scheduleRenderGraph();
  }, { passive: false });

  inlineSave.addEventListener('click', commitInlineEdit);
  inlineInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') commitInlineEdit();
    if (e.key === 'Escape') closeInlineEditor();
  });
}

function openInlineEditor(box, relX, relY) {
  const editor = document.getElementById('canvasInlineEditor');
  const input = document.getElementById('canvasInlineInput');
  state.editingTarget = box;

  if (box.type === 'hkl') {
    input.value = state.indexed.peaks[box.index].hkl_str || '(100)';
  } else if (box.type === 'xAxis') {
    input.value = state.labels.xAxis;
  } else if (box.type === 'yAxis') {
    input.value = state.labels.yAxis;
  } else if (box.type === 'legend') {
    input.value = state.labels.legend;
  } else if (box.type === 'refTag') {
    input.value = state.labels.refTag;
  }

  const frame = document.getElementById('graphFrame');
  const maxLeft = Math.max(10, (frame ? frame.clientWidth : 500) - 190);
  const maxTop = Math.max(10, (frame ? frame.clientHeight : 450) - 44);
  editor.style.left = `${Math.max(8, Math.min(relX - 60, maxLeft))}px`;
  editor.style.top = `${Math.max(8, Math.min(relY - 18, maxTop))}px`;
  editor.hidden = false;
  input.focus();
  input.select();
}

function commitInlineEdit() {
  const box = state.editingTarget;
  if (!box) return;
  const val = document.getElementById('canvasInlineInput').value.trim();

  if (box.type === 'hkl' && state.indexed.peaks[box.index]) {
    state.indexed.peaks[box.index].hkl_str = val;
    state.indexed.peaks[box.index].show_label = Boolean(val);
    renderHklTable();
  } else if (box.type === 'xAxis') {
    state.labels.xAxis = val || '2θ (degree)';
  } else if (box.type === 'yAxis') {
    state.labels.yAxis = val || 'Intensity (a.u.)';
  } else if (box.type === 'legend') {
    state.labels.legend = val;
    if (state.pattern) state.pattern.label = val;
    renderTraceList();
  } else if (box.type === 'refTag') {
    state.labels.refTag = val;
    tryResolveReferenceFromTagText(val);
  }

  syncLabelInputs();
  closeInlineEditor();
  renderGraph();
}

function closeInlineEditor() {
  state.editingTarget = null;
  document.getElementById('canvasInlineEditor').hidden = true;
}

function updateViewTabs() {
  document.querySelectorAll('.tab-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.view === state.viewMode);
  });
}

async function uploadSingleXrdFile(file) {
  try {
    const text = await file.text();
    const ext = file.name.split('.').pop().toLowerCase();
    const color = state.useThemeColor ? '#C21E56' : '#e60000';

    if (ext === 'cif') {
      const cifPhase = parseCifClient(text, file.name.replace(/\.cif$/i, ''));
      if (!cifPhase) throw new Error(`Could not parse crystal unit cell from ${file.name}`);
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
      state.pattern = {
        filename: file.name,
        label: cifPhase.formula,
        two_theta,
        intensity,
        min_2theta: 15.0,
        max_2theta: 80.0,
        num_points: nPts,
        color
      };
    } else {
      const item = parseXrdContentClient(text, file.name);
      item.color = color;
      state.pattern = item;
    }

    state.min2Theta = Math.max(5, Math.floor(state.pattern.min_2theta / 5) * 5);
    state.max2Theta = Math.min(120, Math.ceil(state.pattern.max_2theta / 5) * 5);
    document.getElementById('min2ThetaInput').value = state.min2Theta;
    document.getElementById('max2ThetaInput').value = state.max2Theta;
    state.labels.legend = state.pattern.label;
    state.rietveld = null;
    resetRietveldStatsUI();
    state.viewMode = 'pattern';
    updateViewTabs();
    syncLabelInputs();

    // First identify experimental peaks on the newly uploaded XRD pattern
    const detected = detectPeaksClient(state.pattern.two_theta, state.pattern.intensity, 5.0);
    state.indexed = {
      system: 'Hexagonal',
      cell: { a: 3.2498, b: 3.2498, c: 5.2066, alpha: 90, beta: 90, gamma: 120 },
      peaks: detected.map((ep) => ({
        two_theta: ep.two_theta,
        two_theta_calc: null,
        delta_2theta: null,
        d_obs: ep.d,
        d_calc: null,
        fwhm: ep.fwhm || 0.24,
        intensity: ep.intensity,
        intensity_raw: ep.intensity_raw,
        hkl: null,
        hkl_str: '',
        indexed: false,
        show_label: false,
        dx: 0,
        dy: 0
      }))
    };

    // Clear previous scan's matched reference; wait for user to click Auto Match
    state.activeReference = null;
    state.labels.refTag = '';
    syncLabelInputs();
    state.dbResults = (state.dbResults || []).map(
      ({ fom, matched_peaks, total_ref_peaks, matched_exp_peaks, total_exp_peaks, mean_delta_2theta, ...rest }) => rest
    );

    renderTraceList();
    renderDbResults();
    renderHklTable();
    renderGraph();
    showToast(`Loaded ${file.name} (${state.pattern.num_points} pts, ${detected.length} peaks)`, 'ok');
  } catch (err) {
    showToast(err && err.message ? err.message : `Failed to read ${file.name}`, 'err', 3800);
  }
}

function renderTraceList() {
  const container = document.getElementById('traceList');
  container.innerHTML = '';
  if (!state.pattern) return;

  const row = document.createElement('div');
  row.className = 'trace-item';
  row.innerHTML = `
    <input type="color" class="trace-color" value="${escapeHtml(state.pattern.color || '#e60000')}" aria-label="Pattern trace color" />
    <input type="text" class="trace-label-input" value="${escapeHtml(state.pattern.label || '')}" aria-label="Pattern legend label" />
    <span class="trace-pts-badge">${Number(state.pattern.num_points || 0)} pts</span>
  `;
  container.appendChild(row);

  row.querySelector('.trace-color').addEventListener('input', (e) => {
    state.pattern.color = e.target.value;
    scheduleRenderGraph();
  });

  row.querySelector('.trace-label-input').addEventListener('input', (e) => {
    state.pattern.label = e.target.value;
    state.labels.legend = e.target.value;
    syncLabelInputs();
    scheduleRenderGraph();
  });
}

function updateExtraCellRowVisibility() {
  const sys = (document.getElementById('crystalSystemSelect').value || 'Hexagonal').toLowerCase();
  const extraRow = document.getElementById('extraCellRow');
  const cellCInput = document.getElementById('cellCInput');
  const needsExtra = sys === 'orthorhombic' || sys === 'monoclinic' || sys === 'triclinic';
  extraRow.hidden = !needsExtra;
  cellCInput.disabled = sys === 'cubic';
}

function readUnitCellInputsFromUI() {
  const system = document.getElementById('crystalSystemSelect').value || 'Hexagonal';
  const sysLow = system.toLowerCase();
  const a = parseFloat(document.getElementById('cellAInput').value) || 3.2498;
  const cRaw = parseFloat(document.getElementById('cellCInput').value) || a;
  const bRaw = parseFloat(document.getElementById('cellBInput').value) || a;
  const betaRaw = parseFloat(document.getElementById('cellBetaInput').value) || 90.0;

  const refCell = (state.activeReference && state.activeReference.cell) || {};
  const b = (sysLow === 'orthorhombic' || sysLow === 'monoclinic' || sysLow === 'triclinic') ? bRaw : a;
  const c = sysLow === 'cubic' ? a : cRaw;
  const alpha = sysLow === 'triclinic' ? Number(refCell.alpha || 90.0) : (sysLow === 'trigonal' && Number(refCell.gamma) !== 120 && refCell.alpha ? Number(refCell.alpha) : 90.0);
  const beta = (sysLow === 'monoclinic' || sysLow === 'triclinic') ? betaRaw : (sysLow === 'trigonal' && Number(refCell.gamma) !== 120 && refCell.alpha ? Number(refCell.alpha) : 90.0);
  const gamma = (sysLow === 'hexagonal' || (sysLow === 'trigonal' && (!refCell.alpha || Math.abs(Number(refCell.gamma || 120) - 120) < 0.5)))
    ? 120.0
    : (sysLow === 'triclinic' ? Number(refCell.gamma || 90.0) : 90.0);

  return { system, cell: { a, b, c, alpha, beta, gamma } };
}

function applyActiveReference(phase, opts = {}) {
  if (!phase) return;
  const normalized = enrichPhaseClient(phase);
  state.activeReference = normalized;
  state.labels.refTag = opts.preserveCustomRefTag || formatRefTag(normalized);
  syncLabelInputs();
  syncCellInputsFromReference(normalized);
  if (opts.reRenderList !== false) {
    renderDbResults();
  }
  if (state.pattern) {
    const { system, cell } = readUnitCellInputsFromUI();
    state.indexed = assignMillerIndicesClient(
      state.pattern.two_theta,
      state.pattern.intensity,
      normalized,
      system,
      cell,
      0.55
    );
    renderHklTable();
    if (state.viewMode === 'rietveld') {
      runRietveld();
      return;
    }
  }
  renderGraph();
}

async function tryResolveReferenceFromTagText(tagText) {
  const raw = String(tagText || '').trim();
  if (!raw) return;
  const match = raw.match(/\b(\d{1,3}-\d{3,5})\b/);
  if (!match) return;
  const candidateId = formatPdf2JcpdsClient(match[1], true);
  const curId = state.activeReference
    ? formatPdf2JcpdsClient(state.activeReference.jcpds || state.activeReference.id, true)
    : '';
  if (candidateId === curId) return;

  let found = (state.dbResults || []).find(
    (p) => formatPdf2JcpdsClient(p.jcpds || p.id, true) === candidateId
  );
  if (!found) {
    const queried = await queryOnlineDatabasesClient(candidateId, state.dbSource === 'local' ? 'local' : 'all');
    found = queried.find((p) => formatPdf2JcpdsClient(p.jcpds || p.id, true) === candidateId) || queried[0] || null;
  }
  if (found) {
    applyActiveReference(found, { preserveCustomRefTag: raw });
  }
}

function stripMatchScoresFromPhase(phase) {
  if (!phase) return phase;
  const { fom, matched_peaks, total_ref_peaks, matched_exp_peaks, total_exp_peaks, mean_delta_2theta, ...rest } = phase;
  return rest;
}

function refreshDbViewWithoutMatch() {
  const q = (document.getElementById('dbSearchInput')?.value || '').trim();
  const src = state.dbSource || 'all';
  if (src === 'local' || src === 'all') {
    const baseCards = loadLocalDatabaseClient().map(stripMatchScoresFromPhase);
    state.dbResults = filterPhasesByRestraintsClient(baseCards, state.restraints, q);
  } else if (src === 'cod') {
    state.dbResults = (state.dbResults || [])
      .filter((p) => String(p.source || '').toLowerCase().includes('cod'))
      .map(stripMatchScoresFromPhase);
  } else if (src === 'optimade') {
    state.dbResults = (state.dbResults || [])
      .filter((p) => {
        const s = String(p.source || '').toLowerCase();
        return s.includes('optimade') || s.includes('materials cloud') || s.includes('rruff');
      })
      .map(stripMatchScoresFromPhase);
  }
  renderDbResults();
}

async function runDatabaseQuery() {
  const q = document.getElementById('dbSearchInput').value.trim();
  const btn = document.getElementById('dbSearchBtn');
  btn.textContent = '...';
  try {
    if ((state.dbSource === 'cod' || state.dbSource === 'optimade') && !q && !hasActiveRestraints()) {
      state.dbResults = [];
      renderDbResults();
      return;
    }
    const rawResults = await queryOnlineDatabasesClient(q, state.dbSource);
    state.dbResults = rawResults.map(stripMatchScoresFromPhase);
    if (state.dbResults.length > 0 && (q || hasActiveRestraints())) {
      applyActiveReference(state.dbResults[0]);
    } else {
      renderDbResults();
      renderGraph();
    }
  } finally {
    btn.textContent = 'Query';
  }
}

async function runSearchMatch(opts = {}) {
  if (!state.pattern) return;
  const source = opts.sourceOverride || state.dbSource || 'all';
  const query = opts.queryOverride !== undefined
    ? opts.queryOverride
    : document.getElementById('dbSearchInput').value.trim();
  const identifiedPeaks = getIdentifiedPeaksForSearchMatch();
  const sampleHint = getCurrentSampleHint();
  const btn = document.getElementById('searchMatchBtn');
  if (btn) btn.textContent = 'Matching...';

  const filterExtrasForSource = (items) => (items || []).filter((p) => {
    const s = String(p.source || '').toLowerCase();
    if (source === 'local') return s.includes('local') || s.includes('.sq');
    if (source === 'cod') return s.includes('cod');
    if (source === 'optimade') return s.includes('optimade') || s.includes('materials cloud') || s.includes('rruff');
    return true;
  });

  try {
    let matches = null;
    const clientExtras = state.backendAvailable
      ? [
          ...(source === 'local' || source === 'all' ? loadCustomLocalStoragePhasesClient() : []),
          ...filterExtrasForSource(state.dbResults)
        ]
      : [
          ...(source === 'local' || source === 'all' ? (state.sqIndex.clientPhases || []) : []),
          ...(source === 'local' ? loadLocalDatabaseClient() : filterExtrasForSource(state.dbResults))
        ];

    if (state.backendAvailable) {
      try {
        const resp = await fetch('/api/search-match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            two_theta: state.pattern.two_theta,
            intensity: state.pattern.intensity,
            tolerance_deg: 0.45,
            extra_phases: clientExtras,
            identified_peaks: identifiedPeaks,
            restraints: state.restraints,
            query,
            source,
            sample_hint: sampleHint
          })
        });
        if (resp.ok) {
          const data = await resp.json();
          matches = (data.matches || []).map((m) => enrichPhaseClient(m));
        }
      } catch (_) {
        matches = null;
      }
    }

    if (!matches) {
      let fallbackPool = filterExtrasForSource(state.dbResults);
      if (source === 'cod' || source === 'optimade' || source === 'all') {
        const remoteFetched = await queryOnlineDatabasesClient(query, source);
        const merged = new Map();
        fallbackPool.forEach((p) => merged.set(p.id, p));
        remoteFetched.forEach((p) => merged.set(p.id, p));
        fallbackPool = Array.from(merged.values());
      }
      matches = searchMatchClient(
        state.pattern.two_theta,
        state.pattern.intensity,
        0.45,
        fallbackPool,
        identifiedPeaks,
        state.restraints,
        query,
        source
      );
    }

    state.dbResults = matches;
    if (matches.length) {
      applyActiveReference(matches[0]);
    } else {
      renderDbResults();
      renderGraph();
    }
  } finally {
    if (btn) btn.textContent = 'Auto Match';
  }
}

function syncCellInputsFromReference(ref) {
  if (!ref || !ref.cell) return;
  const sel = document.getElementById('crystalSystemSelect');
  const validSystems = ['Hexagonal', 'Trigonal', 'Cubic', 'Tetragonal', 'Orthorhombic', 'Monoclinic', 'Triclinic'];
  const rawSys = String(ref.system || 'Hexagonal').trim();
  const matchedSys = validSystems.find((s) => s.toLowerCase() === rawSys.toLowerCase()) || 'Orthorhombic';
  sel.value = matchedSys;
  document.getElementById('cellAInput').value = Number(ref.cell.a || 3.2498).toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
  document.getElementById('cellBInput').value = Number(ref.cell.b || ref.cell.a || 3.2498).toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
  document.getElementById('cellCInput').value = Number(ref.cell.c || ref.cell.a || 5.2066).toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
  document.getElementById('cellBetaInput').value = Number(ref.cell.beta || 90.0).toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
  updateExtraCellRowVisibility();
}

function renderDbResults() {
  const container = document.getElementById('dbResultsList');
  container.innerHTML = '';
  if (!state.dbResults || !state.dbResults.length) {
    const empty = document.createElement('div');
    empty.style.cssText = 'font-size:11px; color:var(--chive-soft); padding:10px 6px; text-align:center;';
    const qNow = (document.getElementById('dbSearchInput')?.value || '').trim();
    if ((state.dbSource === 'cod' || state.dbSource === 'optimade') && !qNow && !hasActiveRestraints()) {
      const srcLabel = state.dbSource === 'cod' ? 'COD' : 'OPTIMADE';
      empty.textContent = `Enter a formula/name above or set Restraints, then click Auto Match or Query to search ${srcLabel}.`;
    } else {
      empty.textContent = hasActiveRestraints()
        ? 'No phases match the active Restraints / peak positions.'
        : 'No matching reference cards found.';
    }
    container.appendChild(empty);
    return;
  }

  const activeKey = state.activeReference
    ? String(state.activeReference.id || state.activeReference.jcpds || '')
    : '';

  const frag = document.createDocumentFragment();
  state.dbResults.forEach((phase) => {
    const phaseKey = String(phase.id || phase.jcpds || '');
    const isSelected = state.activeReference === phase || (Boolean(activeKey) && activeKey === phaseKey);
    const card = document.createElement('div');
    card.className = `db-card ${isSelected ? 'selected' : ''}`;
    const badgeText = phase.fom !== undefined ? `${phase.fom}%` : (phase.source || 'DB');
    const pkMatchInfo = phase.matched_peaks !== undefined && phase.total_ref_peaks !== undefined
      ? ` • ${phase.matched_peaks}/${phase.total_ref_peaks} pks`
      : '';
    const isLocalSrc = !phase.source || phase.source === 'Local DB' || String(phase.source).startsWith('Local');
    card.innerHTML = `
      <div class="db-card-main">
        <div class="db-card-title">${escapeHtml(phase.name || phase.formula)}</div>
        <div class="db-card-meta">
          <span>${escapeHtml(phase.jcpds ? 'JCPDS ' + phase.jcpds : phase.id)}</span>
          <span>•</span>
          <span>${escapeHtml(`${phase.system || ''} ${phase.space_group || ''}${pkMatchInfo}`.trim())}</span>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:5px;">
        ${!isLocalSrc ? `<button class="btn btn-sm save-local-btn" title="Save to Local DB">↓</button>` : ''}
        <span class="fom-badge">${escapeHtml(badgeText)}</span>
      </div>
    `;

    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('save-local-btn')) {
        e.stopPropagation();
        state.localDb = savePhaseToLocalStorage(phase);
        e.target.textContent = '✓';
        showToast(`Saved ${phase.formula || phase.name} to Local DB`, 'ok');
        return;
      }
      applyActiveReference(phase);
    });

    frag.appendChild(card);
  });
  container.appendChild(frag);
}

function runIndexPeaks(useReference = true) {
  if (!state.pattern) return;
  const { system, cell } = readUnitCellInputsFromUI();

  state.indexed = assignMillerIndicesClient(
    state.pattern.two_theta,
    state.pattern.intensity,
    useReference ? state.activeReference : null,
    system,
    cell,
    0.55
  );
  renderHklTable();
  renderGraph();
}

function renderHklTable() {
  const tbody = document.getElementById('hklTableBody');
  tbody.innerHTML = '';
  const peaks = (state.indexed && state.indexed.peaks) || [];
  const frag = document.createDocumentFragment();
  peaks.forEach((pk, idx) => {
    const tr = document.createElement('tr');
    if (state.highlightedPeakIdx === idx) tr.classList.add('row-highlight');
    tr.innerHTML = `
      <td><input type="checkbox" data-hkl-toggle="${idx}" ${pk.show_label ? 'checked' : ''} aria-label="Show peak ${idx + 1} label" /></td>
      <td><input type="number" step="0.01" class="pos-input" data-pos-edit="${idx}" value="${pk.two_theta.toFixed(2)}" aria-label="Peak ${idx + 1} 2theta" /></td>
      <td>${pk.d_obs.toFixed(3)}</td>
      <td>${pk.intensity.toFixed(0)}</td>
      <td><input type="text" class="hkl-input" data-hkl-edit="${idx}" value="${escapeHtml(pk.hkl_str || '')}" aria-label="Peak ${idx + 1} Miller index" /></td>
      <td><button class="icon-btn" data-hkl-del="${idx}" title="Delete">×</button></td>
    `;
    tr.addEventListener('pointerenter', () => {
      if (state.highlightedPeakIdx !== idx) {
        state.highlightedPeakIdx = idx;
        tr.classList.add('row-highlight');
        scheduleRenderGraph();
      }
    });
    tr.addEventListener('pointerleave', () => {
      if (state.highlightedPeakIdx === idx) {
        state.highlightedPeakIdx = -1;
        tr.classList.remove('row-highlight');
        scheduleRenderGraph();
      }
    });
    frag.appendChild(tr);
  });
  tbody.appendChild(frag);

  tbody.querySelectorAll('[data-hkl-toggle]').forEach((cb) => {
    cb.addEventListener('change', (e) => {
      const i = parseInt(e.target.dataset.hklToggle, 10);
      state.indexed.peaks[i].show_label = e.target.checked;
      renderGraph();
    });
  });

  tbody.querySelectorAll('[data-pos-edit]').forEach((inp) => {
    inp.addEventListener('input', (e) => {
      const i = parseInt(e.target.dataset.posEdit, 10);
      const tt = Math.max(2.0, Math.min(140.0, parseFloat(e.target.value) || 30.0));
      state.indexed.peaks[i].two_theta = tt;
      state.indexed.peaks[i].d_obs = Number((1.5406 / (2 * Math.sin((tt / 2) * (Math.PI / 180)))).toFixed(4));
      scheduleRenderGraph();
    });
  });

  tbody.querySelectorAll('[data-hkl-edit]').forEach((inp) => {
    inp.addEventListener('input', (e) => {
      const i = parseInt(e.target.dataset.hklEdit, 10);
      state.indexed.peaks[i].hkl_str = e.target.value;
      state.indexed.peaks[i].show_label = Boolean(e.target.value.trim());
      scheduleRenderGraph();
    });
  });

  tbody.querySelectorAll('[data-hkl-del]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const i = parseInt(e.target.dataset.hklDel, 10);
      if (state.highlightedPeakIdx === i) state.highlightedPeakIdx = -1;
      state.indexed.peaks.splice(i, 1);
      renderHklTable();
      renderGraph();
    });
  });
}

async function computeRietveldBestAvailable(refPhase) {
  if (state.backendAvailable) {
    try {
      const resp = await fetch('/api/rietveld', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          two_theta: state.pattern.two_theta,
          intensity: state.pattern.intensity,
          phase: refPhase,
          wavelength: 1.540598
        })
      });
      if (resp.ok) {
        return await resp.json();
      }
    } catch (_) {
      // Fall back to client-side engine seamlessly
    }
  }
  return runRietveldClient(state.pattern.two_theta, state.pattern.intensity, refPhase, 1.540598);
}

async function runRietveld() {
  if (!state.pattern) return;
  const refPhase = state.activeReference || SEED_PHASES[0];
  if (!state.activeReference) {
    showToast('No reference selected — refining against default ZnO card', 'info');
  }
  const btn = document.getElementById('runRietveldBtn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Refining...';
  }
  try {
    state.rietveld = await computeRietveldBestAvailable(refPhase);
    updateRietveldStatsUI(state.rietveld.metrics);
    state.viewMode = 'rietveld';
    updateViewTabs();
    renderGraph();
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Refine';
    }
  }
}

function updateRietveldStatsUI(m) {
  document.getElementById('statRwp').textContent = Number(m.rwp ?? 0).toFixed(2);
  document.getElementById('statChi2').textContent = Number(m.chi2 ?? 1).toFixed(2);
  document.getElementById('statRp').textContent = Number(m.rp ?? 0).toFixed(2);
  document.getElementById('statRexp').textContent = Number(m.rexp ?? 0).toFixed(2);
  document.getElementById('statCellA').textContent = Number(m.a ?? 0).toFixed(4);
  document.getElementById('statCellC').textContent = Number(m.c ?? 0).toFixed(4);
  document.getElementById('statSize').textContent = Number(m.crystallite_nm ?? 0).toFixed(1);
  document.getElementById('statVol').textContent = Number(m.volume ?? 0).toFixed(2);
  document.getElementById('statStrain').textContent = Number(m.microstrain_pct ?? 0.08).toFixed(3);
  const rbEl = document.getElementById('statRBragg');
  if (rbEl) rbEl.textContent = m.r_bragg !== undefined ? Number(m.r_bragg).toFixed(2) : '—';
  const crEl = document.getElementById('statCryst');
  if (crEl) crEl.textContent = m.crystallinity_pct !== undefined ? Number(m.crystallinity_pct).toFixed(1) : '—';
}

/* =========================================================================
   SINGLE-PATTERN PUBLICATION GRAPH RENDERER (300 DPI + MANUAL INTERACTION)
   ========================================================================= */
function renderGraph(targetCanvas = null, forceMode = null, suppressOverlays = false) {
  const canvas = targetCanvas || document.getElementById('xrdCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width;   // 1800 px (6.0 in @ 300 DPI)
  const H = canvas.height;  // 1575 px (5.25 in @ 300 DPI)
  const mode = forceMode || state.viewMode;

  if (!targetCanvas) {
    state.hitBoxes = [];
  }

  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.setLineDash([]);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  if (mode === 'rietveld' && state.rietveld) {
    drawRietveldPlot(ctx, W, H, !targetCanvas && !suppressOverlays);
  } else {
    drawSinglePatternPlot(ctx, W, H, !targetCanvas && !suppressOverlays);
  }
  ctx.restore();
}

function drawSinglePatternPlot(ctx, W, H, registerInteractive = true) {
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

  // 1. Draw JCPDS Reference Pattern Stick Bars at Bottom of Box
  const stickZoneH = 220;
  if (state.activeReference && Array.isArray(state.activeReference.peaks) && state.activeReference.peaks.length) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(left, top, plotW, plotH);
    ctx.clip();

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5.5;
    ctx.lineCap = 'butt';

    let maxRefInt = 0;
    for (const pk of state.activeReference.peaks) {
      const iv = Number(pk.intensity);
      if (Number.isFinite(iv) && iv > maxRefInt) maxRefInt = iv;
    }
    const intScale = maxRefInt > 0 ? maxRefInt : 100;

    state.activeReference.peaks.forEach((pk) => {
      let tt = Number(pk.two_theta);
      if ((!Number.isFinite(tt) || tt <= 0) && Number(pk.d) > 0) {
        const sTh = 1.5406 / (2 * Number(pk.d));
        if (sTh > 0 && sTh < 0.998) tt = (2 * Math.asin(sTh) * 180) / Math.PI;
      }
      if (Number.isFinite(tt) && tt >= minX && tt <= maxX) {
        const px = xToPx(tt);
        const relInt = Math.max(2, Math.min(100, (Number(pk.intensity || 10) / intScale) * 100));
        const barH = (relInt / 100) * (stickZoneH - 20);
        ctx.beginPath();
        ctx.moveTo(px, bottom);
        ctx.lineTo(px, bottom - barH);
        ctx.stroke();
      }
    });
    ctx.restore();
  }

  // Compute top-right JCPDS legend geometry upfront so (hkl) labels can avoid overlapping it
  let refLegendRect = null;
  if (state.activeReference && state.labels.refTag) {
    ctx.save();
    ctx.font = '43px "Times New Roman", Times, serif';
    const refParts = (state.labels.refTag || '').split('|').map((s) => s.trim());
    const line1 = refParts[0] || '';
    const line2 = refParts[1] || '';
    const wRef = Math.max(
      line1 ? ctx.measureText(line1).width : 0,
      line2 ? ctx.measureText(line2).width : 0,
      120
    );
    ctx.restore();
    const blockRight = right - 44 + (state.labels.refOffset.dx || 0);
    const rx = blockRight - wRef;
    const ry = top + 98 + (state.labels.refOffset.dy || 0);
    refLegendRect = {
      line1,
      line2,
      rx,
      ry,
      wRef,
      x: rx - 38,
      y: ry - 44,
      w: wRef + 50,
      h: line2 ? 112 : 58
    };
  }

  // 2. Draw Single Experimental XRD Pattern
  if (state.pattern) {
    const baseLineY = bottom - stickZoneH - 45;
    const peakAmpH = baseLineY - (top + 225);
    const xs = state.pattern.two_theta;
    const ys = state.pattern.intensity;

    const visStart = Math.max(0, lowerBound(xs, minX) - 1);
    const visEnd = Math.min(xs.length, upperBound(xs, maxX) + 1);

    let minVal = Infinity;
    let maxVal = -Infinity;
    for (let i = visStart; i < visEnd; i++) {
      if (xs[i] >= minX && xs[i] <= maxX) {
        if (ys[i] < minVal) minVal = ys[i];
        if (ys[i] > maxVal) maxVal = ys[i];
      }
    }
    if (!Number.isFinite(minVal)) minVal = 0;
    const rangeY = Math.max(maxVal - minVal, 1e-3);

    ctx.save();
    ctx.beginPath();
    ctx.rect(left, top, plotW, plotH);
    ctx.clip();

    ctx.strokeStyle = state.pattern.color || '#e60000';
    ctx.lineWidth = 4.4;
    ctx.lineJoin = 'round';
    ctx.beginPath();

    const visCount = visEnd - visStart;
    if (visCount <= 3200) {
      let started = false;
      for (let i = visStart; i < visEnd; i++) {
        const px = xToPx(xs[i]);
        const normY = (ys[i] - minVal) / rangeY;
        const py = baseLineY - normY * peakAmpH;
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
    } else {
      // Pixel-bucket min-max envelope decimation for ultra-dense scans (>3,200 points)
      const nBuckets = Math.floor(plotW);
      let started = false;
      let curBucket = -1;
      let bMinY = Infinity, bMaxY = -Infinity, bFirstY = 0, bLastY = 0, bX = 0;
      const flushBucket = () => {
        if (curBucket < 0) return;
        if (!started) {
          ctx.moveTo(bX, bFirstY);
          started = true;
        } else {
          ctx.lineTo(bX, bFirstY);
        }
        if (bMaxY > bMinY + 0.5) {
          ctx.lineTo(bX, bMinY);
          ctx.lineTo(bX, bMaxY);
        }
        ctx.lineTo(bX, bLastY);
      };
      for (let i = visStart; i < visEnd; i++) {
        const px = xToPx(xs[i]);
        const b = Math.floor(px - left);
        const py = baseLineY - ((ys[i] - minVal) / rangeY) * peakAmpH;
        if (b !== curBucket) {
          flushBucket();
          curBucket = b;
          bX = Math.max(left, Math.min(right, left + Math.min(nBuckets, Math.max(0, b)) + 0.5));
          bFirstY = py;
          bLastY = py;
          bMinY = py;
          bMaxY = py;
        } else {
          bLastY = py;
          if (py < bMinY) bMinY = py;
          if (py > bMaxY) bMaxY = py;
        }
      }
      flushBucket();
    }
    ctx.stroke();

    // Interactive peak marker when hovering a row in the Miller Indices table
    if (registerInteractive && state.highlightedPeakIdx >= 0 && state.indexed && state.indexed.peaks[state.highlightedPeakIdx]) {
      const hpk = state.indexed.peaks[state.highlightedPeakIdx];
      if (hpk.two_theta >= minX && hpk.two_theta <= maxX) {
        const hpx = xToPx(hpk.two_theta);
        ctx.save();
        ctx.strokeStyle = 'rgba(194, 30, 86, 0.55)';
        ctx.lineWidth = 3.0;
        ctx.setLineDash([10, 8]);
        ctx.beginPath();
        ctx.moveTo(hpx, top);
        ctx.lineTo(hpx, bottom);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Subtle live cursor vertical guide (suppressed on PNG/Report export)
    if (registerInteractive && state.cursor2Theta !== null && state.cursor2Theta >= minX && state.cursor2Theta <= maxX) {
      const cpx = xToPx(state.cursor2Theta);
      ctx.save();
      ctx.strokeStyle = 'rgba(24, 36, 30, 0.22)';
      ctx.lineWidth = 2.0;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(cpx, top);
      ctx.lineTo(cpx, bottom);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();

    // 3. Draw Editable Pattern Legend Label
    const legX = left + 42 + (state.labels.legendOffset.dx || 0);
    const legY = top + 115 + (state.labels.legendOffset.dy || 0);
    if (state.labels.legend) {
      const lineSampleW = 68;
      const lineGap = 24;
      // Color line sample + legend text (explicit left alignment prevents overlap)
      ctx.save();
      ctx.strokeStyle = state.pattern.color || '#e60000';
      ctx.lineWidth = 6;
      ctx.lineCap = 'butt';
      ctx.beginPath();
      ctx.moveTo(legX, legY - 14);
      ctx.lineTo(legX + lineSampleW, legY - 14);
      ctx.stroke();
      ctx.restore();

      const textX = legX + lineSampleW + lineGap;
      const textW = drawFormattedTraceLabel(ctx, state.labels.legend, textX, legY, '#000000');

      if (registerInteractive) {
        const lw = lineSampleW + lineGap + textW;
        state.hitBoxes.push({
          id: 'legend',
          type: 'legend',
          x: legX - 10,
          y: legY - 46,
          w: lw + 20,
          h: 62
        });
      }
    }

    // 4. Draw Vertical (hkl) Miller Indices above Peaks
    if (state.showHkl && state.indexed && state.indexed.peaks) {
      ctx.fillStyle = '#000000';
      ctx.font = '40px "Times New Roman", Times, serif';

      state.indexed.peaks.forEach((pk, idx) => {
        if (!pk.show_label || !pk.hkl_str || pk.two_theta < minX || pk.two_theta > maxX) return;

        let bestY = baseLineY;
        let bestX = xToPx(pk.two_theta);
        const wLo = lowerBound(xs, pk.two_theta - 0.45);
        const wHi = upperBound(xs, pk.two_theta + 0.45);
        for (let i = wLo; i < wHi; i++) {
          const tt = xs[i];
          const normY = (ys[i] - minVal) / rangeY;
          const py = baseLineY - normY * peakAmpH;
          if (py < bestY) {
            bestY = py;
            bestX = xToPx(tt);
          }
        }

        const textW = ctx.measureText(pk.hkl_str).width;
        let anchorX = bestX + (pk.dx || 0);
        let anchorY = bestY - 24 + (pk.dy || 0);

        // Keep tallest peak label cleanly inside top border & avoid overlapping top-right JCPDS legend
        if (anchorY - textW < top + 14) {
          anchorX = bestX + 44 + (pk.dx || 0);
          anchorY = Math.max(top + textW + 20, bestY + textW * 0.55) + (pk.dy || 0);
        }
        if (
          refLegendRect &&
          !pk.dx &&
          !pk.dy &&
          anchorX + 26 >= refLegendRect.x &&
          anchorX - 26 <= refLegendRect.x + refLegendRect.w &&
          anchorY - textW < refLegendRect.y + refLegendRect.h + 12
        ) {
          anchorY = Math.max(anchorY, refLegendRect.y + refLegendRect.h + textW + 18);
        }

        ctx.save();
        ctx.translate(anchorX, anchorY);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(pk.hkl_str, 0, 0);
        ctx.restore();

        if (registerInteractive) {
          state.hitBoxes.push({
            id: `hkl_${idx}`,
            type: 'hkl',
            index: idx,
            x: anchorX - 26,
            y: anchorY - textW - 8,
            w: 52,
            h: textW + 16
          });
        }
      });
    }
  }

  // 5. Draw JCPDS Reference Card Legend at Top-Right of Graph (Editable in Manual Mode)
  if (refLegendRect) {
    const { line1, line2, rx, ry, x, y, w, h } = refLegendRect;
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.font = '43px "Times New Roman", Times, serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // Reference stick bar sample icon to the left of the JCPDS text block
    const iconX = rx - 22;
    const iconTop = ry - 34;
    const iconBot = line2 ? ry + 56 : ry + 6;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5.5;
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.moveTo(iconX, iconTop);
    ctx.lineTo(iconX, iconBot);
    ctx.stroke();

    if (line1) ctx.fillText(line1, rx, ry);
    if (line2) ctx.fillText(line2, rx, ry + 54);
    ctx.restore();

    if (registerInteractive) {
      state.hitBoxes.push({
        id: 'refTag',
        type: 'refTag',
        x,
        y,
        w,
        h
      });
    }
  }

  // 6. Draw 4-Sided Publication Frame & Editable Axis Labels
  drawPublicationAxes(ctx, left, right, top, bottom, minX, maxX, registerInteractive);

  // 6. Highlight Hovered Interactive Element in Manual Mode
  if (registerInteractive && state.manualMode && state.hoveredBox) {
    const b = state.hoveredBox;
    ctx.save();
    ctx.strokeStyle = '#C21E56';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(b.x, b.y, b.w, b.h);
    ctx.restore();
  }
}

function drawFormattedTraceLabel(ctx, text, x, y, color = '#000000') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  let totalW = 0;
  const m = text.match(/^([a-zA-Z])\s*=\s*(.*)$/);
  if (m) {
    const varChar = m[1];
    const rest = ` = ${m[2]}`;
    ctx.font = 'italic 44px "Times New Roman", Times, serif';
    ctx.fillText(varChar, x, y);
    const varW = ctx.measureText(varChar).width;
    ctx.font = '44px "Times New Roman", Times, serif';
    ctx.fillText(rest, x + varW, y);
    totalW = varW + ctx.measureText(rest).width;
  } else {
    ctx.font = '44px "Times New Roman", Times, serif';
    ctx.fillText(text, x, y);
    totalW = ctx.measureText(text).width;
  }
  ctx.restore();
  return totalW;
}

function drawPublicationAxes(ctx, left, right, top, bottom, minX, maxX, registerInteractive = true) {
  ctx.save();
  const plotW = right - left;
  const plotH = bottom - top;
  const spanX = Math.max(maxX - minX, 1);
  const xToPx = (tt) => left + ((tt - minX) / spanX) * plotW;

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4.2;
  ctx.strokeRect(left, top, plotW, plotH);

  const majorStep = spanX <= 25 ? 5 : 10;
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

  // Bottom X-Axis Label (Editable)
  const centerX = (left + right) / 2;
  const labelY = bottom + 142;
  const xText = state.labels.xAxis || '2θ (degree)';

  ctx.save();
  if (xText === '2θ (degree)') {
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
    ctx.fillText('2', curX, labelY);
    curX += w2;
    ctx.font = 'italic 48px "Times New Roman", Times, serif';
    ctx.fillText('θ', curX, labelY);
    curX += wTheta;
    ctx.font = '48px "Times New Roman", Times, serif';
    ctx.fillText(' (degree)', curX, labelY);
  } else {
    ctx.font = '48px "Times New Roman", Times, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(xText, centerX, labelY);
  }
  ctx.restore();

  if (registerInteractive) {
    state.hitBoxes.push({
      id: 'xAxis',
      type: 'xAxis',
      x: centerX - 180,
      y: labelY - 48,
      w: 360,
      h: 64
    });
  }

  // Left Y-Axis Label (Editable)
  const yText = state.labels.yAxis || 'Intensity (a.u.)';
  const centerY = (top + bottom) / 2;
  ctx.save();
  ctx.translate(72, centerY);
  ctx.rotate(-Math.PI / 2);
  ctx.font = '48px "Times New Roman", Times, serif';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(yText, 0, 0);
  ctx.restore();

  if (registerInteractive) {
    state.hitBoxes.push({
      id: 'yAxis',
      type: 'yAxis',
      x: 34,
      y: centerY - 190,
      w: 74,
      h: 380
    });
  }
  ctx.restore();
}

function drawRietveldPlot(ctx, W, H, registerInteractive = true) {
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

  const visStart = Math.max(0, lowerBound(xs, minX) - 1);
  const visEnd = Math.min(xs.length, upperBound(xs, maxX) + 1);

  let maxY = 1e-6;
  let maxDiff = 1e-6;
  for (let i = visStart; i < visEnd; i++) {
    if (xs[i] >= minX && xs[i] <= maxX) {
      if (yObs[i] > maxY) maxY = yObs[i];
      if (yCalc[i] > maxY) maxY = yCalc[i];
      if (Math.abs(yDiff[i]) > maxDiff) maxDiff = Math.abs(yDiff[i]);
    }
  }

  const mainBaseY = bottom - 310;
  const mainHeight = mainBaseY - (top + 140);
  const diffZeroY = bottom - 115;
  const diffScale = 85 / Math.max(maxDiff, 1e-6);

  ctx.save();
  ctx.beginPath();
  ctx.rect(left, top, plotW, plotH);
  ctx.clip();

  // Yobs dots (adaptive stride for dense scans)
  const obsStride = Math.max(2, Math.ceil((visEnd - visStart) / 900));
  ctx.fillStyle = '#18241E';
  for (let i = visStart; i < visEnd; i += obsStride) {
    const tt = xs[i];
    if (tt < minX || tt > maxX) continue;
    const px = xToPx(tt);
    const py = mainBaseY - (yObs[i] / maxY) * mainHeight;
    ctx.beginPath();
    ctx.arc(px, py, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ycalc solid curve
  const calcStride = Math.max(1, Math.floor((visEnd - visStart) / 2400));
  ctx.strokeStyle = '#C21E56';
  ctx.lineWidth = 4.0;
  ctx.beginPath();
  let started = false;
  for (let i = visStart; i < visEnd; i += calcStride) {
    const px = xToPx(xs[i]);
    const py = mainBaseY - (yCalc[i] / maxY) * mainHeight;
    if (!started) {
      ctx.moveTo(px, py);
      started = true;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  // Bragg ticks
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

  // Difference curve (Yobs - Ycalc)
  ctx.strokeStyle = '#0018c4';
  ctx.lineWidth = 3.0;
  ctx.beginPath();
  started = false;
  for (let i = visStart; i < visEnd; i += calcStride) {
    const px = xToPx(xs[i]);
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
      .filter((t) => t.intensity >= 12 && t.two_theta >= minX && t.two_theta <= maxX)
      .forEach((tk) => {
        const px = xToPx(tk.two_theta);
        let apexY = mainBaseY;
        const wLo = lowerBound(xs, tk.two_theta - 0.35);
        const wHi = upperBound(xs, tk.two_theta + 0.35);
        for (let i = wLo; i < wHi; i++) {
          const py = mainBaseY - (yCalc[i] / maxY) * mainHeight;
          if (py < apexY) apexY = py;
        }
        ctx.save();
        ctx.translate(px, Math.max(top + 125, apexY - 18));
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
  ctx.fillText(`${r.phase_name}`, left + 36, top + 64);
  if (state.labels.refTag || r.phase_id) {
    const refParts = (state.labels.refTag || `JCPDS No. | ${r.phase_id}`).split('|').map((s) => s.trim());
    ctx.save();
    ctx.font = '38px "Times New Roman", Times, serif';
    ctx.textAlign = 'right';
    if (refParts[0]) ctx.fillText(refParts[0], right - 44, top + 64);
    if (refParts[1]) ctx.fillText(refParts[1], right - 44, top + 110);
    ctx.restore();
  }
  ctx.font = '34px "Times New Roman", Times, serif';
  ctx.textAlign = 'left';
  const rbText = r.metrics.r_bragg !== undefined ? `   RB = ${Number(r.metrics.r_bragg).toFixed(2)}%` : '';
  ctx.fillText(
    `Rwp = ${r.metrics.rwp.toFixed(2)}%   Rp = ${r.metrics.rp.toFixed(2)}%${rbText}   χ² = ${r.metrics.chi2.toFixed(2)}`,
    left + 36,
    top + 112
  );
  ctx.fillText(
    `a = ${r.metrics.a.toFixed(4)} Å   c = ${r.metrics.c.toFixed(4)} Å   D = ${r.metrics.crystallite_nm.toFixed(1)} nm`,
    left + 36,
    top + 156
  );

  drawPublicationAxes(ctx, left, right, top, bottom, minX, maxX, registerInteractive);
}

/* =========================================================================
   AUTOMATIC FULL XRD ANALYSIS & PUBLICATION REPORT GENERATOR
   ========================================================================= */
async function generateFullReport() {
  if (!state.pattern) return;

  const ref = state.activeReference || SEED_PHASES[0];
  const repBtn = document.getElementById('generateReportBtn');
  if (repBtn) {
    repBtn.disabled = true;
    repBtn.textContent = 'Building...';
  }

  try {
    // 2. Run automated Miller Index Assignment (while preserving manual (hkl) edits if already indexed)
    if (!state.indexed || !state.indexed.peaks || state.indexed.peaks.length === 0) {
      state.indexed = assignMillerIndicesClient(
        state.pattern.two_theta,
        state.pattern.intensity,
        ref,
        ref.system,
        ref.cell,
        0.55
      );
      renderHklTable();
    }

    // 3. Run Full-Profile Rietveld Refinement & Microstructural Analysis
    state.rietveld = await computeRietveldBestAvailable(ref);
    updateRietveldStatsUI(state.rietveld.metrics);
    renderGraph();

    // 4. Render 300 DPI offscreen images for Both Pattern & Rietveld Figures
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 1800;
    offCanvas.height = 1575;

    renderGraph(offCanvas, 'pattern', true);
    const patternImgUrl = offCanvas.toDataURL('image/png');

    renderGraph(offCanvas, 'rietveld', true);
    const rietveldImgUrl = offCanvas.toDataURL('image/png');

    // 5. Build Publication-Ready Report Content
    const m = state.rietveld.metrics;
    const dateStr = new Date().toISOString().split('T')[0];
    const sampleTitle = escapeHtml(state.pattern.label || 'Sample');
    const safeRefName = escapeHtml(ref.name || ref.formula || 'Reference Phase');
    const safeRefSys = escapeHtml(ref.system || 'Crystalline');
    const safeRefSg = escapeHtml(ref.space_group || 'P1');
    const safeRefTag = escapeHtml((state.labels.refTag || formatRefTag(ref)).replace('|', ''));
    const fomText = ref.fom !== undefined ? `Figure of Merit = ${Number(ref.fom).toFixed(1)}%` : `Source: ${escapeHtml(ref.source || 'Database')}`;
    const indexedPeaks = (state.indexed.peaks || []).filter((p) => p.indexed);
    const topPeaksDesc = escapeHtml(
      indexedPeaks
        .slice(0, 6)
        .map((p) => `${p.two_theta.toFixed(2)}° ${p.hkl_str}`)
        .join(', ') || 'characteristic Bragg positions'
    );
    const rBraggVal = m.r_bragg !== undefined ? Number(m.r_bragg).toFixed(2) : '—';

    const reportEl = document.getElementById('reportContent');
    reportEl.innerHTML = `
    <div class="report-header">
      <div>
        <div class="report-title" contenteditable="true">${sampleTitle} — X-Ray Diffraction Report</div>
        <div class="report-meta">Radiation: Cu Kα₁,₂ (λ₁ = 1.5406 Å) • Range: ${state.min2Theta}°–${state.max2Theta}° 2θ • Points: ${state.pattern.num_points}</div>
      </div>
      <div class="report-meta">Date: ${dateStr}</div>
    </div>

    <div class="report-summary-text" contenteditable="true">
      <strong>Manuscript Summary (Editable):</strong> Powder X-ray diffraction (XRD) analysis of <strong>${sampleTitle}</strong> confirms the formation of crystalline <strong>${safeRefName}</strong> (${safeRefSys}, space group <em>${safeRefSg}</em>, ${safeRefTag}, ${fomText}). Characteristic diffraction reflections are observed at 2θ = ${topPeaksDesc}. Full-profile Thompson–Cox–Hastings Rietveld refinement converged with agreement factors of <em>R</em><sub>wp</sub> = ${m.rwp.toFixed(2)}%, <em>R</em><sub>p</sub> = ${m.rp.toFixed(2)}%, <em>R</em><sub>B</sub> = ${rBraggVal}%, and χ² = ${m.chi2.toFixed(2)}, yielding refined unit-cell parameters <em>a</em> = ${m.a.toFixed(4)} Å, <em>b</em> = ${m.b.toFixed(4)} Å, <em>c</em> = ${m.c.toFixed(4)} Å (<em>V</em> = ${m.volume.toFixed(2)} Å³). The average coherent crystallite size estimated from instrumental-corrected profile broadening is <strong>${m.crystallite_nm.toFixed(1)} nm</strong> with a Stokes–Wilson lattice microstrain of <strong>${m.microstrain_pct.toFixed(4)}%</strong> and Ruland crystallinity index of <strong>${m.crystallinity_pct.toFixed(1)}%</strong>.
    </div>

    <div class="report-figures-grid">
      <div class="report-figure-card">
        <img src="${patternImgUrl}" alt="Indexed XRD Pattern" />
        <div class="report-figure-caption">Figure 1. Indexed powder XRD pattern of ${sampleTitle} with ${safeRefTag} reference bars.</div>
      </div>
      <div class="report-figure-card">
        <img src="${rietveldImgUrl}" alt="Rietveld Refinement Profile" />
        <div class="report-figure-caption">Figure 2. Rietveld refinement profile (Observed, Calculated, Bragg ticks, and Difference curve).</div>
      </div>
    </div>

    <div class="report-section-h3">1. Phase Identification &amp; Refined Structural Parameters</div>
    <table class="report-table">
      <thead>
        <tr>
          <th>Phase / Formula</th>
          <th>Reference ID</th>
          <th>Crystal System</th>
          <th>Space Group</th>
          <th>a (Å)</th>
          <th>b (Å)</th>
          <th>c (Å)</th>
          <th>Volume (Å³)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>${safeRefName}</strong></td>
          <td>${safeRefTag}</td>
          <td>${safeRefSys}</td>
          <td>${safeRefSg}</td>
          <td>${m.a.toFixed(4)}</td>
          <td>${m.b.toFixed(4)}</td>
          <td>${m.c.toFixed(4)}</td>
          <td>${m.volume.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div class="report-section-h3">2. Rietveld Agreement Indices &amp; Microstructure</div>
    <table class="report-table">
      <thead>
        <tr>
          <th>R<sub>wp</sub> (%)</th>
          <th>R<sub>p</sub> (%)</th>
          <th>R<sub>exp</sub> (%)</th>
          <th>R<sub>B</sub> (%)</th>
          <th>χ² (GOF)</th>
          <th>Zero Shift (°2θ)</th>
          <th>Crystallite Size (nm)</th>
          <th>Microstrain (%)</th>
          <th>Crystallinity (%)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>${m.rwp.toFixed(2)}</strong></td>
          <td>${m.rp.toFixed(2)}</td>
          <td>${m.rexp.toFixed(2)}</td>
          <td>${rBraggVal}</td>
          <td><strong>${m.chi2.toFixed(2)}</strong></td>
          <td>${m.zero_shift.toFixed(4)}</td>
          <td><strong>${m.crystallite_nm.toFixed(1)}</strong></td>
          <td>${m.microstrain_pct.toFixed(4)}</td>
          <td>${m.crystallinity_pct.toFixed(1)}</td>
        </tr>
      </tbody>
    </table>

    <div class="report-section-h3">3. Indexed Diffraction Peak List (hkl)</div>
    <table class="report-table">
      <thead>
        <tr>
          <th>No.</th>
          <th>(hkl)</th>
          <th>2θ<sub>obs</sub> (°)</th>
          <th>2θ<sub>calc</sub> (°)</th>
          <th>Δ2θ (°)</th>
          <th>d<sub>obs</sub> (Å)</th>
          <th>d<sub>calc</sub> (Å)</th>
          <th>FWHM (°)</th>
          <th>Rel. Intensity (%)</th>
        </tr>
      </thead>
      <tbody>
        ${(state.indexed.peaks || [])
          .map(
            (pk, i) => `
          <tr>
            <td>${i + 1}</td>
            <td><strong>${escapeHtml(pk.hkl_str || '—')}</strong></td>
            <td>${pk.two_theta.toFixed(3)}</td>
            <td>${pk.two_theta_calc !== null ? pk.two_theta_calc.toFixed(3) : '—'}</td>
            <td>${pk.delta_2theta !== null && pk.delta_2theta !== undefined ? pk.delta_2theta.toFixed(4) : '—'}</td>
            <td>${pk.d_obs.toFixed(4)}</td>
            <td>${pk.d_calc !== null ? pk.d_calc.toFixed(4) : '—'}</td>
            <td>${(pk.fwhm || 0.24).toFixed(3)}</td>
            <td>${pk.intensity.toFixed(1)}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `;

    document.getElementById('reportModal').hidden = false;
  } finally {
    if (repBtn) {
      repBtn.disabled = false;
      repBtn.textContent = 'Report';
    }
  }
}

function downloadStandaloneReportHtml() {
  const content = document.getElementById('reportContent').innerHTML;
  const sampleTitle = state.pattern ? state.pattern.label : 'XRD_Report';
  const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${sampleTitle} — XRD Analysis Report</title>
<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; max-width: 960px; margin: 28px auto; padding: 0 20px; line-height: 1.5; }
  .report-header { border-bottom: 2px solid #18241E; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
  .report-title { font-family: Georgia, serif; font-style: italic; font-size: 26px; color: #18241E; }
  .report-meta { font-size: 12px; color: #444; }
  .report-summary-text { background: #F7F5FA; border-left: 4px solid #C21E56; padding: 12px 16px; font-size: 13px; margin-bottom: 22px; }
  .report-figures-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 22px; }
  .report-figure-card { border: 1px solid #DDD; padding: 8px; text-align: center; }
  .report-figure-card img { width: 100%; height: auto; }
  .report-figure-caption { font-size: 11px; font-weight: 600; margin-top: 6px; }
  .report-section-h3 { font-size: 13px; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #CCC; padding-bottom: 4px; margin: 18px 0 10px; color: #18241E; }
  .report-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 16px; }
  .report-table th { background: #18241E; color: #FFF; text-align: left; padding: 6px 8px; }
  .report-table td { padding: 6px 8px; border-bottom: 1px solid #E2E2E2; }
</style>
</head>
<body>${content}</body>
</html>`;

  const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sampleTitle.replace(/\s+/g, '_')}_XRD_Report.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadReportCsv() {
  const rows = [
    ['Peak_No', 'Miller_Index_hkl', '2Theta_Obs_deg', '2Theta_Calc_deg', 'd_Obs_A', 'd_Calc_A', 'FWHM_deg', 'Rel_Intensity_pct']
  ];
  (state.indexed.peaks || []).forEach((pk, i) => {
    rows.push([
      i + 1,
      pk.hkl_str || '',
      pk.two_theta.toFixed(3),
      pk.two_theta_calc !== null ? pk.two_theta_calc.toFixed(3) : '',
      pk.d_obs.toFixed(4),
      pk.d_calc !== null ? pk.d_calc.toFixed(4) : '',
      (pk.fwhm || 0.24).toFixed(3),
      pk.intensity.toFixed(1)
    ]);
  });

  const csvContent = rows.map((r) => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const sampleTitle = state.pattern ? state.pattern.label : 'XRD';
  a.href = url;
  a.download = `${sampleTitle.replace(/\s+/g, '_')}_Indexed_Peaks.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* =========================================================================
   TRUE 300 DPI PNG EXPORT (Embeds binary PNG pHYs chunk = 11811 px/meter)
   ========================================================================= */
function download300DpiPng() {
  // Render cleanly without hover box, live cursor guide, or row highlight marker
  renderGraph(null, null, true);

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
  renderGraph();
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

/* ============================================================================
   DB INDEX (.sq LOCAL DESKTOP DATABASE) & QUALX RESTRAINTS WINDOW CONTROLLERS
   ============================================================================ */

let compSummaryBoxEl = null;
let ptableElementBtnMap = new Map();
let sqlJsEnginePromise = null;

async function initBackendAndSqStatus() {
  try {
    const resp = await fetch('/api/database/sq-status');
    if (!resp.ok) return;
    const data = await resp.json();
    state.backendAvailable = true;
    state.desktopDir = data.desktop_dir || '';
    state.sqIndex.rawPath = data.raw_path || '';
    state.sqIndex.files = data.files || [];
    state.sqIndex.totalCards = data.total_sq_cards || 0;
    updateDbFolderPathUI();
    updateSqStatusBoxUI(data);
  } catch (_) {
    state.backendAvailable = false;
  }
}

function activateDbSourcePill(source) {
  state.dbSource = source;
  document.querySelectorAll('.pill-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.source === source);
  });
}

function updateDbFolderPathUI() {
  const pathEl = document.getElementById('dbFolderPath');
  const idxBtn = document.getElementById('dbIndexBtn');
  const files = state.sqIndex.files || [];
  if (files.length > 0) {
    const names = files.map((f) => f.name).join(', ');
    const cardsTxt = state.sqIndex.totalCards ? ` (${state.sqIndex.totalCards} cards)` : '';
    pathEl.textContent = `db index: ${names}${cardsTxt}`;
    pathEl.title = state.sqIndex.rawPath || names;
    idxBtn.classList.add('has-active');
  } else {
    pathEl.textContent = 'database/ (Local + COD + OPTIMADE)';
    pathEl.title = 'Click to configure local Desktop .sq database index';
    idxBtn.classList.remove('has-active');
  }
}

function updateSqStatusBoxUI(statusObj, errorMsg = '') {
  const box = document.getElementById('sqStatusBox');
  box.classList.remove('ok', 'err');
  if (errorMsg) {
    box.classList.add('err');
    box.textContent = errorMsg;
    return;
  }
  const files = (statusObj && statusObj.files) || state.sqIndex.files || [];
  if (files.length > 0) {
    box.classList.add('ok');
    const summary = files.map((f) => `${f.name} (${f.cards ?? '?'} cards)`).join(', ');
    box.textContent = `Indexed .sq database: ${summary}`;
  } else {
    box.textContent = 'No external .sq file indexed yet (using built-in database/).';
  }
}

async function openDbIndexModal() {
  const modal = document.getElementById('dbIndexModal');
  const input = document.getElementById('sqPathInput');
  modal.hidden = false;
  if (state.sqIndex.rawPath) {
    input.value = state.sqIndex.rawPath;
  } else if (state.desktopDir && !input.value) {
    input.placeholder = `${state.desktopDir}\\pdf2-1.sq`;
  }
  if (state.backendAvailable) {
    await browseServerSqDirectory();
  } else {
    renderClientSqBrowserFallback();
  }
}

function closeDbIndexModal() {
  document.getElementById('dbIndexModal').hidden = true;
}

function renderClientSqBrowserFallback() {
  const label = document.getElementById('sqBrowserDirLabel');
  const list = document.getElementById('sqBrowserList');
  label.textContent = 'Static Browser Mode — Use "Browse .sq File..." or "Browse Desktop Folder..." above';
  list.innerHTML = '';
  const files = state.sqIndex.files || [];
  if (!files.length) {
    const row = document.createElement('div');
    row.className = 'sq-item';
    row.textContent = 'Select a local .sq file (e.g. pdf2-1.sq) from your Desktop folder above.';
    list.appendChild(row);
    return;
  }
  files.forEach((f) => {
    const row = document.createElement('div');
    row.className = 'sq-item';
    row.innerHTML = `<span>🗄️ ${f.name}</span><span class="sq-item-meta">${f.cards || 0} cards (loaded)</span>`;
    list.appendChild(row);
  });
}

async function browseServerSqDirectory(dirPath = '') {
  if (!state.backendAvailable) {
    renderClientSqBrowserFallback();
    return;
  }
  const label = document.getElementById('sqBrowserDirLabel');
  const list = document.getElementById('sqBrowserList');
  try {
    const url = dirPath
      ? `/api/database/sq-browse?dir=${encodeURIComponent(dirPath)}`
      : '/api/database/sq-browse';
    const resp = await fetch(url);
    if (!resp.ok) return;
    const data = await resp.json();
    if (data.desktop_dir) state.desktopDir = data.desktop_dir;
    label.textContent = `Folder: ${data.current_dir || 'Desktop'}`;
    list.innerHTML = '';

    // Quick-detected .sq databases across Desktop / sample_data / database
    if (!dirPath && Array.isArray(data.discovered_sq_files) && data.discovered_sq_files.length > 0) {
      data.discovered_sq_files.forEach((sq) => {
        const row = document.createElement('div');
        row.className = 'sq-item';
        row.innerHTML = `
          <span>🗄️ <strong>${sq.name}</strong> <span style="opacity:0.7;">(${sq.path})</span></span>
          <span class="sq-item-meta">${sq.size_kb} KB • Click to Index</span>
        `;
        row.addEventListener('click', () => {
          document.getElementById('sqPathInput').value = sq.path;
          applySqPath(sq.path);
        });
        list.appendChild(row);
      });
    }

    // Parent directory link
    if (data.parent_dir) {
      const up = document.createElement('div');
      up.className = 'sq-item';
      up.innerHTML = `<span>📁 .. (Parent Folder)</span><span class="sq-item-meta">Open</span>`;
      up.addEventListener('click', () => browseServerSqDirectory(data.parent_dir));
      list.appendChild(up);
    }

    // Current directory .sq files (if browsing a specific subfolder)
    if (dirPath && Array.isArray(data.sq_files)) {
      data.sq_files.forEach((sq) => {
        const row = document.createElement('div');
        row.className = 'sq-item';
        row.innerHTML = `
          <span>🗄️ <strong>${sq.name}</strong></span>
          <span class="sq-item-meta">${sq.size_kb} KB • Index</span>
        `;
        row.addEventListener('click', () => {
          document.getElementById('sqPathInput').value = sq.path;
          applySqPath(sq.path);
        });
        list.appendChild(row);
      });
    }

    // Subfolders
    (data.subdirs || []).forEach((sd) => {
      const row = document.createElement('div');
      row.className = 'sq-item';
      row.innerHTML = `<span>📁 ${sd.name}</span><span class="sq-item-meta">Browse</span>`;
      row.addEventListener('click', () => browseServerSqDirectory(sd.path));
      list.appendChild(row);
    });

    if (!list.children.length) {
      const empty = document.createElement('div');
      empty.className = 'sq-item';
      empty.textContent = 'No .sq files or subfolders found in this directory.';
      list.appendChild(empty);
    }
  } catch (_) {}
}

async function applySqPath(rawPathInput = null) {
  const pathVal = (rawPathInput !== null ? rawPathInput : document.getElementById('sqPathInput').value).trim();
  if (!pathVal) {
    updateSqStatusBoxUI(null, 'Please enter a .sq file path (e.g. pdf2-1.sq) or browse from Desktop.');
    return;
  }
  if (!state.backendAvailable) {
    updateSqStatusBoxUI(
      null,
      'Direct filesystem path access requires the Python server. Use "Browse .sq File..." to load .sq directly in browser.'
    );
    return;
  }
  try {
    const resp = await fetch('/api/database/sq-index', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathVal })
    });
    const data = await resp.json();
    if (!resp.ok) {
      updateSqStatusBoxUI(null, data.detail || 'Could not index .sq database at that path.');
      return;
    }
    state.sqIndex.rawPath = data.raw_path || pathVal;
    state.sqIndex.files = data.files || [];
    state.sqIndex.totalCards = data.total_sq_cards || 0;
    state.sqIndex.clientPhases = (data.preview_phases || []).map((p) => enrichPhaseClient(p));
    document.getElementById('sqPathInput').value = state.sqIndex.rawPath;
    updateDbFolderPathUI();
    updateSqStatusBoxUI(data);

    // Switch to Local DB and refresh preview list (wait for user to click Auto Match)
    activateDbSourcePill('local');
    refreshDbViewWithoutMatch();
  } catch (err) {
    updateSqStatusBoxUI(null, `Failed to index .sq path: ${err.message || err}`);
  }
}

async function clearSqIndex() {
  state.sqIndex = { rawPath: '', files: [], totalCards: 0, clientPhases: [] };
  document.getElementById('sqPathInput').value = '';
  if (state.backendAvailable) {
    try {
      const resp = await fetch('/api/database/sq-index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '' })
      });
      if (resp.ok) {
        const data = await resp.json();
        updateSqStatusBoxUI(data);
      }
    } catch (_) {}
  } else {
    updateSqStatusBoxUI(null);
  }
  updateDbFolderPathUI();
  refreshDbViewWithoutMatch();
}

async function handleSqFileObjects(fileList, folderHint = '') {
  const sqFiles = Array.from(fileList || []).filter((f) =>
    /\.(sq|sqlite|sqlite3|db)$/i.test(f.name)
  );
  if (!sqFiles.length) {
    updateSqStatusBoxUI(null, 'No .sq database files were found in the selected folder/selection.');
    return;
  }

  if (state.backendAvailable) {
    // First try resolving directly on Desktop by relative path or filename (avoids copying huge PDF-2 .sq files!)
    const relCandidate = folderHint || (sqFiles[0].webkitRelativePath
      ? sqFiles[0].webkitRelativePath.split('/')[0]
      : sqFiles[0].name);
    try {
      const tryResp = await fetch('/api/database/sq-index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: relCandidate })
      });
      if (tryResp.ok) {
        const data = await tryResp.json();
        state.sqIndex.rawPath = data.raw_path || relCandidate;
        state.sqIndex.files = data.files || [];
        state.sqIndex.totalCards = data.total_sq_cards || 0;
        state.sqIndex.clientPhases = (data.preview_phases || []).map((p) => enrichPhaseClient(p));
        document.getElementById('sqPathInput').value = state.sqIndex.rawPath;
        updateDbFolderPathUI();
        updateSqStatusBoxUI(data);
        activateDbSourcePill('local');
        refreshDbViewWithoutMatch();
        return;
      }
    } catch (_) {}

    // Otherwise upload the .sq file(s) to the server's database/ directory and index them
    for (const file of sqFiles) {
      const fd = new FormData();
      fd.append('file', file);
      try {
        const upResp = await fetch('/api/database/sq-upload', { method: 'POST', body: fd });
        const data = await upResp.json();
        if (!upResp.ok) {
          updateSqStatusBoxUI(null, data.detail || `Failed to index ${file.name}`);
          return;
        }
        state.sqIndex.rawPath = data.raw_path || file.name;
        state.sqIndex.files = data.files || [];
        state.sqIndex.totalCards = data.total_sq_cards || 0;
        state.sqIndex.clientPhases = (data.preview_phases || []).map((p) => enrichPhaseClient(p));
      } catch (err) {
        updateSqStatusBoxUI(null, `Upload error: ${err.message || err}`);
        return;
      }
    }
    document.getElementById('sqPathInput').value = state.sqIndex.rawPath;
    updateDbFolderPathUI();
    updateSqStatusBoxUI({ files: state.sqIndex.files });
    activateDbSourcePill('local');
    refreshDbViewWithoutMatch();
    return;
  }

  // Client-only static mode: parse .sq SQLite3 via on-demand sql.js WASM or JSON fallback
  const allLoaded = [];
  const fileSummaries = [];
  for (const file of sqFiles) {
    try {
      const parsedPhases = await parseSqFileClient(file);
      allLoaded.push(...parsedPhases);
      fileSummaries.push({ name: file.name, path: file.name, cards: parsedPhases.length });
    } catch (err) {
      updateSqStatusBoxUI(null, `Could not parse ${file.name}: ${err.message || err}`);
      return;
    }
  }
  state.sqIndex.rawPath = fileSummaries.map((f) => f.name).join(', ');
  state.sqIndex.files = fileSummaries;
  state.sqIndex.totalCards = allLoaded.length;
  state.sqIndex.clientPhases = allLoaded;
  document.getElementById('sqPathInput').value = state.sqIndex.rawPath;
  updateDbFolderPathUI();
  updateSqStatusBoxUI({ files: fileSummaries });
  renderClientSqBrowserFallback();
  activateDbSourcePill('local');
  refreshDbViewWithoutMatch();
}

function loadSqlJsOnDemand() {
  if (sqlJsEnginePromise) return sqlJsEnginePromise;
  sqlJsEnginePromise = new Promise((resolve, reject) => {
    const initEngine = () => {
      window.initSqlJs({
        locateFile: (fname) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${fname}`
      }).then(resolve).catch(reject);
    };
    if (typeof window.initSqlJs === 'function') {
      initEngine();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js';
    script.onload = initEngine;
    script.onerror = () => {
      sqlJsEnginePromise = null;
      reject(new Error('Could not load SQLite WASM engine in offline static mode'));
    };
    document.head.appendChild(script);
  });
  return sqlJsEnginePromise;
}

function decodeSqNumsClient(val) {
  if (val === null || val === undefined) return [];
  if (Array.isArray(val)) return val.map(Number).filter(Number.isFinite);
  if (typeof val === 'number') return [val];
  if (val instanceof Uint8Array) {
    const txt = new TextDecoder('utf-8', { fatal: false }).decode(val);
    if (/^[\x20-\x7E\r\n\t]+$/.test(txt)) {
      const m = txt.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g);
      if (m && m.length) return m.map(Number);
    }
    const dv = new DataView(val.buffer, val.byteOffset, val.byteLength);
    if (val.byteLength % 8 === 0) {
      const out8 = [];
      for (let i = 0; i < val.byteLength; i += 8) out8.push(dv.getFloat64(i, true));
      if (out8.every((x) => Number.isFinite(x) && Math.abs(x) < 1e6)) return out8;
    }
    if (val.byteLength % 4 === 0) {
      const out4 = [];
      for (let i = 0; i < val.byteLength; i += 4) out4.push(dv.getFloat32(i, true));
      if (out4.every((x) => Number.isFinite(x) && Math.abs(x) < 1e6)) return out4;
    }
    return [];
  }
  const s = String(val).trim();
  if (!s) return [];
  const m = s.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g);
  return m ? m.map(Number) : [];
}

async function parseSqFileClient(file) {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  const magic = new TextDecoder('ascii').decode(bytes.slice(0, 15));

  if (!magic.startsWith('SQLite format 3')) {
    const txt = new TextDecoder('utf-8').decode(bytes);
    const data = JSON.parse(txt);
    const arr = Array.isArray(data) ? data : (data.phases || [data]);
    return arr.map((p) => enrichPhaseClient({ ...p, source: `Local SQ (${file.name})`, sq_file: file.name }));
  }

  const SQL = await loadSqlJsOnDemand();
  const db = new SQL.Database(bytes);
  try {
    const tblRes = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
    const tblNames = tblRes.length ? tblRes[0].values.map((v) => String(v[0])) : [];
    const mainTbl = ['id', 'phases', 'cards', 'entries', 'structures', 'pattern'].find((t) =>
      tblNames.some((n) => n.toLowerCase() === t)
    ) || tblNames[0];
    if (!mainTbl) return [];

    const mainExec = db.exec(`SELECT * FROM "${mainTbl}" LIMIT 1500`);
    if (!mainExec.length) return [];
    const cols = mainExec[0].columns;
    const colsLow = {};
    cols.forEach((c, idx) => { colsLow[c.toLowerCase()] = idx; });
    const pick = (...cands) => {
      for (const c of cands) {
        if (colsLow[c] !== undefined) return colsLow[c];
      }
      return -1;
    };

    const isPdfSq = file.name.toLowerCase().startsWith('pdf');
    const iId = pick('id', 'card_id', 'pdf_id', 'jcpds', 'cod_id', 'entry_id', 'num');
    const iForm = pick('formula', 'chem_formula', 'chemical_formula', 'sumformula');
    const iName = pick('name', 'chemical_name', 'chemname', 'compound_name', 'title');
    const iMin = pick('mineralname', 'mineral_name', 'mineral');
    const iSys = pick('sy', 'syngony', 'system', 'crystal_system', 'symmetry');
    const iSg = pick('sg', 'spgr', 'space_group', 'spacegroup', 'sgroup');
    const iDval = pick('dval', 'dvalue', 'd_spacings', 'dsp', 'd_list', 'd');
    const iInt = pick('intens', 'intensita', 'intensity', 'intensities', 'i_list', 'int');
    const i2T = pick('two_theta', 'theta2', 'tth');
    const iA = pick('a', 'cell_a'), iB = pick('b', 'cell_b'), iC = pick('c', 'cell_c');
    const iAl = pick('alpha', 'al'), iBe = pick('beta', 'be'), iGa = pick('gamma', 'ga');
    const iVol = pick('vol', 'volume', 'cell_volume');
    const iDens = pick('dens', 'density', 'dcalc', 'dx');

    const wavelength = 1.5406;
    const out = [];
    for (const row of mainExec[0].values) {
      const rawPid = iId >= 0 && row[iId] !== null ? String(row[iId]) : String(out.length + 1);
      const pid = formatPdf2JcpdsClient(rawPid, isPdfSq);
      const formula = iForm >= 0 && row[iForm] ? String(row[iForm]).trim() : '';
      const rawName = iName >= 0 && row[iName] ? String(row[iName]).trim() : '';
      const minName = iMin >= 0 && row[iMin] ? String(row[iMin]).trim() : '';
      const baseName = minName && rawName && !rawName.toLowerCase().includes(minName.toLowerCase())
        ? `${minName} — ${rawName}`
        : (minName || rawName);
      const dispName = baseName && formula && !baseName.includes(formula) ? `${baseName} (${formula})` : (baseName || formula || `Card ${pid}`);
      const hasExplicitCell = iA >= 0 && Number(row[iA]) > 0;
      const a = hasExplicitCell ? Number(row[iA]) : 0;
      const b = (iB >= 0 && Number(row[iB])) || a;
      const c = (iC >= 0 && Number(row[iC])) || a;
      const alpha = (iAl >= 0 && Number(row[iAl])) || 90;
      const beta = (iBe >= 0 && Number(row[iBe])) || 90;
      const gamma = (iGa >= 0 && Number(row[iGa])) || 90;
      const cell = hasExplicitCell ? { a, b, c, alpha, beta, gamma } : null;
      const sysRaw = iSys >= 0 && row[iSys] ? String(row[iSys]) : 'Orthorhombic';

      const dList = iDval >= 0 ? decodeSqNumsClient(row[iDval]) : [];
      const intList = iInt >= 0 ? decodeSqNumsClient(row[iInt]) : [];
      const ttList = i2T >= 0 ? decodeSqNumsClient(row[i2T]) : [];
      const nPk = Math.max(dList.length, ttList.length);
      let peaks = [];
      for (let k = 0; k < nPk; k++) {
        let dv = k < dList.length ? dList[k] : 0;
        let ttv = k < ttList.length ? ttList[k] : 0;
        const iv = k < intList.length ? intList[k] : 50;
        if (ttv <= 0 && dv > 0) {
          const sTh = wavelength / (2 * dv);
          if (sTh > 0 && sTh < 0.998) ttv = (2 * Math.asin(sTh) * 180) / Math.PI;
        } else if (dv <= 0 && ttv > 0) {
          dv = wavelength / (2 * Math.sin((ttv / 2) * (Math.PI / 180)));
        }
        if (ttv > 0) {
          peaks.push({
            two_theta: Number(ttv.toFixed(3)),
            d: Number(dv.toFixed(4)),
            intensity: Number(iv.toFixed(1)),
            hkl: [0, 0, 0]
          });
        }
      }
      if (!peaks.length && cell && cell.a > 0) {
        peaks = computeDSpacingsClient(sysRaw, cell, wavelength, 10, 85, 4).slice(0, 16);
      }
      peaks.sort((x, y) => x.two_theta - y.two_theta);

      out.push(enrichPhaseClient({
        id: pid,
        jcpds: pid,
        cod_id: rawPid,
        name: dispName,
        formula: formula || dispName,
        system: sysRaw,
        space_group: iSg >= 0 && row[iSg] ? String(row[iSg]) : 'P1',
        cell: cell || { a: 4.5, b: 4.5, c: 4.5, alpha: 90, beta: 90, gamma: 90 },
        volume: iVol >= 0 && row[iVol] ? Number(row[iVol]) : (cell ? computeCellVolumeClient(cell, sysRaw) : 0),
        density: iDens >= 0 && row[iDens] ? Number(row[iDens]) : null,
        peaks,
        source: `Local SQ (${file.name})`,
        sq_file: file.name
      }));
    }
    return out;
  } finally {
    db.close();
  }
}

/* ============================================================================
   QUALX-STYLE RESTRAINTS WINDOW & INTERACTIVE PERIODIC TABLE
   ============================================================================ */

function buildPeriodicTableUI() {
  const grid = document.getElementById('periodicTableGrid');
  if (!grid) return;
  grid.innerHTML = '';
  ptableElementBtnMap = new Map();

  // 1. Group Header Buttons (Row 1, Columns 2..19; VIIIB spans columns 9..11)
  const groupHeaders = [
    { label: 'IA', col: '2', grp: 'IA' },
    { label: 'IIA', col: '3', grp: 'IIA' },
    { label: 'IIIB', col: '4', grp: 'IIIB' },
    { label: 'IVB', col: '5', grp: 'IVB' },
    { label: 'VB', col: '6', grp: 'VB' },
    { label: 'VIB', col: '7', grp: 'VIB' },
    { label: 'VIIB', col: '8', grp: 'VIIB' },
    { label: 'VIIIB', col: '9 / 12', grp: 'VIIIB' },
    { label: 'IB', col: '12', grp: 'IB' },
    { label: 'IIB', col: '13', grp: 'IIB' },
    { label: 'IIIA', col: '14', grp: 'IIIA' },
    { label: 'IVA', col: '15', grp: 'IVA' },
    { label: 'VA', col: '16', grp: 'VA' },
    { label: 'VIA', col: '17', grp: 'VIA' },
    { label: 'VIIA', col: '18', grp: 'VIIA' },
    { label: 'VIII', col: '19', grp: 'VIII' }
  ];

  groupHeaders.forEach((gh) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'qx-grp-btn';
    btn.style.gridRow = '1';
    btn.style.gridColumn = gh.col;
    btn.textContent = gh.label;
    btn.title = `Toggle Group ${gh.label}`;
    btn.addEventListener('click', () => {
      const syms = PERIODIC_TABLE_ELEMENTS
        .filter((el) => el.grp === gh.grp && el.per !== 'LN' && el.per !== 'AC')
        .map((el) => el.sym);
      toggleElementGroupInRestraints(syms);
    });
    grid.appendChild(btn);
  });

  // 2. Period Buttons (Column 1, Rows 2..10: Period 1..7, LN, AC)
  const periodRows = [
    { row: 2, per: '1', isNum: true },
    { row: 3, per: '2', isNum: true },
    { row: 4, per: '3', isNum: true },
    { row: 5, per: '4', isNum: true },
    { row: 6, per: '5', isNum: true },
    { row: 7, per: '6', isNum: true },
    { row: 8, per: '7', isNum: true },
    { row: 9, per: 'LN', isNum: false },
    { row: 10, per: 'AC', isNum: false }
  ];

  periodRows.forEach((pr) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'qx-per-btn';
    btn.style.gridRow = String(pr.row);
    btn.style.gridColumn = '1';
    if (pr.isNum) {
      btn.innerHTML = `<span class="per-word">Period</span><span class="per-num">${pr.per}</span>`;
      btn.title = `Toggle Period ${pr.per}`;
    } else {
      btn.innerHTML = `<span class="per-num" style="font-size:12px;">${pr.per}</span>`;
      btn.title = pr.per === 'LN' ? 'Toggle Lanthanides (57–71)' : 'Toggle Actinides (89–103)';
    }
    btn.addEventListener('click', () => {
      const syms = PERIODIC_TABLE_ELEMENTS.filter((el) => el.per === pr.per).map((el) => el.sym);
      toggleElementGroupInRestraints(syms);
    });
    grid.appendChild(btn);
  });

  // 3. White Restraint Expression Summary Box (Rows 2..4, Columns 4..13)
  compSummaryBoxEl = document.createElement('div');
  compSummaryBoxEl.className = 'qx-comp-display';
  grid.appendChild(compSummaryBoxEl);

  // 4. All 103 Periodic Table Element Tiles
  PERIODIC_TABLE_ELEMENTS.forEach((el) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `qx-el qx-cat-${el.cat}`;
    btn.style.gridRow = String(el.row);
    btn.style.gridColumn = String(el.col);
    btn.dataset.sym = el.sym;
    btn.title = `${el.z} — ${el.sym}`;
    btn.innerHTML = `<span class="el-z">${el.z}</span><span class="el-sym">${el.disp}</span>`;
    btn.addEventListener('click', () => toggleElementInRestraints(el.sym));
    grid.appendChild(btn);
    ptableElementBtnMap.set(el.sym, btn);
  });

  renderRestraintsSummaryBox();
}

function getCompKeyForMode(mode) {
  const map = {
    and: 'and_elements',
    or: 'or_elements',
    not: 'not_elements',
    only: 'only_elements',
    just: 'just_elements'
  };
  return map[mode] || 'and_elements';
}

function toggleElementInRestraints(sym) {
  const comp = state.restraints.composition;
  const targetKey = getCompKeyForMode(state.compLogicMode);
  const alreadyInTarget = comp[targetKey].includes(sym);

  ['and_elements', 'or_elements', 'not_elements', 'only_elements', 'just_elements'].forEach((k) => {
    comp[k] = comp[k].filter((s) => s !== sym);
  });

  if (!alreadyInTarget) {
    comp[targetKey].push(sym);
  }
  refreshPeriodicTableStates();
  renderRestraintsSummaryBox();
  updateRestraintsBadgeUI();
}

function toggleElementGroupInRestraints(symbols) {
  if (!symbols.length) return;
  const comp = state.restraints.composition;
  const targetKey = getCompKeyForMode(state.compLogicMode);
  const allPresent = symbols.every((s) => comp[targetKey].includes(s));

  ['and_elements', 'or_elements', 'not_elements', 'only_elements', 'just_elements'].forEach((k) => {
    comp[k] = comp[k].filter((s) => !symbols.includes(s));
  });

  if (!allPresent) {
    symbols.forEach((s) => {
      if (!comp[targetKey].includes(s)) comp[targetKey].push(s);
    });
  }
  refreshPeriodicTableStates();
  renderRestraintsSummaryBox();
  updateRestraintsBadgeUI();
}

function refreshPeriodicTableStates() {
  const comp = state.restraints.composition;
  const sets = {
    and: new Set(comp.and_elements || []),
    or: new Set(comp.or_elements || []),
    not: new Set(comp.not_elements || []),
    only: new Set(comp.only_elements || []),
    just: new Set(comp.just_elements || [])
  };

  ptableElementBtnMap.forEach((btn, sym) => {
    btn.classList.remove('state-and', 'state-or', 'state-not', 'state-only', 'state-just');
    if (sets.and.has(sym)) btn.classList.add('state-and');
    else if (sets.or.has(sym)) btn.classList.add('state-or');
    else if (sets.not.has(sym)) btn.classList.add('state-not');
    else if (sets.only.has(sym)) btn.classList.add('state-only');
    else if (sets.just.has(sym)) btn.classList.add('state-just');
  });
}

function renderRestraintsSummaryBox() {
  if (!compSummaryBoxEl) return;
  const r = state.restraints;
  const c = r.composition;
  const lines = [];

  if (c.and_elements.length) lines.push(`<div><b style="color:#52E08B;">AND:</b> ${c.and_elements.join(', ')}</div>`);
  if (c.or_elements.length) lines.push(`<div><b style="color:#B5A6C6;">OR:</b> ${c.or_elements.join(', ')}</div>`);
  if (c.not_elements.length) lines.push(`<div><b style="color:#FF6B93;">NOT:</b> ${c.not_elements.join(', ')}</div>`);
  if (c.only_elements.length) lines.push(`<div><b style="color:#C792EA;">ONLY:</b> ${c.only_elements.join(', ')}</div>`);
  if (c.just_elements.length) lines.push(`<div><b style="color:#DC2967;">JUST:</b> ${c.just_elements.join(', ')}</div>`);
  if (c.min_elements !== null || c.max_elements !== null) {
    lines.push(`<div><b># Elements:</b> ${c.min_elements ?? 1} – ${c.max_elements ?? 'any'}</div>`);
  }
  if (r.subfiles.selected.length) {
    lines.push(`<div><b>Subfiles (${r.subfiles.mode.toUpperCase()}):</b> ${r.subfiles.selected.join(', ')}</div>`);
  }
  if (r.chemical_name.query.trim()) {
    lines.push(`<div><b>Name:</b> "${r.chemical_name.query.trim()}" (${r.chemical_name.mode})</div>`);
  }
  if (r.entries.ids_text.trim() || r.entries.min_num !== null || r.entries.max_num !== null) {
    lines.push(`<div><b>Entries:</b> ${r.entries.ids_text.trim() || `${r.entries.min_num ?? ''}..${r.entries.max_num ?? ''}`}</div>`);
  }
  if (r.symmetry.systems.length || r.symmetry.space_group.trim()) {
    const parts = [...r.symmetry.systems];
    if (r.symmetry.space_group.trim()) parts.push(`SG: ${r.symmetry.space_group.trim()}`);
    lines.push(`<div><b>Symmetry:</b> ${parts.join(', ')}</div>`);
  }
  if (Object.values(r.cell).some((v) => v !== null && v !== '')) {
    lines.push(`<div><b>Cell / ρ bounds:</b> active</div>`);
  }

  compSummaryBoxEl.innerHTML = lines.length
    ? lines.join('')
    : '<span class="qx-comp-placeholder">No restraints active. Select logic mode below (And / Or / Not / Only / Just) and click elements, groups, or periods.</span>';
}

function updateRestraintsBadgeUI() {
  const count = countActiveRestraints(state.restraints);
  const badge = document.getElementById('restraintsActiveBadge');
  const btn = document.getElementById('restraintsBtn');
  if (count > 0) {
    badge.textContent = String(count);
    badge.hidden = false;
    btn.classList.add('has-active');
  } else {
    badge.hidden = true;
    btn.classList.remove('has-active');
  }
}

function parseNullableNum(val) {
  if (val === '' || val === null || val === undefined) return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
}

function readSecondaryRestraintsFromInputs() {
  const r = state.restraints;
  r.composition.min_elements = parseNullableNum(document.getElementById('minElementsInput').value);
  r.composition.max_elements = parseNullableNum(document.getElementById('maxElementsInput').value);

  r.subfiles.selected = Array.from(document.querySelectorAll('[data-subfile]:checked')).map(
    (cb) => cb.dataset.subfile
  );
  const sfModeRadio = document.querySelector('input[name="subfileMode"]:checked');
  r.subfiles.mode = sfModeRadio ? sfModeRadio.value : 'or';

  r.chemical_name.query = document.getElementById('restrChemNameInput').value;
  r.chemical_name.mode = document.getElementById('restrChemModeSelect').value;

  r.entries.ids_text = document.getElementById('restrEntriesInput').value;
  r.entries.min_num = parseNullableNum(document.getElementById('restrEntryMinInput').value);
  r.entries.max_num = parseNullableNum(document.getElementById('restrEntryMaxInput').value);

  r.symmetry.systems = Array.from(document.querySelectorAll('[data-sym-sys]:checked')).map(
    (cb) => cb.dataset.symSys
  );
  r.symmetry.space_group = document.getElementById('restrSpaceGroupInput').value;

  r.cell.a_min = parseNullableNum(document.getElementById('cellMinA').value);
  r.cell.a_max = parseNullableNum(document.getElementById('cellMaxA').value);
  r.cell.b_min = parseNullableNum(document.getElementById('cellMinB').value);
  r.cell.b_max = parseNullableNum(document.getElementById('cellMaxB').value);
  r.cell.c_min = parseNullableNum(document.getElementById('cellMinC').value);
  r.cell.c_max = parseNullableNum(document.getElementById('cellMaxC').value);
  r.cell.alpha_min = parseNullableNum(document.getElementById('cellMinAlpha').value);
  r.cell.alpha_max = parseNullableNum(document.getElementById('cellMaxAlpha').value);
  r.cell.beta_min = parseNullableNum(document.getElementById('cellMinBeta').value);
  r.cell.beta_max = parseNullableNum(document.getElementById('cellMaxBeta').value);
  r.cell.gamma_min = parseNullableNum(document.getElementById('cellMinGamma').value);
  r.cell.gamma_max = parseNullableNum(document.getElementById('cellMaxGamma').value);
  r.cell.vol_min = parseNullableNum(document.getElementById('cellMinVol').value);
  r.cell.vol_max = parseNullableNum(document.getElementById('cellMaxVol').value);
  r.cell.density_min = parseNullableNum(document.getElementById('cellMinDens').value);
  r.cell.density_max = parseNullableNum(document.getElementById('cellMaxDens').value);

  renderRestraintsSummaryBox();
  updateRestraintsBadgeUI();
}

function syncRestraintsInputsFromState() {
  const r = state.restraints;
  document.getElementById('minElementsInput').value = r.composition.min_elements ?? '';
  document.getElementById('maxElementsInput').value = r.composition.max_elements ?? '';

  document.querySelectorAll('[data-subfile]').forEach((cb) => {
    cb.checked = r.subfiles.selected.includes(cb.dataset.subfile);
  });
  document.querySelectorAll('input[name="subfileMode"]').forEach((rd) => {
    rd.checked = rd.value === r.subfiles.mode;
  });

  document.getElementById('restrChemNameInput').value = r.chemical_name.query || '';
  document.getElementById('restrChemModeSelect').value = r.chemical_name.mode || 'contains';

  document.getElementById('restrEntriesInput').value = r.entries.ids_text || '';
  document.getElementById('restrEntryMinInput').value = r.entries.min_num ?? '';
  document.getElementById('restrEntryMaxInput').value = r.entries.max_num ?? '';

  document.querySelectorAll('[data-sym-sys]').forEach((cb) => {
    cb.checked = r.symmetry.systems.includes(cb.dataset.symSys);
  });
  document.getElementById('restrSpaceGroupInput').value = r.symmetry.space_group || '';

  document.getElementById('cellMinA').value = r.cell.a_min ?? '';
  document.getElementById('cellMaxA').value = r.cell.a_max ?? '';
  document.getElementById('cellMinB').value = r.cell.b_min ?? '';
  document.getElementById('cellMaxB').value = r.cell.b_max ?? '';
  document.getElementById('cellMinC').value = r.cell.c_min ?? '';
  document.getElementById('cellMaxC').value = r.cell.c_max ?? '';
  document.getElementById('cellMinAlpha').value = r.cell.alpha_min ?? '';
  document.getElementById('cellMaxAlpha').value = r.cell.alpha_max ?? '';
  document.getElementById('cellMinBeta').value = r.cell.beta_min ?? '';
  document.getElementById('cellMaxBeta').value = r.cell.beta_max ?? '';
  document.getElementById('cellMinGamma').value = r.cell.gamma_min ?? '';
  document.getElementById('cellMaxGamma').value = r.cell.gamma_max ?? '';
  document.getElementById('cellMinVol').value = r.cell.vol_min ?? '';
  document.getElementById('cellMaxVol').value = r.cell.vol_max ?? '';
  document.getElementById('cellMinDens').value = r.cell.density_min ?? '';
  document.getElementById('cellMaxDens').value = r.cell.density_max ?? '';

  refreshPeriodicTableStates();
  renderRestraintsSummaryBox();
  updateRestraintsBadgeUI();
}

function bindDbIndexAndRestraintsEvents() {
  // --- db index modal bindings ---
  document.getElementById('dbIndexBtn').addEventListener('click', openDbIndexModal);
  document.getElementById('dbFolderPath').addEventListener('click', openDbIndexModal);
  document.getElementById('closeDbIndexBtn').addEventListener('click', closeDbIndexModal);
  document.getElementById('dbIndexModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeDbIndexModal();
  });

  document.getElementById('sqApplyPathBtn').addEventListener('click', () => applySqPath());
  document.getElementById('sqPathInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') applySqPath();
  });
  document.getElementById('sqScanDesktopBtn').addEventListener('click', () => browseServerSqDirectory(''));
  document.getElementById('sqClearIndexBtn').addEventListener('click', clearSqIndex);

  document.getElementById('sqFilePicker').addEventListener('change', async (e) => {
    if (!e.target.files.length) return;
    await handleSqFileObjects(e.target.files);
    e.target.value = '';
  });

  document.getElementById('sqFolderPicker').addEventListener('change', async (e) => {
    if (!e.target.files.length) return;
    const rel = e.target.files[0].webkitRelativePath || '';
    const folderName = rel ? rel.split('/')[0] : '';
    await handleSqFileObjects(e.target.files, folderName);
    e.target.value = '';
  });

  // --- Restraints modal bindings ---
  const openRestraints = () => {
    syncRestraintsInputsFromState();
    document.getElementById('restraintsModal').hidden = false;
  };
  const closeRestraints = () => {
    readSecondaryRestraintsFromInputs();
    document.getElementById('restraintsModal').hidden = true;
  };

  document.getElementById('restraintsBtn').addEventListener('click', openRestraints);
  document.getElementById('restraintsHeaderCloseBtn').addEventListener('click', closeRestraints);
  document.getElementById('restraintsCloseBtn').addEventListener('click', closeRestraints);
  document.getElementById('restraintsModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeRestraints();
  });

  // Draggable Restraints window header (clamped to viewport bounds)
  const winEl = document.getElementById('restraintsWindow');
  const titleBar = document.getElementById('restraintsTitleBar');
  const clampRestraintsOffset = (tx, ty) => {
    const maxDx = Math.max(0, (window.innerWidth - (winEl.offsetWidth || 680)) / 2 - 8);
    const maxDy = Math.max(0, (window.innerHeight - (winEl.offsetHeight || 500)) / 2 - 8);
    return {
      cx: Math.max(-maxDx, Math.min(maxDx, tx)),
      cy: Math.max(-maxDy, Math.min(maxDy, ty))
    };
  };
  let dragWin = null;
  titleBar.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button') || window.innerWidth <= 920) return;
    dragWin = {
      startX: e.clientX,
      startY: e.clientY,
      origX: winEl.dataset.tx ? Number(winEl.dataset.tx) : 0,
      origY: winEl.dataset.ty ? Number(winEl.dataset.ty) : 0
    };
    try { titleBar.setPointerCapture(e.pointerId); } catch (_) {}
  });
  titleBar.addEventListener('pointermove', (e) => {
    if (!dragWin) return;
    const rawX = dragWin.origX + (e.clientX - dragWin.startX);
    const rawY = dragWin.origY + (e.clientY - dragWin.startY);
    const { cx, cy } = clampRestraintsOffset(rawX, rawY);
    winEl.dataset.tx = String(cx);
    winEl.dataset.ty = String(cy);
    winEl.style.transform = `translate(${cx}px, ${cy}px)`;
  });
  titleBar.addEventListener('pointerup', () => {
    dragWin = null;
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 920) {
      winEl.dataset.tx = '0';
      winEl.dataset.ty = '0';
      winEl.style.transform = '';
    } else if (winEl.dataset.tx || winEl.dataset.ty) {
      const { cx, cy } = clampRestraintsOffset(Number(winEl.dataset.tx || 0), Number(winEl.dataset.ty || 0));
      winEl.dataset.tx = String(cx);
      winEl.dataset.ty = String(cy);
      winEl.style.transform = `translate(${cx}px, ${cy}px)`;
    }
  });

  // Restraints 6-tab switcher
  document.querySelectorAll('.qx-tab').forEach((tabBtn) => {
    tabBtn.addEventListener('click', () => {
      const targetTab = tabBtn.dataset.rtab;
      document.querySelectorAll('.qx-tab').forEach((t) => t.classList.toggle('active', t === tabBtn));
      document.querySelectorAll('[data-rpane]').forEach((pane) => {
        const active = pane.dataset.rpane === targetTab;
        pane.hidden = !active;
        pane.classList.toggle('active', active);
      });
    });
  });

  // Composition logic mode radio buttons (And, Or, Not, Only, Just)
  document.querySelectorAll('input[name="compLogicMode"]').forEach((rd) => {
    rd.addEventListener('change', (e) => {
      if (e.target.checked) state.compLogicMode = e.target.value;
    });
  });

  // Per-tab Clear buttons
  document.getElementById('compClearBtn').addEventListener('click', () => {
    state.restraints.composition = createDefaultRestraints().composition;
    syncRestraintsInputsFromState();
  });
  document.getElementById('subfilesClearBtn').addEventListener('click', () => {
    state.restraints.subfiles = createDefaultRestraints().subfiles;
    syncRestraintsInputsFromState();
  });
  document.getElementById('chemNameClearBtn').addEventListener('click', () => {
    state.restraints.chemical_name = createDefaultRestraints().chemical_name;
    syncRestraintsInputsFromState();
  });
  document.getElementById('entriesClearBtn').addEventListener('click', () => {
    state.restraints.entries = createDefaultRestraints().entries;
    syncRestraintsInputsFromState();
  });
  document.getElementById('symmetryClearBtn').addEventListener('click', () => {
    state.restraints.symmetry = createDefaultRestraints().symmetry;
    syncRestraintsInputsFromState();
  });
  document.getElementById('cellClearBtn').addEventListener('click', () => {
    state.restraints.cell = createDefaultRestraints().cell;
    syncRestraintsInputsFromState();
  });

  // Live sync on secondary tab inputs
  document.querySelectorAll(
    '#restraintsWindow input:not([name="compLogicMode"]), #restraintsWindow select'
  ).forEach((el) => {
    el.addEventListener('input', readSecondaryRestraintsFromInputs);
    el.addEventListener('change', readSecondaryRestraintsFromInputs);
  });

  // Footer Actions: Load cards, Load and Merge Cards, Search with restraints, Cancel all restraints!, Help
  document.getElementById('restraintsLoadCardsBtn').addEventListener('click', async () => {
    readSecondaryRestraintsFromInputs();
    const src = state.dbSource || 'all';
    const q = document.getElementById('dbSearchInput').value.trim();
    const loaded = await queryOnlineDatabasesClient(q, src);
    state.dbResults = loaded.map(stripMatchScoresFromPhase);
    if (state.dbResults.length > 0) {
      applyActiveReference(state.dbResults[0]);
    } else {
      renderDbResults();
      renderGraph();
    }
    document.getElementById('restraintsModal').hidden = true;
  });

  document.getElementById('restraintsMergeCardsBtn').addEventListener('click', async () => {
    readSecondaryRestraintsFromInputs();
    const src = state.dbSource || 'all';
    const q = document.getElementById('dbSearchInput').value.trim();
    const incoming = (await queryOnlineDatabasesClient(q, src)).map(stripMatchScoresFromPhase);
    const mergedMap = new Map();
    (state.dbResults || []).forEach((p) => mergedMap.set(p.id, p));
    incoming.forEach((p) => mergedMap.set(p.id, p));
    state.dbResults = Array.from(mergedMap.values());
    if (incoming.length > 0) {
      applyActiveReference(incoming[0]);
    } else {
      renderDbResults();
      renderGraph();
    }
    document.getElementById('restraintsModal').hidden = true;
  });

  document.getElementById('restraintsSearchBtn').addEventListener('click', async () => {
    readSecondaryRestraintsFromInputs();
    document.getElementById('restraintsModal').hidden = true;
    await runSearchMatch({ sourceOverride: state.dbSource || 'all' });
  });

  document.getElementById('restraintsCancelAllBtn').addEventListener('click', () => {
    state.restraints = createDefaultRestraints();
    syncRestraintsInputsFromState();
    refreshDbViewWithoutMatch();
  });

  document.getElementById('restraintsHelpBtn').addEventListener('click', () => {
    const helpBox = document.getElementById('restraintsHelpBox');
    helpBox.hidden = !helpBox.hidden;
  });
}
