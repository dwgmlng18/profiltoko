/**
 * data.js
 * -----------------------------------------------------------------------
 * Data katalog UD Sarana Agro Makmur (SAM). Murni data — tidak ada logic
 * sini. Kalau suatu saat datanya diambil dari backend/API, cukup ganti
 * isi CATALOG ini (atau fetch dari endpoint) tanpa menyentuh app.js.
 *
 * Struktur:
 *  - id     : slug kategori, dipakai untuk URL hash & atribut data-*
 *  - rak    : nomor rak/aisle fisik di toko (ciri khas toko bangunan asli)
 *  - nama   : nama kategori yang tampil di UI
 *  - icon   : nama ikon (Bootstrap Icons, tanpa prefix "bi-")
 *  - deskripsi : deskripsi singkat kategori
 *  - produk : daftar produk { nama, satuan, harga }
 * -----------------------------------------------------------------------
 */

const CATALOG = [
  {
    id: "obat-pertanian",
    rak: "01",
    nama: "Obat Pertanian",
    icon: "droplet-half",
    deskripsi:
      "Pestisida, herbisida, fungisida, dan obat tanaman lain untuk mengendalikan hama dan penyakit tanaman.",
    produk: [
      { nama: "Insektisida Decis 25 EC", satuan: "100 ml", harga: 28000 },
      { nama: "Fungisida Antracol 70WP", satuan: "500 g", harga: 48000 },
      { nama: "Herbisida Round Up 486 SL", satuan: "1 L", harga: 55000 },
      { nama: "Herbisida Gramoxone", satuan: "1 L", harga: 62000 },
      { nama: "Pestisida Curacron 500 EC", satuan: "1 L", harga: 95000 },
      { nama: "Bakterisida Agrept 20 WP", satuan: "100 g", harga: 22000 },
      { nama: "Perekat Perata Agristick", satuan: "100 ml", harga: 15000 },
      { nama: "Perangsang Tumbuh Atonik", satuan: "500 ml", harga: 45000 },
      { nama: "Rodentisida Klerat RM", satuan: "100 g", harga: 12000 },
      { nama: "Fungisida Dithane M-45", satuan: "250 g", harga: 26000 },
      { nama: "Insektisida Regent 50 SC", satuan: "100 ml", harga: 38000 },
      { nama: "Nematisida Furadan 3G", satuan: "1 kg", harga: 18000 },
    ],
  },
  {
    id: "pupuk-pertanian",
    rak: "02",
    nama: "Pupuk Pertanian",
    icon: "flower2",
    deskripsi:
      "Pupuk kimia, organik, dan kapur pertanian untuk menyuburkan lahan dan meningkatkan hasil panen.",
    produk: [
      { nama: "Urea Non Subsidi", satuan: "50 kg", harga: 265000 },
      { nama: "NPK Phonska", satuan: "50 kg", harga: 245000 },
      { nama: "NPK Mutiara 16-16-16", satuan: "25 kg", harga: 185000 },
      { nama: "SP-36", satuan: "50 kg", harga: 220000 },
      { nama: "KCl (MOP)", satuan: "50 kg", harga: 260000 },
      { nama: "Pupuk Organik Petroganik", satuan: "40 kg", harga: 65000 },
      { nama: "Pupuk Kandang Fermentasi", satuan: "20 kg", harga: 25000 },
      { nama: "Pupuk Cair NASA", satuan: "500 ml", harga: 35000 },
      { nama: "Kapur Dolomit", satuan: "50 kg", harga: 45000 },
      { nama: "Pupuk Daun Gandasil D", satuan: "100 g", harga: 18000 },
      { nama: "ZA (Zwavelzure Amonia)", satuan: "50 kg", harga: 180000 },
      { nama: "Kompos Daun Bambu", satuan: "20 kg", harga: 30000 },
    ],
  },
  {
    id: "bahan-bangunan",
    rak: "03",
    nama: "Alat & Bahan Bangunan",
    icon: "bricks",
    deskripsi:
      "Material konstruksi dan peralatan tukang untuk membangun, merenovasi, dan memperbaiki rumah.",
    produk: [
      { nama: "Semen Portland", satuan: "50 kg", harga: 68000 },
      { nama: "Bata Merah", satuan: "per biji", harga: 750 },
      { nama: "Bata Ringan (Hebel) 60×20×10 cm", satuan: "per biji", harga: 9500 },
      { nama: "Pasir Cor", satuan: "per m³", harga: 185000 },
      { nama: "Batu Split 1–2 cm", satuan: "per m³", harga: 215000 },
      { nama: "Keramik Lantai 60×60 cm", satuan: "per dus", harga: 85000 },
      { nama: "Besi Beton Ulir Ø10 mm", satuan: "12 m", harga: 95000 },
      { nama: "Besi Beton Polos Ø12 mm", satuan: "12 m", harga: 138000 },
      { nama: "Kawat Bendrat", satuan: "1 kg", harga: 18000 },
      { nama: "Cat Tembok", satuan: "25 kg", harga: 385000 },
      { nama: "Cat Kayu & Besi", satuan: "1 kg", harga: 45000 },
      { nama: "Pipa PVC AW 3/4\"", satuan: "4 m", harga: 28000 },
      { nama: "Triplek 18 mm", satuan: "122×244 cm", harga: 285000 },
      { nama: "Genteng Beton", satuan: "per biji", harga: 4500 },
      { nama: "Waterproofing Coating", satuan: "4 kg", harga: 125000 },
      { nama: "Cangkul Baja", satuan: "per unit", harga: 95000 },
      { nama: "Sekop Semen", satuan: "per unit", harga: 42000 },
    ],
  },
  {
    id: "alat-listrik",
    rak: "04",
    nama: "Alat Listrik",
    icon: "lightning-charge",
    deskripsi:
      "Kabel, saklar, MCB, lampu, dan perlengkapan instalasi listrik rumah tangga sesuai standar SNI.",
    produk: [
      { nama: "Kabel NYM 3×2,5 mm", satuan: "50 m", harga: 285000 },
      { nama: "Kabel NYA 1,5 mm", satuan: "100 m", harga: 145000 },
      { nama: "Stop Kontak 1 Phase", satuan: "per unit", harga: 15000 },
      { nama: "Saklar Tunggal", satuan: "per unit", harga: 22000 },
      { nama: "Saklar Ganda", satuan: "per unit", harga: 28000 },
      { nama: "MCB 10A", satuan: "per unit", harga: 55000 },
      { nama: "MCB 16A", satuan: "per unit", harga: 65000 },
      { nama: "Box Panel 4 Group", satuan: "per unit", harga: 85000 },
      { nama: "Lampu LED 10W", satuan: "per unit", harga: 35000 },
      { nama: "Lampu LED 18W", satuan: "per unit", harga: 55000 },
      { nama: "Fitting Lampu E27", satuan: "per unit", harga: 8500 },
      { nama: "Pipa Conduit 20 mm", satuan: "3 m", harga: 18000 },
      { nama: "Isolasi Listrik", satuan: "per roll", harga: 12000 },
      { nama: "Terminal Block 10 Jalur", satuan: "per unit", harga: 25000 },
      { nama: "Stabilizer Listrik 1000 VA", satuan: "per unit", harga: 265000 },
    ],
  },
];

// Info toko — dipakai di beberapa tempat (kontak, JSON-LD, footer) lewat app.js
const STORE_INFO = {
  nama: "UD Sarana Agro Makmur",
  singkatan: "SAM",
  tagline: "Sarana Tani & Bangunan",
  alamat: "Jl. Raya Makmur No. 17, Kec. Subur, Kab. Sejahtera, Jawa Timur 68123",
  telepon: "0321-123456",
  whatsapp: "6281234567890",
  email: "info@saranaagromakmur.id",
  jamOperasional: [
    { hari: "Senin – Sabtu", jam: "07.00 – 18.00 WIB" },
    { hari: "Minggu", jam: "08.00 – 15.00 WIB" },
  ],
};
