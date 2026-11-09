const state = {
  series: [],
  localDb: [],
  dbResults: [],
  activeReference: null,
  indexed: { system: 'Hexagonal', cell: { a: 3.2498, b: 3.2498, c: 5.2066 }, peaks: [] },
  rietveld: null,
  viewMode: 'stacked', // 'stacked' | 'rietveld' | 'overlay'
  showHkl: true,
  dbSource: 'all',
  min2Theta: 20,
  max2Theta: 70,
  stackOffset: 1.0,
  useThemeTraceColors: false
};

const CLASSIC_COLORS = ['#e60000', '#0018c4', '#006b1b', '#8B008B', '#D2691E'];
const THEME_COLORS = ['#C21E56', '#7D6B91', '#18241E', '#A63A69', '#4A6B5B'];

document.addEventListener('DOMContentLoaded', () => {
  bindEvents();
  initApp();
});

async function initApp() {
  const res = await fetch('/api/init');
  const data = await res.json();
  applyAppData(data);
}

function applyAppData(data) {
  state.series = data.series || [];
  state.localDb = data.local_db || [];
  state.activeReference = data.active_reference || (state.localDb[0] || null);
  state.indexed = data.indexed || { system: 'Hexagonal', cell: { a: 3.2498, c: 5.2066 }, peaks: [] };
  state.dbResults = data.matches && data.matches.length ? data.matches : state.localDb;
  state.rietveld = null;

  if (data.database_dir) {
    document.getElementById('dbFolderPath').textContent = data.database_dir;
  }

  if (state.activeReference && state.activeReference.cell) {
    document.getElementById('crystalSystemSelect').value = state.activeReference.system || 'Hexagonal';
    document.getElementById('cellAInput').value = state.activeReference.cell.a || 3.2498;
    document.getElementById('cellCInput').value = state.activeReference.cell.c || 5.2066;
  }

  renderTraceList();
  renderDbResults();
  renderHklTable();
  populateRietveldTraceSelect();
  renderGraph();
}

function bindEvents() {
  // Preset selector
  document.getElementById('presetSelect').addEventListener('change', async (e) => {
    const res = await fetch(`/api/preset/${e.target.value}`);
    const data = await res.json();
    state.viewMode = 'stacked';
    updateViewTabs();
    applyAppData(data);
  });

  // Replace upload
  document.getElementById('fileUploadInput').addEventListener('change', async (e) => {
    if (!e.target.files.length) return;
    await uploadXrdFiles(e.target.files, false);
    e.target.value = '';
  });

  // Append upload
  document.getElementById('appendUploadInput').addEventListener('change', async (e) => {
    if (!e.target.files.length) return;
    await uploadXrdFiles(e.target.files, true);
    e.target.value = '';
  });

  // Palette toggle (Classic Reference vs Swamp/Chive/Rose Theme)
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

  // Upload CIF/JSON into Local Database folder
  document.getElementById('dbUploadInput').addEventListener('change', async (e) => {
    if (!e.target.files.length) return;
    const fd = new FormData();
    for (const f of e.target.files) fd.append('files', f);
    const res = await fetch('/api/database/upload', { method: 'POST', body: fd });
    const data = await res.json();
    state.localDb = data.phases || [];
    state.dbResults = state.localDb;
    renderDbResults();
    e.target.value = '';
  });

  // Database source pills
  document.querySelectorAll('.pill-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pill-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.dbSource = btn.dataset.source;
      runDatabaseQuery();
    });
  });

  // Database search
  document.getElementById('dbSearchBtn').addEventListener('click', runDatabaseQuery);
  document.getElementById('dbSearchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') runDatabaseQuery();
  });

  // Auto Search-Match
  document.getElementById('searchMatchBtn').addEventListener('click', runSearchMatch);

  // View tabs
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      state.viewMode = btn.dataset.view;
      updateViewTabs();
      if (state.viewMode === 'rietveld' && !state.rietveld) {
        await runRietveld();
      } else {
        renderGraph();
      }
    });
  });

  // Range & Offset controls
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

  // Toggle (hkl)
  document.getElementById('toggleHklBtn').addEventListener('click', (e) => {
    state.showHkl = !state.showHkl;
    e.target.textContent = state.showHkl ? '(hkl) On' : '(hkl) Off';
    renderGraph();
  });

  // Assign Miller Indices
  document.getElementById('assignHklBtn').addEventListener('click', () => runIndexPeaks(false));

  // Run Rietveld
  document.getElementById('runRietveldBtn').addEventListener('click', runRietveld);

  // Download 300 DPI PNG
  document.getElementById('downloadPngBtn').addEventListener('click', download300DpiPng);

  // Canvas cursor readout
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
  const fd = new FormData();
  for (const f of fileList) fd.append('files', f);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  if (!res.ok) return;
  const data = await res.json();
  if (append) {
    const pal = state.useThemeTraceColors ? THEME_COLORS : CLASSIC_COLORS;
    data.series.forEach((s) => {
      s.color = pal[state.series.length % pal.length];
      state.series.push(s);
    });
  } else {
    state.series = data.series || [];
  }

  if (state.series.length) {
    const first = state.series[0];
    state.min2Theta = Math.max(5, Math.floor(first.min_2theta / 5) * 5);
    state.max2Theta = Math.min(100, Math.ceil(first.max_2theta / 5) * 5);
    document.getElementById('min2ThetaInput').value = state.min2Theta;
    document.getElementById('max2ThetaInput').value = state.max2Theta;
  }

  renderTraceList();
  populateRietveldTraceSelect();
  await runSearchMatch();
  await runIndexPeaks(true);
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
    const res = await fetch(`/api/database/search?q=${encodeURIComponent(q)}&source=${state.dbSource}`);
    const data = await res.json();
    state.dbResults = data.results || [];
    renderDbResults();
  } finally {
    btn.textContent = 'Query';
  }
}

