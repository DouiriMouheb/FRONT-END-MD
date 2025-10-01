import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Home, FileText, X, Edit } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/example', label: 'Example', icon: FileText },
  { to: '/batch-editing', label: 'Batch Editing', icon: Edit },
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
    <aside className={`fixed h-screen z-40 left-0 top-0 transition-all duration-300 ${isMobile ? (open ? 'translate-x-0' : '-translate-x-full') : ''} ${open || isMobile ? 'sidebar' : 'sidebar sidebar-compact'} p-4`}> 
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
        <button className="btn btn-ghost mb-6 self-start" onClick={() => setOpen(!open)} aria-label={open ? 'Close sidebar' : 'Open sidebar'}>
          {open ? <X size={18} /> : <Menu size={18} />}
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
      
      <nav className={`sidebar-nav flex flex-col gap-2 ${!open && !isMobile ? 'items-center' : ''}`}>
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={handleLinkClick}
              title={!open && !isMobile ? label : ''}
              className={`transition-all duration-200 relative group ${!open && !isMobile ? 'justify-center' : ''} ${isActive ? 'active' : ''}`}
            >
              <Icon 
                size={20} 
                className={`transition-all duration-200 ${isActive ? 'scale-110' : ''}`}
              />
              {(open || isMobile) && (
                <span className={`font-medium transition-colors`}>
                  {label}
                </span>
              )}
              {/* Active indicator is handled by CSS .active */}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
