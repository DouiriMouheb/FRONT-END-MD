import React, { useState, useMemo } from "react";
import { toast } from 'react-hot-toast';
import Modal from '../components/Modal';
import { Search, Paperclip, ChevronDown, ChevronUp, FileText, FileSpreadsheet, File, Image, Download } from 'lucide-react';
import { saveBatchEdits } from '../api/batchEditing';

// Small sample dataset demonstrating the requested fields:
// - category: dropdown with 3 options
// - date: single date field
// - amount: money in euros
// - description: free text
const initialData = [
  { id: 1, name: 'Item 1', category: 'Option A', date: '2025-10-01', amount: 125.50, description: 'First sample' },
  { id: 2, name: 'Item 2', category: 'Option B', date: '2025-10-02', amount: 49.99, description: 'Second sample' },
  { id: 3, name: 'Item 3', category: 'Option C', date: '2025-10-03', amount: 0.00, description: 'Third sample' },
  { id: 4, name: 'Item 4', category: 'Option A', date: '2025-10-04', amount: 230.00, description: 'Fourth sample' },
  { id: 5, name: 'Item 5', category: 'Option B', date: '2025-10-05', amount: 15.75, description: 'Fifth sample' },
  { id: 6, name: 'Item 6', category: 'Option C', date: '2025-10-06', amount: 9.99, description: 'Sixth sample' },
  { id: 7, name: 'Item 7', category: 'Option A', date: '2025-10-07', amount: 320.10, description: 'Seventh sample' },
  { id: 8, name: 'Item 8', category: 'Option B', date: '2025-10-08', amount: 78.45, description: 'Eighth sample' },
  { id: 9, name: 'Item 9', category: 'Option C', date: '2025-10-09', amount: 1500.00, description: 'Ninth sample' },
  { id: 10, name: 'Item 10', category: 'Option A', date: '2025-10-10', amount: 0.99, description: 'Tenth sample' },
  { id: 11, name: 'Item 11', category: 'Option B', date: '2025-10-11', amount: 45.00, description: 'Eleventh sample' },
  { id: 12, name: 'Item 12', category: 'Option C', date: '2025-10-12', amount: 220.20, description: 'Twelfth sample' },
  { id: 13, name: 'Item 13', category: 'Option A', date: '2025-10-13', amount: 13.37, description: 'Thirteenth sample' },
  { id: 14, name: 'Item 14', category: 'Option B', date: '2025-10-14', amount: 600.00, description: 'Fourteenth sample' },
  { id: 15, name: 'Item 15', category: 'Option C', date: '2025-10-15', amount: 7.25, description: 'Fifteenth sample' },
];

