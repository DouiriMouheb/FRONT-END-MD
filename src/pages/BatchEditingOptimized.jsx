import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { FixedSizeList } from 'react-window';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Modal from '../components/Modal';
import { Search, Filter, RefreshCw, Database, ChevronDown } from 'lucide-react';
import { fetchBatchData, saveBatchEdits } from '../api/batchEditing';

/**
 * OPTIMIZED FOR LARGE DATASETS (1500+ rows)
 * 
 * Features:
 * - Virtual scrolling with FixedSizeList (only renders visible rows)
 * - Memoized filtering/sorting
 * - Debounced search
 * - Efficient state updates
 * - IndexedDB caching (optional)
 */

// Debounce utility
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function BatchEditingOptimized() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const listRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Debounced search (500ms delay)
  const debouncedSearch = useDebounce(searchQuery, 500);
  
  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    sortBy: 'id',
    sortOrder: 'asc',
  });

  // Memoized calculations for performance
  const dirtyRows = useMemo(() => rows.filter(r => r._dirty), [rows]);
  const selectedCount = useMemo(() => rows.filter(r => r._selected).length, [rows]);

  // Initial data fetch
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
      }));
      setRows(rowsWithMeta);
      toast.success(`Loaded ${result.data.length} records`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  // Optimized field update - only updates specific row
  const updateField = useCallback((id, field, value) => {
    setRows(prev => prev.map(r => 
      r.id === id 
        ? { 
            ...r, 
            [field]: value, 
            _dirty: true, 
            _dirtyFields: { ...(r._dirtyFields || {}), [field]: true } 
          } 
        : r
    ));
  }, []);

  const toggleSelect = useCallback((id) => {
    setRows(prev => prev.map(r => 
      r.id === id ? { ...r, _selected: !r._selected } : r
    ));
  }, []);

  const selectAll = useCallback((checked, visibleIds) => {
    setRows(prev => prev.map(r => 
      visibleIds.includes(r.id) ? { ...r, _selected: checked } : r
    ));
  }, []);

  // Memoized filtering and sorting (runs only when dependencies change)
  const filteredAndSortedRows = useMemo(() => {
    let result = [...rows];

    // Apply filters
    if (filters.category) {
      result = result.filter(r => r.category === filters.category);
    }
    if (filters.dateFrom) {
      result = result.filter(r => r.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter(r => r.date <= filters.dateTo);
    }
    if (filters.minAmount !== '') {
      result = result.filter(r => r.amount >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount !== '') {
      result = result.filter(r => r.amount <= parseFloat(filters.maxAmount));
    }

    // Apply search (debounced)
    const q = debouncedSearch.trim().toLowerCase();
    if (q) {
      result = result.filter(r => 
        [r.name, r.category, r.date, String(r.amount), r.description]
          .some(v => (v || '').toString().toLowerCase().includes(q))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const aVal = a[filters.sortBy];
      const bVal = b[filters.sortBy];
      
      if (aVal < bVal) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [rows, filters, debouncedSearch]);

  // Calculate totals (memoized)
  const totals = useMemo(() => {
    const filteredTotal = filteredAndSortedRows.reduce((sum, row) => 
      sum + (typeof row.amount === 'number' ? row.amount : 0), 0
    );
    
    const allTotal = rows.reduce((sum, row) => 
      sum + (typeof row.amount === 'number' ? row.amount : 0), 0
    );

    return { filteredTotal, allTotal };
  }, [filteredAndSortedRows, rows]);

  // Mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Browser close warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (dirtyRows.length > 0) {
        e.preventDefault();
        e.returnValue = '';
        return 'You have unsaved changes';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirtyRows.length]);

  // Navigation blocking
  useEffect(() => {
    const handleClick = (e) => {
      if (dirtyRows.length === 0) return;
      const link = e.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#')) return;
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

  // Back button blocking
  useEffect(() => {
    if (dirtyRows.length === 0) return;
    const handlePopState = () => {
      if (dirtyRows.length > 0) {
        window.history.pushState(null, '', window.location.pathname);
        setPendingNavigation(-1);
        setShowNavigationWarning(true);
      }
    };
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [dirtyRows.length]);

  function handleStayOnPage() {
    setShowNavigationWarning(false);
    setPendingNavigation(null);
  }

  function handleLeavePage() {
    setShowNavigationWarning(false);
    if (pendingNavigation === -1) {
      setRows(prev => prev.map(r => ({ ...r, _dirty: false, _dirtyFields: {} })));
      setTimeout(() => window.history.back(), 50);
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
      if (pendingNavigation === -1) {
        setTimeout(() => window.history.back(), 50);
      } else if (pendingNavigation) {
        navigate(pendingNavigation);
      }
      setPendingNavigation(null);
    } catch (err) {
      setSaving(false);
      toast.error('Failed to save');
    }
  }

  async function handleSave() {
    if (dirtyRows.length === 0) {
      toast('No changes to save');
      return;
    }
    setSaving(true);
    try {
      const payload = dirtyRows.map(({ _dirty, _dirtyFields, _selected, _height, ...rest }) => rest);
      await saveBatchEdits(payload);
      setRows(prev => prev.map(r => r._dirty ? { ...r, _dirty: false, _dirtyFields: {} } : r));
      toast.success('Changes saved');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  function applyFilters() {
    setShowFilterModal(false);
    toast.success('Filters applied');
  }

  function clearFilters() {
    setFilters({
      category: '',
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: '',
      sortBy: 'id',
      sortOrder: 'asc',
    });
    setShowFilterModal(false);
    toast.success('Filters cleared');
  }

  function deleteSelected() {
    setShowDeleteModal(true);
  }

  function confirmDelete() {
    const toDelete = rows.filter(r => r._selected);
    setRows(prev => prev.filter(r => !r._selected));
    setShowDeleteModal(false);
    toast.success(`${toDelete.length} row(s) deleted`);
  }

  // Mobile view
  if (isMobile) {
    return (
      <div className="p-6 flex items-center justify-center h-full" style={{ minHeight: '200px' }}>
        <div className="max-w-sm text-center px-4">
          <h2 className="text-lg font-semibold mb-2">{t('batchEditing.mobileTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('batchEditing.mobileDescription')}</p>
        </div>
      </div>
    );
  }

  // Virtual row renderer
  const Row = ({ index, style }) => {
    const row = filteredAndSortedRows[index];
    if (!row) return null;

    return (
      <div style={style} className="excel-row-virtual">
        <div className="excel-cell excel-row-number">{index + 1}</div>
        <div className="excel-cell excel-checkbox-cell">
          <input 
            type="checkbox" 
            checked={!!row._selected} 
            onChange={() => toggleSelect(row.id)}
          />
        </div>
        <div className="excel-cell">
          <input 
            type="text" 
            value={row.name} 
            onChange={e => updateField(row.id, 'name', e.target.value)} 
            className={`excel-input ${row._dirtyFields?.name ? 'excel-dirty' : ''}`}
          />
        </div>
        <div className="excel-cell">
          <select 
            value={row.category} 
            onChange={e => updateField(row.id, 'category', e.target.value)} 
            className={`excel-input ${row._dirtyFields?.category ? 'excel-dirty' : ''}`}
          >
            <option>Option A</option>
            <option>Option B</option>
            <option>Option C</option>
          </select>
        </div>
        <div className="excel-cell">
          <input 
            type="date" 
            value={row.date} 
            onChange={e => updateField(row.id, 'date', e.target.value)} 
            className={`excel-input ${row._dirtyFields?.date ? 'excel-dirty' : ''}`}
          />
        </div>
        <div className="excel-cell">
          <input 
            type="number" 
            step="0.01" 
            value={typeof row.amount === 'number' ? row.amount : ''} 
            onChange={e => updateField(row.id, 'amount', e.target.value === '' ? '' : parseFloat(e.target.value))} 
            className={`excel-input ${row._dirtyFields?.amount ? 'excel-dirty' : ''}`}
          />
        </div>
        <div className="excel-cell">
          <input 
            type="text" 
            value={row.description} 
            onChange={e => updateField(row.id, 'description', e.target.value)} 
            className={`excel-input ${row._dirtyFields?.description ? 'excel-dirty' : ''}`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6" style={{background: 'transparent'}}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{t('batchEditing.title')} (Optimized)</h1>
          {dirtyRows.length > 0 && (
            <span className="px-3 py-1 bg-warning/20 text-warning border border-warning/30 rounded-full text-xs font-semibold animate-pulse">
              ⚠️ {dirtyRows.length} {t('batchEditing.unsaved')}
            </span>
          )}
          <button onClick={loadData} disabled={loading} className="btn btn-ghost p-2">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-subtle">
            {filteredAndSortedRows.length} of {rows.length} records
            {dirtyRows.length > 0 && ` • ${dirtyRows.length} unsaved`}
          </span>
          {selectedCount > 0 && (
            <button onClick={deleteSelected} className="btn btn-destructive">
              Delete {selectedCount}
            </button>
          )}
          <button 
            onClick={handleSave} 
            disabled={saving || dirtyRows.length === 0} 
            className={`btn btn-primary ${saving ? 'opacity-80' : ''}`}
          >
            {saving ? t('batchEditing.saving') : `${t('batchEditing.save')} ${dirtyRows.length > 0 ? `(${dirtyRows.length})` : ''}`}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={16} />
          </div>
          <input 
            type="text" 
            placeholder={t('batchEditing.search')}
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            className="input w-full pl-10 pr-3" 
          />
        </div>
        <button onClick={() => setShowFilterModal(true)} className="btn btn-ghost border border-border">
          <Filter size={16} />
          <span>Filters & Sort</span>
          {(filters.category || filters.dateFrom || filters.sortBy !== 'id') && (
            <span className="ml-1 px-2 py-0.5 bg-accent text-accent-foreground rounded-full text-xs">Active</span>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="mb-3 flex gap-4 text-sm">
        <div>
          <strong>Total Amount:</strong> €{totals.allTotal.toFixed(2)}
        </div>
        {filteredAndSortedRows.length < rows.length && (
          <div>
            <strong>Filtered Amount:</strong> €{totals.filteredTotal.toFixed(2)}
          </div>
        )}
      </div>

      {/* Virtual Scrolling Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Database size={32} className="animate-pulse text-accent" />
          <p className="ml-3 text-muted-foreground">{t('batchEditing.loading')}</p>
        </div>
      ) : (
        <div className="excel-table-wrapper-virtual">
          {/* Header Row */}
          <div className="excel-header-row">
            <div className="excel-header excel-row-header" style={{width: '50px'}}>#</div>
            <div className="excel-header excel-checkbox-col" style={{width: '50px'}}>
              <input 
                type="checkbox" 
                checked={filteredAndSortedRows.length > 0 && filteredAndSortedRows.every(r => r._selected)} 
                onChange={e => selectAll(e.target.checked, filteredAndSortedRows.map(r => r.id))}
              />
            </div>
            <div className="excel-header" style={{minWidth: '180px'}}>Name</div>
            <div className="excel-header" style={{minWidth: '150px'}}>Category</div>
            <div className="excel-header" style={{minWidth: '140px'}}>Date</div>
            <div className="excel-header" style={{minWidth: '120px'}}>Amount (€)</div>
            <div className="excel-header" style={{minWidth: '200px'}}>Description</div>
          </div>

          {/* Virtual List */}
          <FixedSizeList
            ref={listRef}
            height={500}
            itemCount={filteredAndSortedRows.length}
            itemSize={40}
            width="100%"
            overscanCount={5}
          >
            {Row}
          </FixedSizeList>
        </div>
      )}

      {/* Modals */}
      <Modal 
        open={showDeleteModal} 
        title="Confirm deletion" 
        onBackdropClick={() => setShowDeleteModal(false)} 
        footer={(
          <>
            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded bg-muted text-sidebar-text">
              Cancel
            </button>
            <button onClick={confirmDelete} className="px-4 py-2 rounded bg-destructive text-on-destructive">
              Delete
            </button>
          </>
        )}
      >
        <div className="py-2">Delete {selectedCount} row(s)?</div>
      </Modal>

      <Modal 
        open={showFilterModal} 
        title="Filters & Sorting" 
        onBackdropClick={() => setShowFilterModal(false)}
        footer={(
          <>
            <button onClick={clearFilters} className="px-4 py-2 rounded bg-muted">Clear All</button>
            <button onClick={applyFilters} className="px-4 py-2 rounded bg-accent text-accent-foreground">Apply</button>
          </>
        )}
      >
        <div className="py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))} className="input w-full">
              <option value="">All</option>
              <option value="Option A">Option A</option>
              <option value="Option B">Option B</option>
              <option value="Option C">Option C</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Date From</label>
              <input type="date" value={filters.dateFrom} onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))} className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date To</label>
              <input type="date" value={filters.dateTo} onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))} className="input w-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Min Amount</label>
              <input type="number" step="0.01" value={filters.minAmount} onChange={e => setFilters(f => ({ ...f, minAmount: e.target.value }))} className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Amount</label>
              <input type="number" step="0.01" value={filters.maxAmount} onChange={e => setFilters(f => ({ ...f, maxAmount: e.target.value }))} className="input w-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Sort By</label>
              <select value={filters.sortBy} onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value }))} className="input w-full">
                <option value="id">ID</option>
                <option value="name">Name</option>
                <option value="category">Category</option>
                <option value="date">Date</option>
                <option value="amount">Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order</label>
              <select value={filters.sortOrder} onChange={e => setFilters(f => ({ ...f, sortOrder: e.target.value }))} className="input w-full">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      <Modal 
        open={showNavigationWarning} 
        title="⚠️ Unsaved Changes" 
        onBackdropClick={handleStayOnPage}
        footer={(
          <>
            <button onClick={handleStayOnPage} className="px-4 py-2 rounded bg-muted">Stay</button>
            <button onClick={handleLeavePage} className="px-4 py-2 rounded bg-destructive text-white">Leave</button>
            <button onClick={handleSaveAndLeave} disabled={saving} className="px-4 py-2 rounded bg-accent text-accent-foreground">
              {saving ? 'Saving...' : 'Save & Leave'}
            </button>
          </>
        )}
      >
        <div className="py-2">
          <p>You have <strong>{dirtyRows.length} unsaved changes</strong>.</p>
        </div>
      </Modal>
    </div>
  );
}
