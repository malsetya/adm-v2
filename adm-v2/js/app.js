/* ============================================
   APP — Router & Initialization
   ============================================ */

const App = {
    currentPage: null,

    async init() {
        await Store.init();

        // Route based on current state
        const hash = location.hash.replace('#/', '');

        if (Store.isLoggedIn() && hash !== '' && hash !== 'landing' && hash !== 'login') {
            this.showApp();
            await this.navigate();
        } else if (hash === 'login' && !Store.isLoggedIn()) {
            this.showLogin();
        } else {
            await this.showLanding();
        }

        window.addEventListener('hashchange', async () => {
            const h = location.hash.replace('#/', '');
            if (h === 'login' && !Store.isLoggedIn()) {
                this.showLogin();
            } else if (h === '' || h === 'landing') {
                await this.showLanding();
            } else if (Store.isLoggedIn()) {
                await this.navigate();
            } else {
                await this.showLanding();
            }
        });

        this.setupMobileMenu();

        document.getElementById('logout-btn').addEventListener('click', () => {
            this.doLogout();
        });

        this.setupAutoLogout();
    },

    doLogout() {
        Components.confirm('Konfirmasi Keluar', 'Apakah Anda yakin ingin keluar dari sistem?', async () => {
            await Store.logout();
            await this.showLanding();
            Components.toast('Anda telah berhasil keluar.', 'info');
        });
    },

    // ── View Switching ──
    async showLanding() {
        document.getElementById('landing-page').classList.remove('hidden');
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('app-layout').classList.add('hidden');
        location.hash = '#/landing';
        await LandingPage.render();
    },

    showLogin() {
        document.getElementById('landing-page').classList.add('hidden');
        document.getElementById('login-page').classList.remove('hidden');
        document.getElementById('app-layout').classList.add('hidden');
        location.hash = '#/login';
        LoginPage.render();
    },

    showApp() {
        document.getElementById('landing-page').classList.add('hidden');
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('app-layout').classList.remove('hidden');
        this.updateUserUI();
    },

    async onLoginSuccess() {
        location.hash = '#/landing';
        await this.showLanding();
    },

    // ── Router (authenticated pages) ──
    async navigate() {
        const hash = location.hash.replace('#/', '') || 'beranda';
        const page = hash.split('?')[0];

        if (!Store.isLoggedIn()) { await this.showLanding(); return; }

        // Skip public routes in app navigation
        if (page === 'login' || page === 'landing') return;

        // Ensure app layout is visible
        this.showApp();

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });

        this.closeMobileMenu();
        this.currentPage = page;

        switch (page) {
            case 'beranda': await BerandaPage.render(); break;
            case 'dashboard': await DashboardPage.render(); break;
            case 'documents': await DocumentsPage.render(); break;
            case 'projects': await ProjectsPage.render(); break;
            case 'users': await UsersPage.render(); break;
            case 'settings': await SettingsPage.render(); break;
            default: await BerandaPage.render(); break;
        }

        document.getElementById('main-content').scrollTo(0, 0);
    },

    // ── UI Updates ──
    updateUserUI() {
        const user = Store.getCurrentUser();
        if (!user) return;

        document.getElementById('sidebar-avatar').textContent = user.avatar || '??';
        document.getElementById('sidebar-username').textContent = user.nama.split(',')[0];
        document.getElementById('sidebar-userrole').textContent = Utils.getRoleLabel(user.role);
        document.getElementById('mobile-user-avatar').textContent = user.avatar || '??';

        const usersNav = document.getElementById('nav-users');
        if (usersNav) usersNav.style.display = user.role === 'admin' ? '' : 'none';
    },

    // ── Mobile Menu ──
    setupMobileMenu() {
        const toggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (toggle) toggle.addEventListener('click', () => { sidebar.classList.toggle('open'); overlay.classList.toggle('active'); });
        if (overlay) overlay.addEventListener('click', () => this.closeMobileMenu());
    },

    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
    },

    // ── Auto Logout ──
    setupAutoLogout() {
        let timer;
        const TIMEOUT = 30 * 60 * 1000;
        const reset = () => {
            clearTimeout(timer);
            if (Store.isLoggedIn()) {
                timer = setTimeout(async () => {
                    await Store.logout();
                    await this.showLanding();
                    Components.toast('Sesi Anda telah berakhir karena tidak ada aktivitas.', 'warning');
                }, TIMEOUT);
            }
        };
        ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(evt => document.addEventListener(evt, reset, { passive: true }));
        reset();
    },

    // ── Data Management (Deprecated/Disabled for Supabase MVP) ──
    exportData() {
        Components.toast('Export data dinonaktifkan pada versi Supabase Cloud.', 'info');
    },

    importData(file) {
        Components.toast('Import data dinonaktifkan pada versi Supabase Cloud.', 'info');
    },

    resetData() {
        Components.toast('Reset data dinonaktifkan pada versi Supabase Cloud.', 'info');
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
