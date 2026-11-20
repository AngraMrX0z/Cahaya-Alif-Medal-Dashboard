# AGENTS.md

Panduan untuk agen AI yang bekerja di repositori ini. Isi situs menggunakan Bahasa Indonesia; pertahankan gaya bahasa tersebut.

## Ringkasan Proyek

Situs pemasaran statis untuk **PT Cahaya Alif Medal (PT-CAM)**, perusahaan properti di Rancamanyar, Baleendah, Kabupaten Bandung. Situs menampilkan katalog hunian (Cupu Mekar Indah, Bahuan Mekar Indah, Limus Lestari), detail tipe/denah, formulir konsultasi WhatsApp, ulasan pengunjung, dan halaman portofolio tim.

- **Tanpa build step dan tanpa framework.** HTML, CSS, dan JavaScript vanilla.
- Deploy sebagai situs statis di Vercel; konfigurasi ada di `vercel.json`.
- Tidak ada test suite, linter, atau formatter yang dikonfigurasi.

## Menjalankan Secara Lokal

Jalankan dari root proyek, lalu buka <http://localhost:8000/>:

```powershell
py -m http.server 8000
# atau
python -m http.server 8000
```

Gunakan server HTTP, bukan membuka `index.html` langsung: beberapa aset memakai path absolut (`/tim/...`) dan perilaku browser berbeda pada `file://`.

Halaman utama: `http://localhost:8000/` · Halaman tim: `http://localhost:8000/tim/`

## Struktur

```text
index.html              # Beranda: hero, katalog properti, tipe/interior, ulasan, kontak
css/style.css           # Seluruh gaya beranda
js/main.js              # Navigasi, transisi halaman, tab tipe, dialog marketing, form WhatsApp
tim/index.html          # Halaman portofolio Rangga & Agus Aditya
tim/team.css            # Gaya halaman tim
tim/team-lentur.js      # Interaksi kartu ID + tali (lanyard), navigasi anggota
images/                 # Foto properti, denah, brosur, logo, potret tim
icon/                   # Ikon
vercel.json             # cleanUrls, rewrite /tim, header cache
index.js                # Server Express lama — tidak dipakai (lihat Catatan)
```

## Alur Data yang Penting

### Katalog properti (`index.html` + `js/main.js`)

Data tipe properti ditulis langsung di HTML pada tombol `.type-chip`:

```html
<button class="type-chip" data-detail="..." data-price="Rp 215 juta"
        data-image="images/limus lestari 36x50.webp">36 × 50</button>
```

Saat chip dipilih, `js/main.js`:

1. Mengubah gambar, detail, dan harga di kartu.
2. Menyelaraskan pilihan `select[name="minat"]` dengan format `Nama Properti|Tipe`.
3. Membuka dialog marketing dengan pesan WhatsApp berisi properti dan tipe.

Jika menambah/mengubah tipe, perbarui semuanya secara konsisten:

- tombol `.type-chip` (termasuk `data-*`),
- opsi `<select name="minat">` di formulir kontak,
- teks default `.property-detail` dan `.property-bottom strong` bila tipe pertama berubah,
- aset gambar di `images/` (sertakan `.webp` bila ada; gunakan nama file persis).

Formulir kontak tidak mengirim ke server; ia menyusun pesan dan membuka `wa.me/6282120776124`.

### Ulasan pengunjung (`index.html`, script inline di akhir halaman)

- Supabase dimuat dari CDN (`@supabase/supabase-js@2`), dengan URL dan **publishable key** hardcoded. Kunci ini memang publik untuk klien; **jangan pernah** menambahkan `service_role` key ke kode klien.
- Tabel `comments` memakai kolom: `id`, `name`, `message`, `parent_id` (null untuk komentar utama), `created_at`.
- Komentar dirender dengan `escapeHTML()`; pertahankan sanitasi ini dan jangan menyisipkan HTML mentah dari pengguna.
- Setelah insert berhasil, notifikasi email dikirim via `https://formsubmit.co/ajax/<email>` ke `PRIMARY_EMAIL` dan `CC_EMAIL`. Kegagalan email tidak boleh menggagalkan pengiriman komentar (`Promise.allSettled`).

### Halaman tim (`tim/`)

- `tim/team-lentur.js` membutuhkan `[data-member-slide]`, tepat dua tombol `[data-member-step]`, dan `[data-active-member]`; jika tidak ada, script berhenti diam-diam.
- Efek gerak menghormati `prefers-reduced-motion`; pertahankan pola ini untuk animasi baru.
- Halaman tim memakai path absolut `/tim/team.css` dan `/tim/team-lentur.js`, serta tautan `/#kontak`, `/#properti`. Uji halaman ini lewat server lokal, bukan `file://`.

## Konvensi Kode

- HTML dan CSS: indentasi 2 spasi. Sebagian markup ditulis padat dalam satu baris panjang; ikuti gaya di sekitarnya, jangan melakukan reformat massal.
- JavaScript: 2 spasi, titik koma, kutip tunggal, trailing comma pada argumen multi-baris. Tidak ada modul/bundler; script dimuat langsung.
- Pertahankan atribut aksesibilitas yang sudah ada (`aria-*`, `role`, `alt`, `loading="lazy"`, `decoding="async"`).
- Semua teks yang terlihat pengguna menggunakan Bahasa Indonesia.
- Nomor WhatsApp marketing: Rangga `6282120776124`, Agus Aditya `6285186663627`.

## Catatan dan Jebakan

- **`index.js` bukan bagian dari situs yang berjalan.** File itu server Express lama yang memakai `require`, sedangkan `package.json` memakai `"type": "module"`; `express` juga tidak ada di dependencies. README menyatakan proyek tanpa build. Jangan mengandalkan atau men-deploy file ini tanpa diminta.
- `@google/genai` dan `dotenv` ada di `package.json`, serta `GEMINI_API_KEY` di `.env`, tetapi tidak dipakai oleh situs statis saat ini. Jangan menambahkan rahasia ke kode klien atau commit `.env` (sudah di-`.gitignore`).
- Vercel berjalan di Linux dan **case-sensitive**. Windows tidak; pastikan nama file di `src`/`href` sama persis dengan nama aset, termasuk spasi dan huruf besar/kecil (mis. `images/Bahuan mekar indah.jpeg`).
- `vercel.json` mengaktifkan `cleanUrls`, `trailingSlash: false`, dan rewrite `/tim` → `/tim/index.html`. Gunakan tautan `tim/` atau `/tim/` sesuai konteks halaman.
- Jangan mengubah `package-lock.json` tanpa alasan; dependensi Node tidak diperlukan untuk menjalankan situs.

## Verifikasi Perubahan

Tidak ada build/test otomatis. Sebelum menyelesaikan perubahan:

1. Jalankan server lokal dan buka beranda serta `/tim/`.
2. Periksa console browser untuk error JavaScript.
3. Uji pemilihan tipe properti, dialog WhatsApp, formulir kontak, dan (jika relevan) kirim ulasan.
4. Cek tampilan di lebar mobile dan desktop, serta dengan `prefers-reduced-motion` aktif.
5. Pastikan semua tautan aset dan navigasi tidak 404.

## Repositori dan Deployment

- Remote: `https://github.com/AngraMrX0z/Cahaya-Alif-Medal-Dashboard.git`
- Deployment: Vercel (situs statis). Commit mengikuti pesan singkat seperti `update website`.
