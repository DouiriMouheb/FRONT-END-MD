import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Modal from '../components/Modal';
import { Search, Paperclip, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { saveBatchEdits } from '../api/batchEditing';

const makeInitial = () => Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  category: ['Option A', 'Option B', 'Option C'][i % 3],
  date: `2025-10-${String(i + 1).padStart(2, '0')}`,
  amount: Math.round(Math.random() * 10000) / 100,
  description: `${['First','Second','Third','Fourth','Fifth'][i % 5]} sample`,
}));

export default function BatchEditing() {
  const [rows, setRows] = useState(() => makeInitial().map(r => ({ ...r, _dirty: false, _dirtyFields: {}, _selected: false, _attachments: [], _expanded: false })));
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const dirtyRows = useMemo(() => rows.filter(r => r._dirty), [rows]);
  const selectedCount = useMemo(() => rows.filter(r => r._selected).length, [rows]);

  function updateField(id, field, value) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value, _dirty: true, _dirtyFields: { ...(r._dirtyFields || {}), [field]: true } } : r));
  }

  function handleAddFiles(id, files) {
    setRows(prev => prev.map(r => {
      if (r.id !== id) return r;
      const existing = r._attachments || [];
      const newFiles = Array.from(files).map((f, idx) => ({ id: `${Date.now()}-${idx}`, file: f }));
      return { ...r, _attachments: [...existing, ...newFiles], _dirty: true, _dirtyFields: { ...(r._dirtyFields || {}), _attachments: true } };
    }));
  }

  function handleRemoveAttachment(rowId, attachId) {
    setRows(prev => prev.map(r => r.id === rowId ? { ...r, _attachments: (r._attachments || []).filter(a => a.id !== attachId), _dirty: true } : r));
  }

  function handleDownloadAttachment(rowId, attachId) {
    const row = rows.find(r => r.id === rowId);
    if (!row) return;
    const attach = (row._attachments || []).find(a => a.id === attachId);
    if (!attach || !attach.file) return;
    const url = URL.createObjectURL(attach.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = attach.file.name || 'download';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function toggleSelect(id) { setRows(prev => prev.map(r => r.id === id ? { ...r, _selected: !r._selected } : r)); }
  function selectAllOnPage(checked, visibleIds) { setRows(prev => prev.map(r => visibleIds.includes(r.id) ? { ...r, _selected: checked } : r)); }
  function toggleExpand(id) { setRows(prev => prev.map(r => r.id === id ? { ...r, _expanded: !r._expanded } : r)); }

  const filteredRows = useMemo(() => {
    const q = (searchQuery || '').toString().trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r => [r.name, r.category, r.date, String(r.amount), r.description].some(v => (v || '').toString().toLowerCase().includes(q)));
  }, [rows, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(1); }, [filteredRows.length, pageSize, totalPages]);
  const visibleRows = useMemo(() => { const start = (currentPage - 1) * pageSize; return filteredRows.slice(start, start + pageSize); }, [filteredRows, currentPage, pageSize]);

  // Detect small / mobile screens and show a friendly message instead of the full table.
  // Use the same breakpoint as MainLayout (window.innerWidth < 768) so sidebar behaviour stays consistent.
  useEffect(() => {
    const checkIsMobile = () => {
      if (typeof window === 'undefined') return setIsMobile(false);
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  async function handleSave() {
    if (dirtyRows.length === 0) { toast('No changes to save.'); return; }
    setSaving(true);
    try {
      const hasFiles = dirtyRows.some(r => (r._attachments || []).length > 0);
      if (hasFiles && typeof FormData !== 'undefined') {
        const form = new FormData();
        form.append('items', JSON.stringify(dirtyRows.map(({ _dirty, _attachments, ...rest }) => rest)));
        dirtyRows.forEach(r => { (r._attachments || []).forEach((a) => { form.append(`files[${r.id}][]`, a.file, a.file.name); }); });
        await saveBatchEdits(form);
      } else {
        const payload = dirtyRows.map(({ _dirty, _attachments, ...rest }) => rest);
        await saveBatchEdits(payload);
      }
      setRows(prev => prev.map(r => r._dirty ? { ...r, _dirty: false, _dirtyFields: {} } : r));
      toast.success('Changes saved');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save changes');
    } finally { setSaving(false); }
  }

  function deleteSelected() { setShowDeleteModal(true); }
  function confirmDelete() { const toDelete = rows.filter(r => r._selected); setRows(prev => prev.filter(r => !r._selected)); setShowDeleteModal(false); toast.success(`${toDelete.length} row(s) deleted`); }

  // When on small screens, show a short message advising to use a larger device
  if (isMobile) {
    return (
      <div className="p-6 flex items-center justify-center h-full" style={{ minHeight: '200px' }}>
        <div className="max-w-sm text-center px-4">
          <h2 className="text-lg font-semibold mb-2">Batch editing not available on small screens</h2>
          <p className="text-sm text-muted-foreground mb-4">This page is not optimized for mobile devices yet. Please open this tool on a tablet or desktop for the best experience.</p>
          <div className="text-xs text-muted-foreground">Tip: rotate your device or use a larger screen to continue.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" style={{background: 'transparent'}}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-foreground">Batch Editing</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-subtle">{dirtyRows.length} unsaved change(s)</span>
          {selectedCount > 0 && (
            <button onClick={deleteSelected} className="btn btn-destructive">Delete {selectedCount}</button>
          )}
          <button onClick={handleSave} disabled={saving || dirtyRows.length === 0} className={`btn btn-primary ${saving ? 'opacity-80' : ''}`}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative w-full sm:w-1/2">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={16} />
          </div>
          <input type="text" placeholder="Search name, category, date, amount, description..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="input w-full pl-10 pr-3" />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="app-table" aria-label="Batch editing table">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground border-r border-border"><input type="checkbox" checked={visibleRows.length > 0 && visibleRows.every(v => v._selected)} onChange={e => selectAllOnPage(e.target.checked, visibleRows.map(v => v.id))} aria-label="Select all rows" /></th>
              <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground hidden border-r border-border">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground border-r border-border">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground border-r border-border">Category</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground border-r border-border">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground border-r border-border">Amount (€)</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground border-r border-border">Description</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Attachments</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">{searchQuery && searchQuery.trim() ? `No results found for "${searchQuery}"` : 'No rows available.'}</td></tr>
            ) : (
              visibleRows.map(row => (
                <React.Fragment key={row.id}>
                  <tr>
                    <td><input type="checkbox" checked={!!row._selected} onChange={() => toggleSelect(row.id)} aria-label={`Select row ${row.id}`} /></td>
                    <td className="hidden">{row.id}</td>
                    <td><input type="text" value={row.name} onChange={e => updateField(row.id, 'name', e.target.value)} className={`input w-full ${row._dirtyFields?.name ? 'ring-2 ring-yellow-300 bg-yellow-50' : ''}`} aria-label={`Name for ${row.name}`} /></td>
                    <td><select value={row.category} onChange={e => updateField(row.id, 'category', e.target.value)} className={`input w-full ${row._dirtyFields?.category ? 'ring-2 ring-yellow-300 bg-yellow-50' : ''}`} aria-label={`Category for ${row.name}`}><option>Option A</option><option>Option B</option><option>Option C</option></select></td>
                    <td><input type="date" value={row.date} onChange={e => updateField(row.id, 'date', e.target.value)} className={`input w-full ${row._dirtyFields?.date ? 'ring-2 ring-yellow-300 bg-yellow-50' : ''}`} aria-label={`Date for ${row.name}`} /></td>
                    <td><input type="number" step="0.01" value={typeof row.amount === 'number' ? row.amount : ''} onChange={e => updateField(row.id, 'amount', e.target.value === '' ? '' : parseFloat(e.target.value))} className={`input w-full ${row._dirtyFields?.amount ? 'ring-2 ring-yellow-300 bg-yellow-50' : ''}`} aria-label={`Amount in euros for ${row.name}`} /></td>
                    <td><input type="text" value={row.description} onChange={e => updateField(row.id, 'description', e.target.value)} className={`input w-full ${row._dirtyFields?.description ? 'ring-2 ring-yellow-300 bg-yellow-50' : ''}`} aria-label={`Description for ${row.name}`} /></td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => toggleExpand(row.id)} className="p-1 rounded hover:bg-muted/10"><Paperclip size={16} /></button>
                        <button onClick={() => toggleExpand(row.id)} className="p-1 rounded hover:bg-muted/10">{row._expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
                      </div>
                    </td>
                  </tr>

                  {row._expanded && (
                    <tr key={`${row.id}-attachments`} className="bg-muted/5">
                      <td colSpan={8} className="p-3">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <label className="px-3 py-1 bg-background border border-border rounded-md cursor-pointer text-sm text-foreground inline-flex items-center gap-2">Add file<input type="file" multiple className="hidden" onChange={e => handleAddFiles(row.id, e.target.files)} /></label>
                            <div className="flex gap-3 flex-wrap items-center">{
                              (row._attachments || []).map(a => (
                                <div key={a.id} className="relative inline-flex items-center gap-2 bg-muted/5 border border-border rounded-full px-3 py-1 shadow-sm max-w-xs">
                                  <span className="text-sm text-foreground truncate">{(a.file && a.file.name) || a.name || 'file'}</span>
                                  <div className="flex items-center gap-1 ml-2">
                                    <button onClick={() => handleDownloadAttachment(row.id, a.id)} className="p-1 rounded hover:bg-muted/10" aria-label={`Download ${(a.file && a.file.name) || a.name || 'file'}`}>
                                      <Download size={16} />
                                    </button>
                                    <button onClick={() => handleRemoveAttachment(row.id, a.id)} className="p-1 rounded hover:bg-red-600/10" aria-label={`Remove ${(a.file && a.file.name) || a.name || 'file'}`}>
                                      <span className="text-red-600 font-bold">×</span>
                                    </button>
                                  </div>
                                </div>
                              ))
                            }</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}

                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm">Page size:</label>
          <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="px-2 py-1 border border-border rounded">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-3 py-1 border rounded">Prev</button>
          <span className="text-sm">Page {currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">Tip: Edit dates directly in the table and click "Save changes" to persist via the API.</div>

      <Modal open={showDeleteModal} title="Confirm deletion" onBackdropClick={() => setShowDeleteModal(false)} footer={(<><button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded bg-muted text-sidebar-text">Cancel</button><button onClick={confirmDelete} className="px-4 py-2 rounded bg-destructive text-on-destructive">Delete</button></>)}>
        <div className="py-2">Are you sure you want to delete {selectedCount} row{selectedCount > 1 ? 's' : ''}? This action cannot be undone.</div>
      </Modal>
    </div>
  );
}

