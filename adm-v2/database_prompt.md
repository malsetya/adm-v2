

# 🗄 3️⃣ PROMPT DATABASE (MYSQL + SUPABASE)

**Title:**
Database Schema Dashboard Administrasi Dokumen

---

## 🧠 Instruction

Generate relational database schema dengan:

* Normalized structure
* Foreign key constraints
* Audit trail
* Soft delete
* Support Supabase & MySQL

---

## 📌 TABLE: USERS

```sql
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password TEXT,
    role ENUM('admin','ppk','pengawas','kepala','viewer'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📌 TABLE: PROJECTS

```sql
CREATE TABLE projects (
    id CHAR(36) PRIMARY KEY,
    nama_proyek VARCHAR(255),
    lokasi TEXT,
    bidang VARCHAR(100),
    tahun_anggaran INT,
    sumber_dana VARCHAR(100),
    nilai_kontrak DECIMAL(15,2),
    kontraktor VARCHAR(255),
    konsultan VARCHAR(255),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📌 TABLE: DOCUMENTS

```sql
CREATE TABLE documents (
    id CHAR(36) PRIMARY KEY,
    proyek_id CHAR(36),
    jenis ENUM('HPS','SHOP_DRAWING','KONTRAK','LAPORAN'),
    nomor_dokumen VARCHAR(100) UNIQUE,
    tanggal_masuk DATE,
    tanggal_keluar DATE,
    status ENUM('MASUK','VERIFIKASI','REVIEW','REVISI','DISETUJUI','ARSIP'),
    versi INT DEFAULT 1,
    file_path TEXT,
    is_late BOOLEAN DEFAULT FALSE,
    keterangan TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proyek_id) REFERENCES projects(id)
);
```

---

## 📌 TABLE: STATUS_LOGS

```sql
CREATE TABLE status_logs (
    id CHAR(36) PRIMARY KEY,
    document_id CHAR(36),
    user_id CHAR(36),
    status VARCHAR(50),
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 📌 TABLE: NOTIFICATIONS

```sql
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## ⚠️ DATABASE CONSTRAINTS

* Nomor dokumen UNIQUE
* Semua dokumen wajib punya proyek
* Status mengikuti workflow
* Soft delete (is_deleted)
* Latitude & longitude wajib untuk map

---

## 🔁 TRIGGER LOGIC

### Status Log Auto Insert

```sql
-- pseudo logic
AFTER UPDATE documents
→ insert ke status_logs
```

---

## 🔢 AUTO NUMBERING

Format:

```
{JENIS}/{BIDANG}/{TAHUN}/{RUNNING_NUMBER}
```

---

# 🧠 FINAL INSTRUCTION KE ANTIGRAVITY

Generate:

* Fullstack app
* Supabase integration
* Google Maps integration
* Dashboard + CRUD + workflow
* Search + map sync

Optimize:

* Cepat input
* Monitoring real-time
* UI sederhana

---

# 🚀 HASIL

Dengan 3 prompt ini:

* Frontend → UI langsung jadi
* Backend → logic aman & terstruktur
* Database → siap deploy

---

Kalau mau next step paling powerful:
👉 saya bisa generate **kode React + Supabase full (tinggal deploy)**
atau
👉 buatkan **versi UI mockup visual (seperti Figma)**
