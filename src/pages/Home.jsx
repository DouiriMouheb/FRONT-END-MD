import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Modal from '../components/Modal';
import ThemeToggle from '../components/ThemeToggle';

const Home = () => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  const handleShowToast = () => {
    toast.success(t('home.quickActions.showToast'));
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-0">
      {/* Header with theme toggle */}
      <div className="flex justify-between items-start mb-6 sm:mb-8">
        <div className="flex-1 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">{t('home.title')}</h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-2">
            {t('home.subtitle')}
          </p>
        </div>
        <div className="ml-4 mt-2">
          <ThemeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="panel bg-panel border border-border rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">{t('home.features.title')}</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-sidebar-active rounded-full"></span>
              {t('home.features.items.react')}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-sidebar-active rounded-full"></span>
              {t('home.features.items.tailwind')}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-sidebar-active rounded-full"></span>
              {t('home.features.items.router')}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-sidebar-active rounded-full"></span>
              {t('home.features.items.toast')}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-sidebar-active rounded-full"></span>
              {t('home.features.items.sidebar')}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-sidebar-active rounded-full"></span>
              {t('home.features.items.theme')}
            </li>
          </ul>
        </div>

        <div className="panel bg-panel border border-border rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">{t('home.quickActions.title')}</h2>
          <div className="space-y-3">
            <button onClick={handleShowToast} className="btn btn-primary w-full">{t('home.quickActions.showToast')}</button>
            <button onClick={() => setModalOpen(true)} className="btn w-full">{t('home.quickActions.openModal')}</button>
            <div className="pt-2">
              <ThemeToggle className="w-full justify-center sm:hidden" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center px-2">
        <p className="text-sm sm:text-base text-muted-foreground">
          {t('home.navigate')} <span className="font-semibold">{t('home.examplePage')}</span> {t('home.toSeeMore')}
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
