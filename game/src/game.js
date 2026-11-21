// game.js — mesin permainan Selisih Tiga Dunia (bagian 1: state, render, klik).
// Dua panel SVG berdampingan; klik di panel mana pun diperiksa terhadap selisih
// dunia aktif. Selisih yang berpindah (ember kebun) punya koordinat sendiri
// di tiap panel (bx/by di scenes.js).

import { SCENES, DIFFICULTIES, getScene } from './scenes.js';
import { paintStation } from './paint-station.js';
import { paintLibrary } from './paint-library.js';
import { paintGarden } from './paint-garden.js';
import { sfx, setMuted, isMuted } from './sound.js';

const PAINTERS = { stasiun: paintStation, perpustakaan: paintLibrary, kebun: paintGarden };
const SVG_NS = 'http://www.w3.org/2000/svg';
const VIEW_W = 560;
const VIEW_H = 400;

export const state = {
  phase: 'menu', // menu | playing | levelDone | won | lost
  sceneIndex: 0,
  difficulty: 'klasik',
  found: new Set(),
  hintsLeft: 3,
  score: 0,
  totalScore: 0,
  combo: 0,
  timeLeft: 180,
  timeTotal: 180,
  timerId: null,
  hintRings: [],
  reticle: { panel: 'a', x: 280, y: 200, visible: false },
};

export const els = {};
export function $(id) { return document.getElementById(id); }

export function currentScene() {
  return SCENES[state.sceneIndex];
}

export function diffPoint(diff, panel) {
  if (panel === 'b' && diff.bx !== undefined) return { x: diff.bx, y: diff.by };
  return { x: diff.x, y: diff.y };
}

export function renderPanels() {
  const scene = currentScene();
  const paint = PAINTERS[scene.painter];
  els.svgA.innerHTML = paint('a');
  els.svgB.innerHTML = paint('b');
  for (const id of state.found) drawFoundMark(id);
}

export function updateHud() {
  const scene = currentScene();
  els.hudScene.textContent = scene.name;
  els.hudCounter.textContent = `${state.found.size} / ${scene.diffs.length}`;
  const m = Math.floor(state.timeLeft / 60);
  const s = String(state.timeLeft % 60).padStart(2, '0');
  els.hudTimer.textContent = `${m}:${s}`;
  els.timerFill.style.width = `${Math.max(0, (state.timeLeft / state.timeTotal) * 100)}%`;
  els.timerBox.classList.toggle('low', state.timeLeft <= 30 && state.phase === 'playing');
  els.hudScore.textContent = String(state.score + state.totalScore);
  els.hudHints.textContent = '●'.repeat(state.hintsLeft) + '○'.repeat(3 - state.hintsLeft);
  els.hudCombo.textContent = `x${Math.min(state.combo + 1, 5)}`;
  els.hudLevel.textContent = `Dunia ${state.sceneIndex + 1} dari ${SCENES.length}`;
  els.btnHint.disabled = state.phase !== 'playing' || state.hintsLeft <= 0;
}

export function toast(msg, ms = 1600) {
  els.toast.textContent = msg;
  els.toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => els.toast.classList.remove('show'), ms);
}

