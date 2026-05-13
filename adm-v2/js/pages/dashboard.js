/* ============================================
   DASHBOARD PAGE
   ============================================ */

const DashboardPage = {
    dateFilter: 'all',

    async render() {
        const main = document.getElementById('main-content');
        main.innerHTML = `
            <div class="page-header">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text" style="width:40%"></div>
            </div>
            <div class="stat-cards stagger">
                <div class="skeleton skeleton-block"></div>
                <div class="skeleton skeleton-block"></div>
                <div class="skeleton skeleton-block"></div>
                <div class="skeleton skeleton-block"></div>
            </div>
            <div class="dashboard-grid stagger" style="margin-top:20px;">
                <div class="skeleton skeleton-block" style="height:300px"></div>
                <div class="skeleton skeleton-block" style="height:300px"></div>
            </div>
        `;

        let docs = await Store.getAll(Store.KEYS.DOCUMENTS);
        let projects = await Store.getAll(Store.KEYS.PROJECTS);

        // Apply Date Filter
        const now = new Date();
        if (this.dateFilter === 'month') {
            docs = docs.filter(d => { const dt = new Date(d.created_at || d.updated_at); return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear(); });
            projects = projects.filter(p => { const dt = new Date(p.created_at || p.updated_at); return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear(); });
        } else if (this.dateFilter === 'year') {
            docs = docs.filter(d => new Date(d.created_at || d.updated_at).getFullYear() === now.getFullYear());
            projects = projects.filter(p => new Date(p.created_at || p.updated_at).getFullYear() === now.getFullYear());
        }

        const docStats = {
            total: docs.length,
            draft: docs.filter(d => d.status === 'Draft').length,
            review: docs.filter(d => d.status === 'Review').length,
            signing: docs.filter(d => d.status === 'Signing').length,
            final: docs.filter(d => d.status === 'Final').length,
            needSign: docs.filter(d => d.status === 'Signing').length,
        };

        const projStats = {
            total: projects.length,
            active: projects.filter(p => p.status === 'Berjalan').length,
            done: projects.filter(p => p.status === 'Selesai').length,
            delayed: projects.filter(p => p.status === 'Tertunda').length,
        };

        const recentDocs = [...docs].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 6);

        // Category counts for bar chart
        const categories = {};
        projects.forEach(p => { categories[p.kategori] = (categories[p.kategori] || 0) + 1; });

        main.innerHTML = `
            <div class="page-header" style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h1>Dashboard</h1>
                    <p>Ringkasan statistik dan monitoring dokumen infrastruktur</p>
                </div>
                <div>
                    <select id="dashboard-filter" class="form-input" style="width:auto; cursor:pointer;" onchange="DashboardPage.changeFilter(this.value)">
                        <option value="all" ${this.dateFilter === 'all' ? 'selected' : ''}>Semua Waktu</option>
                        <option value="month" ${this.dateFilter === 'month' ? 'selected' : ''}>Bulan Ini</option>
                        <option value="year" ${this.dateFilter === 'year' ? 'selected' : ''}>Tahun Ini</option>
                    </select>
                </div>
            </div>

            <!-- Stat Cards -->
            <div class="stat-cards stagger">
                <div class="stat-card accent-blue">
                    <div class="stat-card-header">
                        <span class="stat-card-label">Total Dokumen</span>
                        <div class="stat-card-icon blue">${Components.icon('document', 20)}</div>
                    </div>
                    <div class="stat-card-value">${docStats.total}</div>
                    <div class="stat-card-footer">Semua tipe dokumen</div>
                </div>
                <div class="stat-card accent-success">
                    <div class="stat-card-header">
                        <span class="stat-card-label">Dokumen Final</span>
                        <div class="stat-card-icon green">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                    </div>
                    <div class="stat-card-value">${docStats.final}</div>
                    <div class="stat-card-footer">${docStats.total > 0 ? Math.round((docStats.final / docStats.total) * 100) : 0}% dari total</div>
                </div>
                <div class="stat-card accent-warning">
                    <div class="stat-card-header">
                        <span class="stat-card-label">Menunggu TTD</span>
                        <div class="stat-card-icon orange">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                        </div>
                    </div>
                    <div class="stat-card-value">${docStats.signing}</div>
                    <div class="stat-card-footer">Perlu persetujuan</div>
                </div>
                <div class="stat-card accent-gold">
                    <div class="stat-card-header">
                        <span class="stat-card-label">Proyek Aktif</span>
                        <div class="stat-card-icon gold">${Components.icon('project', 20)}</div>
                    </div>
                    <div class="stat-card-value">${projStats.active}</div>
                    <div class="stat-card-footer">${projStats.total} total proyek</div>
                </div>
            </div>

            <!-- Charts Grid -->
            <div class="dashboard-grid">
                <!-- Document Status Chart -->
                <div class="chart-card">
                    <div class="chart-card-header">
                        <span class="chart-card-title">Status Dokumen</span>
                    </div>
                    <div class="donut-container">
                        <div class="donut-chart" id="donut-chart"></div>
                        <div class="donut-legend">
                            <div class="legend-item"><div class="legend-dot" style="background:#dc2626"></div> Draft (${docStats.draft})</div>
                            <div class="legend-item"><div class="legend-dot" style="background:#0284c7"></div> Review (${docStats.review})</div>
                            <div class="legend-item"><div class="legend-dot" style="background:#d97706"></div> Signing (${docStats.signing})</div>
                            <div class="legend-item"><div class="legend-dot" style="background:#059669"></div> Final (${docStats.final})</div>
                        </div>
                    </div>
                </div>

                <!-- Projects by Category -->
                <div class="chart-card">
                    <div class="chart-card-header">
                        <span class="chart-card-title">Proyek per Kategori</span>
                    </div>
                    <div class="bar-chart" id="bar-chart">
                        ${Object.entries(categories).map(([cat, count]) => {
                            const maxCount = Math.max(...Object.values(categories));
                            const height = maxCount > 0 ? (count / maxCount) * 140 : 10;
                            return `
                                <div class="bar-group">
                                    <div class="bar" style="height:${height}px;background:${Utils.getCategoryColor(cat)}"></div>
                                    <div class="bar-label">${cat}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Recent Documents Table -->
                <div class="recent-table-card">
                    <div class="recent-table-header">
                        <h3>Dokumen Terbaru</h3>
                        <a href="#/documents" class="btn btn-ghost btn-sm">Lihat Semua</a>
                    </div>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Judul</th>
                                <th>Tipe</th>
                                <th>Status</th>
                                <th>TTD Progress</th>
                                <th>Diperbarui</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${recentDocs.map(doc => {
                                const sigProg = Utils.signatureProgress(doc.signatures || []);
                                return `
                                    <tr>
                                        <td>
                                            <div style="font-weight:500">${Utils.escapeHtml(doc.judul)}</div>
                                            <div class="text-xs text-secondary">${doc.project_id ? 'Terkait Proyek' : '-'}</div>
                                        </td>
                                        <td><span class="badge badge-inactive">${doc.tipe_dokumen}</span></td>
                                        <td>${Utils.getStatusBadge(doc.status)}</td>
                                        <td>
                                            <div class="progress-bar" style="width:80px">
                                                <div class="progress-fill" style="width:${sigProg}%"></div>
                                            </div>
                                            <span class="text-xs text-secondary">${sigProg}%</span>
                                        </td>
                                        <td class="text-sm text-secondary">${Utils.formatDate(doc.updated_at)}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        this.renderDonut(docStats);
    },

    renderDonut(stats) {
        const el = document.getElementById('donut-chart');
        if (!el) return;
        const total = stats.total || 1;
        const segments = [
            { value: stats.draft, color: '#dc2626' },
            { value: stats.review, color: '#0284c7' },
            { value: stats.signing, color: '#d97706' },
            { value: stats.final, color: '#059669' },
        ];

        let offset = 0;
        const gradientParts = [];
        segments.forEach(seg => {
            const pct = (seg.value / total) * 100;
            gradientParts.push(`${seg.color} ${offset}% ${offset + pct}%`);
            offset += pct;
        });

        el.style.background = `conic-gradient(${gradientParts.join(', ')})`;
        el.innerHTML = `
            <div class="donut-center" style="width:100px;height:100px;border-radius:50%;background:var(--bg-card);display:flex;flex-direction:column;align-items:center;justify-content:center">
                <div class="donut-center-value">${total}</div>
                <div class="donut-center-label">Dokumen</div>
            </div>
        `;
    },

    changeFilter(val) {
        this.dateFilter = val;
        this.render();
    }
};
