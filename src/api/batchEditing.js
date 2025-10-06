/**
 * API helper for batch editing operations.
 *
 * This file provides client helpers for:
 * - Fetching data from the database
 * - Filtering data based on criteria
 * - Saving batch edits back to the server
 *
 * Replace the simulated implementations with real fetch/axios calls
 * when a backend endpoint is available.
 */

/**
 * Fetch all records from the database
 * GET /api/batch-data or similar endpoint
 */
export async function fetchBatchData(filters = {}) {
  // Simulate network latency
  await new Promise(res => setTimeout(res, 800));

  // In production, this would be:
  // const params = new URLSearchParams(filters);
  // const res = await fetch(`/api/batch-data?${params}`);
  // if (!res.ok) throw new Error('Failed to fetch data');
  // return res.json();

  // Mock data - simulating DB response
  const mockData = Array.from({ length: 50 }).map((_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    category: ['Option A', 'Option B', 'Option C'][i % 3],
    date: `2025-10-${String((i % 28) + 1).padStart(2, '0')}`,
    amount: Math.round((Math.random() * 10000 + 500)) / 100,
    description: `${['First', 'Second', 'Third', 'Fourth', 'Fifth'][i % 5]} sample item`,
    status: ['Active', 'Pending', 'Completed'][i % 3],
    createdAt: new Date(2025, 9, (i % 28) + 1).toISOString(),
  }));

  return { data: mockData, total: mockData.length };
}

/**
 * Apply server-side filters (in production this would be done via query params)
 */
export async function filterBatchData(criteria) {
  // Simulate network latency
  await new Promise(res => setTimeout(res, 400));

  // In production:
  // const res = await fetch('/api/batch-data/filter', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(criteria),
  // });
  // return res.json();

  // For now, return all data and filter client-side
  const { data } = await fetchBatchData();
  return { data, total: data.length };
}

export async function saveBatchEdits(payload) {
  // Simulate latency
  await new Promise(res => setTimeout(res, 600));

  // If payload is a FormData (contains files), in a real implementation
  // you'd POST it directly without setting Content-Type (browser will set multipart boundary).
  // Here we just simulate success.
  if (typeof FormData !== 'undefined' && payload instanceof FormData) {
    // Example: you could inspect payload.get('items') if the client appended JSON under 'items'
    const items = JSON.parse(payload.get('items'));
    const newRows = items.filter(item => item.isNew);
    const updatedRows = items.filter(item => !item.isNew);
    
    console.log('📤 Saving to database:', {
      newRows: newRows.length,
      updatedRows: updatedRows.length,
      total: items.length
    });
    
    // In production, backend would:
    // 1. Insert new rows (isNew: true) and return generated IDs
    // 2. Update existing rows (isNew: false)
    // 3. Handle file uploads from FormData
    
    return { 
      success: true, 
      created: newRows.length,
      updated: updatedRows.length,
      // Backend would return real IDs here: newIds: [123, 124, 125]
    };
  }

  // Example of where you'd call your real API with JSON:
  // const res = await fetch('/api/batch-edits', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ items: payload }),
  // });
  // if (!res.ok) throw new Error('Network response was not ok');
  // return res.json();
  
  // Handle JSON payload (no files)
  const newRows = payload.filter(item => item.isNew);
  const updatedRows = payload.filter(item => !item.isNew);
  
  console.log('📤 Saving to database:', {
    newRows: newRows.length,
    updatedRows: updatedRows.length,
    total: payload.length
  });
  
  // In production, backend would:
  // 1. INSERT new rows (isNew: true) into database
  // 2. UPDATE existing rows (isNew: false) in database
  // 3. Return the generated IDs for new rows

  return { 
    success: true, 
    created: newRows.length,
    updated: updatedRows.length,
    // Backend would return real IDs here: newIds: [123, 124, 125]
  };
}
