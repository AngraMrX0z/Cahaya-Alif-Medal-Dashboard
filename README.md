# PT Cahaya Alif Medal (PT-CAM) - Property & Housing Platform

Platform web resmi untuk informasi, katalog, dan konsultasi hunian perumahan strategis di kawasan **Rancamanyar, Baleendah, dan Rancamulya - Pameungpeuk, Kabupaten Bandung**. Proyek ini dirancang sebagai media pemasaran digital yang interaktif dan responsif untuk menghubungkan calon pembeli langsung dengan tim marketing via WhatsApp.

> **Website statis, tanpa proses build.** Tidak memerlukan Node.js, framework, ataupun instalasi paket untuk dijalankan secara lokal.

---

## 🌟 Fitur Unggulan & Isi Website

- **Beranda & Katalog Properti** — pilihan hunian Cupu Mekar Indah, Bahuan Mekar Indah, dan Limus Lestari.
- **Detail Tipe & Denah** — informasi tipe, luas, harga yang ditampilkan, denah, serta foto interior.
- **Konsultasi & WhatsApp** — formulir yang menyiapkan pesan untuk dikirim melalui WhatsApp dan dialog pilihan kontak marketing.
- **Portofolio Tim** — profil Rangga dan Agus Aditya di halaman [Tim](./tim/), dengan kartu ID yang dapat digerakkan.
- **Tampilan Responsif** — mendukung perangkat desktop dan mobile, serta preferensi sistem untuk mengurangi animasi.

Informasi harga, tipe, dan ketersediaan dapat berubah. Konfirmasikan detail terbaru kepada tim marketing sebelum mengambil keputusan.

---

## 🚀 Menjalankan di Komputer

Pastikan Python tersedia, lalu buka PowerShell atau Command Prompt di folder proyek. Jalankan:

```powershell
py -m http.server 8000
```

Jika perintah `py` tidak tersedia, coba:

```powershell
python -m http.server 8000
```

Selama server berjalan, buka alamat berikut di browser:

- Beranda: <http://localhost:8000/>
- Portofolio tim: <http://localhost:8000/tim/>

Biarkan jendela terminal tetap terbuka selama melihat website. Untuk menghentikan server, tekan `Ctrl+C` di terminal.

> Gunakan server lokal, bukan membuka `index.html` langsung. Beberapa fitur website dan pemuatan aset bergantung pada URL HTTP.

---

## 📂 Struktur Direktori Proyek

```text
WEB PT-CAM/
├── index.html             # Beranda, informasi properti, dan formulir kontak
├── css/
│   └── style.css          # Gaya utama dan tata letak responsif
├── js/
│   └── main.js            # Interaksi beranda, dialog, dan formulir WhatsApp
├── tim/
│   ├── index.html         # Halaman portofolio Rangga dan Agus Aditya
│   ├── team.css           # Gaya khusus halaman tim
│   └── team-lentur.js     # Navigasi profil dan tracking tali kartu ID
├── images/                # Foto properti, denah, potret tim, dan logo
├── icon/                  # Aset ikon
└── vercel.json            # Pengaturan URL dan header untuk Vercel
```

## Teknologi

- HTML untuk struktur dan konten halaman.
- CSS untuk desain, animasi, dan penyesuaian layar.
- JavaScript tanpa framework untuk navigasi, pemilihan tipe properti, dialog, formulir WhatsApp, dan interaksi kartu anggota.
- Google Fonts (Montserrat) untuk tipografi; koneksi internet diperlukan agar font eksternal dapat dimuat.

## Publikasi

Proyek ini tidak memerlukan langkah kompilasi. Konfigurasi [vercel.json](./vercel.json) menyiapkan URL halaman tim serta header respons untuk aset. Unggah folder proyek ini ke hosting statis atau hubungkan repositorinya ke Vercel; pastikan `index.html`, folder `css`, `js`, `tim`, `images`, dan `icon` ikut dipublikasikan.
