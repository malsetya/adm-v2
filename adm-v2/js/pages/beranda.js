/* ============================================
   BERANDA (HOME) PAGE
   ============================================ */

const BerandaPage = {
    async render() {
        const main = document.getElementById('main-content');

        main.innerHTML = `<div style="text-align:center; padding: 40px; color: var(--text-tertiary);">Memuat data beranda...</div>`;

        const user = Store.getCurrentUser();
        const dateInfo = Utils.getCurrentDateFormatted();
        const docStats = await Store.getDocStats();
        const projStats = await Store.getProjectStats();
        const allActivities = await Store.getAll(Store.KEYS.ACTIVITIES);
        const activities = allActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 8);
        const docs = await Store.getAll(Store.KEYS.DOCUMENTS);
        const signingDocs = docs.filter(d => d.status === 'Signing');
        const draftDocs = docs.filter(d => d.status === 'Draft');

        main.innerHTML = `
            <!-- Hero Banner -->
            <div class="beranda-hero">
                <div class="beranda-hero-content">
                    <div class="beranda-greeting">${Utils.getGreeting()},</div>
                    <div class="beranda-title">${user ? user.nama.split(',')[0] : 'Pengguna'}</div>
                    <div class="beranda-subtitle">Selamat datang di Dashboard Administrasi Dokumen Bidang Cipta Karya</div>
                    <div class="beranda-subtitle">Kelola dan Pantau Seluruh Dokumen Proyek Infrastruktur dengan Mudah</div>
                    <div style="margin-top: 15px;">
                        <button class="btn btn-secondary btn-sm" onclick="location.hash='#/landing'" style="background: rgba(255,255,255,0.2); color: white; border: none;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 5px;"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                            Lihat Halaman Publik (Landing)
                        </button>
                    </div>
                </div>
                <div class="beranda-date">
                    <div class="beranda-date-day">${dateInfo.day}</div>
                    <div class="beranda-date-month">${dateInfo.month} ${dateInfo.year}</div>
                </div>
            </div>

            <!-- Quick Stats -->
            <div class="beranda-stats stagger">
                <div class="stat-card accent-blue">
                    <div class="stat-card-header">
                        <span class="stat-card-label">Total Dokumen</span>
                        <div class="stat-card-icon blue">${Components.icon('document', 20)}</div>
                    </div>
                    <div class="stat-card-value">${docStats.total}</div>
                    <div class="stat-card-footer">${docStats.final} dokumen final</div>
                </div>
                <div class="stat-card accent-gold">
                    <div class="stat-card-header">
                        <span class="stat-card-label">Proyek Aktif</span>
                        <div class="stat-card-icon gold">${Components.icon('project', 20)}</div>
                    </div>
                    <div class="stat-card-value">${projStats.active}</div>
                    <div class="stat-card-footer">dari ${projStats.total} total proyek</div>
                </div>
                <div class="stat-card accent-warning">
                    <div class="stat-card-header">
                        <span class="stat-card-label">Butuh Tanda Tangan</span>
                        <div class="stat-card-icon orange">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                        </div>
                    </div>
                    <div class="stat-card-value">${docStats.needSign}</div>
                    <div class="stat-card-footer">menunggu persetujuan</div>
                </div>
                <div class="stat-card accent-danger">
                    <div class="stat-card-header">
                        <span class="stat-card-label">Draft Dokumen</span>
                        <div class="stat-card-icon red">${Components.icon('document', 20)}</div>
                    </div>
                    <div class="stat-card-value">${docStats.draft}</div>
                    <div class="stat-card-footer">perlu ditindaklanjuti</div>
                </div>
            </div>

            <!-- Quick Access -->
            <div class="beranda-quick-access">
                <div class="beranda-section-title">Akses Cepat</div>
                <div class="quick-access-grid stagger">
                    <div class="quick-access-card" onclick="location.hash='#/dashboard'">
                        <div class="quick-access-icon" style="background:var(--primary-50);color:var(--pupr-blue)">${Components.icon('dashboard', 24)}</div>
                        <div class="quick-access-label">Dashboard</div>
                        <div class="quick-access-desc">Statistik & grafik</div>
                    </div>
                    <div class="quick-access-card" onclick="location.hash='#/documents'">
                        <div class="quick-access-icon" style="background:var(--accent-50);color:var(--pupr-gold-dark)">${Components.icon('document', 24)}</div>
                        <div class="quick-access-label">Dokumen</div>
                        <div class="quick-access-desc">${docStats.total} dokumen</div>
                    </div>
                    <div class="quick-access-card" onclick="location.hash='#/projects'">
                        <div class="quick-access-icon" style="background:var(--success-light);color:var(--success)">${Components.icon('project', 24)}</div>
                        <div class="quick-access-label">Proyek</div>
                        <div class="quick-access-desc">${projStats.active} aktif</div>
                    </div>
                    ${Store.isAdmin() ? `
                    <div class="quick-access-card" onclick="location.hash='#/users'">
                        <div class="quick-access-icon" style="background:var(--info-light);color:var(--info)">${Components.icon('users', 24)}</div>
                        <div class="quick-access-label">Pengguna</div>
                        <div class="quick-access-desc">Kelola akses</div>
                    </div>` : `
                    <div class="quick-access-card" onclick="location.hash='#/activity'">
                        <div class="quick-access-icon" style="background:var(--warning-light);color:var(--warning)">${Components.icon('activity', 24)}</div>
                        <div class="quick-access-label">Log Aktivitas</div>
                        <div class="quick-access-desc">Riwayat sistem</div>
                    </div>`}
                </div>
            </div>

            <!-- Bottom Grid -->
            <div class="beranda-grid">
                <!-- Recent Activity Feed -->
                <div class="activity-feed">
                    <div class="activity-feed-header">
                        <h3>Aktivitas Terbaru</h3>
                        <a href="#/activity" class="btn btn-ghost btn-sm">Lihat Semua</a>
                    </div>
                    <div class="activity-feed-list">
                        ${activities.map(a => `
                            <div class="activity-feed-item">
                                <div class="activity-feed-dot" style="background:${Utils.getActivityColor(a.action)}"></div>
                                <div>
                                    <div class="activity-feed-text">${Utils.escapeHtml(a.detail)}</div>
                                    <div class="activity-feed-time">${Utils.timeAgo(a.timestamp)}</div>
                                </div>
                            </div>
                        `).join('')}
                        ${activities.length === 0 ? '<div class="empty-state"><p>Belum ada aktivitas</p></div>' : ''}
                    </div>
                </div>

                <!-- Alerts Panel -->
                <div class="alerts-panel">
                    <div class="alerts-panel-header">
                        <h3>⚠️ Perlu Perhatian</h3>
                    </div>
                    ${signingDocs.map(d => `
                        <div class="alert-item">
                            <div class="alert-item-title">${Utils.escapeHtml(d.judul)}</div>
                            <div class="alert-item-desc">Menunggu tanda tangan — ${Utils.signatureProgress(d.signatures)}% selesai</div>
                        </div>
                    `).join('')}
                    ${draftDocs.map(d => `
                        <div class="alert-item">
                            <div class="alert-item-title">${Utils.escapeHtml(d.judul)}</div>
                            <div class="alert-item-desc">Status: Draft — perlu ditindaklanjuti</div>
                        </div>
                    `).join('')}
                    ${(signingDocs.length + draftDocs.length) === 0 ? '<div class="alert-item"><div class="alert-item-desc">Tidak ada item yang memerlukan perhatian 🎉</div></div>' : ''}
                </div>
            </div>
        `;
    }
};
