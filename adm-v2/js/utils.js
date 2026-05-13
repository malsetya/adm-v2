/* ============================================
   UTILS — Helper Functions
   ============================================ */

const Utils = {
    generateId(prefix = 'ID') {
        return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
    },

    now() { return new Date().toISOString(); },
    today() { return new Date().toISOString().split('T')[0]; },

    formatDate(isoStr) {
        if (!isoStr) return '-';
        const d = new Date(isoStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    },

    formatDateTime(isoStr) {
        if (!isoStr) return '-';
        const d = new Date(isoStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },

    formatCurrency(num) {
        if (!num) return 'Rp 0';
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
    },

    timeAgo(isoStr) {
        const now = new Date();
        const past = new Date(isoStr);
        const diff = Math.floor((now - past) / 1000);
        if (diff < 60) return 'Baru saja';
        if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
        if (diff < 2592000) return `${Math.floor(diff / 86400)} hari lalu`;
        return Utils.formatDate(isoStr);
    },

    getRoleLabel(role) {
        const map = { admin: 'Administrator', staff: 'Staf Operasional', viewer: 'Pimpinan' };
        return map[role] || role;
    },

    getStatusBadge(status) {
        const map = {
            'Draft': 'badge-draft',
            'Review': 'badge-review',
            'Signing': 'badge-signing',
            'Final': 'badge-final',
        };
        return `<span class="badge ${map[status] || 'badge-draft'}"><span class="badge-dot"></span>${status}</span>`;
    },

    getProjectStatusBadge(status) {
        const map = {
            'Berjalan': 'badge-signing',
            'Selesai': 'badge-final',
            'Tertunda': 'badge-draft',
        };
        return `<span class="badge ${map[status] || 'badge-draft'}"><span class="badge-dot"></span>${status}</span>`;
    },

    getCategoryColor(cat) {
        const map = {
            'SPAM': '#0284c7',
            'Sanitasi': '#059669',
            'Drainase': '#7c3aed',
            'Gedung': '#d97706',
        };
        return map[cat] || '#64748b';
    },

    getActivityColor(action) {
        const map = {
            'Login': '#0284c7',
            'Logout': '#64748b',
            'Upload': '#059669',
            'Download': '#7c3aed',
            'Edit Status': '#d97706',
            'Tanda Tangan': '#0284c7',
            'Tambah Proyek': '#059669',
            'Tambah Pengguna': '#0284c7',
            'Backup': '#7c3aed',
            'Restore': '#d97706',
        };
        return map[action] || '#64748b';
    },

    debounce(fn, ms = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), ms);
        };
    },

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    getGreeting() {
        const h = new Date().getHours();
        if (h < 11) return 'Selamat Pagi';
        if (h < 15) return 'Selamat Siang';
        if (h < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    },

    getCurrentDateFormatted() {
        const now = new Date();
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return {
            day: now.getDate(),
            dayName: days[now.getDay()],
            month: months[now.getMonth()],
            year: now.getFullYear(),
            full: `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
        };
    },

    signatureProgress(signatures) {
        if (!signatures || !signatures.length) return 0;
        const signed = signatures.filter(s => s.signed).length;
        return Math.round((signed / signatures.length) * 100);
    },

    exportToCSV(filename, data) {
        if (!data || !data.length) {
            alert('Tidak ada data untuk diekspor.');
            return;
        }

        const headers = Object.keys(data[0]);
        
        const escapeCSV = (val) => {
            if (val === null || val === undefined) return '""';
            let str = String(val);
            str = str.replace(/"/g, '""');
            if (str.search(/("|,|\n)/g) >= 0) {
                str = `"${str}"`;
            }
            return str;
        };

        const csvContent = [
            headers.map(escapeCSV).join(','),
            ...data.map(row => headers.map(header => escapeCSV(row[header])).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
};
