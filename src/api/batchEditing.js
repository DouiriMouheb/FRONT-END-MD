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

  // Mock data - simulating DB response based on real project structure
  const mockData = [
    // Empaired - WP3 Implementazione
    { id: 1, progetto: 'Empaired', workPackage: 'WP3 Implementazione', attivita: '3.4 Sviluppo Frontend', tipoSpessa: 'Materiali', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'EQUIPMENT', importo: 2000.00 },
    { id: 2, progetto: 'Empaired', workPackage: 'WP3 Implementazione', attivita: '3.5 Test', tipoSpessa: 'Personale', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'STAFF', importo: 3000.00 },
    { id: 3, progetto: 'Empaired', workPackage: 'WP3 Implementazione', attivita: '3.6 Deploy', tipoSpessa: 'Personale', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'STAFF', importo: 6000.00 },
    { id: 4, progetto: 'Empaired', workPackage: 'WP3 Implementazione', attivita: '3.6 Deploy', tipoSpessa: 'Materiali', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'EQUIPMENT', importo: 9000.00 },
    
    // CTE - WP1 Management
    { id: 5, progetto: 'CTE', workPackage: 'WP1 Management', attivita: '1.1 Gestione', tipoSpessa: 'Personale', tipoAttivita: 'Ricerca Industriale', tipoCosto: 'STAFF', importo: 5000.00 },
    { id: 6, progetto: 'CTE', workPackage: 'WP1 Management', attivita: '1.1 Gestione', tipoSpessa: 'Personale', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'STAFF', importo: 4500.00 },
    { id: 7, progetto: 'CTE', workPackage: 'WP1 Management', attivita: '1.1 Gestione', tipoSpessa: 'Consulenze', tipoAttivita: 'Ricerca Industriale', tipoCosto: 'EXTERNAL', importo: 3000.00 },
    { id: 8, progetto: 'CTE', workPackage: 'WP1 Management', attivita: '1.2 Comunicazione', tipoSpessa: 'Personale', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'STAFF', importo: 8000.00 },
    { id: 9, progetto: 'CTE', workPackage: 'WP1 Management', attivita: '1.2 Comunicazione', tipoSpessa: 'Personale', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'STAFF', importo: 5000.00 },
    
    // Praeciso - WP1 Management
    { id: 10, progetto: 'Praeciso', workPackage: 'WP1 Management', attivita: '1.1 Gestione', tipoSpessa: 'Personale', tipoAttivita: 'Ricerca Industriale', tipoCosto: 'STAFF', importo: 5000.00 },
    { id: 11, progetto: 'Praeciso', workPackage: 'WP1 Management', attivita: '1.1 Gestione', tipoSpessa: 'Personale', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'STAFF', importo: 4500.00 },
    { id: 12, progetto: 'Praeciso', workPackage: 'WP1 Management', attivita: '1.1 Gestione', tipoSpessa: 'Consulenze', tipoAttivita: 'Ricerca Industriale', tipoCosto: 'EXTERNAL', importo: 3000.00 },
    { id: 13, progetto: 'Praeciso', workPackage: 'WP1 Management', attivita: '1.2 Comunicazione', tipoSpessa: 'Personale', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'STAFF', importo: 8000.00 },
    { id: 14, progetto: 'Praeciso', workPackage: 'WP1 Management', attivita: '1.2 Comunicazione', tipoSpessa: 'Personale', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'STAFF', importo: 5000.00 },
    
    // Praeciso - WP2 Soluzioni tecnologiche
    { id: 15, progetto: 'Praeciso', workPackage: 'WP2 Soluzioni tecnologiche', attivita: '2.1 Scouting', tipoSpessa: 'Personale', tipoAttivita: 'Ricerca Industriale', tipoCosto: 'STAFF', importo: 6000.00 },
    { id: 16, progetto: 'Praeciso', workPackage: 'WP2 Soluzioni tecnologiche', attivita: '2.1 Scouting', tipoSpessa: 'Consulenze', tipoAttivita: 'Ricerca Industriale', tipoCosto: 'EXTERNAL', importo: 12000.00 },
    { id: 17, progetto: 'Praeciso', workPackage: 'WP2 Soluzioni tecnologiche', attivita: '2.2 Analisi tecniche', tipoSpessa: 'Personale', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'STAFF', importo: 8000.00 },
    { id: 18, progetto: 'Praeciso', workPackage: 'WP2 Soluzioni tecnologiche', attivita: '2.2 Analisi tecniche', tipoSpessa: 'Consulenze', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'EXTERNAL', importo: 2000.00 },
    
    // Additional entries for Empaired - WP1 and WP2
    { id: 19, progetto: 'Empaired', workPackage: 'WP1 Management', attivita: '1.1 Gestione', tipoSpessa: 'Personale', tipoAttivita: 'Ricerca Industriale', tipoCosto: 'STAFF', importo: 4800.00 },
    { id: 20, progetto: 'Empaired', workPackage: 'WP1 Management', attivita: '1.2 Comunicazione', tipoSpessa: 'Materiali', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'EQUIPMENT', importo: 3500.00 },
    { id: 21, progetto: 'Empaired', workPackage: 'WP2 Soluzioni tecnologiche', attivita: '2.1 Scouting', tipoSpessa: 'Consulenze', tipoAttivita: 'Ricerca Industriale', tipoCosto: 'EXTERNAL', importo: 7500.00 },
    { id: 22, progetto: 'Empaired', workPackage: 'WP2 Soluzioni tecnologiche', attivita: '2.2 Analisi tecniche', tipoSpessa: 'Personale', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'STAFF', importo: 5500.00 },
    
    // CTE - WP2 and WP3
    { id: 23, progetto: 'CTE', workPackage: 'WP2 Soluzioni tecnologiche', attivita: '2.1 Scouting', tipoSpessa: 'Personale', tipoAttivita: 'Ricerca Industriale', tipoCosto: 'STAFF', importo: 6500.00 },
    { id: 24, progetto: 'CTE', workPackage: 'WP2 Soluzioni tecnologiche', attivita: '2.2 Analisi tecniche', tipoSpessa: 'Consulenze', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'EXTERNAL', importo: 4000.00 },
    { id: 25, progetto: 'CTE', workPackage: 'WP3 Implementazione', attivita: '3.4 Sviluppo Frontend', tipoSpessa: 'Personale', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'STAFF', importo: 9500.00 },
    { id: 26, progetto: 'CTE', workPackage: 'WP3 Implementazione', attivita: '3.5 Test', tipoSpessa: 'Materiali', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'EQUIPMENT', importo: 3800.00 },
    
    // Praeciso - WP3
    { id: 27, progetto: 'Praeciso', workPackage: 'WP3 Implementazione', attivita: '3.4 Sviluppo Frontend', tipoSpessa: 'Personale', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'STAFF', importo: 7800.00 },
    { id: 28, progetto: 'Praeciso', workPackage: 'WP3 Implementazione', attivita: '3.5 Test', tipoSpessa: 'Personale', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'STAFF', importo: 4200.00 },
    { id: 29, progetto: 'Praeciso', workPackage: 'WP3 Implementazione', attivita: '3.6 Deploy', tipoSpessa: 'Consulenze', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'EXTERNAL', importo: 5600.00 },
    { id: 30, progetto: 'Praeciso', workPackage: 'WP3 Implementazione', attivita: '3.6 Deploy', tipoSpessa: 'Materiali', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'EQUIPMENT', importo: 8500.00 },
    
    // More varied entries
    { id: 31, progetto: 'CTE', workPackage: 'WP3 Implementazione', attivita: '3.6 Deploy', tipoSpessa: 'Personale', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'STAFF', importo: 7200.00 },
    { id: 32, progetto: 'Empaired', workPackage: 'WP2 Soluzioni tecnologiche', attivita: '2.3 Progettazione', tipoSpessa: 'Personale', tipoAttivita: 'Ricerca Industriale', tipoCosto: 'STAFF', importo: 9800.00 },
    { id: 33, progetto: 'Praeciso', workPackage: 'WP2 Soluzioni tecnologiche', attivita: '2.3 Progettazione', tipoSpessa: 'Materiali', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'EQUIPMENT', importo: 6200.00 },
    { id: 34, progetto: 'CTE', workPackage: 'WP1 Management', attivita: '1.3 Coordinamento', tipoSpessa: 'Personale', tipoAttivita: 'Ricerca Industriale', tipoCosto: 'STAFF', importo: 4700.00 },
    { id: 35, progetto: 'Empaired', workPackage: 'WP1 Management', attivita: '1.3 Coordinamento', tipoSpessa: 'Consulenze', tipoAttivita: 'Ricerca Industriale', tipoCosto: 'EXTERNAL', importo: 5300.00 },
    { id: 36, progetto: 'Praeciso', workPackage: 'WP1 Management', attivita: '1.3 Coordinamento', tipoSpessa: 'Personale', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'STAFF', importo: 4100.00 },
    { id: 37, progetto: 'CTE', workPackage: 'WP2 Soluzioni tecnologiche', attivita: '2.3 Progettazione', tipoSpessa: 'Personale', tipoAttivita: 'Ricerca Industriale', tipoCosto: 'STAFF', importo: 8800.00 },
    { id: 38, progetto: 'Empaired', workPackage: 'WP3 Implementazione', attivita: '3.7 Integrazione', tipoSpessa: 'Personale', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'STAFF', importo: 6700.00 },
    { id: 39, progetto: 'Praeciso', workPackage: 'WP3 Implementazione', attivita: '3.7 Integrazione', tipoSpessa: 'Materiali', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'EQUIPMENT', importo: 5900.00 },
    { id: 40, progetto: 'CTE', workPackage: 'WP3 Implementazione', attivita: '3.7 Integrazione', tipoSpessa: 'Consulenze', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'EXTERNAL', importo: 7600.00 },
    { id: 41, progetto: 'Empaired', workPackage: 'WP1 Management', attivita: '1.4 Reporting', tipoSpessa: 'Personale', tipoAttivita: 'Ricerca Industriale', tipoCosto: 'STAFF', importo: 3200.00 },
    { id: 42, progetto: 'CTE', workPackage: 'WP1 Management', attivita: '1.4 Reporting', tipoSpessa: 'Materiali', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'EQUIPMENT', importo: 2800.00 },
    { id: 43, progetto: 'Praeciso', workPackage: 'WP1 Management', attivita: '1.4 Reporting', tipoSpessa: 'Personale', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'STAFF', importo: 3400.00 },
    { id: 44, progetto: 'Empaired', workPackage: 'WP2 Soluzioni tecnologiche', attivita: '2.4 Validazione', tipoSpessa: 'Consulenze', tipoAttivita: 'Ricerca Industriale', tipoCosto: 'EXTERNAL', importo: 11000.00 },
    { id: 45, progetto: 'CTE', workPackage: 'WP2 Soluzioni tecnologiche', attivita: '2.4 Validazione', tipoSpessa: 'Personale', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'STAFF', importo: 6900.00 },
    { id: 46, progetto: 'Praeciso', workPackage: 'WP2 Soluzioni tecnologiche', attivita: '2.4 Validazione', tipoSpessa: 'Materiali', tipoAttivita: 'Ricerca Industriale', tipoCosto: 'EQUIPMENT', importo: 8300.00 },
    { id: 47, progetto: 'Empaired', workPackage: 'WP3 Implementazione', attivita: '3.8 Ottimizzazione', tipoSpessa: 'Personale', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'STAFF', importo: 5400.00 },
    { id: 48, progetto: 'CTE', workPackage: 'WP3 Implementazione', attivita: '3.8 Ottimizzazione', tipoSpessa: 'Consulenze', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'EXTERNAL', importo: 9200.00 },
    { id: 49, progetto: 'Praeciso', workPackage: 'WP3 Implementazione', attivita: '3.8 Ottimizzazione', tipoSpessa: 'Materiali', tipoAttivita: 'Sviluppo Sperimentale', tipoCosto: 'EQUIPMENT', importo: 4600.00 },
    { id: 50, progetto: 'CTE', workPackage: 'WP2 Soluzioni tecnologiche', attivita: '2.5 Documentazione', tipoSpessa: 'Personale', tipoAttivita: 'Ricerca Industriale', tipoCosto: 'STAFF', importo: 3900.00 },
  ].map(row => ({
    ...row,
    createdAt: new Date(2025, 9, (row.id % 28) + 1).toISOString(),
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