function svgEl(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

export function drawFoundMark(diffId) {
  const diff = currentScene().diffs.find((d) => d.id === diffId);
  if (!diff) return;
  for (const [svg, panel] of [[els.svgA, 'a'], [els.svgB, 'b']]) {
    const p = diffPoint(diff, panel);
    const g = svgEl('g', { class: 'mark-found' });
    g.appendChild(svgEl('circle', { cx: p.x, cy: p.y, r: diff.r + 4, fill: 'none', stroke: '#2e7d32', 'stroke-width': 3.5 }));
    g.appendChild(svgEl('path', {
      d: `M ${p.x - 8} ${p.y} L ${p.x - 2} ${p.y + 6} L ${p.x + 9} ${p.y - 7}`,
      fill: 'none', stroke: '#2e7d32', 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }));
    svg.appendChild(g);
  }
}

export function drawMissMark(panel, x, y) {
  const svg = panel === 'a' ? els.svgA : els.svgB;
  const g = svgEl('g', { class: 'click-miss' });
  g.appendChild(svgEl('path', {
    d: `M ${x - 8} ${y - 8} L ${x + 8} ${y + 8} M ${x + 8} ${y - 8} L ${x - 8} ${y + 8}`,
    fill: 'none', stroke: '#b3261e', 'stroke-width': 3.5, 'stroke-linecap': 'round',
  }));
  svg.appendChild(g);
  setTimeout(() => g.remove(), 450);
}

export function drawHintRing(diff) {
  clearHintRings();
  for (const [svg, panel] of [[els.svgA, 'a'], [els.svgB, 'b']]) {
    const p = diffPoint(diff, panel);
    const c = svgEl('circle', {
      cx: p.x, cy: p.y, r: diff.r + 8, fill: 'none', stroke: '#e9a13b', 'stroke-width': 4, class: 'mark-hint',
    });
    svg.appendChild(c);
    state.hintRings.push(c);
  }
  setTimeout(clearHintRings, 2600);
}

export function clearHintRings() {
  for (const c of state.hintRings) c.remove();
  state.hintRings = [];
}

export function svgPoint(svg, clientX, clientY) {
  const r = svg.getBoundingClientRect();
  return {
    x: ((clientX - r.left) / r.width) * VIEW_W,
    y: ((clientY - r.top) / r.height) * VIEW_H,
  };
}

export function checkPoint(panel, x, y) {
  if (state.phase !== 'playing') return;
  const scene = currentScene();
  const hit = scene.diffs.find((d) => {
    if (state.found.has(d.id)) return false;
    const p = diffPoint(d, panel);
    return Math.hypot(x - p.x, y - p.y) <= d.r + 6;
  });
  if (hit) {
    state.found.add(hit.id);
    state.combo += 1;
    const pts = 100 + 25 * Math.min(state.combo - 1, 4);
    state.score += pts;
    sfx.found();
    drawFoundMark(hit.id);
    toast(`Ketemu! ${hit.label}  +${pts}`);
    updateHud();
    if (state.found.size === scene.diffs.length) levelComplete();
  } else {
    state.combo = 0;
    state.score = Math.max(0, state.score - 25);
    state.timeLeft = Math.max(0, state.timeLeft - 3);
    sfx.miss();
    drawMissMark(panel, x, y);
    const panelEl = panel === 'a' ? els.panelA : els.panelB;
    panelEl.classList.remove('shake');
    void panelEl.offsetWidth;
    panelEl.classList.add('shake');
    toast('Bukan di situ. −25 poin, −3 detik');
    updateHud();
    if (state.timeLeft <= 0) gameOver();
  }
}

// game.js — bagian 2: alur level, timer, petunjuk, keyboard, overlay, init.

export function startLevel(sceneIndex, difficultyId) {
  const diff = DIFFICULTIES[difficultyId] ?? DIFFICULTIES.klasik;
  state.sceneIndex = sceneIndex;
  state.difficulty = diff.id;
  state.found = new Set();
  state.hintsLeft = 3;
  state.score = 0;
  state.combo = 0;
  state.timeLeft = diff.seconds;
  state.timeTotal = diff.seconds;
  state.phase = 'playing';
  stopTimer();
  state.timerId = setInterval(tick, 250);
  clearHintRings();
  renderPanels();
  updateHud();
  hideOverlay();
  toast(`${currentScene().name}: cari 10 selisih!`);
}

export function stopTimer() {
  if (state.timerId) clearInterval(state.timerId);
  state.timerId = null;
}

export function tick() {
  if (state.phase !== 'playing') return;
  state.timeLeft -= 0.25;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    updateHud();
    gameOver();
    return;
  }
  updateHud();
}

export function levelComplete() {
  stopTimer();
  const bonus = Math.ceil(state.timeLeft) * 5;
  state.score += bonus;
  const levelScore = state.score;
  state.totalScore += state.score;
  state.score = 0; // sudah dibukukan ke totalScore; HUD = totalScore + score
  state.phase = 'levelDone';
  sfx.level();
  updateHud();
  const last = state.sceneIndex === SCENES.length - 1;
  showOverlay(
    last ? 'SEMUA DUNIA SELESAI!' : `${currentScene().name.toUpperCase()} SELESAI!`,
    last
      ? `Luar biasa, semua 30 selisih ketemu. Bonus waktu +${bonus} poin.`
      : `Semua 10 selisih ketemu! Bonus waktu +${bonus} poin. Dunia berikutnya menunggu.`,
    [
      { label: 'Skor dunia ini', value: String(levelScore) },
      { label: 'Skor total', value: String(state.totalScore) },
      { label: 'Sisa waktu', value: `${Math.ceil(state.timeLeft)} dtk` },
    ],
    last
      ? [{ label: 'Main Lagi dari Dunia 1', act: () => startLevel(0, state.difficulty) }]
      : [{ label: `Lanjut: ${SCENES[state.sceneIndex + 1].name}`, act: () => startLevel(state.sceneIndex + 1, state.difficulty) }],
  );
  if (last) state.phase = 'won';
}

