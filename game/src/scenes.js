// scenes.js — data tiga dunia. Setiap dunia punya 10 selisih dengan koordinat
// (x, y, r) di ruang gambar 560x400, label yang muncul saat ditemukan, dan
// petunjuk yang dibisikkan tombol Hint. Koordinatnya harus sama persis dengan
// yang digambar pelukis di paint-*.js, supaya klik yang benar selalu kena.

export const DIFFICULTIES = {
  santai: { id: 'santai', name: 'Santai', seconds: 300 },
  klasik: { id: 'klasik', name: 'Klasik', seconds: 180 },
  kilat: { id: 'kilat', name: 'Kilat', seconds: 90 },
};

export const SCENES = [
  {
    id: 'stasiun',
    name: 'Stasiun Senja',
    tagline: 'Peron tua di ujung hari',
    painter: 'stasiun',
    diffs: [
      { id: 'jam', x: 280, y: 72, r: 24, label: 'Jarum jam melompat', hint: 'Jam besar di dinding: jarumnya menunjuk angka yang lain.' },
      { id: 'lampu', x: 120, y: 112, r: 16, label: 'Lampu gantung padam', hint: 'Deretan lampu gantung di kiri: satu lampunya padam.' },
      { id: 'koper', x: 92, y: 322, r: 18, label: 'Koper merah hilang', hint: 'Di peron kiri bawah ada koper yang lenyap di satu gambar.' },
      { id: 'kucing', x: 432, y: 302, r: 18, label: 'Kucing di bangku hilang', hint: 'Bangku kanan: ada kucing oranye yang menghilang.' },
      { id: 'poster', x: 470, y: 152, r: 20, label: 'Poster ganti tujuan', hint: 'Baca poster di dinding kanan: nama kotanya berbeda.' },
      { id: 'jendela', x: 352, y: 212, r: 16, label: 'Jendela kereta gelap', hint: 'Kereta di kanan: satu jendelanya gelap gulita.' },
      { id: 'peron', x: 202, y: 152, r: 16, label: 'Nomor peron berubah', hint: 'Papan nomor peron di tengah: angkanya bukan 2 lagi.' },
      { id: 'burung', x: 182, y: 62, r: 12, label: 'Burung tambahan di kabel', hint: 'Kabel di langit: ada burung yang hinggap di satu gambar saja.' },
      { id: 'pot', x: 520, y: 332, r: 16, label: 'Bunga pot ganti warna', hint: 'Pot bunga di kanan bawah: bunganya berubah warna.' },
      { id: 'kopi', x: 332, y: 312, r: 14, label: 'Cangkir kopi hilang', hint: 'Meja kecil di tengah: cangkir kopinya raib.' },
    ],
  },
  {
    id: 'perpustakaan',
    name: 'Perpustakaan Ajaib',
    tagline: 'Rak buku yang berbisik',
    painter: 'perpustakaan',
    diffs: [
      { id: 'lilin', x: 112, y: 296, r: 18, label: 'Lilin padam', hint: 'Lilin di meja kiri: apinya padam di satu gambar.' },
      { id: 'buku', x: 275, y: 122, r: 14, label: 'Buku merah hilang', hint: 'Rak tengah: hitung buku merahnya, ada yang kurang satu.' },
      { id: 'hantu', x: 472, y: 122, r: 20, label: 'Burung hantu memejam', hint: 'Burung hantu di rak kanan: matanya terpejam di satu gambar.' },
      { id: 'globe', x: 432, y: 292, r: 22, label: 'Bola dunia berputar', hint: 'Bola dunia di meja kanan: benua yang tampak berbeda.' },
      { id: 'pasir', x: 202, y: 282, r: 16, label: 'Pasir jam pasir berpindah', hint: 'Jam pasir di meja: pasirnya pindah dari atas ke bawah.' },
      { id: 'tumpuk', x: 152, y: 312, r: 16, label: 'Buku bertambah satu', hint: 'Tumpukan buku di kiri bawah: tingginya beda satu buku.' },
      { id: 'lukisan', x: 282, y: 72, r: 22, label: 'Lukisan ganti bulan', hint: 'Lukisan di dinding tengah: bulannya jadi matahari.' },
      { id: 'tanaman', x: 62, y: 192, r: 16, label: 'Daun tanaman berkurang', hint: 'Tanaman gantung di kiri: daunnya berkurang satu.' },
      { id: 'lampu-meja', x: 382, y: 242, r: 16, label: 'Lampu meja ganti warna', hint: 'Lampu meja di tengah kanan: cahayanya berubah warna.' },
      { id: 'buku-terbuka', x: 252, y: 332, r: 18, label: 'Halaman buku kosong', hint: 'Buku terbuka di meja: tulisannya hilang di satu gambar.' },
    ],
  },
  {
    id: 'kebun',
    name: 'Kebun Kaca',
    tagline: 'Rumah kaca di pagi hari',
    painter: 'kebun',
    diffs: [
      { id: 'matahari', x: 92, y: 62, r: 18, label: 'Sinar matahari berkurang', hint: 'Matahari di kiri atas: satu sinarnya hilang.' },
      { id: 'bunga', x: 152, y: 316, r: 14, label: 'Bunga ganti warna', hint: 'Hamparan bunga di kiri bawah: satu bunga warnanya lain.' },
      { id: 'kupu', x: 302, y: 122, r: 16, label: 'Kupu-kupu tambahan', hint: 'Di tengah langit kebun: ada kupu-kupu yang muncul.' },
      { id: 'burung-pohon', x: 472, y: 92, r: 14, label: 'Burung di pohon hilang', hint: 'Pohon kanan: burung kecilnya terbang pergi.' },
      { id: 'air', x: 282, y: 182, r: 18, label: 'Pancuran air mancur mati', hint: 'Air mancur tengah: satu pancurannya berhenti.' },
      { id: 'jamur', x: 502, y: 314, r: 16, label: 'Bintik jamur bertambah', hint: 'Jamur di kanan bawah: bintik putihnya bertambah.' },
      { id: 'lebah', x: 202, y: 152, r: 12, label: 'Lebah tambahan', hint: 'Dekat bunga tengah: ada lebah yang datang.' },
      { id: 'pagar', x: 82, y: 342, r: 14, label: 'Papan pagar hilang', hint: 'Pagar kayu di bawah: satu papannya copot.' },
      { id: 'ember', x: 382, y: 332, r: 16, bx: 419, by: 341, label: 'Ember penyiram berpindah', hint: 'Ember penyiram di kanan: posisinya bergeser.' },
      { id: 'pelangi', x: 282, y: 100, r: 24, label: 'Pelangi kehilangan warna', hint: 'Pelangi di langit: satu busur warnanya hilang.' },
    ],
  },
];

export function getScene(id) {
  return SCENES.find((s) => s.id === id) ?? SCENES[0];
}
