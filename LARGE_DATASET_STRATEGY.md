# Large Dataset Strategy (1500+ Rows)

## 🎯 Problem Statement

Working with 1500+ rows in a browser presents challenges:
- **Performance:** Rendering 1500 DOM elements is slow
- **Memory:** Storing all data in state is heavy
- **UX:** Scrolling through 1500 rows is painful
- **Network:** Loading 1500 rows upfront is slow

---

## ✅ Recommended Architecture

### **Server-Side Everything**
```
┌─────────────┐
│   Browser   │ ← Only loads 10-50 rows at a time
└──────┬──────┘
       │ API Requests (with filters & pagination)
       ↓
┌─────────────┐
│   Server    │ ← Handles filtering, sorting, pagination
└──────┬──────┘
       │ SQL Queries
       ↓
┌─────────────┐
│  Database   │ ← Stores all 1500 rows
└─────────────┘
```

---

## 🏗️ Implementation Strategy

### 1. **Server-Side Pagination**
Only fetch the current page of data.

**Client Request:**
```javascript
GET /api/batch-data?page=1&pageSize=20&category=OptionA&minAmount=100
```

**Server Response:**
```json
{
  "data": [ /* 20 rows */ ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 20,
    "totalRows": 1500,
    "totalPages": 75
  },
  "aggregations": {
    "totalAmount": 125000.50,
    "visibleAmount": 3450.00
  }
}
```

**Benefits:**
- ✅ Only 20 rows loaded instead of 1500
- ✅ Fast initial page load
- ✅ Low memory usage
- ✅ Smooth performance

---

### 2. **Server-Side Filtering**
Database handles filtering, not browser.

**SQL Example (PostgreSQL):**
```sql
SELECT * FROM items
WHERE 
  category = $1
  AND date >= $2 
  AND date <= $3
  AND amount BETWEEN $4 AND $5
  AND (
    name ILIKE $6 OR 
    description ILIKE $6
  )
ORDER BY date DESC
LIMIT 20 OFFSET 0;
```

**Benefits:**
- ✅ Database is optimized for filtering
- ✅ Uses indexes for speed
- ✅ Only relevant data sent to browser
- ✅ Instant filter application

---

### 3. **Debounced Search**
Delay search API calls to avoid spamming server.

**Implementation:**
```javascript
import { useMemo } from 'react';
import debounce from 'lodash.debounce';

const debouncedSearch = useMemo(
  () => debounce((query) => {
    fetchData({ search: query, page: 1 });
  }, 500), // Wait 500ms after user stops typing
  []
);

// Usage
<input onChange={(e) => debouncedSearch(e.target.value)} />
```

**Benefits:**
- ✅ Reduces API calls (1 instead of 10+ while typing)
- ✅ Better server performance
- ✅ Better UX (less flickering)

---

### 4. **Virtual Scrolling (Optional)**
For displaying many rows without pagination.

**Libraries:**
- `react-window` - Lightweight, fast
- `react-virtualized` - Feature-rich
- `@tanstack/react-virtual` - Modern, flexible

**Example with react-window:**
```javascript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={1500}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      Row {index}
    </div>
  )}
</FixedSizeList>
```

**Benefits:**
- ✅ Only renders visible rows (~20)
- ✅ Smooth scrolling even with 10,000 rows
- ✅ Low memory usage

---

### 5. **Optimistic Updates**
Update UI immediately, sync with server in background.

**Flow:**
```javascript
function updateCell(rowId, field, value) {
  // 1. Update UI immediately
  setRows(prev => prev.map(r => 
    r.id === rowId ? { ...r, [field]: value, _dirty: true } : r
  ));
  
  // 2. Queue for batch save
  queueUpdate({ rowId, field, value });
  
  // 3. Save in background (debounced)
  debouncedSave();
}
```

**Benefits:**
- ✅ Instant UI feedback
- ✅ Reduced API calls (batch updates)
- ✅ Better UX

---

### 6. **Efficient State Management**

**Option A: Only Store Current Page**
```javascript
const [currentPageData, setCurrentPageData] = useState([]);
const [totalCount, setTotalCount] = useState(0);
```

**Option B: Cache Multiple Pages**
```javascript
const [cache, setCache] = useState({
  1: [...], // Page 1 data
  2: [...], // Page 2 data
  // etc.
});
```

**Option C: Use React Query / SWR**
```javascript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['batch-data', page, filters],
  queryFn: () => fetchBatchData({ page, ...filters }),
  staleTime: 5 * 60 * 1000, // Cache for 5 minutes
});
```

---

## 📊 Database Optimization

### 1. **Indexes**
```sql
-- For fast filtering
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_date ON items(date);
CREATE INDEX idx_items_amount ON items(amount);

-- For fast search
CREATE INDEX idx_items_name_trgm ON items USING gin(name gin_trgm_ops);
```

### 2. **Materialized Views** (for aggregations)
```sql
CREATE MATERIALIZED VIEW item_aggregations AS
SELECT 
  category,
  COUNT(*) as count,
  SUM(amount) as total_amount,
  AVG(amount) as avg_amount
FROM items
GROUP BY category;

-- Refresh periodically
REFRESH MATERIALIZED VIEW item_aggregations;
```

### 3. **Partitioning** (for very large datasets)
```sql
-- Partition by date range
CREATE TABLE items_2025_q1 PARTITION OF items
FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');
```

---

## 🔄 API Design

### Endpoint: GET `/api/batch-data`

