/* ============================================
   STORE — Data Manager with Supabase
   ============================================ */

const Store = {
    KEYS: {
        USERS: 'users',
        PROJECTS: 'projects',
        DOCUMENTS: 'documents',
        ACTIVITIES: 'activities',
        CURRENT_USER: 'ck2_current_user',
        THEME: 'ck2_theme'
    },

    async init() {
        const theme = localStorage.getItem(this.KEYS.THEME) || 'light';
        document.documentElement.setAttribute('data-theme', theme);

        // Sync auth state on load
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                const { data: profile } = await supabaseClient
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                if (profile) {
                    localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(profile));
                    this.initRealtime();
                }
            } else {
                localStorage.removeItem(this.KEYS.CURRENT_USER);
            }
        } catch (error) {
            console.error('Session sync error:', error);
        }
    },

    initRealtime() {
        if (this.realtimeChannel) return;
        
        this.realtimeChannel = supabaseClient.channel('public:documents')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'documents' }, payload => {
                const doc = payload.new;
                if (window.Components && window.Components.toast) {
                    window.Components.toast(`🔔 Dokumen Baru: ${doc.judul}`, 'success');
                }
                if (window.App && window.App.currentPage === 'documents') {
                    if (window.DocumentsPage) window.DocumentsPage.render();
                } else if (window.App && window.App.currentPage === 'dashboard') {
                    if (window.DashboardPage) window.DashboardPage.render();
                }
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'documents' }, payload => {
                const doc = payload.new;
                const old = payload.old;
                if (doc.status !== old.status) {
                    if (window.Components && window.Components.toast) {
                        window.Components.toast(`🔔 Status Berubah: ${doc.judul} -> ${doc.status}`, 'info');
                    }
                }
                if (window.App && window.App.currentPage === 'documents') {
                    if (window.DocumentsPage) window.DocumentsPage.render();
                } else if (window.App && window.App.currentPage === 'dashboard') {
                    if (window.DashboardPage) window.DashboardPage.render();
                }
            })
            .subscribe();
    },

    // ── CRUD (Supabase Asynchronous) ──
    async getAll(table) {
        const { data, error } = await supabaseClient.from(table).select('*').order('created_at', { ascending: false });
        if (error) {
            console.error(`Error fetching from ${table}:`, error);
            return [];
        }
        return data;
    },

    async getById(table, id) {
        const { data, error } = await supabaseClient.from(table).select('*').eq('id', id).single();
        if (error) {
            console.error(`Error fetching by id from ${table}:`, error);
            return null;
        }
        return data;
    },

    async add(table, item) {
        const { data, error } = await supabaseClient.from(table).insert([item]).select().single();
        if (error) {
            console.error(`Error adding to ${table}:`, error);
            return null;
        }
        return data;
    },

    async update(table, id, updates) {
        const { data, error } = await supabaseClient.from(table).update(updates).eq('id', id).select().single();
        if (error) {
            console.error(`Error updating ${table}:`, error);
            return null;
        }
        return data;
    },

    async remove(table, id) {
        const { error } = await supabaseClient.from(table).delete().eq('id', id);
        if (error) {
            console.error(`Error deleting from ${table}:`, error);
            return false;
        }
        return true;
    },

    // ── Auth ──
    async login(email, password) {
        // Validasi menggunakan Supabase Auth
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error('Login error:', error);
            throw error;
        }

        const authUser = data.user;

        // Ambil profil dari tabel public.users secara sinkron
        let { data: profile, error: profileError } = await supabaseClient
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .maybeSingle();

        // Jika profil tidak ditemukan (biasanya karena user dibuat manual di Dashboard sebelum Trigger diaktifkan), 
        // kita buat profilnya secara otomatis sebagai "Self-Healing".
        if (!profile) {
            const newProfile = {
                id: authUser.id,
                email: authUser.email,
                nama: authUser.user_metadata?.nama || authUser.email.split('@')[0],
                avatar: (authUser.user_metadata?.avatar || authUser.email.substring(0,2)).toUpperCase(),
                role: 'viewer',
                status: 'Aktif'
            };
            
            const { data: insertedProfile, error: insertError } = await supabaseClient
                .from('users')
                .insert([newProfile])
                .select()
                .single();
                
            if (insertError) {
                console.error('Gagal membuat profil otomatis:', insertError);
                throw insertError;
            }
            profile = insertedProfile;
        }

        // Simpan sesi ke localStorage
        localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(profile));
        this.initRealtime();
        
        // Catat log aktivitas
        await this.logActivity('Login', `${profile.nama} masuk ke sistem`);
        
        return profile;
    },

    async register(name, email, password) {
        // Daftar menggunakan Supabase Auth
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    nama: name,
                    avatar: name.substring(0, 2).toUpperCase()
                }
            }
        });

        if (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
        return { success: true, user: data.user };
    },

    async logout() {
        const user = this.getCurrentUser();
        if (user) await this.logActivity('Logout', `${user.nama} keluar dari sistem`);
        await supabaseClient.auth.signOut();
        // localStorage ck2_current_user akan dihapus oleh onAuthStateChange di supabase-client
    },

    getCurrentUser() {
        const data = localStorage.getItem(this.KEYS.CURRENT_USER);
        return data ? JSON.parse(data) : null;
    },

    isLoggedIn() { return !!this.getCurrentUser(); },
    isAdmin() { const u = this.getCurrentUser(); return u && u.role === 'admin'; },

    // ── Theme (Synchronous LocalStorage) ──
    getTheme() { return localStorage.getItem(this.KEYS.THEME) || 'light'; },
    setTheme(theme) {
        localStorage.setItem(this.KEYS.THEME, theme);
        document.documentElement.setAttribute('data-theme', theme);
    },
    toggleTheme() {
        const current = this.getTheme();
        this.setTheme(current === 'light' ? 'dark' : 'light');
    },

    // ── Activity Logging ──
    async logActivity(action, detail) {
        const user = this.getCurrentUser();
        await this.add(this.KEYS.ACTIVITIES, {
            user_id: user ? user.id : null,
            user_name: user ? user.nama : 'Sistem',
            user_role: user ? user.role : 'sistem',
            action: action,
            detail: detail,
            timestamp: new Date().toISOString()
        });
    },

    // ── Storage (Files) ──
    async uploadDocumentFile(file) {
        if (!file) return null;
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabaseClient.storage
            .from('documents')
            .upload(filePath, file);

        if (error) {
            console.error('Error uploading file:', error);
            throw error;
        }

        // Get public URL
        const { data: publicUrlData } = supabaseClient.storage
            .from('documents')
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    },

    // ── Stats (Aggregations) ──
    async getDocStats() {
        const docs = await this.getAll(this.KEYS.DOCUMENTS);
        return {
            total: docs.length,
            draft: docs.filter(d => d.status === 'Draft').length,
            review: docs.filter(d => d.status === 'Review').length,
            signing: docs.filter(d => d.status === 'Signing').length,
            final: docs.filter(d => d.status === 'Final').length,
            needSign: docs.filter(d => d.status === 'Signing').length,
        };
    },

    async getProjectStats() {
        const projects = await this.getAll(this.KEYS.PROJECTS);
        return {
            total: projects.length,
            active: projects.filter(p => p.status === 'Berjalan').length,
            done: projects.filter(p => p.status === 'Selesai').length,
            delayed: projects.filter(p => p.status === 'Tertunda').length,
        };
    }
};
