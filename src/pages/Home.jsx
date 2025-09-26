import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Modal from '../components/Modal';
import ThemeToggle from '../components/ThemeToggle';

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleShowToast = () => {
    toast.success('Welcome to the Frontend Template!');
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-0">
      {/* Header with theme toggle */}
      <div className="flex justify-between items-start mb-6 sm:mb-8">
        <div className="flex-1 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">Welcome Home</h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-2">
            This is a modern React template with Vite, Tailwind CSS, and a clean component structure.
          </p>
        </div>
        <div className="ml-4 mt-2">
          <ThemeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-background border border-border rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">Features</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-sidebar-active rounded-full"></span>
              React 19 with Vite
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-sidebar-active rounded-full"></span>
              Tailwind CSS with theme system
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-sidebar-active rounded-full"></span>
              React Router for navigation
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-sidebar-active rounded-full"></span>
              Toast notifications
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-sidebar-active rounded-full"></span>
              Responsive sidebar layout
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-sidebar-active rounded-full"></span>
              Dark/Light theme support
            </li>
          </ul>
        </div>

        <div className="bg-background border border-border rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={handleShowToast}
              className="w-full px-4 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base"
            >
              Show Toast Notification
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="w-full px-4 py-2 bg-primary border border-border text-primary-foreground rounded-lg hover:bg-muted transition-colors text-sm sm:text-base"
            >
              Open Modal Demo
            </button>
            <div className="pt-2">
              <ThemeToggle className="w-full justify-center sm:hidden" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center px-2">
        <p className="text-sm sm:text-base text-muted-foreground">
          Navigate to the <span className="font-semibold">Example</span> page to see more components in action.
        </p>
      </div>

      <Modal
        open={modalOpen}
        onBackdropClick={handleModalClose}
        title="Modal Demo"
        size="lg"
        footer={
          <button
            onClick={handleModalClose}
            className="w-full sm:w-auto px-4 py-2 bg-sidebar-active text-white rounded-lg hover:bg-sidebar-hover transition-colors text-sm sm:text-base"
          >
            Close
          </button>
        }
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            This is a demonstration of the modal component. It features:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Backdrop blur effect</li>
            <li>Customizable sizes</li>
            <li>Optional header and footer</li>
            <li>Responsive design</li>
            <li>Theme-based styling</li>
          </ul>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Click outside the modal or use the close button to dismiss it.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
