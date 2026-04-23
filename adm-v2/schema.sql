-- ==============================================================================
-- SKEMA DATABASE SUPABASE UNTUK DASHBOARD CIPTA KARYA V2
-- Copy seluruh teks di file ini dan jalankan di SQL Editor pada Dashboard Supabase
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. CREATE TABLES
-- ==========================================

-- TABLE: USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nama VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'staff', 'viewer')),
    kontak VARCHAR(100),
    avatar VARCHAR(10),
    status VARCHAR(20) DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TABLE: PROJECTS
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_proyek VARCHAR(255) NOT NULL,
    kategori VARCHAR(100) CHECK (kategori IN ('SPAM', 'Sanitasi', 'Drainase', 'Gedung')),
    lokasi TEXT,
    anggaran DECIMAL(15,2),
    tahun INT,
    progress INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Berjalan' CHECK (status IN ('Berjalan', 'Selesai', 'Tertunda')),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TABLE: DOCUMENTS
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    tipe_dokumen VARCHAR(100) CHECK (tipe_dokumen IN ('Shop Drawing', 'RAB', 'Laporan', 'HPS', 'Kontrak')),
    judul VARCHAR(255) NOT NULL,
    nomor_surat VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) CHECK (status IN ('Draft', 'Review', 'Revisi', 'Signing', 'Final')),
    version INT DEFAULT 1,
    signatures JSONB DEFAULT '[]'::jsonb, -- Array of signature objects
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TABLE: ACTIVITIES
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255),
    user_role VARCHAR(50),
    action VARCHAR(50),
    detail TEXT,
    target_type VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. INSERT DEFAULT / DEMO DATA
-- ==========================================

-- Insert Default Admin
INSERT INTO users (id, username, password, nama, role, kontak, avatar)
VALUES (uuid_generate_v4(), 'admin', 'admin123', 'Budi Santoso, ST, MT', 'admin', 'budi@ciptakarya.go.id', 'BS');

-- ==========================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
-- Matikan RLS sementara untuk memudahkan pengembangan MVP, 
-- atau set RLS agar public/anon access diizinkan untuk keperluan demo.

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policy for anon to allow all operations (For Demo MVP)
-- WARNING: In production, these should be restricted to authenticated users.
CREATE POLICY "Allow public read/write users" ON users FOR ALL USING (true);
CREATE POLICY "Allow public read/write projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow public read/write documents" ON documents FOR ALL USING (true);
CREATE POLICY "Allow public read/write activities" ON activities FOR ALL USING (true);
