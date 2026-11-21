// sound.js — efek suara kecil via WebAudio, tanpa file audio sama sekali.
// Semua bunyi dibuat dari osilator, jadi game tetap offline dan tanpa aset.

let ctx = null;
let muted = false;

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq, start, dur, type = 'sine', vol = 0.12) {
  if (muted) return;
  const ac = ensureCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, ac.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + start + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur + 0.02);
}

export const sfx = {
  click() { tone(520, 0, 0.06, 'triangle', 0.06); },
  found() { tone(660, 0, 0.12, 'sine', 0.14); tone(880, 0.09, 0.18, 'sine', 0.14); },
  miss() { tone(180, 0, 0.18, 'sawtooth', 0.07); },
  hint() { tone(980, 0, 0.1, 'sine', 0.1); tone(1240, 0.08, 0.14, 'sine', 0.1); },
  level() { [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.22, 'sine', 0.13)); },
  win() { [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, i * 0.12, 0.3, 'triangle', 0.12)); },
  lose() { [392, 330, 262].forEach((f, i) => tone(f, i * 0.16, 0.25, 'sine', 0.11)); },
};
