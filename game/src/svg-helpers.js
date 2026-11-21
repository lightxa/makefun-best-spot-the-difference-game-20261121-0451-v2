// svg-helpers.js — pembangun potongan SVG kecil yang dipakai semua pelukis dunia.
// Semua bentuk digambar dari angka (bukan gambar pinjaman), jadi game tetap
// 100% buatan sendiri dan deterministik: rng yang sama selalu memberi hasil sama.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function circle(cx, cy, r, fill, extra = '') {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra}/>`;
}

export function ellipse(cx, cy, rx, ry, fill, extra = '') {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
}

export function rect(x, y, w, h, fill, extra = '') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
}

export function text(x, y, str, fill, size = 14, extra = '') {
  return `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-family="Georgia, serif" text-anchor="middle" ${extra}>${str}</text>`;
}

export function path(d, fill, extra = '') {
  return `<path d="${d}" fill="${fill}" ${extra}/>`;
}

// Awan sederhana dari tiga lingkaran + alas, dipakai di dunia luar ruang.
export function cloud(x, y, s, fill = '#fff8ea') {
  return `<g opacity="0.95">${circle(x, y, 18 * s, fill)}${circle(x + 20 * s, y - 8 * s, 14 * s, fill)}${circle(x + 40 * s, y, 16 * s, fill)}${rect(x - 8 * s, y, 56 * s, 12 * s, fill, 'rx="6"')}</g>`;
}

// Bintang empat sudut kecil untuk langit senja / perpustakaan.
export function sparkle(x, y, r, fill = '#ffe9a8') {
  return `<path d="M ${x} ${y - r} L ${x + r * 0.3} ${y - r * 0.3} L ${x + r} ${y} L ${x + r * 0.3} ${y + r * 0.3} L ${x} ${y + r} L ${x - r * 0.3} ${y + r * 0.3} L ${x - r} ${y} L ${x - r * 0.3} ${y - r * 0.3} Z" fill="${fill}"/>`;
}

// Bunga lima kelopak, dipakai di kebun dan pot stasiun.
export function flower(x, y, petal, center, r = 9) {
  let petals = '';
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    petals += circle(Math.round(x + Math.cos(a) * r), Math.round(y + Math.sin(a) * r), r * 0.62, petal);
  }
  return `<g>${petals}${circle(x, y, r * 0.45, center)}</g>`;
}

// Burung sederhana (dua busur) untuk kabel dan pohon.
export function bird(x, y, s = 1, stroke = '#3a2c22') {
  return `<path d="M ${x - 10 * s} ${y} Q ${x - 5 * s} ${y - 8 * s} ${x} ${y} Q ${x + 5 * s} ${y - 8 * s} ${x + 10 * s} ${y}" fill="none" stroke="${stroke}" stroke-width="${2 * s}" stroke-linecap="round"/>`;
}

// Kupu-kupu: dua pasang sayap + badan.
export function butterfly(x, y, s, wing, body = '#4a2c4a') {
  return `<g>
    ${ellipse(x - 8 * s, y - 4 * s, 9 * s, 7 * s, wing, `transform="rotate(-25 ${x - 8 * s} ${y - 4 * s})"`)}
    ${ellipse(x + 8 * s, y - 4 * s, 9 * s, 7 * s, wing, `transform="rotate(25 ${x + 8 * s} ${y - 4 * s})"`)}
    ${ellipse(x - 6 * s, y + 6 * s, 6 * s, 5 * s, wing, `transform="rotate(20 ${x - 6 * s} ${y + 6 * s})"`)}
    ${ellipse(x + 6 * s, y + 6 * s, 6 * s, 5 * s, wing, `transform="rotate(-20 ${x + 6 * s} ${y + 6 * s})"`)}
    ${ellipse(x, y, 2.5 * s, 9 * s, body)}
  </g>`;
}
