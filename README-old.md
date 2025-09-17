# Manajemen Es Batu Pua Ranga

Aplikasi web sederhana untuk mencatat pemasukan, pengeluaran, saldo, dan laporan dari penjualan es batu.

## 🧊 Fitur Utama

### 📊 Dashboard
- Ringkasan dalam bentuk kartu: Total Pemasukan, Total Pengeluaran, Saldo, dan Laba
- Grafik penjualan harian (line chart) untuk 7 hari terakhir
- Desain modern dengan card bersudut membulat dan bayangan lembut

### 🛒 Penjualan
- Form input jumlah es batu dengan perhitungan harga otomatis
- Sistem pricing tier:
  - 1 es batu = Rp 2.000
  - 3 es batu = Rp 5.000 
  - 6 es batu = Rp 10.000
- Perhitungan otomatis kombinasi terbaik untuk jumlah besar
- Tabel riwayat penjualan harian
- Detail breakdown perhitungan harga

### 💳 Pengeluaran
- Form input dengan kolom: Nama Pengeluaran, Nominal, dan Tanggal
- Tabel daftar pengeluaran dengan riwayat biaya
- Fitur hapus pengeluaran

### 📈 Laporan
- Filter laporan berdasarkan:
  - Hari ini
  - Bulan ini
  - Tahun ini
  - Custom (pilih tanggal sendiri)
- Tabel ringkasan pemasukan, pengeluaran, dan laba
- Export laporan ke Excel (CSV format)
- Print to PDF

### 💰 Kas / Saldo
- Tampilan besar saldo saat ini
- Riwayat lengkap transaksi yang mempengaruhi saldo
- Detail pemasukan dan pengeluaran dengan running balance

## 🎨 Desain

### Tema Warna
- **Warna utama**: Hijau muda (#4ade80) + Putih
- **Warna aksen**: Biru muda (#60a5fa) dan Abu-abu lembut (#e5e7eb)
- **Kesan**: Segar, bersih, dan modern

### Responsif
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (< 768px)
- ✅ Mobile kecil (< 480px)

### Fitur UI/UX
- Card dengan sudut membulat dan bayangan lembut
- Animasi hover dan transisi smooth
- Ikon Font Awesome untuk visual yang menarik
- Notifikasi toast untuk feedback user
- Mobile-friendly navigation dengan hamburger menu

## 🚀 Cara Menggunakan

### 1. Setup
1. Download semua file ke folder lokal
2. Buka `index.html` di browser
3. Tidak perlu server - aplikasi berjalan client-side

### 2. Workflow Harian

#### Mencatat Penjualan
1. Buka menu **Penjualan**
2. Masukkan jumlah es batu yang dibeli pembeli
3. Sistem akan otomatis menghitung harga optimal
4. Klik **Simpan Penjualan**

#### Mencatat Pengeluaran
1. Buka menu **Pengeluaran**
2. Isi nama pengeluaran (contoh: "Listrik", "Bahan Baku")
3. Masukkan nominal
4. Pilih tanggal
5. Klik **Simpan Pengeluaran**

#### Melihat Laporan
1. Buka menu **Laporan**
2. Pilih periode (hari/bulan/tahun/custom)
3. Klik **Filter** untuk memperbarui data
4. Export ke Excel atau print ke PDF sesuai kebutuhan

#### Monitoring Kas
1. Buka menu **Kas** untuk melihat saldo terkini
2. Lihat riwayat semua transaksi yang mempengaruhi saldo

## 📱 Contoh Perhitungan Harga

### Contoh 1: 30 es batu
- 4 × 6 es batu = 4 × Rp 10.000 = Rp 40.000
- 2 × 3 es batu = 2 × Rp 5.000 = Rp 10.000
- Total: **Rp 50.000**

### Contoh 2: 10 es batu
- 1 × 6 es batu = Rp 10.000
- 1 × 3 es batu = Rp 5.000
- 1 × 1 es batu = Rp 2.000
- Total: **Rp 17.000**

## 💾 Penyimpanan Data

Data disimpan di **localStorage** browser, artinya:
- ✅ Data tersimpan meskipun browser ditutup
- ✅ Tidak perlu internet untuk akses data
- ⚠️ Data hilang jika localStorage dibersihkan
- ⚠️ Data tidak tersinkron antar device

## 🔧 Teknologi

- **HTML5**: Struktur aplikasi
- **CSS3**: Styling responsif dengan CSS Grid dan Flexbox
- **JavaScript (ES6+)**: Logika aplikasi dan interaktivitas
- **Chart.js**: Grafik penjualan harian
- **Font Awesome**: Ikon
- **localStorage**: Penyimpanan data lokal

## 📂 Struktur File

```
management-esbatu/
├── index.html          # File utama aplikasi
├── styles.css          # Styling dan desain responsif
├── script.js           # Logika JavaScript
└── README.md           # Dokumentasi ini
```

## 🐛 Fitur Tambahan

### Notifikasi
- Notifikasi toast untuk konfirmasi aksi
- Animasi smooth slide-in dari kanan
- Auto-dismiss setelah 3 detik

### Validasi
- Validasi input form (tidak boleh kosong, angka harus positif)
- Feedback error yang jelas

### Demo Data
Untuk testing, uncomment baris terakhir di `script.js`:
```javascript
setTimeout(addDemoData, 1000);
```

## 📈 Pengembangan Lanjutan

Untuk pengembangan lebih lanjut, bisa ditambahkan:
- Backend database (MySQL/PostgreSQL)
- Multi-user support dengan login
- Backup dan restore data
- Laporan yang lebih detail (grafik profit, trend penjualan)
- Push notification untuk reminder
- PWA (Progressive Web App) untuk install di mobile

## 📞 Support

Jika ada pertanyaan atau butuh bantuan:
1. Cek dokumentasi di README.md ini
2. Periksa console browser untuk error
3. Pastikan JavaScript enabled di browser

---

**Selamat menggunakan aplikasi Manajemen Es Batu Pua Ranga! 🧊**
