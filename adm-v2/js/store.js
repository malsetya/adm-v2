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
    async login(username, password) {
        // Validasi ke tabel users
        const { data, error } = await supabaseClient.from(this.KEYS.USERS)
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .eq('status', 'Aktif')
            .maybeSingle();

        if (data && !error) {
            const session = { ...data };
            delete session.password; // Remove password from local session
            localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(session));
            await this.logActivity('Login', `${data.nama} masuk ke sistem`);
            return data;
        }
        return null;
    },

    async register(name, email, username, password) {
        const newUser = {
            id: crypto.randomUUID(),
            nama: name,
            email: email,
            username: username,
            password: password,
            role: 'viewer', // default role
            status: 'Aktif',
            avatar: name.substring(0,2).toUpperCase()
        };
        const { data, error } = await supabaseClient.from(this.KEYS.USERS).insert([newUser]).select().single();
        if (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
        return { success: true, user: data };
    },

    async logout() {
        const user = this.getCurrentUser();
        if (user) await this.logActivity('Logout', `${user.nama} keluar dari sistem`);
        localStorage.removeItem(this.KEYS.CURRENT_USER);
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
