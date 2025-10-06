import React, { useState, useRef, useCallback } from 'react';

/**
 * Custom hook for resizable table columns
 * Returns column widths and resize handlers
 */
export function useResizableColumns(initialWidths) {
  const [columnWidths, setColumnWidths] = useState(initialWidths);
  const [resizingColumn, setResizingColumn] = useState(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const startResize = useCallback((columnKey, event) => {
    event.preventDefault();
    setResizingColumn(columnKey);
    startXRef.current = event.clientX;
    startWidthRef.current = columnWidths[columnKey];

    const handleMouseMove = (e) => {
      if (!resizingColumn && columnKey) {
        const diff = e.clientX - startXRef.current;
        const newWidth = Math.max(80, startWidthRef.current + diff); // Min width 80px
        
        setColumnWidths(prev => ({
          ...prev,
          [columnKey]: newWidth
        }));
      }
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [columnWidths, resizingColumn]);

  return { columnWidths, startResize, resizingColumn };
}

/**
 * Resizable column header component
 */
export function ResizableHeader({ 
  columnKey, 
  width, 
  onResize, 
  children, 
  className = '',
  style = {} 
}) {
  return (
    <div 
      className={`excel-header-resizable ${className}`}
      style={{ ...style, width: `${width}px`, position: 'relative' }}
    >
      <div className="excel-header-content">
        {children}
      </div>
      <div
        className="excel-resize-handle"
        onMouseDown={(e) => onResize(columnKey, e)}
        title="Drag to resize"
      />
    </div>
  );
}
