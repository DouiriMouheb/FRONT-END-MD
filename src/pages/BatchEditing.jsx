import React, { useState, useMemo, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from '../components/Modal';
import { Search, Filter, RefreshCw, Database, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { fetchBatchData, saveBatchEdits } from '../api/batchEditing';

export default function BatchEditing() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nextTempId, setNextTempId] = useState(1); // Counter for temporary IDs
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  
  // Column widths for resizing
  const [columnWidths, setColumnWidths] = useState({
    rowNumber: 50,
    checkbox: 50,
    name: 180,
    category: 150,
    date: 140,
    amount: 120,
    description: 200,
  });
  const [resizingColumn, setResizingColumn] = useState(null);
  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
  });
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

  const dirtyRows = useMemo(() => rows.filter(r => r._dirty), [rows]);
  const selectedCount = useMemo(() => rows.filter(r => r._selected).length, [rows]);

  // Initial data fetch on mount
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const result = await fetchBatchData();
      const rowsWithMeta = result.data.map(r => ({
        ...r,
        _dirty: false,
        _dirtyFields: {},
        _selected: false,
        _attachments: [],
        _expanded: false,
      }));
      setRows(rowsWithMeta);
      toast.success(`Loaded ${result.data.length} records from database`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    // Client-side filtering based on selected filters
    setShowFilterModal(false);
    setCurrentPage(1);
    toast.success('Filters applied');
  }

  function clearFilters() {
    setFilters({
      category: '',
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: '',
    });
    setShowFilterModal(false);
    toast.success('Filters cleared');
  }

  // Column resizing handlers
  function startResize(columnKey, event) {
    event.preventDefault();
    event.stopPropagation();
    
    setResizingColumn(columnKey);
    resizeStartX.current = event.clientX;
    resizeStartWidth.current = columnWidths[columnKey];
    
    document.body.classList.add('resizing-column');
    
    const handleMouseMove = (e) => {
      if (resizingColumn || columnKey) {
        const diff = e.clientX - resizeStartX.current;
        const newWidth = Math.max(60, resizeStartWidth.current + diff); // Min width 60px
        
        setColumnWidths(prev => ({
          ...prev,
          [columnKey]: newWidth
        }));
      }
    };
    
    const handleMouseUp = () => {
      setResizingColumn(null);
      document.body.classList.remove('resizing-column');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

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
  
  // Duplicate selected rows
  function duplicateSelected() {
    const selectedRows = rows.filter(r => r._selected);
    if (selectedRows.length === 0) {
      toast.error('Please select rows to duplicate');
      return;
    }
    
    setNextTempId(prev => prev + selectedRows.length);
    
    // Insert duplicates right after their original rows
    setRows(prev => {
      const newRows = [];
      let tempIdCounter = nextTempId;
      
      prev.forEach(row => {
        // Add the original row
        newRows.push(row);
        
        // If this row was selected, add a duplicate right after it
        if (row._selected) {
          const newId = `temp_${tempIdCounter++}`;
          const duplicate = {
            ...row,
            id: newId,
            _selected: false,
            _dirty: true, // Mark as dirty so it gets saved
            _dirtyFields: { ...row._dirtyFields }, // Copy dirty fields
            _isNew: true, // Flag to indicate this is a new row
            _attachments: [], // Reset attachments for duplicates
            _expanded: false,
          };
          newRows.push(duplicate);
        }
      });
      
      return newRows;
    });
    
    toast.success(`${selectedRows.length} row(s) duplicated`);
  }
  
  // Handle column sorting
  function handleSort(columnKey) {
    if (sortColumn === columnKey) {
      // Same column - toggle direction
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // New column - set to ascending
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  }
  
  // Render sort icon for column headers
  function renderSortIcon(columnKey) {
    if (sortColumn !== columnKey) {
      return <ChevronsUpDown size={14} className="inline ml-1 opacity-40" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp size={14} className="inline ml-1 text-accent" />
      : <ChevronDown size={14} className="inline ml-1 text-accent" />;
  }

  const filteredRows = useMemo(() => {
    let filtered = [...rows];

    // Apply advanced filters
    if (filters.category) {
      filtered = filtered.filter(r => r.category === filters.category);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(r => r.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(r => r.date <= filters.dateTo);
    }
    if (filters.minAmount !== '') {
      filtered = filtered.filter(r => r.amount >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount !== '') {
      filtered = filtered.filter(r => r.amount <= parseFloat(filters.maxAmount));
    }

    // Apply search query
    const q = (searchQuery || '').toString().trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(r => 
        [r.name, r.category, r.date, String(r.amount), r.description]
          .some(v => (v || '').toString().toLowerCase().includes(q))
      );
    }

    // Apply sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];
        
        // Handle different data types
        if (sortColumn === 'amount') {
          // Numeric sorting
          aVal = typeof aVal === 'number' ? aVal : 0;
          bVal = typeof bVal === 'number' ? bVal : 0;
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        } else if (sortColumn === 'date') {
          // Date sorting
          aVal = aVal || '';
          bVal = bVal || '';
          return sortDirection === 'asc' 
            ? aVal.localeCompare(bVal) 
            : bVal.localeCompare(aVal);
        } else {
          // String sorting (alphabetic)
          aVal = (aVal || '').toString().toLowerCase();
          bVal = (bVal || '').toString().toLowerCase();
          return sortDirection === 'asc' 
            ? aVal.localeCompare(bVal) 
            : bVal.localeCompare(aVal);
        }
      });
    }

    return filtered;
  }, [rows, searchQuery, filters, sortColumn, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(1); }, [filteredRows.length, pageSize, totalPages]);
  const visibleRows = useMemo(() => { const start = (currentPage - 1) * pageSize; return filteredRows.slice(start, start + pageSize); }, [filteredRows, currentPage, pageSize]);

  // Calculate sum of visible amounts
  const visibleTotal = useMemo(() => {
    return visibleRows.reduce((sum, row) => {
      const amount = typeof row.amount === 'number' ? row.amount : 0;
      return sum + amount;
    }, 0);
  }, [visibleRows]);

  // Calculate sum of all filtered amounts
  const filteredTotal = useMemo(() => {
    return filteredRows.reduce((sum, row) => {
      const amount = typeof row.amount === 'number' ? row.amount : 0;
      return sum + amount;
    }, 0);
  }, [filteredRows]);

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

  // Prevent accidental page close/reload when there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (dirtyRows.length > 0) {
        e.preventDefault();
        e.returnValue = ''; // Chrome requires returnValue to be set
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirtyRows.length]);

  // Intercept link clicks to show warning modal
  useEffect(() => {
    const handleClick = (e) => {
      // Check if unsaved changes exist
      if (dirtyRows.length === 0) return;

      // Check if it's a navigation link (a tag or Link component)
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      // Skip external links and same-page anchors
      if (!href || href.startsWith('http') || href.startsWith('#')) return;

      // Only intercept if navigating away from current page
      if (href !== location.pathname) {
        e.preventDefault();
        e.stopPropagation();
        setPendingNavigation(href);
        setShowNavigationWarning(true);
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [dirtyRows.length, location.pathname]);

  // Block browser back button when there are unsaved changes
  useEffect(() => {
    if (dirtyRows.length === 0) return;

    // Push a dummy state to history when there are unsaved changes
    const handlePopState = (e) => {
      if (dirtyRows.length > 0) {
        // Push current state back to prevent actual navigation
        window.history.pushState(null, '', window.location.pathname);
        
        // Show the warning modal
        setPendingNavigation(-1); // -1 indicates back button
        setShowNavigationWarning(true);
      }
    };

    // Add initial history entry
    window.history.pushState(null, '', window.location.pathname);
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [dirtyRows.length]);

  function handleStayOnPage() {
    setShowNavigationWarning(false);
    setPendingNavigation(null);
  }

  function handleLeavePage() {
    setShowNavigationWarning(false);
    
    if (pendingNavigation === -1) {
      // Back button was pressed - temporarily clear dirty state and go back
      setRows(prev => prev.map(r => ({ ...r, _dirty: false, _dirtyFields: {} })));
      setTimeout(() => {
        window.history.back();
      }, 50);
    } else if (pendingNavigation) {
      navigate(pendingNavigation);
    }
    
    setPendingNavigation(null);
  }

  async function handleSaveAndLeave() {
    if (dirtyRows.length === 0) {
      handleLeavePage();
      return;
    }

    setSaving(true);
    try {
      await handleSave();
      setSaving(false);
      setShowNavigationWarning(false);
      
      // Navigate after successful save
      if (pendingNavigation === -1) {
        // Back button - go back
        setTimeout(() => {
          window.history.back();
        }, 50);
      } else if (pendingNavigation) {
        navigate(pendingNavigation);
      }
      
      setPendingNavigation(null);
    } catch (err) {
      // Save failed, stay on page
      setSaving(false);
      toast.error('Failed to save. Please try again.');
    }
  }

  async function handleSave() {
    if (dirtyRows.length === 0) { toast('No changes to save.'); return; }
    setSaving(true);
    try {
      // Separate new rows from modified rows
      const newRows = dirtyRows.filter(r => r._isNew);
      const modifiedRows = dirtyRows.filter(r => !r._isNew);
      
      const hasFiles = dirtyRows.some(r => (r._attachments || []).length > 0);
      if (hasFiles && typeof FormData !== 'undefined') {
        const form = new FormData();
        // Send all dirty rows (both new and modified)
        const payload = dirtyRows.map(({ _dirty, _attachments, _selected, _expanded, _dirtyFields, _isNew, ...rest }) => ({
          ...rest,
          isNew: _isNew || false // Flag for backend to know if it's a new row
        }));
        form.append('items', JSON.stringify(payload));
        dirtyRows.forEach(r => { (r._attachments || []).forEach((a) => { form.append(`files[${r.id}][]`, a.file, a.file.name); }); });
        await saveBatchEdits(form);
      } else {
        // Send all dirty rows with isNew flag
        const payload = dirtyRows.map(({ _dirty, _attachments, _selected, _expanded, _dirtyFields, _isNew, ...rest }) => ({
          ...rest,
          isNew: _isNew || false // Flag for backend to know if it's a new row
        }));
        await saveBatchEdits(payload);
      }
      
      // After successful save, update rows:
      // - Remove _isNew flag from new rows (they're now in DB)
      // - Clear _dirty flags
      // - For new rows, backend should return real IDs, but for now we'll just clear flags
      setRows(prev => prev.map(r => {
        if (r._dirty) {
          return { 
            ...r, 
            _dirty: false, 
            _dirtyFields: {},
            _isNew: false // Clear the new flag after save
          };
        }
        return r;
      }));
      
      const saveMessage = newRows.length > 0 && modifiedRows.length > 0
        ? `Saved ${modifiedRows.length} change(s) and created ${newRows.length} new row(s)`
        : newRows.length > 0
        ? `Created ${newRows.length} new row(s)`
        : `Saved ${modifiedRows.length} change(s)`;
      
      toast.success(saveMessage);
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
      {/* Header with action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-foreground">Batch Editing</h1>
          {dirtyRows.length > 0 && (
            <span className="px-3 py-1 bg-warning/20 text-warning border border-warning/30 rounded-full text-xs font-semibold animate-pulse">
              ⚠️ {dirtyRows.length} Unsaved
            </span>
          )}
          <button 
            onClick={loadData} 
            disabled={loading}
            className="btn btn-ghost p-2"
            title="Reload data from database"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-subtle">
            {filteredRows.length} of {rows.length} records
            {dirtyRows.length > 0 && ` • ${dirtyRows.length} unsaved`}
          </span>
          {selectedCount > 0 && (
            <>
              <button onClick={duplicateSelected} className="btn btn-ghost border border-border">
                Duplicate {selectedCount}
              </button>
              <button onClick={deleteSelected} className="btn btn-destructive">
                Delete {selectedCount}
              </button>
            </>
          )}
          <button 
            onClick={handleSave} 
            disabled={saving || dirtyRows.length === 0} 
            className={`btn btn-primary ${saving ? 'opacity-80' : ''}`}
          >
            {saving ? 'Saving…' : `Save ${dirtyRows.length > 0 ? `(${dirtyRows.length})` : 'changes'}`}
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={16} />
          </div>
          <input 
            type="text" 
            placeholder="Search name, category, date, amount, description..." 
            value={searchQuery} 
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
            className="input w-full pl-10 pr-3" 
          />
        </div>
        <button 
          onClick={() => setShowFilterModal(true)}
          className="btn btn-ghost border border-border"
        >
          <Filter size={16} />
          <span>Filters</span>
          {(filters.category || filters.dateFrom || filters.dateTo || filters.minAmount || filters.maxAmount) && (
            <span className="ml-1 px-2 py-0.5 bg-accent text-accent-foreground rounded-full text-xs">Active</span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Database size={32} className="animate-pulse text-accent" />
            <p className="text-muted-foreground">Loading data from database...</p>
          </div>
        </div>
      ) : (
        <div className={`excel-table-wrapper ${resizingColumn ? 'resizing' : ''}`}>
          <table className="excel-table" aria-label="Batch editing table">
          <thead>
            <tr>
              <th className="excel-header excel-row-header" style={{width: `${columnWidths.rowNumber}px`, position: 'relative'}}>
                #
                <div className="excel-resize-handle" onMouseDown={(e) => startResize('rowNumber', e)} title="Drag to resize" />
              </th>
              <th className="excel-header excel-checkbox-col" style={{width: `${columnWidths.checkbox}px`, position: 'relative'}}>
                <input type="checkbox" checked={visibleRows.length > 0 && visibleRows.every(v => v._selected)} onChange={e => selectAllOnPage(e.target.checked, visibleRows.map(v => v.id))} aria-label="Select all rows" />
                <div className="excel-resize-handle" onMouseDown={(e) => startResize('checkbox', e)} title="Drag to resize" />
              </th>
              <th className="excel-header excel-sortable" style={{width: `${columnWidths.name}px`, position: 'relative'}} onClick={() => handleSort('name')}>
                <span className="excel-header-content">Name {renderSortIcon('name')}</span>
                <div className="excel-resize-handle" onMouseDown={(e) => startResize('name', e)} title="Drag to resize" />
              </th>
              <th className="excel-header excel-sortable" style={{width: `${columnWidths.category}px`, position: 'relative'}} onClick={() => handleSort('category')}>
                <span className="excel-header-content">Category {renderSortIcon('category')}</span>
                <div className="excel-resize-handle" onMouseDown={(e) => startResize('category', e)} title="Drag to resize" />
              </th>
              <th className="excel-header excel-sortable" style={{width: `${columnWidths.date}px`, position: 'relative'}} onClick={() => handleSort('date')}>
                <span className="excel-header-content">Date {renderSortIcon('date')}</span>
                <div className="excel-resize-handle" onMouseDown={(e) => startResize('date', e)} title="Drag to resize" />
              </th>
              <th className="excel-header excel-sortable" style={{width: `${columnWidths.amount}px`, position: 'relative'}} onClick={() => handleSort('amount')}>
                <span className="excel-header-content">Amount (€) {renderSortIcon('amount')}</span>
                <div className="excel-resize-handle" onMouseDown={(e) => startResize('amount', e)} title="Drag to resize" />
              </th>
              <th className="excel-header excel-sortable" style={{width: `${columnWidths.description}px`, position: 'relative'}} onClick={() => handleSort('description')}>
                <span className="excel-header-content">Description {renderSortIcon('description')}</span>
                <div className="excel-resize-handle" onMouseDown={(e) => startResize('description', e)} title="Drag to resize" />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">{searchQuery && searchQuery.trim() ? `No results found for "${searchQuery}"` : 'No rows available.'}</td></tr>
            ) : (
              visibleRows.map((row, idx) => (
                <React.Fragment key={row.id}>
                  <tr className={`excel-row ${row._isNew ? 'excel-row-new' : ''}`}>
                    <td className="excel-cell excel-row-number" style={{width: `${columnWidths.rowNumber}px`}}>
                      {row._isNew ? (
                        <span className="text-success font-bold" title="New row (not yet saved)">+</span>
                      ) : (
                        (currentPage - 1) * pageSize + idx + 1
                      )}
                    </td>
                    <td className="excel-cell excel-checkbox-cell" style={{width: `${columnWidths.checkbox}px`}}>
                      <input type="checkbox" checked={!!row._selected} onChange={() => toggleSelect(row.id)} aria-label={`Select row ${row.id}`} />
                    </td>
                    <td className="excel-cell" style={{width: `${columnWidths.name}px`}}>
                      <input type="text" value={row.name} onChange={e => updateField(row.id, 'name', e.target.value)} className={`excel-input ${row._dirtyFields?.name ? 'excel-dirty' : ''}`} aria-label={`Name for ${row.name}`} />
                    </td>
                    <td className="excel-cell" style={{width: `${columnWidths.category}px`}}>
                      <select value={row.category} onChange={e => updateField(row.id, 'category', e.target.value)} className={`excel-input ${row._dirtyFields?.category ? 'excel-dirty' : ''}`} aria-label={`Category for ${row.name}`}>
                        <option>Option A</option>
                        <option>Option B</option>
                        <option>Option C</option>
                      </select>
                    </td>
                    <td className="excel-cell" style={{width: `${columnWidths.date}px`}}>
                      <input type="date" value={row.date} onChange={e => updateField(row.id, 'date', e.target.value)} className={`excel-input ${row._dirtyFields?.date ? 'excel-dirty' : ''}`} aria-label={`Date for ${row.name}`} />
                    </td>
                    <td className="excel-cell" style={{width: `${columnWidths.amount}px`}}>
                      <input type="number" step="0.01" value={typeof row.amount === 'number' ? row.amount : ''} onChange={e => updateField(row.id, 'amount', e.target.value === '' ? '' : parseFloat(e.target.value))} className={`excel-input ${row._dirtyFields?.amount ? 'excel-dirty' : ''}`} aria-label={`Amount in euros for ${row.name}`} />
                    </td>
                    <td className="excel-cell" style={{width: `${columnWidths.description}px`}}>
                      <input type="text" value={row.description} onChange={e => updateField(row.id, 'description', e.target.value)} className={`excel-input ${row._dirtyFields?.description ? 'excel-dirty' : ''}`} aria-label={`Description for ${row.name}`} />
                    </td>
                  </tr>
                </React.Fragment>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="excel-total-row">
              <td className="excel-total-cell" colSpan={2}></td>
              <td className="excel-total-cell excel-total-label" colSpan={3}>
                <strong>Total (visible):</strong>
              </td>
              <td className="excel-total-cell excel-total-value">
                <strong>€{visibleTotal.toFixed(2)}</strong>
              </td>
              <td className="excel-total-cell"></td>
            </tr>
            {filteredRows.length > visibleRows.length && (
              <tr className="excel-subtotal-row">
                <td className="excel-total-cell" colSpan={2}></td>
                <td className="excel-total-cell excel-total-label" colSpan={3}>
                  <em>Total (all {filteredRows.length} filtered):</em>
                </td>
                <td className="excel-total-cell excel-total-value">
                  <em>€{filteredTotal.toFixed(2)}</em>
                </td>
                <td className="excel-total-cell"></td>
              </tr>
            )}
          </tfoot>
        </table>
        </div>
      )}

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

      {/* Filter Modal */}
      <Modal 
        open={showFilterModal} 
        title="Advanced Filters" 
        onBackdropClick={() => setShowFilterModal(false)}
        footer={(
          <>
            <button onClick={clearFilters} className="px-4 py-2 rounded bg-muted text-sidebar-text">
              Clear All
            </button>
            <button onClick={applyFilters} className="px-4 py-2 rounded bg-accent text-accent-foreground">
              Apply Filters
            </button>
          </>
        )}
      >
        <div className="py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select 
              value={filters.category} 
              onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
              className="input w-full"
            >
              <option value="">All Categories</option>
              <option value="Option A">Option A</option>
              <option value="Option B">Option B</option>
              <option value="Option C">Option C</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Date From</label>
              <input 
                type="date" 
                value={filters.dateFrom}
                onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date To</label>
              <input 
                type="date" 
                value={filters.dateTo}
                onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))}
                className="input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Min Amount (€)</label>
              <input 
                type="number" 
                step="0.01"
                value={filters.minAmount}
                onChange={e => setFilters(f => ({ ...f, minAmount: e.target.value }))}
                className="input w-full"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Amount (€)</label>
              <input 
                type="number" 
                step="0.01"
                value={filters.maxAmount}
                onChange={e => setFilters(f => ({ ...f, maxAmount: e.target.value }))}
                className="input w-full"
                placeholder="10000.00"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Navigation Warning Modal */}
      <Modal 
        open={showNavigationWarning} 
        title="⚠️ Unsaved Changes" 
        onBackdropClick={handleStayOnPage}
        footer={(
          <>
            <button 
              onClick={handleStayOnPage} 
              className="px-4 py-2 rounded bg-muted text-foreground"
            >
              Stay on Page
            </button>
            <button 
              onClick={handleLeavePage} 
              className="px-4 py-2 rounded bg-destructive text-white"
            >
              {pendingNavigation === -1 ? 'Go Back Without Saving' : 'Leave Without Saving'}
            </button>
            <button 
              onClick={handleSaveAndLeave} 
              disabled={saving}
              className="px-4 py-2 rounded bg-accent text-accent-foreground"
            >
              {saving ? 'Saving...' : (pendingNavigation === -1 ? 'Save & Go Back' : 'Save & Leave')}
            </button>
          </>
        )}
      >
        <div className="py-2">
          <p className="mb-3">
            You have <strong>{dirtyRows.length} unsaved change{dirtyRows.length > 1 ? 's' : ''}</strong>.
          </p>
          <p className="text-sm text-muted-foreground">
            {pendingNavigation === -1 
              ? "You're trying to go back. If you leave now, your changes will be lost. What would you like to do?"
              : "If you leave now, your changes will be lost. What would you like to do?"
            }
          </p>
        </div>
      </Modal>
    </div>
  );
}

