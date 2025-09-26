
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
      className={`fixed inset-0 backdrop-blur-md bg-sidebar-bg/20 flex items-center justify-center z-[100] p-2 sm:p-4`}
      onClick={handleBackdropClick}
    >
      <div
        className={`
          bg-background rounded-xl shadow-2xl border border-border w-full 
          max-h-[95vh] sm:max-h-[90vh] min-h-fit overflow-hidden flex flex-col slide-up
          ${className || `${sizeClasses[size]} mx-2 sm:mx-0`}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {showHeader && title && (
          <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-border">
            <h3 className="text-base sm:text-lg font-bold text-center text-foreground">{title}</h3>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4">{children}</div>
        {footer && (
          <div className="bg-muted/30 px-4 py-3 sm:px-6 sm:py-4 border-t border-border flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
