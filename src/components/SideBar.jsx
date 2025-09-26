import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Home, FileText, X } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/example', label: 'Example', icon: FileText },
];

const Sidebar = ({ open, setOpen, isMobile }) => {
  const location = useLocation();
  
  const handleLinkClick = () => {
    // Auto-close sidebar on mobile when navigating
    if (isMobile && open) {
      setOpen(false);
    }
  };

  return (
    <aside className={`
      fixed h-screen bg-sidebar-bg text-sidebar-text flex flex-col p-4 z-40 left-0 top-0 shadow-lg transition-all duration-300
      ${isMobile 
        ? `${open ? 'translate-x-0 w-64' : '-translate-x-full w-64'}` 
        : `${open ? 'w-64' : 'w-16'}`
      }
    `}>
      {/* Mobile header with close button */}
      {isMobile && open && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-sidebar-text">Menu</h2>
          <button
            className="flex justify-center items-center w-10 h-10 bg-muted rounded text-sidebar-text hover:bg-sidebar-hover transition-colors"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Desktop toggle button */}
      {!isMobile && (
        <button
          className="mb-6 flex justify-center items-center w-10 h-10 bg-muted rounded text-sidebar-text hover:bg-sidebar-hover transition-colors self-start"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close sidebar' : 'Open sidebar'}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Mobile menu button */}
      {isMobile && !open && (
        <button
          className="fixed top-4 left-4 z-50 flex justify-center items-center w-12 h-12 bg-sidebar-bg rounded-lg text-sidebar-text hover:bg-sidebar-hover transition-colors shadow-lg"
          onClick={() => setOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
      )}
      
      <nav className={`flex flex-col gap-2 ${!open && !isMobile ? 'items-center' : ''}`}>
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={handleLinkClick}
              title={!open && !isMobile ? label : ''}
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-all duration-200 relative group
                ${!open && !isMobile ? 'justify-center' : ''}
                ${isActive 
                  ? 'bg-sidebar-active shadow-lg shadow-sidebar-active/20 scale-105 sidebar-active-pulse' 
                  : 'text-muted-foreground hover:text-sidebar-text hover:bg-sidebar-hover/50'
                }
              `}
            >
              <Icon 
                size={20} 
                className={`${isActive ? 'text-sidebar-active-text' : ''} transition-all duration-200 ${isActive ? 'scale-110' : ''}`}
              />
              {(open || isMobile) && (
                <span className={`font-medium transition-colors ${isActive ? 'text-sidebar-active-text' : ''}`}>
                  {label}
                </span>
              )}
              {/* Active indicator - vertical line for expanded, dot for collapsed */}
              {isActive && (
                <>
                  {(open || isMobile) ? (
                    <div className="absolute left-0 top-0 w-1 h-full bg-sidebar-active-text rounded-r-full" />
                  ) : (
                    <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-sidebar-active-text rounded-full" />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
