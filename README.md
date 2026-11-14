# Cahaya Alif Medal

Website informasi dan konsultasi hunian PT Cahaya Alif Medal di kawasan
Rancamanyar, Baleendah, Kabupaten Bandung. Pengunjung dapat mengenal pilihan
properti, membandingkan tipe dan denah, melihat foto, lalu menghubungi tim
marketing melalui WhatsApp.

> **Website statis, tanpa proses build.** Tidak memerlukan Node.js, framework,
> ataupun instalasi paket untuk dijalankan secara lokal.

## Isi website

- **Beranda properti** — pilihan hunian Cupu Mekar Indah, Bahuan Mekar Indah,
  dan Limus Lestari.
- **Detail tipe hunian** — informasi tipe, luas, harga yang ditampilkan, denah,
  serta foto interior.
- **Konsultasi** — formulir yang menyiapkan pesan untuk dikirim melalui
  WhatsApp dan dialog pilihan kontak marketing.
- **Portofolio tim** — profil Rangga dan Agus Aditya di halaman [Tim](./tim/),
  dengan kartu ID yang dapat digerakkan.
- **Tampilan responsif** — mendukung perangkat desktop dan mobile, serta
  preferensi sistem untuk mengurangi animasi.

Informasi harga, tipe, dan ketersediaan dapat berubah. Konfirmasikan detail
terbaru kepada tim marketing sebelum mengambil keputusan.

## Menjalankan di komputer

Pastikan Python tersedia, lalu buka PowerShell atau Command Prompt di folder
proyek. Jalankan:

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

Biarkan jendela terminal tetap terbuka selama melihat website. Untuk menghentikan
server, tekan `Ctrl+C` di terminal.

> Gunakan server lokal, bukan membuka `index.html` langsung. Beberapa fitur
> website dan pemuatan aset bergantung pada URL HTTP.

## Struktur proyek

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
- JavaScript tanpa framework untuk navigasi, pemilihan tipe properti, dialog,
  formulir WhatsApp, dan interaksi kartu anggota.
- Google Fonts (Montserrat) untuk tipografi; koneksi internet diperlukan agar
  font eksternal dapat dimuat.

## Publikasi

Proyek ini tidak memerlukan langkah kompilasi. Konfigurasi [vercel.json](./vercel.json)
menyiapkan URL halaman tim serta header respons untuk aset. Unggah folder proyek
ini ke hosting statis atau hubungkan repositorinya ke Vercel; pastikan
`index.html`, folder `css`, `js`, `tim`, `images`, dan `icon` ikut dipublikasikan.
