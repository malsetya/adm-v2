/* ============================================
   DOCUMENTS PAGE
   ============================================ */

const DocumentsPage = {
    filters: { search: '', type: '', status: '' },

    async render() {
        const main = document.getElementById('main-content');
        main.innerHTML = `<div style="text-align:center; padding: 40px; color: var(--text-tertiary);">Memuat data dokumen...</div>`;

        const docs = await this.getFilteredDocs();
        const projects = await Store.getAll(Store.KEYS.PROJECTS);
        const allDocs = await Store.getAll(Store.KEYS.DOCUMENTS);
        const types = [...new Set(allDocs.map(d => d.tipe_dokumen))];

        main.innerHTML = `
            <div class="page-header">
                <h1>Dokumen</h1>
                <p>Kelola seluruh dokumen proyek infrastruktur</p>
            </div>

            <div class="toolbar">
                <div class="toolbar-group">
                    <div class="search-bar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input type="text" id="doc-search" placeholder="Cari dokumen..." value="${this.filters.search}">
                    </div>
                    <select class="filter-select" id="doc-filter-type">
                        <option value="">Semua Tipe</option>
                        ${types.map(t => `<option value="${t}" ${this.filters.type === t ? 'selected' : ''}>${t}</option>`).join('')}
                    </select>
                    <select class="filter-select" id="doc-filter-status">
                        <option value="">Semua Status</option>
                        <option value="Draft" ${this.filters.status === 'Draft' ? 'selected' : ''}>Draft</option>
                        <option value="Review" ${this.filters.status === 'Review' ? 'selected' : ''}>Review</option>
                        <option value="Signing" ${this.filters.status === 'Signing' ? 'selected' : ''}>Signing</option>
                        <option value="Final" ${this.filters.status === 'Final' ? 'selected' : ''}>Final</option>
                    </select>
                </div>
                ${Store.isAdmin() || Store.getCurrentUser().role === 'staff' ? `
                <button class="btn btn-primary" id="btn-add-doc">${Components.icon('plus', 16)} Tambah Dokumen</button>
                ` : ''}
            </div>

            <div class="data-table-wrapper" style="animation:fadeInUp 0.4s ease">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>No. Surat</th>
                            <th>Judul</th>
                            <th>Tipe</th>
                            <th>Status</th>
                            <th>Versi</th>
                            <th>TTD</th>
                            <th>Diperbarui</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${docs.length === 0 ? `<tr><td colspan="8" class="text-center text-secondary" style="padding:var(--space-8)">Tidak ada dokumen ditemukan</td></tr>` :
                        docs.map(doc => {
                            const proj = projects.find(p => p.id === doc.project_id);
                            const sigProg = Utils.signatureProgress(doc.signatures || []);
                            return `
                            <tr>
                                <td><span style="font-weight:500;font-size:var(--font-size-xs)">${Utils.escapeHtml(doc.nomor_surat)}</span></td>
                                <td>
                                    <div style="font-weight:500">${Utils.escapeHtml(doc.judul)}</div>
                                    <div class="text-xs text-secondary">${proj ? proj.kode_proyek : '-'}</div>
                                </td>
                                <td><span class="badge badge-inactive">${doc.tipe_dokumen}</span></td>
                                <td>${Utils.getStatusBadge(doc.status)}</td>
                                <td class="text-center">v${doc.version}</td>
                                <td>
                                    <div class="progress-bar" style="width:60px"><div class="progress-fill" style="width:${sigProg}%"></div></div>
                                </td>
                                <td class="text-sm text-secondary">${Utils.formatDate(doc.updated_at)}</td>
                                <td>
                                    <div class="action-row">
                                        <button class="action-btn" title="Detail" onclick="DocumentsPage.showDetail('${doc.id}')">${Components.icon('eye', 16)}</button>
                                        ${(Store.isAdmin() || Store.getCurrentUser().role === 'staff') && doc.status !== 'Final' ? `
                                        <button class="action-btn" title="Edit" onclick="DocumentsPage.showEdit('${doc.id}')">${Components.icon('edit', 16)}</button>
                                        ` : ''}
                                        ${Store.isAdmin() && doc.status !== 'Final' ? `
                                        <button class="action-btn danger" title="Hapus" onclick="DocumentsPage.deleteDoc('${doc.id}')">${Components.icon('trash', 16)}</button>
                                        ` : ''}
                                    </div>
                                </td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;

        this.bindEvents();
    },

    async getFilteredDocs() {
        let docs = await Store.getAll(Store.KEYS.DOCUMENTS);
        if (this.filters.search) {
            const q = this.filters.search.toLowerCase();
            docs = docs.filter(d => d.judul.toLowerCase().includes(q) || d.nomor_surat.toLowerCase().includes(q));
        }
        if (this.filters.type) docs = docs.filter(d => d.tipe_dokumen === this.filters.type);
        if (this.filters.status) docs = docs.filter(d => d.status === this.filters.status);
        return docs.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    },

    bindEvents() {
        const search = document.getElementById('doc-search');
        if (search) search.addEventListener('input', Utils.debounce((e) => { this.filters.search = e.target.value; this.render(); }, 300));
        const filterType = document.getElementById('doc-filter-type');
        if (filterType) filterType.addEventListener('change', (e) => { this.filters.type = e.target.value; this.render(); });
        const filterStatus = document.getElementById('doc-filter-status');
        if (filterStatus) filterStatus.addEventListener('change', (e) => { this.filters.status = e.target.value; this.render(); });
        const addBtn = document.getElementById('btn-add-doc');
        if (addBtn) addBtn.addEventListener('click', () => this.showAdd());
    },

    async showDetail(id) {
        const doc = await Store.getById(Store.KEYS.DOCUMENTS, id);
        if (!doc) return;
        const proj = await Store.getById(Store.KEYS.PROJECTS, doc.project_id);
        const sigProg = Utils.signatureProgress(doc.signatures || []);

        const body = `
            <div style="display:flex;flex-direction:column;gap:var(--space-4)">
                <div>
                    <div class="text-xs text-secondary" style="margin-bottom:2px">Nomor Surat</div>
                    <div style="font-weight:600">${Utils.escapeHtml(doc.nomor_surat)}</div>
                </div>
                <div>
                    <div class="text-xs text-secondary" style="margin-bottom:2px">Proyek</div>
                    <div>${proj ? Utils.escapeHtml(proj.nama_proyek) : '-'}</div>
                </div>
                <div style="display:flex;gap:var(--space-4)">
                    <div style="flex:1"><div class="text-xs text-secondary" style="margin-bottom:2px">Tipe</div><span class="badge badge-inactive">${doc.tipe_dokumen}</span></div>
                    <div style="flex:1"><div class="text-xs text-secondary" style="margin-bottom:2px">Status</div>${Utils.getStatusBadge(doc.status)}</div>
                    <div style="flex:1"><div class="text-xs text-secondary" style="margin-bottom:2px">Versi</div>v${doc.version}</div>
                </div>
                <div>
                    <div class="text-xs text-secondary" style="margin-bottom:4px">Progress Tanda Tangan (${sigProg}%)</div>
                    <div class="progress-bar"><div class="progress-fill" style="width:${sigProg}%"></div></div>
                    <div class="doc-sig-list">
                        ${doc.signatures.map(s => `
                            <div class="doc-sig-item ${s.signed ? 'signed' : 'pending'}">
                                <div>
                                    <div style="font-weight:500">${s.jabatan}</div>
                                    <div class="text-xs text-secondary">${s.nama}</div>
                                </div>
                                <div>
                                    ${s.signed ? `<span class="badge badge-final">✓ Ditandatangani</span><div class="text-xs text-secondary" style="margin-top:2px">${Utils.formatDate(s.date)}</div>` : '<span class="badge badge-inactive">Menunggu</span>'}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                </div>
            </div>
        `;
        Components.modal(doc.judul, body, '', { wide: true });
    },

    async showAdd() {
        const projects = await Store.getAll(Store.KEYS.PROJECTS);
        const body = `
            <form id="doc-add-form">
                <div class="form-group">
                    <label class="form-label">Proyek</label>
                    <select class="form-select" id="add-doc-project" required>
                        <option value="">Pilih proyek...</option>
                        ${projects.map(p => `<option value="${p.id}">${p.nama_proyek}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Judul Dokumen</label>
                    <input type="text" class="form-input" id="add-doc-title" required placeholder="Masukkan judul dokumen">
                </div>
                <div class="form-group">
                    <label class="form-label">Tipe Dokumen</label>
                    <select class="form-select" id="add-doc-type" required>
                        <option value="">Pilih tipe...</option>
                        <option value="HPS">HPS</option><option value="Kontrak">Kontrak</option>
                        <option value="Shop Drawing">Shop Drawing</option><option value="RAB">RAB</option>
                        <option value="Laporan">Laporan</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Nomor Surat</label>
                    <input type="text" class="form-input" id="add-doc-number" required placeholder="contoh: HPS/SPAM/2026/001">
                </div>
            </form>
        `;
        const footer = `<button class="btn btn-secondary" onclick="Components.closeModal()">Batal</button><button class="btn btn-primary" id="btn-save-doc">Simpan</button>`;
        Components.modal('Tambah Dokumen Baru', body, footer);

        document.getElementById('btn-save-doc').addEventListener('click', async () => {
            const projectId = document.getElementById('add-doc-project').value;
            const title = document.getElementById('add-doc-title').value.trim();
            const type = document.getElementById('add-doc-type').value;
            const number = document.getElementById('add-doc-number').value.trim();
            if (!projectId || !title || !type || !number) { Components.toast('Lengkapi semua field.', 'warning'); return; }

            const btn = document.getElementById('btn-save-doc');
            btn.disabled = true;
            btn.textContent = 'Menyimpan...';

            await Store.add(Store.KEYS.DOCUMENTS, {
                project_id: projectId, tipe_dokumen: type,
                nomor_surat: number, status: 'Draft', judul: title,
                version: 1,
                signatures: [
                    { jabatan: 'Kasubag TU', nama: '-', signed: false, date: null },
                    { jabatan: 'Kabid Cipta Karya', nama: '-', signed: false, date: null },
                    { jabatan: 'Kepala Dinas', nama: '-', signed: false, date: null },
                ]
            });
            await Store.logActivity('Tambah Dokumen', `Menambahkan dokumen: ${title}`);
            Components.closeModal();
            Components.toast('Dokumen berhasil ditambahkan.', 'success');
            await this.render();
        });
    },

    async showEdit(id) {
        const doc = await Store.getById(Store.KEYS.DOCUMENTS, id);
        if (!doc) return;
        const body = `
            <form id="doc-edit-form">
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <select class="form-select" id="edit-doc-status">
                        <option value="Draft" ${doc.status === 'Draft' ? 'selected' : ''}>Draft</option>
                        <option value="Review" ${doc.status === 'Review' ? 'selected' : ''}>Review</option>
                        <option value="Signing" ${doc.status === 'Signing' ? 'selected' : ''}>Signing</option>
                        <option value="Final" ${doc.status === 'Final' ? 'selected' : ''}>Final</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Judul</label>
                    <input type="text" class="form-input" id="edit-doc-title" value="${Utils.escapeHtml(doc.judul)}">
                </div>
            </form>
        `;
        const footer = `<button class="btn btn-secondary" onclick="Components.closeModal()">Batal</button><button class="btn btn-primary" id="btn-update-doc">Perbarui</button>`;
        Components.modal('Edit Dokumen', body, footer);

        document.getElementById('btn-update-doc').addEventListener('click', async () => {
            const status = document.getElementById('edit-doc-status').value;
            const title = document.getElementById('edit-doc-title').value.trim();
            
            const btn = document.getElementById('btn-update-doc');
            btn.disabled = true;
            btn.textContent = 'Memperbarui...';

            await Store.update(Store.KEYS.DOCUMENTS, id, { status, judul: title, updated_at: new Date().toISOString() });
            await Store.logActivity('Edit Status', `Mengubah status dokumen ${doc.nomor_surat} ke ${status}`);
            Components.closeModal();
            Components.toast('Dokumen berhasil diperbarui.', 'success');
            await this.render();
        });
    },

    deleteDoc(id) {
        Components.confirm('Hapus Dokumen', 'Apakah Anda yakin ingin menghapus dokumen ini?', async () => {
            await Store.remove(Store.KEYS.DOCUMENTS, id);
            await Store.logActivity('Hapus Dokumen', `Menghapus dokumen ${id}`);
            Components.toast('Dokumen berhasil dihapus.', 'success');
            await this.render();
        });
    }
};
