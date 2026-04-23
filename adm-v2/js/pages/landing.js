/* ============================================
   LANDING PAGE — Public Home
   ============================================ */

const LandingPage = {
    async render() {
        const page = document.getElementById('landing-page');
        const projStats = await Store.getProjectStats();
        const docStats = await Store.getDocStats();
        const projects = await Store.getAll(Store.KEYS.PROJECTS);
        const activeProjects = projects.filter(p => p.status === 'Berjalan');
        const isLoggedIn = Store.isLoggedIn();

        page.innerHTML = `
            <!-- Navigation Bar -->
            <nav class="landing-nav">
                <div class="landing-nav-brand">
                    <div class="landing-nav-logo">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>
                            <path d="M9 9v.01"/><path d="M9 12v.01"/><path d="M9 15v.01"/>
                        </svg>
                    </div>
                    <div>
                        <div class="landing-nav-title">Dinas Cipta Karya Bina Konstruksi & Tata Ruang</div>
                        <div class="landing-nav-subtitle">Provinsi Sulawesi Tenggara</div>
                    </div>
                </div>
                <div class="landing-nav-actions">
                    <a href="#/tracking" class="btn btn-ghost btn-sm" onclick="event.preventDefault(); LandingPage.scrollTo('tracking')">Tracking</a>
                    <a href="#/peta" class="btn btn-ghost btn-sm" onclick="event.preventDefault(); LandingPage.scrollTo('map')">Peta</a>
                    ${isLoggedIn
                ? `<button class="btn btn-ghost btn-sm" onclick="App.doLogout()">
                               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                               Log out
                           </button>`
                : `<button class="btn btn-primary btn-sm" onclick="App.showLogin()">
                               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                               Masuk
                           </button>`
            }
                </div>
            </nav>

            <!-- Hero Section -->
            <section class="landing-hero">
                <div class="landing-hero-badge">
                    <span class="landing-hero-badge-dot"></span>
                    Sistem Informasi Bidang Cipta Karya
                </div>
                <h1>
                    Selamat Datang
                    <span>Optimasi Informasi Bidang Cipta Karya</span>
                </h1>
                <p class="landing-hero-desc">
                    <span>Platform digital untuk monitoring, pelacakan, dan pengelolaan dokumen proyek infrastruktur secara terintegrasi</span>
                    
                </p>
                <div class="landing-hero-actions">
                    ${isLoggedIn
                ? `<button class="landing-hero-btn landing-hero-btn-primary" onclick="location.hash='#/beranda'">
                               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                               Buka Dashboard
                           </button>`
                : `<button class="landing-hero-btn landing-hero-btn-primary" onclick="App.showLogin()">
                               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                               Masuk ke Sistem
                           </button>`
            }
                    <button class="landing-hero-btn landing-hero-btn-secondary" onclick="LandingPage.scrollTo('tracking')">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        Lacak Dokumen
                    </button>
                </div>
            </section>

            <!-- Stats Strip -->
            <div class="landing-stats-strip">
                <div class="landing-stat-item">
                    <div class="landing-stat-value">${projStats.total}</div>
                    <div class="landing-stat-label">Total Proyek</div>
                </div>
                <div class="landing-stat-item">
                    <div class="landing-stat-value">${projStats.active}</div>
                    <div class="landing-stat-label">Proyek Aktif</div>
                </div>
                <div class="landing-stat-item">
                    <div class="landing-stat-value">${docStats.total}</div>
                    <div class="landing-stat-label">Dokumen</div>
                </div>
                <div class="landing-stat-item">
                    <div class="landing-stat-value">${docStats.final}</div>
                    <div class="landing-stat-label">Dokumen Final</div>
                </div>
            </div>

            <!-- Feature Cards -->
            <section class="landing-features">
                <div class="landing-section-header">
                    <div class="landing-section-tag">Layanan</div>
                    <h2 class="landing-section-title">Akses Informasi Bidang Cipta Karya</h2>
                    <p class="landing-section-desc">Pilih layanan yang tersedia untuk memantau dan mengelola proyek infrastruktur</p>
                </div>

                <div class="landing-features-grid stagger">
                    <!-- Login Card -->
                    <div class="landing-feature-card" onclick="${isLoggedIn ? `location.hash='#/beranda'` : `App.showLogin()`}">
                        <div class="landing-feature-icon blue">
                            ${isLoggedIn
                ? `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
                : `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`
            }
                        </div>
                        <h3 class="landing-feature-title">${isLoggedIn ? 'Buka Dashboard' : 'Login Sistem'}</h3>
                        <p class="landing-feature-desc">Masuk ke dashboard administrasi untuk mengelola dokumen, proyek, dan pengguna dengan akses berbasis peran.</p>
                        <span class="landing-feature-link">
                            ${isLoggedIn ? 'Buka Sekarang' : 'Masuk Sekarang'}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                        </span>
                    </div>

                    <!-- Tracking Status Card -->
                    <div class="landing-feature-card" onclick="LandingPage.scrollTo('tracking')">
                        <div class="landing-feature-icon gold">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        </div>
                        <h3 class="landing-feature-title">Tracking Status</h3>
                        <p class="landing-feature-desc">Lacak status dokumen proyek secara publik dengan memasukkan nomor surat. Pantau progress tanda tangan berjenjang.</p>
                        <span class="landing-feature-link">
                            Lacak Dokumen
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                        </span>
                    </div>

                    <!-- Map Card -->
                    <div class="landing-feature-card" onclick="LandingPage.scrollTo('map')">
                        <div class="landing-feature-icon green">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        </div>
                        <h3 class="landing-feature-title">Peta Lokasi Pekerjaan</h3>
                        <p class="landing-feature-desc">Lihat sebaran lokasi proyek infrastruktur Cipta Karya di seluruh Indonesia melalui peta interaktif Google Maps.</p>
                        <span class="landing-feature-link">
                            Lihat Peta
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                        </span>
                    </div>
                </div>
            </section>

            <!-- Tracking Section -->
            <section class="landing-tracking" id="landing-tracking">
                <div class="landing-tracking-inner">
                    <div class="landing-section-tag">Tracking</div>
                    <h2 class="landing-section-title">Lacak Status Dokumen</h2>
                    <p class="landing-section-desc">Masukkan nomor surat untuk melihat status dan progress tanda tangan dokumen proyek.</p>

                    <div class="landing-tracking-form">
                        <input type="text" class="landing-tracking-input" id="tracking-input" placeholder="Masukkan nomor surat, contoh: HPS/SPAM/2026/001" autocomplete="off">
                        <button class="landing-tracking-btn" id="tracking-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            Lacak
                        </button>
                    </div>

                    <div id="tracking-result"></div>
                </div>
            </section>

            <!-- Map Section -->
            <section class="landing-map" id="landing-map">
                <div class="landing-section-header">
                    <div class="landing-section-tag">Lokasi</div>
                    <h2 class="landing-section-title">Peta Lokasi Pekerjaan</h2>
                    <p class="landing-section-desc">Sebaran Proyek Infrastruktur Bidang Cipta Karya di Indonesia.</p>
                </div>

                <div class="landing-map-container">
                    <iframe
                        id="landing-gmap"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15959.083041935515!2d106.8202568!3d-6.2366889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e4c442eb33%3A0x8e83f5ce62d29486!2sKementerian%20Pekerjaan%20Umum%20dan%20Perumahan%20Rakyat!5e0!3m2!1sen!2sid!4v1682315000000!5m2!1sen!2sid"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                    <div class="landing-map-overlay">
                        ${activeProjects.map(p => `
                            <div class="landing-map-tag">
                                <span class="landing-map-tag-dot" style="background:${Utils.getCategoryColor(p.kategori)}"></span>
                                ${Utils.escapeHtml(p.lokasi)}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>

            <!-- Footer -->
            <footer class="landing-footer">
                <div class="landing-footer-brand">
                    <div class="landing-footer-logo">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>
                    </div>
                    <span class="landing-footer-name">Cipta Karya</span>
                </div>
                <div style="font-size:var(--font-size-sm)">Dashboard Administrasi Dokumen v2</div>
                <div class="landing-footer-copy">© ${new Date().getFullYear()} Dinas Cipta Karya Bina Konstruksi & Tata Ruang</div>
                <div>Provinsi Sulawesi Tenggara</div>
                <div class="landing-footer-links">
                    ${isLoggedIn
                ? `<a href="#/beranda">Dashboard</a>`
                : `<a href="#" onclick="event.preventDefault(); App.showLogin()">Login</a>`
            }
                    <a href="#" onclick="event.preventDefault(); LandingPage.scrollTo('tracking')">Tracking</a>
                    <a href="#" onclick="event.preventDefault(); LandingPage.scrollTo('map')">Peta Lokasi</a>
                </div>
            </footer>
        `;

        this.bindEvents();
    },

    bindEvents() {
        const btn = document.getElementById('tracking-btn');
        const input = document.getElementById('tracking-input');

        if (btn) {
            btn.addEventListener('click', () => this.doTracking());
        }
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.doTracking();
            });
        }
    },

    async doTracking() {
        const input = document.getElementById('tracking-input');
        const resultEl = document.getElementById('tracking-result');
        const query = input.value.trim();

        if (!query) {
            resultEl.innerHTML = `<div class="landing-tracking-not-found">Silakan masukkan nomor surat dokumen.</div>`;
            return;
        }

        resultEl.innerHTML = `<div style="text-align:center; padding: 20px;">Memuat data...</div>`;

        const docs = await Store.getAll(Store.KEYS.DOCUMENTS);
        const doc = docs.find(d =>
            d.nomor_surat.toLowerCase() === query.toLowerCase() ||
            d.nomor_surat.toLowerCase().includes(query.toLowerCase()) ||
            d.judul.toLowerCase().includes(query.toLowerCase())
        );

        if (!doc) {
            resultEl.innerHTML = `
                <div class="landing-tracking-not-found">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" stroke-width="1.5" style="margin:0 auto var(--space-3);display:block;opacity:0.4">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        <line x1="8" y1="8" x2="14" y2="14"/><line x1="14" y1="8" x2="8" y2="14"/>
                    </svg>
                    Dokumen dengan nomor surat "<strong>${Utils.escapeHtml(query)}</strong>" tidak ditemukan.<br>
                    <span style="font-size:var(--font-size-xs);color:var(--text-tertiary)">Pastikan nomor surat dimasukkan dengan benar.</span>
                </div>
            `;
            return;
        }

        const proj = await Store.getById(Store.KEYS.PROJECTS, doc.project_id);
        const sigProg = Utils.signatureProgress(doc.signatures);

        resultEl.innerHTML = `
            <div class="landing-tracking-result">
                <div class="landing-tracking-card">
                    <div class="landing-tracking-card-header">
                        <div>
                            <div style="font-weight:var(--font-weight-bold);font-size:var(--font-size-md)">${Utils.escapeHtml(doc.judul)}</div>
                            <div class="text-xs text-secondary" style="margin-top:2px">${Utils.escapeHtml(doc.nomor_surat)}</div>
                        </div>
                        ${Utils.getStatusBadge(doc.status)}
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);margin-bottom:var(--space-4)">
                        <div>
                            <div class="text-xs text-secondary">Proyek</div>
                            <div style="font-weight:500;font-size:var(--font-size-sm)">${proj ? Utils.escapeHtml(proj.nama_proyek) : '-'}</div>
                        </div>
                        <div>
                            <div class="text-xs text-secondary">Tipe Dokumen</div>
                            <div style="font-size:var(--font-size-sm)"><span class="badge badge-inactive">${doc.tipe_dokumen}</span></div>
                        </div>
                        <div>
                            <div class="text-xs text-secondary">Versi</div>
                            <div style="font-size:var(--font-size-sm);font-weight:500">v${doc.version}</div>
                        </div>
                        <div>
                            <div class="text-xs text-secondary">Terakhir Diperbarui</div>
                            <div style="font-size:var(--font-size-sm)">${Utils.formatDate(doc.updated_at)}</div>
                        </div>
                    </div>

                    <div>
                        <div class="text-xs text-secondary" style="margin-bottom:var(--space-2)">Progress Tanda Tangan (${sigProg}%)</div>
                        <div class="progress-bar" style="margin-bottom:var(--space-3)">
                            <div class="progress-fill" style="width:${sigProg}%"></div>
                        </div>
                        <div style="display:flex;flex-direction:column;gap:var(--space-2)">
                            ${doc.signatures.map(s => `
                                <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-2) var(--space-3);background:var(--bg-tertiary);border-radius:var(--border-radius-md);border-left:3px solid ${s.signed ? 'var(--success)' : 'var(--border-light)'}">
                                    <div>
                                        <div style="font-size:var(--font-size-sm);font-weight:500">${s.jabatan}</div>
                                        <div class="text-xs text-secondary">${s.nama}</div>
                                    </div>
                                    <div>
                                        ${s.signed
                ? `<span class="badge badge-final" style="font-size:10px">✓ Ditandatangani</span>`
                : `<span class="badge badge-inactive" style="font-size:10px">Menunggu</span>`
            }
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    scrollTo(section) {
        const el = document.getElementById(`landing-${section}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
};