**Query Parameters:**
```
page=1              # Current page (1-indexed)
pageSize=20         # Rows per page
search=laptop       # Search query
category=OptionA    # Filter by category
dateFrom=2025-01-01 # Filter date range
dateTo=2025-12-31
minAmount=100       # Filter amount range
maxAmount=1000
sortBy=date         # Sort field
sortOrder=desc      # asc or desc
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Item 1",
      "category": "Option A",
      "date": "2025-10-01",
      "amount": 99.17,
      "description": "Sample item"
    }
    // ... 19 more rows
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 20,
    "totalRows": 1500,
    "totalPages": 75,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "aggregations": {
    "totalAmount": 125000.50,     # All 1500 rows
    "filteredAmount": 45000.00,   # After filters
    "visibleAmount": 1234.56      # Current page
  },
  "filters": {
    "category": "Option A",
    "dateFrom": "2025-01-01",
    "dateTo": "2025-12-31"
  }
}
```

---

## 💻 Client Implementation

### Updated API Helper
```javascript
// src/api/batchEditing.js

export async function fetchBatchData(params = {}) {
  const {
    page = 1,
    pageSize = 20,
    search = '',
    category = '',
    dateFrom = '',
    dateTo = '',
    minAmount = '',
    maxAmount = '',
    sortBy = 'date',
    sortOrder = 'desc'
  } = params;

  const queryParams = new URLSearchParams({
    page,
    pageSize,
    ...(search && { search }),
    ...(category && { category }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
    ...(minAmount && { minAmount }),
    ...(maxAmount && { maxAmount }),
    sortBy,
    sortOrder
  });

  const response = await fetch(`/api/batch-data?${queryParams}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
}
```

### Updated Component Logic
```javascript
// src/pages/BatchEditing.jsx

const [rows, setRows] = useState([]);
const [pagination, setPagination] = useState({
  currentPage: 1,
  pageSize: 20,
  totalRows: 0,
  totalPages: 0
});
const [aggregations, setAggregations] = useState({});
const [loading, setLoading] = useState(false);

// Fetch data when filters/page changes
useEffect(() => {
  loadData();
}, [currentPage, pageSize, filters, searchQuery]);

async function loadData() {
  setLoading(true);
  try {
    const result = await fetchBatchData({
      page: currentPage,
      pageSize,
      search: searchQuery,
      ...filters
    });
    
    setRows(result.data.map(r => ({
      ...r,
      _dirty: false,
      _dirtyFields: {},
      _selected: false
    })));
    
    setPagination(result.pagination);
    setAggregations(result.aggregations);
    
  } catch (err) {
    toast.error('Failed to load data');
  } finally {
    setLoading(false);
  }
}
```

---

## 🎨 UX Improvements

### 1. **Loading States**
```javascript
{loading ? (
  <div className="excel-table-skeleton">
    {Array.from({ length: pageSize }).map((_, i) => (
      <div key={i} className="skeleton-row" />
    ))}
  </div>
) : (
  <table>...</table>
)}
```

### 2. **Infinite Scroll** (Alternative to pagination)
```javascript
import { useInfiniteQuery } from '@tanstack/react-query';

const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage
} = useInfiniteQuery({
  queryKey: ['batch-data', filters],
  queryFn: ({ pageParam = 1 }) => fetchBatchData({ page: pageParam }),
  getNextPageParam: (lastPage) => 
    lastPage.pagination.hasNextPage 
      ? lastPage.pagination.currentPage + 1 
      : undefined
});

// Trigger on scroll
<IntersectionObserver onIntersect={fetchNextPage}>
  {isFetchingNextPage ? 'Loading...' : 'Load more'}
</IntersectionObserver>
```

### 3. **Show Total Count**
```
Showing 1-20 of 1,500 records
Filtered: 450 rows | Total Amount: €45,000.00
```

---

## 📈 Performance Benchmarks

| Strategy | 1500 Rows | Performance |
|----------|-----------|-------------|
| **Client-side (all data)** | 😱 Slow | Initial load: 3-5s, Laggy UI |
| **Server pagination** | ✅ Fast | Initial load: 200-500ms, Smooth UI |
| **Virtual scrolling** | ✅ Fast | Initial load: 300ms, Smooth scroll |
| **Infinite scroll** | ✅ Good | Progressive loading, Good UX |

---

## 🛠️ Recommended Stack

### For 1500 rows:
```
✅ Server-side pagination (20-50 rows per page)
✅ Server-side filtering
✅ Debounced search (500ms)
✅ Optimistic updates
✅ React Query for caching
```

### For 10,000+ rows:
```
✅ All of the above, PLUS:
✅ Virtual scrolling
✅ Database indexes
✅ Materialized views
✅ CDN caching
```

---

## 🚀 Quick Migration Path

### Phase 1: Server Pagination
1. Update API to accept pagination params
2. Return only requested page
3. Update client to fetch per page

### Phase 2: Server Filtering
1. Move filter logic to server
2. Use database indexes
3. Return filtered count

### Phase 3: Optimizations
1. Add debouncing
2. Implement caching (React Query)
3. Add loading skeletons

### Phase 4: Advanced (if needed)
1. Virtual scrolling
2. Infinite scroll
3. Materialized views

---

## 📋 Summary

For **1500 rows**, the best approach is:

1. **Server-side pagination** (fetch 20-50 rows at a time)
2. **Server-side filtering** (let database handle it)
3. **Debounced search** (reduce API calls)
4. **Optimistic updates** (instant UI feedback)
5. **React Query** (caching & state management)

This gives you:
- ⚡ Fast page loads (~200ms)
- 🎯 Smooth UI (only 20 rows rendered)
- 💾 Low memory usage
- 🔍 Fast filtering (database indexes)
- 📊 Real-time aggregations (totals, counts)

**Don't load all 1500 rows in the browser!** 🚫
