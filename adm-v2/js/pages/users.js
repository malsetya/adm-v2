/* ============================================
   USERS PAGE
   ============================================ */

const UsersPage = {
    async render() {
        const main = document.getElementById('main-content');
        const currentUser = Store.getCurrentUser();

        if (currentUser.role !== 'admin') {
            main.innerHTML = `
                <div class="page-header"><h1>Pengguna</h1></div>
                <div class="empty-state">
                    <h3>Akses Ditolak</h3>
                    <p>Halaman ini hanya dapat diakses oleh Administrator.</p>
                </div>
            `;
            return;
        }

        main.innerHTML = `<div style="text-align:center; padding: 40px; color: var(--text-tertiary);">Memuat data pengguna...</div>`;
        const users = await Store.getAll(Store.KEYS.USERS);

        main.innerHTML = `
            <div class="page-header">
                <h1>Pengguna</h1>
                <p>Kelola akun pengguna dan hak akses sistem</p>
            </div>

            <div class="toolbar">
                <div class="toolbar-group">
                    <span class="text-sm text-secondary">${users.length} pengguna terdaftar</span>
                </div>
                <button class="btn btn-primary" id="btn-add-user">${Components.icon('plus', 16)} Tambah Pengguna</button>
            </div>

            <div class="user-grid stagger">
                ${users.map(u => `
                    <div class="user-card">
                        <div class="user-card-avatar">${u.avatar}</div>
                        <div class="user-card-name">${Utils.escapeHtml(u.nama.split(',')[0])}</div>
                        <div class="user-card-email">${Utils.escapeHtml(u.email)}</div>
                        <div style="margin-bottom:var(--space-2)">
                            <span class="badge ${u.role === 'admin' ? 'badge-signing' : u.role === 'staff' ? 'badge-review' : 'badge-final'}">${Utils.getRoleLabel(u.role)}</span>
                        </div>
                        <span class="badge ${u.status === 'aktif' ? 'badge-active' : 'badge-inactive'}"><span class="badge-dot"></span>${u.status === 'aktif' ? 'Aktif' : 'Nonaktif'}</span>
                        <div class="user-card-actions">
                            <button class="btn btn-ghost btn-sm" onclick="UsersPage.showEdit('${u.id}')">${Components.icon('edit', 14)} Edit</button>
                            ${u.id !== currentUser.id ? `<button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="UsersPage.toggleStatus('${u.id}')">${u.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}</button>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        document.getElementById('btn-add-user').addEventListener('click', () => this.showAdd());
    },

    showAdd() {
        const body = `
            <form>
                <div class="form-group"><label class="form-label">Nama Lengkap</label><input type="text" class="form-input" id="add-user-name" required placeholder="Nama lengkap dengan gelar"></div>
                <div class="form-group"><label class="form-label">Username</label><input type="text" class="form-input" id="add-user-uname" required placeholder="Username login"></div>
                <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="add-user-email" placeholder="email@ciptakarya.go.id"></div>
                <div class="form-group"><label class="form-label">Password</label><input type="text" class="form-input" id="add-user-pass" required placeholder="Password awal"></div>
                <div class="form-group"><label class="form-label">Role</label>
                    <select class="form-select" id="add-user-role">
                        <option value="staff">Staf Operasional</option>
                        <option value="viewer">Pimpinan</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>
            </form>
        `;
        const footer = `<button class="btn btn-secondary" onclick="Components.closeModal()">Batal</button><button class="btn btn-primary" id="btn-save-user">Simpan</button>`;
        Components.modal('Tambah Pengguna Baru', body, footer);

        document.getElementById('btn-save-user').addEventListener('click', async () => {
            const nama = document.getElementById('add-user-name').value.trim();
            const username = document.getElementById('add-user-uname').value.trim();
            const email = document.getElementById('add-user-email').value.trim();
            const password = document.getElementById('add-user-pass').value.trim();
            const role = document.getElementById('add-user-role').value;

            if (!nama || !username || !password) { Components.toast('Lengkapi field wajib.', 'warning'); return; }

            const allUsers = await Store.getAll(Store.KEYS.USERS);
            const existing = allUsers.find(u => u.username === username);
            if (existing) { Components.toast('Username sudah digunakan.', 'error'); return; }

            const btn = document.getElementById('btn-save-user');
            btn.disabled = true;
            btn.textContent = 'Menyimpan...';

            const initials = nama.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
            await Store.add(Store.KEYS.USERS, {
                username, password, nama, role,
                status: 'Aktif', avatar: initials, email, kontak: ''
            });
            await Store.logActivity('Tambah Pengguna', `Menambahkan pengguna: ${nama}`);
            Components.closeModal();
            Components.toast('Pengguna berhasil ditambahkan.', 'success');
            await this.render();
        });
    },

    async showEdit(id) {
        const u = await Store.getById(Store.KEYS.USERS, id);
        if (!u) return;
        const body = `
            <form>
                <div class="form-group"><label class="form-label">Nama</label><input type="text" class="form-input" id="edit-user-name" value="${Utils.escapeHtml(u.nama)}"></div>
                <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="edit-user-email" value="${Utils.escapeHtml(u.email)}"></div>
                <div class="form-group"><label class="form-label">Role</label>
                    <select class="form-select" id="edit-user-role">
                        <option value="staff" ${u.role==='staff'?'selected':''}>Staf Operasional</option>
                        <option value="viewer" ${u.role==='viewer'?'selected':''}>Pimpinan</option>
                        <option value="admin" ${u.role==='admin'?'selected':''}>Administrator</option>
                    </select>
                </div>
                <div class="form-group"><label class="form-label">Password Baru (kosongkan jika tidak diubah)</label><input type="text" class="form-input" id="edit-user-pass" placeholder="Password baru"></div>
            </form>
        `;
        const footer = `<button class="btn btn-secondary" onclick="Components.closeModal()">Batal</button><button class="btn btn-primary" id="btn-update-user">Perbarui</button>`;
        Components.modal('Edit Pengguna', body, footer);

        document.getElementById('btn-update-user').addEventListener('click', async () => {
            const btn = document.getElementById('btn-update-user');
            btn.disabled = true;
            btn.textContent = 'Memperbarui...';

            const updates = {
                nama: document.getElementById('edit-user-name').value.trim(),
                email: document.getElementById('edit-user-email').value.trim(),
                role: document.getElementById('edit-user-role').value,
            };
            const newPass = document.getElementById('edit-user-pass').value.trim();
            if (newPass) updates.password = newPass;
            updates.avatar = updates.nama.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

            await Store.update(Store.KEYS.USERS, id, updates);
            await Store.logActivity('Edit Pengguna', `Memperbarui data pengguna: ${updates.nama}`);
            Components.closeModal();
            Components.toast('Pengguna berhasil diperbarui.', 'success');
            await this.render();
        });
    },

    async toggleStatus(id) {
        const u = await Store.getById(Store.KEYS.USERS, id);
        if (!u) return;
        const newStatus = u.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
        Components.confirm(
            `${newStatus === 'Aktif' ? 'Aktifkan' : 'Nonaktifkan'} Pengguna`,
            `Apakah Anda yakin ingin ${newStatus === 'Aktif' ? 'mengaktifkan' : 'menonaktifkan'} akun ${u.nama}?`,
            async () => {
                await Store.update(Store.KEYS.USERS, id, { status: newStatus });
                await Store.logActivity('Ubah Status Pengguna', `${u.nama} di${newStatus === 'Aktif' ? 'aktifkan' : 'nonaktifkan'}`);
                Components.toast(`Pengguna berhasil di${newStatus === 'Aktif' ? 'aktifkan' : 'nonaktifkan'}.`, 'success');
                await this.render();
            }
        );
    }
};