async function runSearchMatch() {
  if (!state.series.length) return;
  const primary = state.series[0];
  const res = await fetch('/api/search-match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      two_theta: primary.two_theta,
      intensity: primary.intensity,
      tolerance_deg: 0.45,
      extra_phases: state.dbResults
    })
  });
  const data = await res.json();
  if (data.matches && data.matches.length) {
    state.dbResults = data.matches;
    state.activeReference = data.matches[0];
    syncCellInputsFromReference(state.activeReference);
    renderDbResults();
    await runIndexPeaks(true);
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

    card.addEventListener('click', async (e) => {
      if (e.target.classList.contains('save-local-btn')) {
        e.stopPropagation();
        await savePhaseToLocalDb(phase, e.target);
        return;
      }
      state.activeReference = phase;
      syncCellInputsFromReference(phase);
      renderDbResults();
      await runIndexPeaks(true);
      if (state.viewMode === 'rietveld') {
        await runRietveld();
      } else {
        renderGraph();
      }
    });

    container.appendChild(card);
  });
}

async function savePhaseToLocalDb(phase, btnEl) {
  btnEl.textContent = '✓';
  const res = await fetch('/api/database/save-local', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phase })
  });
  const data = await res.json();
  state.localDb = data.phases || state.localDb;
}

async function runIndexPeaks(useReference = true) {
  if (!state.series.length) return;
  const topTrace = state.series[state.series.length - 1];
  const system = document.getElementById('crystalSystemSelect').value;
  const a = parseFloat(document.getElementById('cellAInput').value) || 3.2498;
  const c = parseFloat(document.getElementById('cellCInput').value) || 5.2066;

  const payload = {
    two_theta: topTrace.two_theta,
    intensity: topTrace.intensity,
    reference_phase: useReference ? state.activeReference : null,
    system,
    cell: {
      a,
      b: a,
      c,
      alpha: 90.0,
      beta: 90.0,
      gamma: system === 'Hexagonal' ? 120.0 : 90.0
    },
    tolerance_deg: 0.55,
    prominence_pct: 5.5
  };

  const res = await fetch('/api/index-peaks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  state.indexed = await res.json();
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

async function runRietveld() {
  if (!state.series.length || !state.activeReference) return;
  const traceIdx = parseInt(document.getElementById('rietveldTraceSelect').value, 10) || 0;
  const trace = state.series[traceIdx] || state.series[0];
  const btn = document.getElementById('runRietveldBtn');
  btn.textContent = '...';

  try {
    const res = await fetch('/api/rietveld', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        two_theta: trace.two_theta,
        intensity: trace.intensity,
        phase: state.activeReference,
        wavelength: 1.5406
      })
    });
    state.rietveld = await res.json();
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
  } finally {
    btn.textContent = 'Refine';
  }
}

/* =========================================================================
   PUBLICATION GRAPH RENDERER (MATCHES PASTED REFERENCE LAYOUT AT 300 DPI)
   ========================================================================= */
