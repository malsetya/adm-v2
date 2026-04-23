# 🛠 PROMPT BACKEND (SUPABASE ARCHITECTURE)

**Title:**
Arsitektur Backend & Integrasi Supabase untuk Dashboard Cipta Karya v2

---

## 🚀 1. Arsitektur Keseluruhan
Aplikasi ini beralih dari arsitektur *Local-Only* (menggunakan `localStorage` sinkronus) menjadi *Cloud-Native* menggunakan **Supabase** (Backend-as-a-Service berbasis PostgreSQL).

Keuntungan:
1. **Tidak butuh server terpisah**: REST API secara otomatis di-generate oleh Supabase dari skema tabel PostgreSQL.
2. **Real-time & Asynchronous**: Pengambilan data menggunakan library `@supabase/supabase-js` secara `async/await`.
3. **Skalabilitas & Keamanan**: Menggunakan *Row Level Security* (RLS) PostgreSQL bawaan.

---

## 🔌 2. Skema Integrasi (Frontend ke Supabase)

### A. Inisialisasi Klien
Aplikasi terhubung ke Supabase menggunakan URL dan *Anon Key* publik:
```javascript
// js/supabase-client.js
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### B. Store Controller (`js/store.js`)
File `store.js` yang sebelumnya menangani logika `localStorage` kini dirombak total menjadi lapisan abstraksi API. 
Semua fungsi berubah menjadi `async`. Contoh:
```javascript
// Mengambil data dokumen
async getAllDocuments() {
    const { data, error } = await supabase.from('documents').select('*');
    if (error) throw error;
    return data;
}

// Menyimpan data proyek baru
async saveProject(projectData) {
    const { data, error } = await supabase.from('projects').insert([projectData]);
    if (error) throw error;
    return data;
}
```

---

## 🔐 3. Autentikasi (Auth)
Untuk MVP, autentikasi menggunakan kueri langsung ke tabel `users` (mencocokkan *username* dan *password* mentah). 
*(Catatan: Untuk tahap produksi tingkat lanjut, ini disarankan untuk beralih ke modul **Supabase Auth** resmi yang menangani hashing, JWT, dan session cookies secara otomatis).*

---

## 📄 4. Panduan Refactoring UI
Karena pengambilan data database membutuhkan waktu (jaringan internet), maka seluruh layer UI (`js/pages/*.js`) diubah.
Semua `render()` method dan fungsi manipulasi data harus:
1. Menggunakan modifier `async`.
2. Menerapkan `await` pada pemanggilan `Store`.
3. Menggunakan fungsi `try...catch` untuk penanganan error.
4. Menampilkan *loading indicator* saat data sedang diambil untuk menjaga UX tetap premium.
