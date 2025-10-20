import React, { createContext, useContext, useState, useCallback } from 'react';

const BatchEditingContext = createContext();

export function BatchEditingProvider({ children }) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [dirtyRowsCount, setDirtyRowsCount] = useState(0);

  const updateUnsavedChanges = useCallback((dirtyRows) => {
    const count = dirtyRows.length;
    setDirtyRowsCount(count);
    setHasUnsavedChanges(count > 0);
  }, []);

  const clearUnsavedChanges = useCallback(() => {
    setDirtyRowsCount(0);
    setHasUnsavedChanges(false);
  }, []);

  return (
    <BatchEditingContext.Provider 
      value={{ 
        hasUnsavedChanges, 
        dirtyRowsCount,
        updateUnsavedChanges,
        clearUnsavedChanges
      }}
    >
      {children}
    </BatchEditingContext.Provider>
  );
}

export function useBatchEditing() {
  const context = useContext(BatchEditingContext);
  if (!context) {
    throw new Error('useBatchEditing must be used within a BatchEditingProvider');
  }
  return context;
}