export default function BatchEditing() {
  const [rows, setRows] = useState(() => initialData.map(r => ({ ...r, _dirty: false, _dirtyFields: {}, _selected: false })));
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const dirtyRows = useMemo(() => rows.filter(r => r._dirty), [rows]);

  function handleDateChange(id, field, value) {
    setRows(prev => prev.map(r => {
      if (r.id !== id) return r;
      const prevFields = r._dirtyFields || {};
      return { ...r, [field]: value, _dirty: true, _dirtyFields: { ...prevFields, [field]: true } };
    }));
  }

  // Attachments: add/remove files per-row (kept client-side for now)
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

  function toggleSelect(id) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, _selected: !r._selected } : r));
  }

  // selectAll will operate on the visible page (defined below)

  const selectedCount = useMemo(() => rows.filter(r => r._selected).length, [rows]);

  const filteredRows = useMemo(() => {
    const q = (searchQuery || '').toString().trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r => {
      // search across name, category, date, amount, description
      if (r.name && r.name.toString().toLowerCase().includes(q)) return true;
      if (r.category && r.category.toString().toLowerCase().includes(q)) return true;
      if (r.date && r.date.toString().toLowerCase().includes(q)) return true;
      if (r.amount !== undefined && r.amount !== null && r.amount.toString().toLowerCase().includes(q)) return true;
      if (r.description && r.description.toString().toLowerCase().includes(q)) return true;
      return false;
    });
  }, [rows, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  // Ensure currentPage is valid when filters change
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredRows.length, pageSize, totalPages]);

  const visibleRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  function selectAllOnPage(checked) {
    const visibleIds = visibleRows.map(v => v.id);
    setRows(prev => prev.map(r => visibleIds.includes(r.id) ? { ...r, _selected: checked } : r));
  }

  function toggleExpand(id) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, _expanded: !r._expanded } : r));
  }

  function deleteSelected() {
    // show confirmation modal instead of immediate delete
    setShowDeleteModal(true);
  }

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  function confirmDelete() {
    const toDelete = rows.filter(r => r._selected);
    if (toDelete.length === 0) {
      setShowDeleteModal(false);
      return;
    }
    setRows(prev => prev.filter(r => !r._selected));
    setShowDeleteModal(false);
    toast.success(`${toDelete.length} row(s) deleted`);
  }

  async function handleSave() {
    if (dirtyRows.length === 0) {
      toast('No changes to save.');
      return;
    }
    setSaving(true);
    try {
      // If any dirty row has attachments, send as FormData
      const hasFiles = dirtyRows.some(r => (r._attachments || []).length > 0);
      if (hasFiles && typeof FormData !== 'undefined') {
        const form = new FormData();
        // Send JSON part
        form.append('items', JSON.stringify(dirtyRows.map(({ _dirty, _attachments, ...rest }) => rest)));
        // Append files with keys like files[<rowId>][]
        dirtyRows.forEach(r => {
          (r._attachments || []).forEach((a, i) => {
            form.append(`files[${r.id}][]`, a.file, a.file.name);
          });
        });
        await saveBatchEdits(form);
      } else {
        const payload = dirtyRows.map(({ _dirty, _attachments, ...rest }) => rest);
        await saveBatchEdits(payload);
      }
      // On success, clear dirty flags for saved rows
      setRows(prev => prev.map(r => r._dirty ? { ...r, _dirty: false, _dirtyFields: {} } : r));
      toast.success('Changes saved');
    } catch (err) {
      console.error('Failed to save batch edits', err);
      toast.error('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-blue-900">Batch Editing</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{dirtyRows.length} unsaved change(s)</span>
          {selectedCount > 0 && (
            <button
              onClick={deleteSelected}
              className="px-3 py-2 rounded bg-red-700 text-white hover:bg-red-600 shadow-sm"
            >
              Delete {selectedCount}
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || dirtyRows.length === 0}
            className={`px-4 py-2 rounded-md bg-blue-800 text-white disabled:opacity-50 shadow-sm ${saving ? 'opacity-80' : 'hover:bg-blue-900'}`}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative w-full sm:w-1/2">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search name, category, date, amount, description..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
          />
        </div>
      </div>

      <div className="overflow-auto border border-gray-200 rounded-lg shadow-sm">
  <table className="min-w-full table-auto bg-white border border-gray-200 border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-200">
                <input
                  type="checkbox"
                  checked={visibleRows.length > 0 && visibleRows.every(v => v._selected)}
                  onChange={e => selectAllOnPage(e.target.checked)}
                  aria-label="Select all rows"
                />
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 hidden border-r border-gray-200">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-200">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-200">Category</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-200">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-200">Amount (€)</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-200">Description</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Attachments</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  {searchQuery && searchQuery.trim()
                    ? `No results found for "${searchQuery}"`
                    : 'No rows available.'}
                </td>
              </tr>
            ) : (
              visibleRows.map(row => (
                <React.Fragment key={row.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">
                      <input
                        type="checkbox"
                        checked={!!row._selected}
                        onChange={() => toggleSelect(row.id)}
                        aria-label={`Select row ${row.id}`}
                      />
                    </td>
                    <td className="border border-gray-200 px-4 py-2 hidden">{row.id}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      <input
                        type="text"
                        value={row.name}
                        onChange={e => handleDateChange(row.id, 'name', e.target.value)}
                        className={`w-full bg-white text-gray-800 px-2 py-1 border border-transparent ${row._dirtyFields?.name ? 'ring-2 ring-yellow-300 bg-yellow-50 rounded' : 'rounded'}`}
                        aria-label={`Name for ${row.name}`}
                      />
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <select
                        value={row.category}
                        onChange={e => handleDateChange(row.id, 'category', e.target.value)}
                        className={`w-full bg-white text-gray-800 px-2 py-1 border border-transparent ${row._dirtyFields?.category ? 'ring-2 ring-yellow-300 bg-yellow-50 rounded' : 'rounded'}`}
                        aria-label={`Category for ${row.name}`}
                      >
                        <option>Option A</option>
                        <option>Option B</option>
                        <option>Option C</option>
                      </select>
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <input
                        type="date"
                        value={row.date}
                        onChange={e => handleDateChange(row.id, 'date', e.target.value)}
                        className={`w-full bg-white text-gray-800 px-2 py-1 border border-transparent ${row._dirtyFields?.date ? 'ring-2 ring-yellow-300 bg-yellow-50 rounded' : 'rounded'}`}
                        aria-label={`Date for ${row.name}`}
                      />
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={typeof row.amount === 'number' ? row.amount : ''}
                        onChange={e => handleDateChange(row.id, 'amount', e.target.value === '' ? '' : parseFloat(e.target.value))}
                        className={`w-full bg-white text-gray-800 px-2 py-1 border border-transparent ${row._dirtyFields?.amount ? 'ring-2 ring-yellow-300 bg-yellow-50 rounded' : 'rounded'}`}
                        aria-label={`Amount in euros for ${row.name}`}
                      />
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <input
                        type="text"
                        value={row.description}
                        onChange={e => handleDateChange(row.id, 'description', e.target.value)}
                        className={`w-full bg-white text-gray-800 px-2 py-1 border border-transparent ${row._dirtyFields?.description ? 'ring-2 ring-yellow-300 bg-yellow-50 rounded' : 'rounded'}`}
                        aria-label={`Description for ${row.name}`}
                      />
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => toggleExpand(row.id)} className="p-1 rounded hover:bg-gray-100">
                          <Paperclip size={16} />
                        </button>
                        <button onClick={() => toggleExpand(row.id)} className="p-1 rounded hover:bg-gray-100">
                          {row._expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {row._expanded && (
                    <tr key={`${row.id}-attachments`} className="bg-gray-50">
                      <td colSpan={8} className="p-3">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <label className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-md cursor-pointer text-sm text-blue-900 inline-flex items-center gap-2">
                              Add file
                              <input type="file" multiple className="hidden" onChange={e => handleAddFiles(row.id, e.target.files)} />
                            </label>

                            <div className="flex gap-3 flex-wrap items-center">
                              {(row._attachments || []).map(a => {
                                const file = a.file;
                                const name = (file && file.name) || a.name || 'file';
                                const type = (file && file.type) || '';
                                const isImage = !!type && type.startsWith('image/');
                                const isPDF = type === 'application/pdf' || name.toLowerCase().endsWith('.pdf');
                                const isExcel = ['.xls', '.xlsx', '.csv'].some(ext => name.toLowerCase().endsWith(ext));
                                return (
                                  <div key={a.id} className="relative inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm max-w-xs">
                                    <span className="text-sm text-gray-700 truncate">{name}</span>
                                    <div className="flex items-center gap-1 ml-2">
                                      <button
                                        onClick={() => handleDownloadAttachment(row.id, a.id)}
                                        className="p-1 rounded hover:bg-gray-100"
                                        aria-label={`Download ${name}`}
                                      >
                                        <Download size={16} className="text-gray-600" />
                                      </button>
                                      <button
                                        onClick={() => handleRemoveAttachment(row.id, a.id)}
                                        className="p-1 rounded hover:bg-red-50"
                                        aria-label={`Remove ${name}`}
                                      >
                                        <span className="text-red-600 font-bold">×</span>
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
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

      <div className="mt-3 flex items-center justify-between">
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

      <div className="mt-4 text-sm text-muted-foreground">
        Tip: Edit dates directly in the table and click "Save changes" to persist via the API.
      </div>
      <Modal
        open={showDeleteModal}
        title="Confirm deletion"
        onBackdropClick={() => setShowDeleteModal(false)}
        footer={(
          <>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 rounded bg-muted text-sidebar-text"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded bg-red-600 text-white"
            >
              Delete 
            </button>
          </>
        )}
      >
        <div className="py-2">
          Are you sure you want to delete {selectedCount}  row{selectedCount > 1 ? 's' : ''}? This action cannot be undone.
        </div>
      </Modal>
    </div>
  );
}

