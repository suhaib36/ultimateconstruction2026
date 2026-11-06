import React from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import { 
  LayoutDashboard, 
  UserPlus, 
  Briefcase, 
  Calendar, 
  ClipboardCheck, 
  Users, 
  FileText, 
  FileSpreadsheet, 
  Contact, 
  Settings, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { 
    currentTab, 
    setCurrentTab, 
    setSelectedProjectId,
    setIsHomeownerPortal,
    projects,
    leads,
    changeOrders,
    dailyUpdates
  } = useApp();

  const activeProjectsCount = projects.filter(p => p.status === 'In Progress' || p.status === 'Planning').length;
  const newLeadsCount = leads.filter(l => l.status === 'New' || l.status === 'Contacted').length;
  const pendingCOsCount = changeOrders.filter(co => co.status === 'Sent for Approval').length;

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads & Estimates', icon: UserPlus, badge: newLeadsCount > 0 ? newLeadsCount : undefined },
    { id: 'projects', label: 'Projects', icon: Briefcase, badge: activeProjectsCount },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'updates', label: 'Daily Site Updates', icon: ClipboardCheck },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'changeorders', label: 'Change Orders', icon: FileSpreadsheet, badge: pendingCOsCount > 0 ? pendingCOsCount : undefined },
    { id: 'clients', label: 'Clients', icon: Contact },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId: NavigationTab) => {
    setCurrentTab(tabId);
    setSelectedProjectId(null);
    if (onCloseMobile) onCloseMobile();
  };

  const handleOpenClientPortal = () => {
    setIsHomeownerPortal(true);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col h-full shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100">
        <BrandLogo variant="full" />
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Management
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-brand-700' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-semibold shrink-0 ${
                    isActive
                      ? 'bg-brand-700 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Homeowner Portal Quick Action Pill */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60">
        <button
          onClick={handleOpenClientPortal}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-brand-300 hover:text-brand-700 transition-all shadow-xs group"
        >
          <div className="flex items-center gap-2.5 text-left min-w-0">
            <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-slate-900 group-hover:text-brand-700">
                Homeowner Portal
              </div>
              <div className="text-[10px] text-slate-500">
                Simulate Client View
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-700 shrink-0" />
        </button>
      </div>

      {/* User / License Info Footer */}
      <div className="p-3.5 border-t border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs ring-2 ring-brand-100">
          NP
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
            Nancy Paramo
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          </div>
          <div className="text-[10px] text-slate-500 truncate">
            Owner & General Contractor
          </div>
        </div>
      </div>
    </aside>
  );
};
