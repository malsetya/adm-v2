/* ============================================
   LOGIN PAGE
   ============================================ */

const LoginPage = {
    isSignUp: false,

    async render() {
        const page = document.getElementById('login-page');
        page.innerHTML = `
            <div class="login-card">
                <div class="login-logo">
                    <div class="login-logo-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>
                            <path d="M9 9v.01"/><path d="M9 12v.01"/><path d="M9 15v.01"/><path d="M9 18v.01"/>
                        </svg>
                    </div>
                    <div class="login-title">Cipta Karya</div>
                    <div class="login-subtitle">Dashboard Administrasi Dokumen v2</div>
                </div>
                
                <div class="login-error" id="login-error" style="display:none; color:var(--error); margin-bottom:15px; font-size:14px; text-align:center;"></div>
                <div class="login-success" id="login-success" style="display:none; color:var(--success); margin-bottom:15px; font-size:14px; text-align:center;"></div>

                <form class="login-form" id="login-form">
                    ${this.isSignUp ? `
                    <div class="form-group">
                        <label class="form-label" for="login-name">Nama Lengkap</label>
                        <input type="text" id="login-name" class="form-input" placeholder="Masukkan nama lengkap" required>
                    </div>
                    ` : ''}
                    <div class="form-group">
                        <label class="form-label" for="login-email">Email</label>
                        <input type="email" id="login-email" class="form-input" placeholder="Masukkan email" autocomplete="email" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="login-password">Password</label>
                        <input type="password" id="login-password" class="form-input" placeholder="Masukkan password" autocomplete="current-password" required>
                    </div>
                    <button type="submit" class="login-btn" id="login-submit-btn">${this.isSignUp ? 'Daftar' : 'Masuk'}</button>
                </form>

                <div style="text-align:center; margin-top: 20px; font-size: 14px;">
                    ${this.isSignUp
                    ? `Sudah punya akun? <a href="#" onclick="event.preventDefault(); LoginPage.toggleMode()">Masuk di sini</a>`
                    : `Belum punya akun? <a href="#" onclick="event.preventDefault(); LoginPage.toggleMode()">Daftar sekarang</a>`
                }
                </div>
            </div>
        `;

        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = document.getElementById('login-submit-btn');
            const originalText = btn.textContent;
            btn.textContent = 'Memuat...';
            btn.disabled = true;

            if (this.isSignUp) {
                await this.handleSignUp();
            } else {
                await this.handleLogin();
            }

            btn.textContent = originalText;
            btn.disabled = false;
        });
    },

    toggleMode() {
        this.isSignUp = !this.isSignUp;
        this.render();
    },

    async handleSignUp() {
        const name = document.getElementById('login-name').value.trim();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const errorEl = document.getElementById('login-error');
        const successEl = document.getElementById('login-success');

        errorEl.style.display = 'none';
        successEl.style.display = 'none';

        if (!name || !email || !password) {
            errorEl.textContent = 'Semua field harus diisi.';
            errorEl.style.display = 'block';
            return;
        }

        try {
            const result = await Store.register(name, email, password);
            if (result.success) {
                successEl.textContent = 'Pendaftaran berhasil! Anda dapat masuk sekarang.';
                successEl.style.display = 'block';
                this.isSignUp = false;
                // Don't auto re-render immediately so they can read the success message
                setTimeout(() => this.render(), 2000);
            } else {
                errorEl.textContent = 'Gagal mendaftar: ' + result.error;
                errorEl.style.display = 'block';
            }
        } catch (error) {
            console.error(error);
            errorEl.textContent = 'Terjadi kesalahan saat menghubungi server.';
            errorEl.style.display = 'block';
        }
    },

    async handleLogin() {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const errorEl = document.getElementById('login-error');

        if (!email || !password) {
            errorEl.textContent = 'Email dan password harus diisi.';
            errorEl.style.display = 'block';
            return;
        }

        try {
            const user = await Store.login(email, password);
            if (user) {
                errorEl.style.display = 'none';
                await App.onLoginSuccess();
            } else {
                errorEl.textContent = 'Gagal memuat profil pengguna.';
                errorEl.style.display = 'block';
            }
        } catch (error) {
            console.error('Error dari Store.login:', error);
            // Translate common Supabase Auth errors
            const errMsg = error?.message || String(error);
            if (errMsg.includes('Invalid login credentials')) {
                errorEl.textContent = 'Email atau password salah.';
            } else if (errMsg.includes('Email not confirmed')) {
                errorEl.textContent = 'Email belum dikonfirmasi.';
            } else if (errMsg.includes('violates row-level security')) {
                errorEl.textContent = 'Akses ditolak oleh database (Row Level Security). Profil Anda belum lengkap di tabel publik.';
            } else {
                errorEl.textContent = 'Terjadi kesalahan: ' + errMsg;
            }
            errorEl.style.display = 'block';
        }
    }
};