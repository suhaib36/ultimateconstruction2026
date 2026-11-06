import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/common/ToastContainer';

// Mobile Contractor Components & Navigation
import { MobileHeader } from './components/mobile/MobileHeader';
import { MobileBottomNav, MobileTab } from './components/mobile/MobileBottomNav';
import { MobileHomeTab } from './components/mobile/MobileHomeTab';
import { MobileProjectsTab } from './components/mobile/MobileProjectsTab';
import { MobileFieldUpdatesTab } from './components/mobile/MobileFieldUpdatesTab';
import { MobileScheduleTab } from './components/mobile/MobileScheduleTab';
import { MobileMoreTab } from './components/mobile/MobileMoreTab';

// Dedicated Full-Width Responsive Client Portal
import { HomeownerPortal } from './components/portal/HomeownerPortal';

const AppContent: React.FC = () => {
  const { 
    isHomeownerPortal, 
    setCurrentTab, 
    setSelectedProjectId 
  } = useApp();

  const [mobileTab, setMobileTab] = useState<MobileTab>('home');

  // If in Homeowner Portal mode, render the dedicated mobile-responsive Client Portal!
  if (isHomeownerPortal) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <HomeownerPortal />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col selection:bg-brand-100 selection:text-brand-900">
      {/* Top Mobile App Navigation Bar */}
      <MobileHeader />

      {/* Main Fluid Responsive Screen Body */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-3.5 sm:px-6 py-4 pb-28">
        {mobileTab === 'home' && (
          <MobileHomeTab
            onNavigateToTab={(t) => setMobileTab(t)}
            onOpenQuickUpdate={() => setMobileTab('updates')}
            onOpenQuickLead={() => setMobileTab('more')}
          />
        )}
        {mobileTab === 'projects' && <MobileProjectsTab />}
        {mobileTab === 'updates' && <MobileFieldUpdatesTab />}
        {mobileTab === 'schedule' && <MobileScheduleTab />}
        {mobileTab === 'more' && <MobileMoreTab />}
      </main>

      {/* Proper Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentMobileTab={mobileTab}
        setCurrentMobileTab={(tab) => {
          setMobileTab(tab);
          // If switching to projects from bottom nav, reset to project list view
          if (tab === 'projects') {
            setSelectedProjectId(null);
          }
        }}
      />

      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
