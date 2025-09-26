import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SideBar';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on mobile when resizing to mobile
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={handleOverlayClick}
        />
      )}
      
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} isMobile={isMobile} />
      
      <main className={`
        min-h-screen transition-all duration-300 bg-muted/30
        ${isMobile 
          ? 'p-4' 
          : `p-6 ${sidebarOpen ? 'ml-64' : 'ml-16'}`
        }
      `}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
