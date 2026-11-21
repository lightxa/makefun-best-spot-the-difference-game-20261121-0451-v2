// paint-station.js — pelukis dunia "Stasiun Senja": peron tua di ujung hari.
// Mengembalikan isi SVG 560x400. Varian 'a' gambar asli, varian 'b' sama persis
// kecuali 10 selisih dari scenes.js (koordinatnya dijaga sama di kedua varian).

import { circle, ellipse, rect, text, path, cloud, sparkle, bird, flower } from './svg-helpers.js';

export function paintStation(variant) {
  const b = variant === 'b';
  const sky = `<defs>
    <linearGradient id="st-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3b2a5e"/><stop offset="0.55" stop-color="#c2571b"/><stop offset="1" stop-color="#f2a65a"/>
    </linearGradient>
    <linearGradient id="st-wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8a5a3b"/><stop offset="1" stop-color="#6b4229"/>
    </linearGradient>
  </defs>`;

  // Langit senja, matahari, bintang awal, awan, dan kabel lampu.
  const skyParts = `
    ${rect(0, 0, 560, 250, 'url(#st-sky)')}
    ${circle(480, 64, 26, '#ffd98a')}${circle(480, 64, 34, '#ffd98a', 'opacity="0.35"')}
    ${sparkle(60, 40, 7)}${sparkle(140, 28, 5)}${sparkle(340, 36, 6)}${sparkle(520, 30, 5)}
    ${cloud(90, 90, 0.8, '#e8b48a')}${cloud(380, 46, 0.6, '#e8b48a')}
    ${path('M 0 78 L 560 70', 'none', 'stroke="#2b2118" stroke-width="2"')}
    ${b ? bird(182, 62, 1) + bird(210, 60, 0.8) : bird(210, 60, 0.8)}`;

  // Menara jam: jarum menunjuk pukul 7 di A, pukul 8 di B.
  const clock = `
    ${rect(255, 40, 50, 86, '#5a3a26')}${rect(250, 34, 60, 10, '#3a2418', 'rx="3"')}
    ${circle(280, 72, 22, '#fdf6e9', 'stroke="#3a2418" stroke-width="3"')}
    ${circle(280, 72, 2.5, '#3a2418')}
    ${path(b ? 'M 280 72 L 280 56 M 280 72 L 292 78' : 'M 280 72 L 280 56 M 280 72 L 268 80', 'none', 'stroke="#3a2418" stroke-width="2.5" stroke-linecap="round"')}
    ${text(280, 58, '12', '#3a2418', 8)}${text(280, 88, '6', '#3a2418', 8)}`;

  // Aula stasiun, atap, papan nomor peron, poster, dan lampu gantung.
  const hall = `
    ${path('M 130 126 L 430 126 L 450 108 L 110 108 Z', '#3a2418')}
    ${rect(150, 126, 260, 130, 'url(#st-wall)')}
    ${rect(170, 150, 60, 106, '#4a2f1e')}${rect(330, 150, 60, 106, '#4a2f1e')}
    ${rect(180, 160, 40, 86, '#2c1c12')}${rect(340, 160, 40, 86, '#2c1c12')}
    ${rect(186, 138, 28, 22, '#f3d9a4', 'stroke="#3a2418" stroke-width="2"')}
    ${text(200, 154, b ? '3' : '2', '#3a2418', 15)}
    ${text(202, 134, 'PERON', '#f3d9a4', 9)}
    ${rect(448, 128, 44, 48, '#fdf6e9', 'stroke="#3a2418" stroke-width="2"')}
    ${rect(452, 132, 36, 22, '#14655c')}${text(470, 147, b ? 'JOGJA' : 'SOLO', '#fff', 8)}
    ${text(470, 168, b ? '07.40' : '07.05', '#3a2418', 9)}
    ${[80, 120, 160].map((x) => `
      ${path(`M ${x} 100 L ${x} 106`, 'none', 'stroke="#2b2118" stroke-width="2"')}
      ${circle(x, 112, 7, b && x === 120 ? '#5a5148' : '#ffd98a', 'stroke="#3a2418" stroke-width="1.5"')}
      ${b && x === 120 ? '' : circle(x, 112, 11, '#ffd98a', 'opacity="0.25"')}`).join('')}`;

  // Kereta di kanan: jendela kedua gelap di B.
  const train = `
    ${rect(318, 178, 224, 84, '#7a2e2e', 'rx="8"')}${rect(318, 178, 224, 16, '#5a1f1f', 'rx="8"')}
    ${[336, 368, 400, 432, 464, 496].map((x, i) => rect(x, 200, 24, 24, b && i === 0 ? '#241a14' : '#bfe3ea', 'stroke="#3a2418" stroke-width="2" rx="3"')).join('')}
    ${circle(340, 262, 10, '#2b2118')}${circle(380, 262, 10, '#2b2118')}${circle(500, 262, 10, '#2b2118')}
    ${rect(310, 262, 240, 6, '#3a2418')}`;

  // Peron bawah: bangku + kucing, meja kopi, koper, pot bunga.
  const platform = `
    ${rect(0, 330, 560, 70, '#8a6a4a')}${rect(0, 330, 560, 6, '#6b4e33')}
    ${rect(0, 262, 560, 8, '#5a3a26')}
    ${rect(396, 286, 96, 10, '#5a3a26')}${rect(404, 296, 6, 34, '#3a2418')}${rect(478, 296, 6, 34, '#3a2418')}
    ${b ? '' : `
      ${ellipse(432, 296, 14, 10, '#e07b39')}${circle(444, 286, 7, '#e07b39')}
      ${path('M 420 296 Q 408 288 410 276', 'none', 'stroke="#e07b39" stroke-width="4" stroke-linecap="round"')}
      ${circle(446, 284, 1.6, '#2b2118')}${path('M 438 280 L 442 274 L 446 280 Z', '#e07b39')}`}
    ${rect(310, 312, 46, 6, '#5a3a26')}${rect(330, 318, 6, 14, '#3a2418')}
    ${b ? '' : `${rect(324, 298, 16, 14, '#fdf6e9', 'stroke="#3a2418" stroke-width="1.5" rx="2"')}
      ${path('M 330 298 Q 328 290 332 286 M 336 298 Q 338 291 334 287', 'none', 'stroke="#fff" stroke-width="1.6" stroke-linecap="round"')}`}
    ${b ? '' : `
      ${rect(78, 300, 28, 42, '#b3261e', 'rx="4" stroke="#7a1a14" stroke-width="2"')}
      ${rect(78, 318, 28, 4, '#7a1a14')}${path('M 86 300 L 86 292 Q 92 288 98 292 L 98 300', 'none', 'stroke="#7a1a14" stroke-width="3" fill="none"')}
      ${rect(106, 306, 10, 30, '#7a2e2e', 'rx="3"')}`}
    ${path('M 512 330 L 528 330 L 524 352 L 516 352 Z', '#b5651d')}
    ${flower(520, 318, b ? '#9b59b6' : '#e63946', '#ffd23f', 8)}`;

  return sky + skyParts + clock + hall + train + platform;
}