export function gameOver() {
  stopTimer();
  state.phase = 'lost';
  sfx.lose();
  updateHud();
  showOverlay(
    'WAKTU HABIS',
    `Waktu habis di ${currentScene().name}. Kamu menemukan ${state.found.size} dari 10 selisih. Coba lagi, kali ini lebih cepat.`,
    [
      { label: 'Ditemukan', value: `${state.found.size} / 10` },
      { label: 'Skor dunia ini', value: String(state.score) },
      { label: 'Skor total', value: String(state.totalScore + state.score) },
    ],
    [{ label: 'Coba Lagi Dunia Ini', act: () => startLevel(state.sceneIndex, state.difficulty) }],
  );
}

export function useHint() {
  if (state.phase !== 'playing' || state.hintsLeft <= 0) return;
  const remaining = currentScene().diffs.filter((d) => !state.found.has(d.id));
  if (!remaining.length) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - 50);
  sfx.hint();
  drawHintRing(pick);
  toast(`Petunjuk: ${pick.hint}  (−50 poin)`, 2600);
  updateHud();
}

export function showOverlay(title, text, stats, actions) {
  const oldStats = $('overlay-stats');
  if (oldStats) oldStats.remove();
  const oldActions = $('overlay-actions');
  if (oldActions) oldActions.remove();
  els.overlayTitle.textContent = title;
  els.overlayText.textContent = text;
  els.scenePick.innerHTML = '';
  els.diffPick.innerHTML = '';
  els.btnStart.style.display = 'none';
  els.overlayFoot.textContent = 'Selisih Tiga Dunia — semua gambar digambar tangan sebagai SVG.';
  let statsHtml = '';
  if (stats && stats.length) {
    statsHtml = `<div id="overlay-stats">${stats.map((s) => `<div class="stat-chip"><b>${s.value}</b><span>${s.label}</span></div>`).join('')}</div>`;
  }
  els.overlayText.insertAdjacentHTML('afterend', statsHtml);
  const old = $('overlay-actions');
  if (old) old.remove();
  const wrap = document.createElement('div');
  wrap.id = 'overlay-actions';
  wrap.style.cssText = 'display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:14px;';
  for (const a of actions) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = a.label;
    btn.addEventListener('click', () => { sfx.click(); a.act(); });
    wrap.appendChild(btn);
  }
  const menuBtn = document.createElement('button');
  menuBtn.type = 'button';
  menuBtn.textContent = 'Menu Utama';
  menuBtn.addEventListener('click', () => { sfx.click(); showMenu(); });
  wrap.appendChild(menuBtn);
  els.overlayCard.appendChild(wrap);
  els.overlay.classList.add('show');
}

export function hideOverlay() {
  els.overlay.classList.remove('show');
  const old = $('overlay-actions');
  if (old) old.remove();
  const stats = $('overlay-stats');
  if (stats) stats.remove();
}

export function showMenu() {
  stopTimer();
  state.phase = 'menu';
  state.sceneIndex = 0;
  state.found = new Set();
  state.score = 0;
  state.totalScore = 0;
  state.combo = 0;
  state.timeLeft = DIFFICULTIES[state.difficulty].seconds;
  state.timeTotal = state.timeLeft;
  renderPanels();
  updateHud();
  const old = $('overlay-actions');
  if (old) old.remove();
  const stats = $('overlay-stats');
  if (stats) stats.remove();
  els.overlayTitle.textContent = 'SELISIH TIGA DUNIA';
  els.overlayText.textContent = 'Dua gambar tampak sama. Padahal ada 10 selisih tersembunyi di setiap dunia. Temukan semuanya sebelum waktu habis.';
  els.overlayFoot.textContent = 'Stasiun Senja · Perpustakaan Ajaib · Kebun Kaca — semua digambar tangan sebagai SVG, tanpa gambar pinjaman.';
  els.scenePick.innerHTML = '';
  for (const scene of SCENES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'scene-btn' + (scene.id === SCENES[state.sceneIndex].id ? ' picked' : '');
    btn.textContent = scene.name;
    btn.addEventListener('click', () => {
      state.sceneIndex = SCENES.indexOf(scene);
      document.querySelectorAll('.scene-btn').forEach((b) => b.classList.remove('picked'));
      btn.classList.add('picked');
      renderPanels();
      updateHud();
      sfx.click();
    });
    els.scenePick.appendChild(btn);
  }
  els.diffPick.innerHTML = '<span class="pick-label">Kesulitan</span>';
  for (const d of Object.values(DIFFICULTIES)) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'diff-btn' + (d.id === state.difficulty ? ' picked' : '');
    const mm = Math.floor(d.seconds / 60);
    const ss = String(d.seconds % 60).padStart(2, '0');
    btn.textContent = `${d.name} · ${mm}:${ss}`;
    btn.addEventListener('click', () => {
      state.difficulty = d.id;
      document.querySelectorAll('.diff-btn').forEach((b) => b.classList.remove('picked'));
      btn.classList.add('picked');
      sfx.click();
    });
    els.diffPick.appendChild(btn);
  }
  els.btnStart.style.display = '';
  els.overlay.classList.add('show');
}

