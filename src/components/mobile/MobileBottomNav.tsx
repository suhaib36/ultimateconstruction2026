import React from 'react';
import { 
  Home, 
  Briefcase, 
  Camera, 
  Calendar, 
  Menu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type MobileTab = 'home' | 'projects' | 'updates' | 'schedule' | 'more';

interface MobileBottomNavProps {
  currentMobileTab: MobileTab;
  setCurrentMobileTab: (tab: MobileTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentMobileTab,
  setCurrentMobileTab,
}) => {
  const { changeOrders, leads, projects } = useApp();

  const pendingCOs = changeOrders.filter(co => co.status === 'Sent for Approval').length;
  const newLeadsCount = leads.filter(l => l.status === 'New').length;

  const tabs: { id: MobileTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'home', label: 'Today', icon: Home, badge: pendingCOs > 0 ? pendingCOs : undefined },
    { id: 'projects', label: 'Projects', icon: Briefcase, badge: projects.length },
    { id: 'updates', label: 'Field Logs', icon: Camera },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'more', label: 'More', icon: Menu, badge: newLeadsCount > 0 ? newLeadsCount : undefined },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg py-1.5 px-3 select-none">
      <div className="max-w-4xl mx-auto flex items-center justify-around sm:justify-evenly">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentMobileTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentMobileTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 sm:px-5 rounded-xl transition-all relative min-h-[46px] ${
                isActive
                  ? 'text-brand-700 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-700 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2.5 px-1.5 py-0.2 text-[9px] font-black rounded-full bg-brand-700 text-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-xs mt-0.5 tracking-tight">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
