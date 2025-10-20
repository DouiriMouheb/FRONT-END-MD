
const sizeClasses = {
  md: 'max-w-md',
  lg: 'max-w-lg', 
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
};

export default function Modal({
  open,
  title,
  children,
  footer,
  size = '2xl',
  className = '',
  showHeader = true,
  onBackdropClick,
}) {
  if (!open) return null;
  
  const handleBackdropClick = (e) => {
    if (onBackdropClick) onBackdropClick(e);
  };

  return (
    <div
      className={`fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-[100] p-2 sm:p-4`}
      onClick={handleBackdropClick}
    >
      <div
        className={`
          modal-card w-full 
          max-h-[95vh] sm:max-h-[90vh] min-h-fit overflow-hidden flex flex-col slide-up
          ${className || `${sizeClasses[size]} mx-2 sm:mx-0`}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {showHeader && title && (
          <div className="modal-header px-4 py-3 sm:px-6 sm:py-4 border-b border-border">
            <h3 className="text-base sm:text-lg font-bold text-foreground">{title}</h3>
            <button className="modal-close" aria-label="Close modal" onClick={onBackdropClick || (() => {})}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4">{children}</div>
        {footer && (
          <div className="bg-card px-4 py-3 sm:px-6 sm:py-4 border-t border-border flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
