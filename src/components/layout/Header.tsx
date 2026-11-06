import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Bell, 
  Menu, 
  Plus, 
  ExternalLink, 
  Check, 
  X, 
  Briefcase, 
  UserPlus, 
  Camera, 
  FileSpreadsheet,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenNewProject: () => void;
  onOpenNewEstimate: () => void;
  onOpenNewUpdate: () => void;
  onOpenNewLead: () => void;
  onOpenNewChangeOrder: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenNewProject,
  onOpenNewEstimate,
  onOpenNewUpdate,
  onOpenNewLead,
  onOpenNewChangeOrder
}) => {
  const {
    currentTab,
    setCurrentTab,
    setSelectedProjectId,
    searchQuery,
    setSearchQuery,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsHomeownerPortal
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (createRef.current && !createRef.current.contains(e.target as Node)) {
        setShowCreateMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return { title: 'Dashboard Overview', desc: 'Welcome back, Nancy. Here is what is happening across your job sites today.' };
      case 'leads':
        return { title: 'Leads & Estimates', desc: 'Manage incoming client inquiries, schedule on-site walkthroughs, and create itemized bids.' };
      case 'projects':
        return { title: 'Projects Management', desc: 'Active construction projects, timelines, task tracking, and milestone completion.' };
      case 'schedule':
        return { title: 'Schedule & Calendar', desc: 'City inspections, client walkthroughs, material deliveries, and crew allocations.' };
      case 'updates':
        return { title: 'Daily Site Updates', desc: 'Real-time field reports, progress logs, site photos, and weather conditions.' };
      case 'team':
        return { title: 'Team Directory', desc: 'Unlimited Construction craft crew, project managers, and trade specialists.' };
      case 'documents':
        return { title: 'Documents & Permits', desc: 'Building permits, structural plans, prime contracts, change orders, and invoices.' };
      case 'changeorders':
        return { title: 'Change Orders', desc: 'Manage project scope modifications, material upgrades, and client approvals.' };
      case 'clients':
        return { title: 'Client Directory', desc: 'Homeowner relationships, property addresses, and project histories.' };
      case 'settings':
        return { title: 'Company Settings', desc: 'License information, office details, markup rates, and preferences.' };
      default:
        return { title: 'Unlimited Construction', desc: 'General Contracting Platform' };
    }
  };

  const { title, desc } = getPageTitle();

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    if (notif.projectId) {
      setSelectedProjectId(notif.projectId);
      setCurrentTab('projects');
    } else if (notif.linkTab) {
      setCurrentTab(notif.linkTab as any);
    }
    setShowNotifications(false);
  };

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden text-slate-500 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
              {title}
            </h1>
            <p className="hidden md:block text-xs text-slate-500 truncate max-w-xl">
              {desc}
            </p>
          </div>
        </div>

        {/* Right: Search, Quick Add, Portal Switcher, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search bar */}
          <div className="relative hidden lg:block w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, clients..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Create Dropdown */}
          <div className="relative" ref={createRef}>
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Action</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {showCreateMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-elevation p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Create Record
                </div>
                <button
                  onClick={() => { setShowCreateMenu(false); onOpenNewProject(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors text-left"
                >
                  <Briefcase className="w-4 h-4 text-brand-700" />
                  <span>New Project</span>
                </button>
                <button
                  onClick={() => { setShowCreateMenu(false); onOpenNewLead(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors text-left"
                >
                  <UserPlus className="w-4 h-4 text-brand-700" />
                  <span>New Lead Inquiry</span>
                </button>
                <button
                  onClick={() => { setShowCreateMenu(false); onOpenNewEstimate(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors text-left"
                >
                  <FileSpreadsheet className="w-4 h-4 text-brand-700" />
                  <span>Create Estimate</span>
                </button>
                <button
                  onClick={() => { setShowCreateMenu(false); onOpenNewUpdate(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors text-left"
                >
                  <Camera className="w-4 h-4 text-brand-700" />
                  <span>Log Daily Site Update</span>
                </button>
                <button
                  onClick={() => { setShowCreateMenu(false); onOpenNewChangeOrder(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors text-left border-t border-slate-100 mt-1"
                >
                  <FileSpreadsheet className="w-4 h-4 text-brand-700" />
                  <span>Draft Change Order</span>
                </button>
              </div>
            )}
          </div>

          {/* Switch to Homeowner Portal */}
          <button
            onClick={() => setIsHomeownerPortal(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-brand-700 bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 rounded-lg transition-all"
            title="Preview Homeowner Portal"
          >
            <ExternalLink className="w-3.5 h-3.5 text-brand-700" />
            <span>Client Portal</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600 ring-2 ring-white" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-elevation p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-brand-50 text-brand-700">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-brand-700 hover:text-brand-800 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="space-y-1 max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-2.5 rounded-xl text-left cursor-pointer transition-colors ${
                          n.read ? 'hover:bg-slate-50 opacity-70' : 'bg-brand-50/50 hover:bg-brand-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">
                            {n.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
