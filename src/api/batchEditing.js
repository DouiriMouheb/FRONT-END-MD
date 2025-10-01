/**
 * API helper for batch editing operations.
 *
 * This file provides a small client helper that the UI calls to persist
 * batch edits. Currently it simulates a successful network request with
 * a short delay. Replace the implementation with real fetch/axios calls
 * when a backend endpoint is available.
 *
 * Expected server contract for saving batch edits (JSON request):
 * POST /api/batch-edits
 * {
 *   items: [
 *     { id: number|string, name?: string, startDate?: 'YYYY-MM-DD', endDate?: 'YYYY-MM-DD' },
 *     ...
 *   ]
 * }
 *
 * Expected successful response: 200 OK with { success: true, updated: [...] }
 */

export async function saveBatchEdits(payload) {
  // Simulate latency
  await new Promise(res => setTimeout(res, 600));

  // If payload is a FormData (contains files), in a real implementation
  // you'd POST it directly without setting Content-Type (browser will set multipart boundary).
  // Here we just simulate success.
  if (typeof FormData !== 'undefined' && payload instanceof FormData) {
    // Example: you could inspect payload.get('items') if the client appended JSON under 'items'
    return { success: true, updated: [] };
  }

  // Example of where you'd call your real API with JSON:
  // const res = await fetch('/api/batch-edits', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ items: payload }),
  // });
  // if (!res.ok) throw new Error('Network response was not ok');
  // return res.json();

  return { success: true, updated: payload };
}
