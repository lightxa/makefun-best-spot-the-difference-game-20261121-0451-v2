// paint-garden.js — pelukis dunia "Kebun Kaca": rumah kaca di pagi hari.
// Varian 'a' gambar asli, varian 'b' sama persis kecuali 10 selisih scenes.js.

import { circle, ellipse, rect, text, path, cloud, bird, flower, butterfly } from './svg-helpers.js';

export function paintGarden(variant) {
  const b = variant === 'b';
  const defs = `<defs>
    <linearGradient id="gd-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#aee3f5"/><stop offset="0.6" stop-color="#dff3d8"/><stop offset="1" stop-color="#cfe8b0"/>
    </linearGradient>
    <linearGradient id="gd-glass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#bfe3ea" stop-opacity="0.25"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0.45"/><stop offset="1" stop-color="#bfe3ea" stop-opacity="0.25"/>
    </linearGradient>
  </defs>`;

  // Langit pagi, matahari (satu sinar hilang di B), pelangi, awan, burung.
  const rays = [0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
    if (b && i === 2) return '';
    const r = (a * Math.PI) / 180;
    return path(`M ${92 + Math.cos(r) * 24} ${62 + Math.sin(r) * 24} L ${92 + Math.cos(r) * 32} ${62 + Math.sin(r) * 32}`, 'none', 'stroke="#f2a541" stroke-width="3" stroke-linecap="round"');
  }).join('');
  const skyParts = `
    ${rect(0, 0, 560, 300, 'url(#gd-sky)')}
    ${circle(92, 62, 20, '#ffd23f')}${rays}
    ${[0, 1, 2].map((i) => path(`M ${180 + i * 8} ${190 - i * 8} A ${104 - i * 10} ${104 - i * 10} 0 0 1 ${380 - i * 8} ${190 - i * 8}`, 'none', `stroke="${['#e63946', '#ffd23f', '#2a9d8f'][i]}" stroke-width="7" fill="none" opacity="0.85"`)).join('')}
    ${b ? '' : path('M 204 190 A 80 80 0 0 1 356 190', 'none', 'stroke="#7b5ea7" stroke-width="7" fill="none" opacity="0.85"')}
    ${cloud(180, 60, 0.9)}${cloud(420, 44, 0.7)}
    ${bird(150, 110, 1)}${bird(360, 90, 0.9)}
    ${b ? butterfly(302, 122, 1, '#e07b39') : ''}`;

  // Rumah kaca: rangka + kaca, pohon kanan dengan burung, lebah di tengah.
  const glasshouse = `
    ${path('M 60 300 L 60 150 Q 280 60 500 150 L 500 300 Z', 'url(#gd-glass)', 'stroke="#5a7a6b" stroke-width="3"')}
    ${path('M 60 210 L 500 210 M 170 300 L 170 128 M 280 300 L 280 96 M 390 300 L 390 128', 'none', 'stroke="#5a7a6b" stroke-width="2" opacity="0.7"')}
    ${rect(60, 296, 440, 8, '#5a7a6b')}
    ${rect(452, 96, 12, 90, '#6b4229')}${circle(468, 92, 46, '#2e7d32')}${circle(438, 110, 30, '#388e3c')}${circle(496, 112, 28, '#43a047')}
    ${b ? '' : `${circle(472, 92, 7, '#5a7a6b')}${circle(475, 89, 2, '#ffd23f')}${path('M 468 92 L 460 88 L 460 96 Z', '#e9a13b')}`}
    ${b ? `${ellipse(202, 152, 4, 3, '#ffd23f', 'stroke="#2b2118" stroke-width="1"')}${path('M 198 150 L 196 144 M 206 150 L 208 144', 'none', 'stroke="#fff" stroke-width="1.5"')}` : ''}`;

  // Air mancur tengah: pancuran tengah mati di B.
  const fountain = `
    ${ellipse(282, 236, 72, 14, '#8a9a9a')}${ellipse(282, 232, 62, 11, '#5a7a8a')}
    ${ellipse(282, 230, 54, 8, '#7fd4e8')}
    ${rect(276, 196, 12, 38, '#8a9a9a')}
    ${path('M 282 196 Q 262 176 252 202 M 282 196 Q 302 176 312 202', 'none', 'stroke="#7fd4e8" stroke-width="3" fill="none" stroke-linecap="round"')}
    ${b ? '' : path('M 282 196 Q 282 172 282 164', 'none', 'stroke="#7fd4e8" stroke-width="3" fill="none" stroke-linecap="round"')}
    ${circle(252, 200, 3, '#bfe3ea')}${circle(312, 200, 3, '#bfe3ea')}${b ? '' : circle(282, 162, 3.5, '#bfe3ea')}`;

  // Tanah, hamparan bunga, pagar, jamur, ember penyiram.
  const ground = `
    ${rect(0, 300, 560, 100, '#7cb342')}${ellipse(120, 340, 90, 18, '#689f38')}${ellipse(430, 350, 100, 20, '#689f38')}
    ${[60, 100, 152, 200, 250, 300, 350, 420, 470].map((x, i) => flower(x, 316 + (i % 2) * 8, i === 2 ? (b ? '#9b59b6' : '#e63946') : ['#e63946', '#ffd23f', '#ff8fab', '#ffffff'][i % 4], '#ffd23f', 7)).join('')}
    ${[40, 64, 88, 112, 136, 160, 184].map((x, i) => (b && i === 2 ? '' : `${rect(x, 330, 12, 30, '#a9805a', 'stroke="#7a5a3a" stroke-width="1"')}${path(`M ${x} 330 L ${x + 6} 322 L ${x + 12} 330 Z`, '#a9805a', 'stroke="#7a5a3a" stroke-width="1"')}`)).join('')}
    ${rect(36, 344, 172, 5, '#8a6a4a')}
    ${ellipse(502, 344, 16, 8, '#f3e6c8')}${rect(498, 322, 8, 24, '#f3e6c8')}
    ${path('M 486 322 Q 502 300 518 322 Q 502 330 486 322 Z', '#e63946')}
    ${circle(496, 314, 2.5, '#fff')}${circle(508, 312, 2.5, '#fff')}${b ? circle(502, 306, 2.5, '#fff') : ''}
    ${b ? path('M 410 332 L 428 332 L 424 350 L 414 350 Z', '#2e5a7a') : path('M 386 332 L 404 332 L 400 350 L 390 350 Z', '#2e5a7a')}
    ${b ? path('M 410 338 L 398 330', 'none', 'stroke="#2e5a7a" stroke-width="4" stroke-linecap="round"') : path('M 386 338 L 374 330', 'none', 'stroke="#2e5a7a" stroke-width="4" stroke-linecap="round"')}
    ${text(280, 392, 'KEBUN KACA', '#3e5e1e', 11)}`;

  return defs + skyParts + glasshouse + fountain + ground;
}
