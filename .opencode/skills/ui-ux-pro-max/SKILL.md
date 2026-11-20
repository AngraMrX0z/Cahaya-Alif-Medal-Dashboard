---
name: ui-ux-pro-max
description: Panduan desain UI/UX modern, responsif, bersih, dan berorientasi konversi untuk website properti PT Cahaya Alif Medal.
---

# UI/UX Pro Max Guidelines — PT Cahaya Alif Medal

Gunakan standar desain berikut setiap kali membuat, merombak, atau merapikan tampilan antarmuka (HTML, CSS, JS):

## 1. Visual Hierarchy & Typography
- Gunakan hierarki ukuran font yang tegas antara judul utama (`h1`), subjudul (`h2`/`h3`), deskripsi, dan label harga/promo.
- Pastikan kontras warna teks dan latar belakang tinggi (minimal rasio 4.5:1) agar nyaman dibaca di layar HP maupun desktop.
- Pertahankan bahasa antarmuka menggunakan Bahasa Indonesia yang profesional, hangat, dan meyakinkan calon pembeli rumah.

## 2. Layout, Spacing & Mobile-First
- Terapkan sistem spasi konsisten (padding/margin kelipatan 8px atau 16px) agar elemen tidak bertumpuk atau terlalu rapat.
- Pastikan seluruh kartu unit rumah, tombol WhatsApp, modal detail properti, dan form komentar tampil rapi di layar smartphone (360px-430px) tanpa scroll horizontal.
- Gunakan grid responsif untuk daftar tipe unit, fasilitas perumahan, dan galeri foto.

## 3. Warna, Kartu & Micro-Interactions
- Gunakan palet warna elegan bertema properti modern (emas hangat/amber sebagai aksen utama, gelap/navy/charcoal untuk kesan premium, dan latar terang bersih untuk keterbacaan konten).
- Berikan `border-radius` yang seragam pada kartu, tombol, dan kolom input, disertai bayangan lembut (`box-shadow`) dan transisi halus (`0.2s-0.3s ease`) saat hover/fokus.
- Hormati pengaturan aksesibilitas dan `prefers-reduced-motion` yang sudah ada di proyek.

## 4. Conversion & Trust Elements (Properti)
- Tonjolkan informasi penting calon pembeli secara jelas: harga/cicilan, tipe bangunan/luas tanah, lokasi strategis, legalitas, dan tombol CTA WhatsApp yang mudah dijangkau.
- Jaga agar seluruh atribut interaktif (`data-detail`, `data-price`, `data-image`), rute `/tim/`, form WhatsApp, sistem komentar Supabase (`public.comments`), dan notifikasi FormSubmit tetap berfungsi penuh tanpa mengubah ID elemen pentingnya.
