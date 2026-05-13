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
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'viewer' CHECK (role IN ('admin', 'staff', 'viewer')),
    kontak VARCHAR(100),
    avatar VARCHAR(10),
    status VARCHAR(20) DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TRIGGER FOR AUTO PROFILE CREATION
-- Membuat data profil otomatis ketika ada user mendaftar via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, nama, avatar, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'nama', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar', upper(substring(new.email from 1 for 2))),
    'viewer'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

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

-- Catatan: Data admin default sekarang harus dibuat melalui Supabase Dashboard (Authentication -> Add User)
-- karena data pada tabel `users` publik akan dibuat otomatis oleh trigger.

-- ==========================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Policies for USERS
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Policies for PROJECTS
CREATE POLICY "Authenticated users can read projects" ON projects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for DOCUMENTS
CREATE POLICY "Authenticated users can read documents" ON documents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert documents" ON documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update documents" ON documents FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete documents" ON documents FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for ACTIVITIES
CREATE POLICY "Authenticated users can read activities" ON activities FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert activities" ON activities FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ==========================================
-- 5. STORAGE BUCKET INSTRUCTIONS
-- ==========================================
-- Silakan buat bucket storage bernama 'documents' secara manual di dashboard Supabase (Storage -> Create a new bucket).
-- Set public menjadi true.
-- Atur RLS bucket (Storage -> Policies) agar role 'authenticated' bisa INSERT, SELECT, UPDATE, DELETE.
