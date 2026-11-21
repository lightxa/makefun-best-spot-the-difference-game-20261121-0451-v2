// shots.js — preset pengambilan gambar: ?shot=start|play|win (&scene=0..2).
// Preset memakai jalur permainan yang sama seperti klik pemain (checkPoint),
// jadi tangkapan layar selalu menunjukkan keadaan permainan yang sungguhan:
// play = 3 selisih sudah ketemu, 7 masih tersembunyi, penghitung 3/10;
// win = dunia terakhir selesai dengan overlay kemenangan.

import { state, startLevel, checkPoint, currentScene, useHint, updateHud } from './game.js';

export function applyShot() {
  const q = new URLSearchParams(window.location.search);
  const shot = q.get('shot');
  if (!shot || shot === 'start') return;
  const sceneIndex = Math.min(2, Math.max(0, Number(q.get('scene') ?? 0) || 0));
  const diffId = q.get('diff') ?? 'klasik';
  window.__game = { state, checkPoint, startLevel };
  if (shot === 'play' || shot === 'hint') {
    startLevel(sceneIndex, diffId);
    const diffs = currentScene().diffs;
    const picks = shot === 'hint' ? diffs.slice(0, 2) : diffs.slice(0, 3);
    for (const d of picks) checkPoint('a', d.x, d.y);
    state.timeLeft = 154;
    state.score = 375;
    if (shot === 'hint') useHint();
    updateHud();
  } else if (shot === 'win') {
    startLevel(2, diffId);
    for (const d of [...currentScene().diffs]) checkPoint('b', d.bx ?? d.x, d.by ?? d.y);
  }
}
