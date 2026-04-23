# Dashboard Administrasi Cipta Karya v2

Prompt untuk Google Stitch / AI Frontend Generator.

## Deskripsi Proyek

Aplikasi web Dashboard Administrasi Dokumen untuk Dinas Cipta Karya, Kementerian PUPR. Aplikasi ini digunakan untuk monitoring dan pengelolaan dokumen proyek infrastruktur (HPS, Kontrak, Shop Drawing, RAB, Laporan) dengan fitur pelacakan tanda tangan berjenjang dan log aktivitas.

## Teknologi

- HTML5, CSS3 (Vanilla), JavaScript (Vanilla)
- localStorage untuk penyimpanan data
- Google Fonts (Inter)
- Tidak menggunakan framework/library eksternal

## Desain

- **Warna Utama**: Biru PUPR (#132F53) dan Kuning Emas (#D4A843)
- **Light Mode** sebagai default, Dark Mode opsional
- **Glassmorphism** untuk elemen card dan sidebar
- **Micro-animations** untuk transisi halaman dan hover effects
- **Responsive**: Desktop, Tablet, Mobile

## Halaman

1. **Login** — Form login dengan akun demo, latar gradient biru PUPR
2. **Beranda** — Hero banner dengan sapaan, statistik ringkas, akses cepat, feed aktivitas terbaru, panel peringatan
3. **Dashboard** — Kartu statistik, donut chart status dokumen, bar chart proyek per kategori, tabel dokumen terbaru
4. **Dokumen** — Tabel CRUD lengkap dengan filter tipe/status, detail modal dengan progress tanda tangan dan riwayat versi
5. **Proyek** — Grid kartu proyek dengan progress bar, filter kategori/status, CRUD operasi
6. **Pengguna** — Grid kartu pengguna (admin-only), tambah/edit/aktifkan/nonaktifkan
7. **Log Aktivitas** — Tabel timeline dengan filter aksi dan pencarian
8. **Pengaturan** — Profil, toggle tema, backup/restore data, informasi sistem

## Fitur Utama

- Role-Based Access Control (admin, staff, viewer)
- Pelacakan tanda tangan berjenjang (Kasubag → Kabid → Kepala Dinas)
- Versioning dokumen otomatis
- Activity logging untuk semua aksi
- Auto-logout setelah 30 menit tidak aktif
- Backup/Restore data JSON
