/* ============================================
   SETTINGS PAGE
   ============================================ */

const SettingsPage = {
    async render() {
        const main = document.getElementById('main-content');
        main.innerHTML = `<div style="text-align:center; padding: 40px; color: var(--text-tertiary);">Memuat pengaturan...</div>`;
        
        const user = Store.getCurrentUser();
        const theme = Store.getTheme();
        const users = await Store.getAll(Store.KEYS.USERS);
        const docs = await Store.getAll(Store.KEYS.DOCUMENTS);
        const projects = await Store.getAll(Store.KEYS.PROJECTS);

        main.innerHTML = `
            <div class="page-header">
                <h1>Pengaturan</h1>
                <p>Konfigurasi sistem dan preferensi tampilan</p>
            </div>

            <div style="display:flex;flex-direction:column;gap:var(--space-5);max-width:640px">
                <!-- Profile -->
                <div class="card">
                    <h3 style="font-size:var(--font-size-md);font-weight:var(--font-weight-semibold);margin-bottom:var(--space-4)">Profil Saya</h3>
                    <div style="display:flex;align-items:center;gap:var(--space-4);margin-bottom:var(--space-4)">
                        <div style="width:56px;height:56px;border-radius:var(--border-radius-full);background:linear-gradient(135deg,var(--pupr-blue),var(--pupr-blue-light));color:#fff;display:flex;align-items:center;justify-content:center;font-size:var(--font-size-lg);font-weight:var(--font-weight-bold)">${user.avatar}</div>
                        <div>
                            <div style="font-weight:var(--font-weight-semibold);font-size:var(--font-size-md)">${Utils.escapeHtml(user.nama)}</div>
                            <div class="text-sm text-secondary">${Utils.getRoleLabel(user.role)} · ${Utils.escapeHtml(user.email || '')}</div>
                        </div>
                    </div>
                </div>

                <!-- Theme -->
                <div class="card">
                    <h3 style="font-size:var(--font-size-md);font-weight:var(--font-weight-semibold);margin-bottom:var(--space-4)">Tampilan</h3>
                    <div style="display:flex;align-items:center;justify-content:space-between">
                        <div>
                            <div style="font-weight:var(--font-weight-medium)">Mode Gelap</div>
                            <div class="text-sm text-secondary">Ubah tema tampilan antarmuka</div>
                        </div>
                        <label style="position:relative;display:inline-block;width:48px;height:26px;cursor:pointer">
                            <input type="checkbox" id="theme-toggle" ${theme === 'dark' ? 'checked' : ''} style="opacity:0;width:0;height:0">
                            <span style="position:absolute;inset:0;background:${theme === 'dark' ? 'var(--pupr-gold)' : 'var(--border-medium)'};border-radius:26px;transition:all var(--transition-base)"></span>
                            <span style="position:absolute;left:${theme === 'dark' ? '24px' : '3px'};top:3px;width:20px;height:20px;background:#fff;border-radius:50%;transition:all var(--transition-base);box-shadow:var(--shadow-sm)"></span>
                        </label>
                    </div>
                </div>

                <!-- Data Management -->
                ${Store.isAdmin() ? `
                <div class="card">
                    <h3 style="font-size:var(--font-size-md);font-weight:var(--font-weight-semibold);margin-bottom:var(--space-4)">Manajemen Data</h3>
                    <div style="display:flex;flex-direction:column;gap:var(--space-3)">
                        <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3);background:var(--bg-tertiary);border-radius:var(--border-radius-md)">
                            <div>
                                <div style="font-weight:var(--font-weight-medium)">Backup Data</div>
                                <div class="text-xs text-secondary">Download backup dalam format JSON</div>
                            </div>
                            <button class="btn btn-secondary btn-sm" id="btn-export">Download</button>
                        </div>
                        <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3);background:var(--bg-tertiary);border-radius:var(--border-radius-md)">
                            <div>
                                <div style="font-weight:var(--font-weight-medium)">Restore Data</div>
                                <div class="text-xs text-secondary">Pulihkan data dari file backup</div>
                            </div>
                            <label class="btn btn-secondary btn-sm" style="cursor:pointer">
                                Upload
                                <input type="file" accept=".json" id="btn-import" style="display:none">
                            </label>
                        </div>
                        <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3);background:var(--danger-light);border-radius:var(--border-radius-md)">
                            <div>
                                <div style="font-weight:var(--font-weight-medium);color:var(--danger)">Reset Data</div>
                                <div class="text-xs text-secondary">Kembalikan semua data ke kondisi awal</div>
                            </div>
                            <button class="btn btn-danger btn-sm" id="btn-reset">Reset</button>
                        </div>
                    </div>
                </div>` : ''}

                <!-- System Info -->
                <div class="card">
                    <h3 style="font-size:var(--font-size-md);font-weight:var(--font-weight-semibold);margin-bottom:var(--space-4)">Informasi Sistem</h3>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)">
                        <div style="padding:var(--space-3);background:var(--bg-tertiary);border-radius:var(--border-radius-md)">
                            <div class="text-xs text-secondary">Versi</div>
                            <div style="font-weight:var(--font-weight-semibold)">v2.0.0</div>
                        </div>
                        <div style="padding:var(--space-3);background:var(--bg-tertiary);border-radius:var(--border-radius-md)">
                            <div class="text-xs text-secondary">Pengguna</div>
                            <div style="font-weight:var(--font-weight-semibold)">${users.length}</div>
                        </div>
                        <div style="padding:var(--space-3);background:var(--bg-tertiary);border-radius:var(--border-radius-md)">
                            <div class="text-xs text-secondary">Dokumen</div>
                            <div style="font-weight:var(--font-weight-semibold)">${docs.length}</div>
                        </div>
                        <div style="padding:var(--space-3);background:var(--bg-tertiary);border-radius:var(--border-radius-md)">
                            <div class="text-xs text-secondary">Proyek</div>
                            <div style="font-weight:var(--font-weight-semibold)">${projects.length}</div>
                        </div>
                    </div>
                    <div style="margin-top:var(--space-4);padding-top:var(--space-4);border-top:1px solid var(--border-light)">
                        <div class="text-xs text-secondary">Dashboard Administrasi Dokumen Cipta Karya</div>
                        <div class="text-xs text-secondary">© ${new Date().getFullYear()} Kementerian PUPR — Dinas Cipta Karya</div>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    },

    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', () => {
                Store.toggleTheme();
                this.render();
            });
        }

        const exportBtn = document.getElementById('btn-export');
        if (exportBtn) exportBtn.addEventListener('click', () => App.exportData());

        const importInput = document.getElementById('btn-import');
        if (importInput) importInput.addEventListener('change', (e) => {
            if (e.target.files[0]) App.importData(e.target.files[0]);
        });

        const resetBtn = document.getElementById('btn-reset');
        if (resetBtn) resetBtn.addEventListener('click', () => App.resetData());
    }
};
