/* ============================================
   PROJECTS PAGE
   ============================================ */

const ProjectsPage = {
    filters: { search: '', category: '', status: '' },

    async render() {
        const main = document.getElementById('main-content');
        main.innerHTML = `
            <div class="page-header">
                <div class="skeleton skeleton-title" style="width:150px"></div>
                <div class="skeleton skeleton-text" style="width:250px"></div>
            </div>
            <div style="margin-top:20px;">
                <div class="skeleton skeleton-block" style="height:60px; border-radius:8px"></div>
                <div class="card-grid stagger" style="margin-top:20px">
                    <div class="skeleton skeleton-block" style="height:200px"></div>
                    <div class="skeleton skeleton-block" style="height:200px"></div>
                    <div class="skeleton skeleton-block" style="height:200px"></div>
                </div>
            </div>
        `;

        const projects = await this.getFilteredProjects();
        const allProjects = await Store.getAll(Store.KEYS.PROJECTS);
        const categories = [...new Set(allProjects.map(p => p.kategori))];

        main.innerHTML = `
            <div class="page-header">
                <h1>Proyek</h1>
                <p>Daftar proyek infrastruktur Cipta Karya</p>
            </div>

            <div class="toolbar">
                <div class="toolbar-group">
                    <div class="search-bar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input type="text" id="proj-search" placeholder="Cari proyek..." value="${this.filters.search}">
                    </div>
                    <select class="filter-select" id="proj-filter-cat">
                        <option value="">Semua Kategori</option>
                        ${categories.map(c => `<option value="${c}" ${this.filters.category === c ? 'selected' : ''}>${c}</option>`).join('')}
                    </select>
                    <select class="filter-select" id="proj-filter-status">
                        <option value="">Semua Status</option>
                        <option value="Berjalan" ${this.filters.status === 'Berjalan' ? 'selected' : ''}>Berjalan</option>
                        <option value="Selesai" ${this.filters.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
                        <option value="Tertunda" ${this.filters.status === 'Tertunda' ? 'selected' : ''}>Tertunda</option>
                    </select>
                </div>
                <div style="display:flex; gap:var(--space-2);">
                    <button class="btn btn-ghost" onclick="ProjectsPage.exportCSV()">Ekspor CSV</button>
                    <button class="btn btn-ghost" onclick="window.print()">Cetak PDF</button>
                    ${Store.isAdmin() ? `<button class="btn btn-primary" id="btn-add-proj">${Components.icon('plus', 16)} Tambah Proyek</button>` : ''}
                </div>
            </div>

            <div class="card-grid stagger">
                ${projects.length === 0 ? '<div class="empty-state" style="grid-column:1/-1"><h3>Tidak ada proyek</h3><p>Proyek yang sesuai filter tidak ditemukan.</p></div>' :
                projects.map(p => `
                    <div class="card" style="display:flex;flex-direction:column">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--space-3)">
                            <span class="project-card-category" style="color:${Utils.getCategoryColor(p.kategori)}">${p.kategori}</span>
                            ${Utils.getProjectStatusBadge(p.status)}
                        </div>
                        <div class="project-card-title">${Utils.escapeHtml(p.nama_proyek)}</div>
                        <div class="project-card-meta">
                            <div class="project-meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                ${Utils.escapeHtml(p.lokasi)}
                            </div>
                            <div class="project-meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                                TA ${p.tahun_anggaran}
                            </div>
                            <div class="project-meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                ${Utils.formatCurrency(p.nilai_kontrak)}
                            </div>
                        </div>
                        <div class="project-progress" style="margin-top:auto">
                            <div class="project-progress-header">
                                <span class="project-progress-label">Progress</span>
                                <span class="project-progress-value">${p.progress}%</span>
                            </div>
                            <div class="progress-bar"><div class="progress-fill" style="width:${p.progress}%"></div></div>
                        </div>
                        ${Store.isAdmin() ? `
                        <div style="display:flex;gap:var(--space-2);margin-top:var(--space-4);border-top:1px solid var(--border-light);padding-top:var(--space-3)">
                            <button class="btn btn-ghost btn-sm" onclick="ProjectsPage.showEdit('${p.id}')">${Components.icon('edit', 14)} Edit</button>
                            <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="ProjectsPage.deleteProj('${p.id}')">${Components.icon('trash', 14)} Hapus</button>
                        </div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;

        this.bindEvents();
    },

    async getFilteredProjects() {
        let projects = await Store.getAll(Store.KEYS.PROJECTS);
        if (this.filters.search) {
            const q = this.filters.search.toLowerCase();
            projects = projects.filter(p => p.nama_proyek.toLowerCase().includes(q) || (p.kode_proyek && p.kode_proyek.toLowerCase().includes(q)));
        }
        if (this.filters.category) projects = projects.filter(p => p.kategori === this.filters.category);
        if (this.filters.status) projects = projects.filter(p => p.status === this.filters.status);
        return projects;
    },

    exportCSV() {
        this.getFilteredProjects().then(projects => {
            if (projects.length === 0) return Components.toast('Tidak ada data untuk diekspor', 'warning');
            const data = projects.map(p => ({
                "ID Proyek": p.id,
                "Kode": p.kode_proyek || '-',
                "Nama Proyek": p.nama_proyek,
                "Kategori": p.kategori,
                "Status": p.status,
                "Progress (%)": p.progress,
                "Lokasi": p.lokasi || '-',
                "Tahun Anggaran": p.tahun_anggaran,
                "Nilai Kontrak (Rp)": p.nilai_kontrak,
                "Kontraktor": p.kontraktor || '-',
                "Konsultan": p.konsultan || '-'
            }));
            Utils.exportToCSV('Laporan_Proyek.csv', data);
        });
    },

    bindEvents() {
        const search = document.getElementById('proj-search');
        if (search) search.addEventListener('input', Utils.debounce(e => { this.filters.search = e.target.value; this.render(); }, 300));
        const filterCat = document.getElementById('proj-filter-cat');
        if (filterCat) filterCat.addEventListener('change', e => { this.filters.category = e.target.value; this.render(); });
        const filterStatus = document.getElementById('proj-filter-status');
        if (filterStatus) filterStatus.addEventListener('change', e => { this.filters.status = e.target.value; this.render(); });
        const addBtn = document.getElementById('btn-add-proj');
        if (addBtn) addBtn.addEventListener('click', () => this.showAdd());
    },

    async showAdd() {
        const body = `
            <form id="proj-add-form">
                <div class="form-group"><label class="form-label">Nama Proyek</label><input type="text" class="form-input" id="add-proj-name" required placeholder="Nama proyek"></div>
                <div class="form-group"><label class="form-label">Kategori / Bidang</label>
                    <select class="form-select" id="add-proj-cat" required>
                        <option value="">Pilih...</option><option>SPAM</option><option>Sanitasi</option><option>Drainase</option><option>Gedung</option>
                    </select>
                </div>
                <div class="form-group"><label class="form-label">Lokasi</label><input type="text" class="form-input" id="add-proj-loc" placeholder="Kota/Kabupaten, Provinsi"></div>
                <div class="form-group"><label class="form-label">Tahun Anggaran</label><input type="number" class="form-input" id="add-proj-year" value="${new Date().getFullYear()}"></div>
                <div class="form-group"><label class="form-label">Nilai Kontrak (Rp)</label><input type="number" class="form-input" id="add-proj-value" placeholder="0"></div>
                <div class="form-group"><label class="form-label">Kontraktor Pelaksana</label><input type="text" class="form-input" id="add-proj-kontraktor" placeholder="Nama Perusahaan Kontraktor"></div>
                <div class="form-group"><label class="form-label">Konsultan Pengawas</label><input type="text" class="form-input" id="add-proj-konsultan" placeholder="Nama Perusahaan Konsultan"></div>
            </form>
        `;
        const footer = `<button class="btn btn-secondary" onclick="Components.closeModal()">Batal</button><button class="btn btn-primary" id="btn-save-proj">Simpan</button>`;
        Components.modal('Tambah Proyek Baru', body, footer);

        document.getElementById('btn-save-proj').addEventListener('click', async () => {
            const name = document.getElementById('add-proj-name').value.trim();
            const cat = document.getElementById('add-proj-cat').value;
            const loc = document.getElementById('add-proj-loc').value.trim();
            const year = parseInt(document.getElementById('add-proj-year').value);
            const val = parseInt(document.getElementById('add-proj-value').value) || 0;
            const kontraktor = document.getElementById('add-proj-kontraktor').value.trim();
            const konsultan = document.getElementById('add-proj-konsultan').value.trim();

            if (!name || !cat) { Components.toast('Lengkapi nama dan kategori.', 'warning'); return; }

            const btn = document.getElementById('btn-save-proj');
            btn.disabled = true;
            btn.textContent = 'Menyimpan...';

            await Store.add(Store.KEYS.PROJECTS, {
                nama_proyek: name, tahun_anggaran: year,
                status: 'Berjalan', progress: 0, kategori: cat,
                nilai_kontrak: val, lokasi: loc,
                kontraktor: kontraktor, konsultan: konsultan
            });
            await Store.logActivity('Tambah Proyek', `Menambahkan proyek: ${name}`);
            Components.closeModal();
            Components.toast('Proyek berhasil ditambahkan.', 'success');
            await this.render();
        });
    },

    async showEdit(id) {
        const p = await Store.getById(Store.KEYS.PROJECTS, id);
        if (!p) return;
        const body = `
            <form>
                <div class="form-group"><label class="form-label">Nama Proyek</label><input type="text" class="form-input" id="edit-proj-name" value="${Utils.escapeHtml(p.nama_proyek)}"></div>
                <div class="form-group"><label class="form-label">Status</label>
                    <select class="form-select" id="edit-proj-status">
                        <option value="Berjalan" ${p.status === 'Berjalan' ? 'selected' : ''}>Berjalan</option>
                        <option value="Selesai" ${p.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
                        <option value="Tertunda" ${p.status === 'Tertunda' ? 'selected' : ''}>Tertunda</option>
                    </select>
                </div>
                <div class="form-group"><label class="form-label">Progress (%)</label><input type="number" class="form-input" id="edit-proj-prog" value="${p.progress}" min="0" max="100"></div>
                <div class="form-group"><label class="form-label">Lokasi</label><input type="text" class="form-input" id="edit-proj-loc" value="${Utils.escapeHtml(p.lokasi || '')}"></div>
                <div class="form-group"><label class="form-label">Kontraktor Pelaksana</label><input type="text" class="form-input" id="edit-proj-kontraktor" value="${Utils.escapeHtml(p.kontraktor || '')}"></div>
                <div class="form-group"><label class="form-label">Konsultan Pengawas</label><input type="text" class="form-input" id="edit-proj-konsultan" value="${Utils.escapeHtml(p.konsultan || '')}"></div>
            </form>
        `;
        const footer = `<button class="btn btn-secondary" onclick="Components.closeModal()">Batal</button><button class="btn btn-primary" id="btn-update-proj">Perbarui</button>`;
        Components.modal('Edit Proyek', body, footer);

        document.getElementById('btn-update-proj').addEventListener('click', async () => {
            const btn = document.getElementById('btn-update-proj');
            btn.disabled = true;
            btn.textContent = 'Memperbarui...';

            await Store.update(Store.KEYS.PROJECTS, id, {
                nama_proyek: document.getElementById('edit-proj-name').value.trim(),
                status: document.getElementById('edit-proj-status').value,
                progress: parseInt(document.getElementById('edit-proj-prog').value) || 0,
                lokasi: document.getElementById('edit-proj-loc').value.trim(),
                kontraktor: document.getElementById('edit-proj-kontraktor').value.trim(),
                konsultan: document.getElementById('edit-proj-konsultan').value.trim(),
                last_updated: new Date().toISOString()
            });
            await Store.logActivity('Edit Proyek', `Memperbarui proyek: ${p.nama_proyek}`);
            Components.closeModal();
            Components.toast('Proyek berhasil diperbarui.', 'success');
            await this.render();
        });
    },

    deleteProj(id) {
        Components.confirm('Hapus Proyek', 'Proyek dan semua dokumen terkait akan dihapus. Lanjutkan?', async () => {
            await Store.remove(Store.KEYS.PROJECTS, id);
            // Supabase ON DELETE CASCADE handles document deletions automatically
            await Store.logActivity('Hapus Proyek', `Menghapus proyek ${id}`);
            Components.toast('Proyek berhasil dihapus.', 'success');
            await this.render();
        });
    }
};
