import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Home, FileText, X, Edit, MessageSquare, Settings, BarChart3, LogOut, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useBatchEditing } from '../contexts/BatchEditingContext';
import toast from 'react-hot-toast';
import NotificationBell from './NotificationBell';
import Modal from './Modal';

const Sidebar = ({ open, setOpen, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { hasUnsavedChanges, dirtyRowsCount } = useBatchEditing();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
    setShowLogoutModal(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const navItems = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/dashboard', label: t('nav.dashboard'), icon: BarChart3 },
    { to: '/example', label: t('nav.example'), icon: FileText },
    { to: '/batch-editing', label: t('nav.batchEditing'), icon: Edit },
    { to: '/messenger', label: t('nav.messenger'), icon: MessageSquare },
    { to: '/profile', label: t('nav.profile'), icon: Settings },
  ];

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
        <button
          onClick={handleLogoutClick}
          className="flex flex-col items-center gap-1 text-sm w-20 py-1 rounded text-muted-foreground"
          aria-label="Logout"
        >
          <LogOut size={20} />
          <span className="truncate text-xs">{t('nav.logout')}</span>
        </button>

        {/* Logout Confirmation Modal for Mobile */}
        <Modal
          open={showLogoutModal}
          title={t('nav.logout')}
          size="md"
          onBackdropClick={handleCancelLogout}
          footer={
            <>
              <button onClick={handleCancelLogout} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </>
          }
        >
          {hasUnsavedChanges ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-warning/10 border border-warning rounded-lg">
                <AlertTriangle className="text-warning flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-warning mb-1">Unsaved Changes Detected</p>
                  <p className="text-sm text-foreground">
                    You have <strong>{dirtyRowsCount}</strong> unsaved {dirtyRowsCount === 1 ? 'change' : 'changes'} in batch editing. 
                    If you logout now, these changes will be lost.
                  </p>
                </div>
              </div>
              <p className="text-foreground">Are you sure you want to logout and lose your unsaved changes?</p>
            </div>
          ) : (
            <p className="text-foreground">Are you sure you want to logout?</p>
          )}
        </Modal>
      </nav>
    );
  }

  // Desktop / large screens: existing sidebar behavior
  return (
    <aside className={`fixed h-screen z-40 left-0 top-0 transition-all duration-300 ${open ? 'sidebar' : 'sidebar sidebar-compact'} p-4 flex flex-col`}> 
      {/* Desktop toggle button */}
      <button className="btn btn-ghost mb-6 self-start" onClick={() => setOpen(!open)} aria-label={open ? 'Close sidebar' : 'Open sidebar'}>
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <nav className={`sidebar-nav flex flex-col gap-2 flex-1 ${!open ? 'items-center' : ''}`}>
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
        
        {/* Notification Bell */}
        <div className="mt-2">
          <NotificationBell isCompact={!open} />
        </div>
      </nav>
        
      {/* Logout Button - Fixed at bottom */}
      <button
        onClick={handleLogoutClick}
        title={!open ? 'Logout' : ''}
        className={`transition-all duration-200 relative group hover:text-red-500 mt-4 ${!open ? 'justify-center flex items-center' : 'flex items-center gap-3'}`}
      >
        <LogOut 
          size={20} 
          className="transition-all duration-200"
        />
        {open && (
          <span className="font-medium transition-colors">{t('nav.logout')}</span>
        )}
      </button>

      {/* Logout Confirmation Modal */}
      <Modal
        open={showLogoutModal}
        title={t('nav.logout')}
        size="md"
        onBackdropClick={handleCancelLogout}
        footer={
          <>
            <button onClick={handleCancelLogout} className="btn btn-ghost">
              Cancel
            </button>
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </>
        }
      >
        {hasUnsavedChanges ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-warning/10 border border-warning rounded-lg">
              <AlertTriangle className="text-warning flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-warning mb-1">Unsaved Changes Detected</p>
                <p className="text-sm text-foreground">
                  You have <strong>{dirtyRowsCount}</strong> unsaved {dirtyRowsCount === 1 ? 'change' : 'changes'} in batch editing. 
                  If you logout now, these changes will be lost.
                </p>
              </div>
            </div>
            <p className="text-foreground">Are you sure you want to logout and lose your unsaved changes?</p>
          </div>
        ) : (
          <p className="text-foreground">Are you sure you want to logout?</p>
        )}
      </Modal>
    </aside>
  );
};

export default Sidebar;
