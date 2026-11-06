import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  User, 
  ExternalLink, 
  ShieldCheck, 
  Phone,
  Check,
  X
} from 'lucide-react';

interface MobileHeaderProps {
  onOpenQuickUpdate?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = () => {
  const { 
    isHomeownerPortal, 
    setIsHomeownerPortal, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    setSelectedProjectId
  } = useApp();

  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 select-none shadow-2xs">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center text-white shrink-0 shadow-xs font-black text-xs">
            UC
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 tracking-tight text-sm leading-none">
                UNLIMITED
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-700 shrink-0" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5 truncate">
              Nancy Paramo • Lic #1040445
            </span>
          </div>
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Direct Call Button */}
          <a
            href="tel:9516097164"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            title="Call Nancy Paramo"
          >
            <Phone className="w-3.5 h-3.5 text-brand-700" />
            <span>(951) 609-7164</span>
          </a>

          {/* Mode Switcher Pill: Contractor Mode ⇄ Client Portal */}
          <button
            onClick={() => setIsHomeownerPortal(!isHomeownerPortal)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isHomeownerPortal 
                ? 'bg-brand-50 text-brand-700 border border-brand-200' 
                : 'bg-brand-700 hover:bg-brand-800 text-white shadow-xs'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>
              {isHomeownerPortal ? 'Contractor Mode' : 'Client Portal'}
            </span>
          </button>

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-600 ring-2 ring-white" />
              )}
            </button>

            {/* Notifications Dropdown Sheet */}
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-brand-700 text-white">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[10px] text-brand-700 font-semibold hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="space-y-1.5 max-h-64 overflow-y-auto mt-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No notifications.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.projectId) setSelectedProjectId(n.projectId);
                          setShowNotifs(false);
                        }}
                        className={`p-2.5 rounded-xl text-left cursor-pointer transition-colors text-xs ${
                          n.read ? 'bg-slate-50/70 hover:bg-slate-100' : 'bg-brand-50/40 hover:bg-brand-50 border border-brand-100'
                        }`}
                      >
                        <div className="font-bold text-slate-900 text-xs leading-snug">{n.title}</div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">{n.message}</p>
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