function renderGraph() {
  const canvas = document.getElementById('xrdCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width;   // 1800 px (6.0 in @ 300 DPI)
  const H = canvas.height;  // 1575 px (5.25 in @ 300 DPI)

  // Clear crisp white publication background
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

  // 1. Draw Reference Pattern Sticks at Bottom (JCPDS / COD card)
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

    // Two-line Reference Label in bottom-left corner matching reference figure:
    // "JCPDS No."
    // "036-1451"
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

  // 2. Draw Stacked Experimental Spectra (x = 0, x = 0.1, x = 0.2)
  const nTraces = state.series.length;
  if (nTraces > 0) {
    const tracesBottom = bottom - stickZoneH - 28;
    const tracesTop = top + 165;
    const availH = tracesBottom - tracesTop;

    const offsetFactor = isOverlay ? 0.0 : state.stackOffset;
    const stepOffset = nTraces > 1 ? (availH / (nTraces + 0.35)) * offsetFactor : 0;
    const peakAmpH = nTraces > 1 ? Math.min(availH * 0.44, stepOffset * 1.38 || availH * 0.72) : availH * 0.78;

    // Clip curves to plot box
    ctx.save();
    ctx.beginPath();
    ctx.rect(left, top, plotW, plotH);
    ctx.clip();

    const traceApexMap = [];

    state.series.forEach((trace, idx) => {
      const baseLineY = tracesBottom - idx * stepOffset;
      const xs = trace.two_theta;
      const ys = trace.intensity;

      // Compute baseline and max within visible range
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

    // 3. Draw Trace Labels on Left ("x = 0", "x = 0.1", "x = 0.2")
    state.series.forEach((trace, idx) => {
      const info = traceApexMap[idx];
      const labelY = isOverlay
        ? top + 80 + idx * 52
        : info.baseLineY - 36;
      const labelX = left + 36;
      drawFormattedTraceLabel(ctx, trace.label, labelX, labelY, isOverlay ? trace.color : '#000000');
    });

    // 4. Draw Vertical (hkl) Miller Indices above the top trace's peaks
    if (state.showHkl && state.indexed && state.indexed.peaks) {
      const topInfo = traceApexMap[traceApexMap.length - 1];
      const visiblePeaks = state.indexed.peaks.filter(
        (pk) => pk.show_label && pk.hkl_str && pk.two_theta >= minX && pk.two_theta <= maxX
      );

      ctx.fillStyle = '#000000';
      ctx.font = '39px "Times New Roman", Times, serif';

      visiblePeaks.forEach((pk) => {
        // Locate exact peak tip in top trace around pk.two_theta
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
        // If peak apex is very close to the top border (like the tallest (101) peak in the reference graph),
        // place the vertical label slightly to the right of the peak tip so it stays inside the top frame.
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

  // 5. Draw Full 4-Sided Outer Frame & Axes Ticks
  drawPublicationAxes(ctx, left, right, top, bottom, minX, maxX);
}

function drawFormattedTraceLabel(ctx, text, x, y, color = '#000000') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.textBaseline = 'alphabetic';

  // If label starts with "x =" or "x=", render 'x' in italic Times New Roman like the reference image
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

  // Crisp 4-sided black bounding box
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4.2;
  ctx.strokeRect(left, top, plotW, plotH);

  // Determine major & minor tick intervals (10 deg major, 5 deg minor by default)
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

  // Bottom Axis Label: 2θ (degree) with italic θ
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

  // Left Axis Label: Intensity (a.u.) rotated -90 deg
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

  // 1. Observed data points (Yobs)
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

  // 2. Calculated Rietveld profile (Ycalc) in Rose Red
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

  // 3. Bragg reflection ticks
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

  // 4. Difference curve (Yobs - Ycalc) in Chive Blossom / Navy
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

  // 5. (hkl) labels above peaks
  if (state.showHkl && r.bragg_ticks) {
    ctx.fillStyle = '#000000';
    ctx.font = '36px "Times New Roman", Times, serif';
    r.bragg_ticks
      .filter((t) => t.intensity >= 8 && t.two_theta >= minX && t.two_theta <= maxX)
      .forEach((tk) => {
        const px = xToPx(tk.two_theta);
        // Find Ycalc apex near tk.two_theta
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

  // Legend & Rietveld Metrics inside top-left
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
  // 300 DPI = 300 / 0.0254 = 11811 pixels per meter
  const ppm = 11811;
  // pHYs chunk: length(4) + 'pHYs'(4) + data(9) + crc(4) = 21 bytes
  const physChunk = new Uint8Array(21);
  const view = new DataView(physChunk.buffer);

  // Length = 9
  view.setUint32(0, 9, false);
  // Type = 'pHYs' (0x70, 0x48, 0x59, 0x73)
  physChunk[4] = 0x70;
  physChunk[5] = 0x48;
  physChunk[6] = 0x59;
  physChunk[7] = 0x73;
  // Pixels per unit X (4 bytes), Y (4 bytes), Unit specifier = 1 (meter)
  view.setUint32(8, ppm, false);
  view.setUint32(12, ppm, false);
  physChunk[16] = 1;

  // Compute CRC32 over type + data (bytes 4..16)
  const crc = crc32(physChunk.subarray(4, 17));
  view.setUint32(17, crc, false);

  // Insert right after PNG signature (8 bytes) + IHDR chunk (25 bytes) = offset 33
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
