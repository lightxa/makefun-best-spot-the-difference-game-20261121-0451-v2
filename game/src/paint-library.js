// paint-library.js — pelukis dunia "Perpustakaan Ajaib": rak buku yang berbisik.
// Varian 'a' gambar asli, varian 'b' sama persis kecuali 10 selisih scenes.js.

import { circle, ellipse, rect, text, path, sparkle } from './svg-helpers.js';

export function paintLibrary(variant) {
  const b = variant === 'b';
  const defs = `<defs>
    <linearGradient id="li-wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#5a3a26"/><stop offset="1" stop-color="#3e2718"/>
    </linearGradient>
    <radialGradient id="li-glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffd98a" stop-opacity="0.55"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/>
    </radialGradient>
  </defs>`;

  // Dinding, rak, dan buku-buku. Buku merah di rak tengah hilang di B.
  const bookRow = (x0, y, colors, missing = -1) => colors.map((c, i) => {
    if (i === missing) return rect(x0 + i * 16, y, 14, 44, '#3e2718');
    const h = 40 + ((i * 7) % 3) * 3;
    return rect(x0 + i * 16, y + 44 - h, 14, h, c, 'stroke="#2b1a10" stroke-width="1"');
  }).join('');
  const shelves = `
    ${rect(0, 0, 560, 400, 'url(#li-wall)')}
    ${sparkle(520, 36, 6)}${sparkle(40, 50, 5)}
    ${rect(30, 56, 150, 4, '#2b1a10')}${rect(30, 140, 150, 4, '#2b1a10')}${rect(30, 224, 150, 4, '#2b1a10')}
    ${rect(200, 56, 160, 4, '#2b1a10')}${rect(200, 140, 160, 4, '#2b1a10')}${rect(200, 224, 160, 4, '#2b1a10')}
    ${rect(380, 56, 150, 4, '#2b1a10')}${rect(380, 140, 150, 4, '#2b1a10')}${rect(380, 224, 150, 4, '#2b1a10')}
    ${bookRow(34, 100, ['#7a2e2e', '#2e5a7a', '#5a7a2e', '#8a6d2b', '#6b3a6b', '#2e7a6b', '#a8542e', '#3a3a6b', '#7a5a2e'])}
    ${bookRow(34, 184, ['#2e5a7a', '#8a6d2b', '#7a2e2e', '#5a7a2e', '#6b3a6b', '#2e7a6b', '#3a3a6b', '#a8542e', '#7a5a2e'])}
    ${bookRow(204, 100, ['#2e5a7a', '#5a7a2e', '#8a6d2b', '#2e7a6b', '#7a2e2e', '#6b3a6b', '#3a3a6b'], b ? 4 : -1)}
    ${bookRow(204, 184, ['#6b3a6b', '#2e7a6b', '#7a2e2e', '#8a6d2b', '#2e5a7a', '#5a7a2e', '#a8542e', '#3a3a6b', '#7a5a2e'])}
    ${bookRow(384, 100, ['#5a7a2e', '#7a2e2e', '#2e5a7a', '#8a6d2b', '#6b3a6b', '#2e7a6b', '#3a3a6b', '#a8542e', '#7a5a2e'])}
    ${bookRow(384, 184, ['#8a6d2b', '#2e5a7a', '#5a7a2e', '#7a2e2e', '#2e7a6b', '#6b3a6b', '#a8542e', '#3a3a6b'])}`;

  // Lukisan dinding: bulan sabit di A, matahari di B.
  const portrait = `
    ${rect(250, 40, 64, 64, '#c9a227', 'stroke="#2b1a10" stroke-width="4"')}
    ${rect(256, 46, 52, 52, '#1c2a4a')}
    ${b ? circle(282, 72, 12, '#ffd23f') + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const r = (a * Math.PI) / 180;
        return path(`M ${282 + Math.cos(r) * 16} ${72 + Math.sin(r) * 16} L ${282 + Math.cos(r) * 21} ${72 + Math.sin(r) * 21}`, 'none', 'stroke="#ffd23f" stroke-width="2" stroke-linecap="round"');
      }).join('') : path('M 290 60 A 13 13 0 1 0 290 84 A 10 10 0 1 1 290 60 Z', '#f4ead5')}
    ${text(282, 118, b ? 'Matahari' : 'Bulan', '#f3d9a4', 9)}`;

  // Burung hantu di rak kanan: mata terbuka di A, terpejam di B.
  const owl = `
    ${ellipse(472, 122, 20, 26, '#8a6d4b')}${ellipse(472, 148, 14, 8, '#8a6d4b')}
    ${circle(464, 114, 6, '#fdf6e9')}${circle(480, 114, 6, '#fdf6e9')}
    ${b
      ? path('M 459 114 L 469 114 M 475 114 L 485 114', 'none', 'stroke="#2b1a10" stroke-width="2" stroke-linecap="round"')
      : circle(464, 114, 2.6, '#2b1a10') + circle(480, 114, 2.6, '#2b1a10')}
    ${path('M 472 120 L 469 126 L 475 126 Z', '#e9a13b')}
    ${path('M 452 130 L 446 138 M 452 136 L 447 144', 'none', 'stroke="#6b4e33" stroke-width="2" stroke-linecap="round"')}
    ${path('M 492 130 L 498 138 M 492 136 L 497 144', 'none', 'stroke="#6b4e33" stroke-width="2" stroke-linecap="round"')}`;

  // Tanaman gantung kiri: satu daun berkurang di B.
  const plant = `
    ${path('M 62 120 L 62 140', 'none', 'stroke="#2b1a10" stroke-width="2"')}
    ${path('M 48 140 L 76 140 L 70 162 L 54 162 Z', '#a8542e')}
    ${ellipse(52, 176, 7, 16, '#2e7d32', 'transform="rotate(-25 52 176)"')}
    ${ellipse(72, 176, 7, 16, '#2e7d32', 'transform="rotate(25 72 176)"')}
    ${b ? '' : ellipse(62, 186, 7, 18, '#2e7d32')}
    ${ellipse(48, 196, 6, 12, '#388e3c', 'transform="rotate(-35 48 196)"')}
    ${ellipse(76, 196, 6, 12, '#388e3c', 'transform="rotate(35 76 196)"')}`;

  // Meja besar dan isinya: lilin, jam pasir, buku terbuka, lampu, globe, tumpukan.
  const desk = `
    ${rect(0, 340, 560, 60, '#4a2f1e')}${rect(0, 340, 560, 5, '#2b1a10')}
    ${ellipse(280, 372, 150, 16, '#7a2e2e', 'opacity="0.6"')}
    ${rect(60, 306, 440, 10, '#6b4229')}${rect(70, 316, 10, 28, '#3a2418')}${rect(480, 316, 10, 28, '#3a2418')}
    ${rect(104, 292, 16, 24, '#fdf6e9', 'stroke="#d8c9a8" stroke-width="1"')}
    ${b ? '' : circle(112, 284, 6, '#ffb03a') + circle(112, 284, 11, '#ffb03a', 'opacity="0.3"')}
    ${ellipse(112, 318, 20, 4, '#c9a227')}
    ${rect(186, 258, 32, 6, '#c9a227')}${rect(186, 300, 32, 6, '#c9a227')}
    ${path('M 188 264 L 216 264 L 202 282 L 188 300 L 216 300 L 202 282 Z', '#bfe3ea', 'stroke="#8a6d2b" stroke-width="1.5"')}
    ${b ? path('M 196 288 L 208 288 L 202 296 Z', '#e9d8a6') : path('M 196 270 L 208 270 L 202 278 Z', '#e9d8a6')}
    ${path('M 228 322 L 252 314 L 252 344 L 228 336 Z', '#fdf6e9', 'stroke="#8a6d2b" stroke-width="1.5"')}
    ${path('M 276 322 L 252 314 L 252 344 L 276 336 Z', '#f3e6c8', 'stroke="#8a6d2b" stroke-width="1.5"')}
    ${b ? '' : path('M 234 324 L 246 321 M 234 330 L 246 327 M 258 321 L 270 324 M 258 327 L 270 330', 'none', 'stroke="#6d5138" stroke-width="1.2"')}
    ${path('M 382 306 L 382 252', 'none', 'stroke="#2b1a10" stroke-width="4" stroke-linecap="round"')}
    ${ellipse(382, 308, 16, 4, '#2b1a10')}
    ${path('M 368 252 L 396 252 L 390 228 L 374 228 Z', b ? '#7ab8a0' : '#c2571b')}
    ${circle(382, 242, 26, b ? '#7ab8a0' : '#ffd98a', 'opacity="0.25"')}
    ${circle(432, 288, 20, '#2e5a7a', 'stroke="#c9a227" stroke-width="2"')}
    ${b ? path('M 420 282 Q 428 276 436 284 Q 444 292 436 298 Q 426 296 420 282 Z', '#5a7a2e') : path('M 424 278 Q 434 274 440 282 Q 436 292 426 292 Q 420 286 424 278 Z', '#5a7a2e')}
    ${path('M 432 308 L 432 316 M 420 316 L 444 316', 'none', 'stroke="#c9a227" stroke-width="3" stroke-linecap="round"')}
    ${[0, 1, 2].map((i) => rect(130, 322 - i * 9, 44 - i * 4, 8, ['#7a2e2e', '#2e5a7a', '#5a7a2e'][i], 'stroke="#2b1a10" stroke-width="1"')).join('')}
    ${b ? rect(132, 295, 38, 8, '#8a6d2b', 'stroke="#2b1a10" stroke-width="1"') : ''}`;

  return defs + shelves + portrait + owl + plant + desk;
}