export function moveReticle(dx, dy) {
  const r = state.reticle;
  r.visible = true;
  r.x = Math.max(0, Math.min(VIEW_W, r.x + dx));
  r.y = Math.max(0, Math.min(VIEW_H, r.y + dy));
  positionReticle();
}

export function positionReticle() {
  const r = state.reticle;
  const svg = r.panel === 'a' ? els.svgA : els.svgB;
  const stage = els.stage.getBoundingClientRect();
  const box = svg.getBoundingClientRect();
  els.reticle.style.left = `${box.left - stage.left + (r.x / VIEW_W) * box.width}px`;
  els.reticle.style.top = `${box.top - stage.top + (r.y / VIEW_H) * box.height}px`;
  els.reticle.classList.toggle('on', r.visible && state.phase === 'playing');
}

export function initGame() {
  els.app = $('app'); els.stage = $('stage');
  els.svgA = $('svg-a'); els.svgB = $('svg-b');
  els.panelA = $('panel-a'); els.panelB = $('panel-b');
  els.hudScene = $('hud-scene'); els.hudCounter = $('hud-counter');
  els.hudTimer = $('hud-timer'); els.timerBox = $('timer-box'); els.timerFill = $('timer-fill');
  els.hudScore = $('hud-score'); els.hudHints = $('hud-hints'); els.hudCombo = $('hud-combo');
  els.hudLevel = $('hud-level'); els.toast = $('toast'); els.reticle = $('reticle');
  els.overlay = $('overlay'); els.overlayCard = $('overlay-card');
  els.overlayTitle = $('overlay-title'); els.overlayText = $('overlay-text');
  els.overlayFoot = $('overlay-foot'); els.scenePick = $('scene-pick'); els.diffPick = $('diff-pick');
  els.btnStart = $('btn-start'); els.btnHint = $('btn-hint');
  els.btnSound = $('btn-sound'); els.btnRestart = $('btn-restart');

  for (const [svg, panel] of [[els.svgA, 'a'], [els.svgB, 'b']]) {
    svg.addEventListener('click', (e) => {
      const p = svgPoint(svg, e.clientX, e.clientY);
      state.reticle = { panel, x: p.x, y: p.y, visible: true };
      positionReticle();
      checkPoint(panel, p.x, p.y);
    });
    svg.addEventListener('pointermove', (e) => {
      const p = svgPoint(svg, e.clientX, e.clientY);
      state.reticle = { panel, x: p.x, y: p.y, visible: state.reticle.visible };
      if (state.reticle.visible) positionReticle();
    });
  }

  els.btnStart.addEventListener('click', () => { sfx.click(); startLevel(state.sceneIndex, state.difficulty); });
  els.btnHint.addEventListener('click', useHint);
  els.btnSound.addEventListener('click', () => {
    setMuted(!isMuted());
    els.btnSound.textContent = isMuted() ? '♪ Sunyi' : '♫ Suara';
    if (!isMuted()) sfx.click();
  });
  els.btnRestart.addEventListener('click', () => { sfx.click(); startLevel(state.sceneIndex, state.difficulty); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'h' || e.key === 'H') { useHint(); return; }
    if (e.key === 'm' || e.key === 'M') { els.btnSound.click(); return; }
    if (e.key === 'r' || e.key === 'R') { startLevel(state.sceneIndex, state.difficulty); return; }
    if (e.key === 'n' || e.key === 'N') {
      startLevel((state.sceneIndex + 1) % SCENES.length, state.difficulty);
      return;
    }
    if (state.phase !== 'playing') return;
    const step = e.shiftKey ? 48 : 12;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (e.key === 'ArrowLeft') {
        if (state.reticle.x <= 4 && state.reticle.panel === 'b') { state.reticle.panel = 'a'; state.reticle.x = VIEW_W - 4; }
        else moveReticle(-step, 0);
      } else if (e.key === 'ArrowRight') {
        if (state.reticle.x >= VIEW_W - 4 && state.reticle.panel === 'a') { state.reticle.panel = 'b'; state.reticle.x = 4; }
        else moveReticle(step, 0);
      } else if (e.key === 'ArrowUp') moveReticle(0, -step);
      else moveReticle(0, step);
      state.reticle.visible = true;
      positionReticle();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      state.reticle.visible = true;
      checkPoint(state.reticle.panel, state.reticle.x, state.reticle.y);
    }
  });

  window.addEventListener('resize', () => { if (state.reticle.visible) positionReticle(); });
  showMenu();
}
