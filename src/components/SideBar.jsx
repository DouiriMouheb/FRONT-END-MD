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
    // Auto-close any overlay sidebar on mobile when navigating (no-op for bottom bar)
    if (isMobile && open) {
      setOpen(false);
    }
  };

  // Mobile: render a bottom nav bar always visible
  if (isMobile) {
    return (
      <nav style={{ backgroundColor: 'hsl(var(--panel))' }} className="fixed bottom-0 left-0 right-0 z-50 border-t border-border px-2 py-2 flex items-center justify-around md:hidden">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={handleLinkClick}
              className={`flex flex-col items-center gap-1 text-sm w-20 py-1 rounded ${isActive ? 'text-accent font-semibold' : 'text-muted-foreground'}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} className={`${isActive ? 'text-accent' : ''}`} />
              <span className="truncate text-xs">{label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  // Desktop / large screens: existing sidebar behavior
  return (
    <aside className={`fixed h-screen z-40 left-0 top-0 transition-all duration-300 ${open ? 'sidebar' : 'sidebar sidebar-compact'} p-4`}> 
      {/* Desktop toggle button */}
      <button className="btn btn-ghost mb-6 self-start" onClick={() => setOpen(!open)} aria-label={open ? 'Close sidebar' : 'Open sidebar'}>
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <nav className={`sidebar-nav flex flex-col gap-2 ${!open ? 'items-center' : ''}`}>
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={handleLinkClick}
              title={!open ? label : ''}
              className={`transition-all duration-200 relative group ${!open ? 'justify-center' : ''} ${isActive ? 'active' : ''}`}
            >
              <Icon 
                size={20} 
                className={`transition-all duration-200 ${isActive ? 'scale-110' : ''}`}
              />
              {open && (
                <span className={`font-medium transition-colors`}>{label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
