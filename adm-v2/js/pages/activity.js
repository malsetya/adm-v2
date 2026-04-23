/* ============================================
   ACTIVITY LOG PAGE
   ============================================ */

const ActivityPage = {
    filters: { search: '', action: '' },

    async render() {
        const main = document.getElementById('main-content');
        main.innerHTML = `<div style="text-align:center; padding: 40px; color: var(--text-tertiary);">Memuat data aktivitas...</div>`;

        const activities = await this.getFiltered();
        const allActivities = await Store.getAll(Store.KEYS.ACTIVITIES);
        const allActions = [...new Set(allActivities.map(a => a.action))];

        main.innerHTML = `
            <div class="page-header">
                <h1>Log Aktivitas</h1>
                <p>Riwayat seluruh aktivitas pengguna dalam sistem</p>
            </div>

            <div class="toolbar">
                <div class="toolbar-group">
                    <div class="search-bar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input type="text" id="act-search" placeholder="Cari aktivitas..." value="${this.filters.search}">
                    </div>
                    <select class="filter-select" id="act-filter-action">
                        <option value="">Semua Aksi</option>
                        ${allActions.map(a => `<option value="${a}" ${this.filters.action === a ? 'selected' : ''}>${a}</option>`).join('')}
                    </select>
                </div>
                <span class="text-sm text-secondary">${activities.length} aktivitas</span>
            </div>

            <div class="data-table-wrapper" style="animation:fadeInUp 0.4s ease">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width:40px"></th>
                            <th>Pengguna</th>
                            <th>Aksi</th>
                            <th>Detail</th>
                            <th>Waktu</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${activities.length === 0 ? `<tr><td colspan="5" class="text-center text-secondary" style="padding:var(--space-8)">Tidak ada aktivitas ditemukan</td></tr>` :
                        activities.map(a => `
                            <tr>
                                <td><div style="width:8px;height:8px;border-radius:50%;background:${Utils.getActivityColor(a.action)}"></div></td>
                                <td style="font-weight:500;font-size:var(--font-size-sm)">${Utils.escapeHtml(a.user_name.split(',')[0])}</td>
                                <td><span class="badge badge-inactive">${a.action}</span></td>
                                <td class="text-sm">${Utils.escapeHtml(a.detail)}</td>
                                <td class="text-sm text-secondary" style="white-space:nowrap">${Utils.timeAgo(a.timestamp)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        this.bindEvents();
    },

    async getFiltered() {
        const allActivities = await Store.getAll(Store.KEYS.ACTIVITIES);
        let acts = allActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        if (this.filters.search) {
            const q = this.filters.search.toLowerCase();
            acts = acts.filter(a => a.detail.toLowerCase().includes(q) || a.user_name.toLowerCase().includes(q));
        }
        if (this.filters.action) acts = acts.filter(a => a.action === this.filters.action);
        return acts;
    },

    bindEvents() {
        const search = document.getElementById('act-search');
        if (search) search.addEventListener('input', Utils.debounce(e => { this.filters.search = e.target.value; this.render(); }, 300));
        const filterAction = document.getElementById('act-filter-action');
        if (filterAction) filterAction.addEventListener('change', e => { this.filters.action = e.target.value; this.render(); });
    }
};
