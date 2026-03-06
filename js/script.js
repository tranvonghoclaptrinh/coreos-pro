
        const MAX_STORAGE = 100 * 1024 * 1024;

        class CoreOS {
            constructor() {
                const saved = localStorage.getItem('coreos_pro_v4');
                this.items = saved ? JSON.parse(saved) : [
                    { id: '1', name: 'Thư mục tài liệu', type: 'folder', pid: null, content: '' },
                    { id: '2', name: 'Ghi chú.txt', type: 'file', pid: null, content: 'Nội dung mẫu...' }
                ];
                this.currentPid = null;
                this.selectedId = null;
                this.activeNoteId = null;
                this.draggedId = null;
                this.isEditing = false;
                this.deleteTargetId = null;
                this.init();
            }

            init() { this.renderAll(); }

            save() { 
                localStorage.setItem('coreos_pro_v4', JSON.stringify(this.items)); 
                this.updateStorage();
            }

            showToast(msg) {
                const t = document.getElementById('toast');
                t.innerText = msg; t.style.display = 'block';
                setTimeout(() => t.style.display = 'none', 3000);
            }
updateStorage() {

    let size = 0;

    this.items.forEach(i => {
        size += i.name.length;
        if (i.content) size += new Blob([i.content]).size;
    });

    const percent = Math.min((size / MAX_STORAGE) * 100, 100);
    const usedMB = (size / (1024 * 1024)).toFixed(2);

    /* SIDEBAR STORAGE */

    const sidebarText = document.getElementById('storage-text');
    const sidebarBar = document.getElementById('storage-bar');

    if (sidebarText)
        sidebarText.innerText = `${usedMB} / 100 MB`;

    if (sidebarBar)
        sidebarBar.style.width = percent + '%';


    /* DASHBOARD STORAGE CIRCLE */

    const circular = document.getElementById('storageCircular');
    const percentText = document.getElementById('storagePercentText');
    const detailText = document.getElementById('storageDetailText');

    if (circular) {
        circular.style.background =
            `conic-gradient(var(--primary-color) ${percent * 3.6}deg, #f1f5f9 0deg)`;
    }

    if (percentText)
        percentText.innerText = Math.round(percent) + '%';

    if (detailText)
        detailText.innerText = `${usedMB} MB / 100.00 MB`;

}

            async handleUpload(input) {
                const files = Array.from(input.files);
                if (files.length === 0) return;
                const progressModal = document.getElementById('uploadProgress');
                const progressBar = document.getElementById('uploadBar');
                const progressPercent = document.getElementById('uploadPercent');
                const progressDetail = document.getElementById('uploadDetail');
                progressModal.style.display = 'block';
                
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const ext = file.name.split('.').pop().toLowerCase();
                    let content = "";
                    const percent = Math.round(((i + 1) / files.length) * 100);
                    progressBar.style.width = percent + '%';
                    progressPercent.innerText = percent + '%';
                    progressDetail.innerText = `Đang đọc: ${file.name}`;
                    try {
                        if (ext === 'txt') {
                            content = await file.text();
                        } else if (ext === 'docx') {
                            const arrayBuffer = await file.arrayBuffer();
                            const result = await mammoth.extractRawText({ arrayBuffer });
                            content = result.value || "[Tài liệu không có văn bản]";
                        }
                        this.items.push({ id: 'item_' + Date.now() + i, name: file.name, type: 'file', pid: this.currentPid, content: content });
                    } catch (e) { this.showToast(`Lỗi khi đọc file ${file.name}`); }
                }
                setTimeout(() => { progressModal.style.display = 'none'; this.save(); this.renderAll(); }, 500);
                input.value = '';
            }

            renderAll() { this.renderGrid(); this.renderNoteList(); this.updateStorage(); lucide.createIcons(); }

            renderGrid() {
                const grid = document.getElementById('fileGrid');
                if (!grid) return; grid.innerHTML = '';
                if (this.currentPid !== null) {
                    const back = this.createFileElement({ id: 'back', name: '.. Quay lại', type: 'back' });
                    grid.appendChild(back);
                }
                this.items.filter(i => i.pid === this.currentPid).forEach(item => { grid.appendChild(this.createFileElement(item)); });
                lucide.createIcons();
            }

            createFileElement(item) {
                const div = document.createElement('div');
                div.className = `file-item ${this.selectedId === item.id ? 'selected' : ''}`;
                if (item.type !== 'back') {
                    div.draggable = true;
                    div.ondragstart = (e) => { this.draggedId = item.id; e.dataTransfer.setData('text/plain', item.id); };
                    div.ondragend = () => this.draggedId = null;
                }
                if (item.type === 'folder' || item.type === 'back') {
                    div.ondragover = (e) => { e.preventDefault(); if (this.draggedId !== item.id) div.classList.add('drag-over'); };
                    div.ondragleave = () => div.classList.remove('drag-over');
                    div.ondrop = (e) => { e.preventDefault(); const id = e.dataTransfer.getData('text/plain'); const targetPid = item.type === 'back' ? this.getParentPid() : item.id; this.moveItem(id, targetPid); };
                }
                const isDoc = item.name.endsWith('.docx');
                const icon = item.type === 'folder' ? 'folder' : (item.type === 'back' ? 'corner-left-up' : 'file-text');
                const iconClass = item.type === 'folder' ? 'file-folder' : (isDoc ? 'file-office' : 'file-doc');
                div.innerHTML = `<i data-lucide="${icon}" class="${iconClass}"></i><span class="file-name">${item.name}</span>`;
                div.onclick = () => { if (item.type === 'back') return; this.selectedId = item.id; this.renderGrid(); };
                div.ondblclick = () => {
                    if (item.type === 'folder') { this.currentPid = item.id; this.selectedId = null; this.renderGrid(); }
                    else if (item.type === 'back') { this.currentPid = this.getParentPid(); this.renderGrid(); }
                    else { this.openNote(item.id); }
                };
                return div;
            }

            getParentPid() { const current = this.items.find(i => i.id === this.currentPid); return current ? current.pid : null; }
            moveItem(itemId, targetPid) {
                if (itemId === targetPid) return;
                const item = this.items.find(i => i.id === itemId);
                if (item) { item.pid = targetPid; this.save(); this.renderAll(); }
            }

            handleTrashDragOver(e) { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }
            handleTrashDragLeave(e) { e.currentTarget.classList.remove('drag-over'); }
            handleTrashDrop(e) {
                e.preventDefault(); const id = e.dataTransfer.getData('text/plain');
                if (id) { this.deleteTargetId = id; const item = this.items.find(i => i.id === id); document.getElementById('deleteMsg').innerText = `Xác nhận xóa tệp "${item.name}"?`; this.confirmDelete(); }
                e.currentTarget.classList.remove('drag-over');
            }

            renderNoteList() {
                const list = document.getElementById('noteList');
                if (!list) return; list.innerHTML = '';
                this.items.filter(i => i.type === 'file').forEach(note => {
                    const div = document.createElement('div');
                    div.className = `note-card ${this.activeNoteId === note.id ? 'active' : ''}`;
                    div.innerHTML = `<div class="note-card-title">${note.name}</div><div class="note-card-preview">${note.content || 'Trống...'}</div>`;
                    div.onclick = () => this.openNote(note.id);
                    list.appendChild(div);
                });
            }

            openNote(id) {
                this.activeNoteId = id;
                const note = this.items.find(i => i.id === id);
                if (note) {
                    navigate('notes');
                    document.getElementById('editorPlaceholder').style.display = 'none';
                    document.getElementById('editor').style.display = 'block';
                    document.getElementById('editTitle').value = note.name;
                    document.getElementById('editContent').value = note.content;
                    document.getElementById('docxNote').style.display = note.name.endsWith('.docx') ? 'block' : 'none';
                    this.isEditing = false;
                    this.updateEditorState();
                    this.renderNoteList();
                }
            }

            toggleEdit() { this.isEditing = !this.isEditing; this.updateEditorState(); }
            updateEditorState() {
                const title = document.getElementById('editTitle');
                const content = document.getElementById('editContent');
                title.readOnly = !this.isEditing; content.readOnly = !this.isEditing;
                document.getElementById('btnEdit').innerHTML = this.isEditing ? '<i data-lucide="x-circle"></i> Hủy sửa' : '<i data-lucide="pencil"></i> Chỉnh sửa';
                document.getElementById('btnSave').style.display = this.isEditing ? 'flex' : 'none';
                lucide.createIcons();
            }

            saveNote() {
                const note = this.items.find(i => i.id === this.activeNoteId);
                if (note) {
                    note.name = document.getElementById('editTitle').value;
                    note.content = document.getElementById('editContent').value;
                    this.isEditing = false; this.updateEditorState();
                    this.save(); this.renderAll(); this.showToast("Đã lưu tài liệu!");
                }
            }

            confirmDeleteSelected() {
                if (!this.selectedId) return;
                this.deleteTargetId = this.selectedId;
                const item = this.items.find(i => i.id === this.selectedId);
                document.getElementById('deleteMsg').innerText = `Xác nhận xóa tệp "${item.name}"?`;
                this.confirmDelete();
            }

            confirmDeleteActive() {
                this.deleteTargetId = this.activeNoteId;
                const item = this.items.find(i => i.id === this.activeNoteId);
                document.getElementById('deleteMsg').innerText = `Xác nhận xóa tệp "${item.name}"?`;
                this.confirmDelete();
            }

            confirmDelete() { document.getElementById('deleteModal').classList.add('active'); }
            closeDeleteModal() { document.getElementById('deleteModal').classList.remove('active'); }
            executeDelete() {
                if (!this.deleteTargetId) return;
                const deleteRecursive = (id) => {
                    this.items.filter(i => i.pid === id).forEach(c => deleteRecursive(c.id));
                    this.items = this.items.filter(i => i.id !== id);
                };
                deleteRecursive(this.deleteTargetId);
                if (this.deleteTargetId === this.activeNoteId) {
                    this.activeNoteId = null;
                    document.getElementById('editor').style.display = 'none';
                    document.getElementById('editorPlaceholder').style.display = 'flex';
                }
                this.selectedId = null;
                this.closeDeleteModal();
                this.save(); this.renderAll();
            }

            openModal(type) { this.modalType = type; document.getElementById('modal').classList.add('active'); }
            closeModal() { document.getElementById('modal').classList.remove('active'); }
            confirmModal() {
                const val = document.getElementById('modalInput').value;
                if (!val) return;
                this.items.push({ id: 'item_' + Date.now(), name: val + (this.modalType === 'file' ? '.txt' : ''), type: this.modalType, pid: this.currentPid, content: '' });
                this.save(); this.closeModal(); this.renderAll();
                document.getElementById('modalInput').value = '';
            }
        }

        const app = new CoreOS();
        function navigate(id) {
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.sidebar nav ul li a').forEach(a => a.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            document.getElementById('nav-' + id).classList.add('active');
            lucide.createIcons();
        }
function shareWebsite(){

const url = window.location.href;

navigator.clipboard.writeText(url);

if(window.app){
app.showToast("Đã sao chép link để chia sẻ!");
}else{
alert("Đã sao chép link: " + url);
}

}