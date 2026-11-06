import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Camera, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MapPin, 
  ChevronRight, 
  Phone, 
  FileSpreadsheet, 
  UserPlus, 
  ShieldCheck, 
  Briefcase,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

interface MobileHomeTabProps {
  onNavigateToTab: (tab: any) => void;
  onOpenQuickUpdate: () => void;
  onOpenQuickLead: () => void;
}

export const MobileHomeTab: React.FC<MobileHomeTabProps> = ({
  onNavigateToTab,
  onOpenQuickUpdate,
  onOpenQuickLead,
}) => {
  const { 
    projects, 
    dailyUpdates, 
    scheduleEvents, 
    changeOrders, 
    setSelectedProjectId,
    updateChangeOrderStatus,
    showToast 
  } = useApp();

  const activeProjects = projects.filter(p => p.status === 'In Progress' || p.status === 'Planning');
  const pendingCOs = changeOrders.filter(co => co.status === 'Sent for Approval');
  const upcomingToday = scheduleEvents.slice(0, 3);

  const handleQuickApprove = (coId: string) => {
    updateChangeOrderStatus(coId, 'Approved', 'Nancy Paramo (Verified Verbal Approval)');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Nancy Paramo Mobile Profile Card */}
      <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 text-white rounded-2xl p-4 shadow-card relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/10 text-white font-extrabold text-sm flex items-center justify-center border border-white/20">
              NP
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-extrabold tracking-tight">Nancy Paramo</h2>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-white/70">General Contractor • Lic #1040445</p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            All Sites Active
          </span>
        </div>

        {/* Quick metrics in hero card */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
          <div>
            <span className="text-[10px] text-white/60 block">Active Jobs</span>
            <span className="text-base font-extrabold text-white">{activeProjects.length}</span>
          </div>
          <div>
            <span className="text-[10px] text-white/60 block">Awaiting Sign</span>
            <span className="text-base font-extrabold text-amber-300">{pendingCOs.length}</span>
          </div>
          <div>
            <span className="text-[10px] text-white/60 block">Visits Today</span>
            <span className="text-base font-extrabold text-white">{upcomingToday.length}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcut Pills (Mobile Native Style) */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={onOpenQuickUpdate}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-brand-300 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-1">
            <Camera className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">Log Site</span>
        </button>

        <button
          onClick={() => onNavigateToTab('schedule')}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-brand-300 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-1">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">Schedule</span>
        </button>

        <button
          onClick={onOpenQuickLead}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-brand-300 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-1">
            <UserPlus className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">New Lead</span>
        </button>

        <button
          onClick={() => onNavigateToTab('more')}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-brand-300 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-1">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">Bids & COs</span>
        </button>
      </div>

      {/* Urgent Pending Approvals (Mobile Card) */}
      {pendingCOs.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>Pending Homeowner Signoff</span>
            </div>
            <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
              {pendingCOs.length} Action
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-amber-200/80 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900">{pendingCOs[0].title}</h4>
                <p className="text-[10px] text-slate-500">{pendingCOs[0].projectName}</p>
              </div>
              <span className="text-xs font-black text-brand-700 shrink-0">
                +${pendingCOs[0].totalCost.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => handleQuickApprove(pendingCOs[0].id)}
                className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verify & Approve</span>
              </button>
              <button
                onClick={() => onNavigateToTab('more')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                View Details →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Projects Quick Horizontal / Stack Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Active Job Sites ({activeProjects.length})
          </h3>
          <button
            onClick={() => onNavigateToTab('projects')}
            className="text-xs font-bold text-brand-700 flex items-center gap-0.5"
          >
            <span>All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {activeProjects.slice(0, 3).map((project) => (
            <div
              key={project.id}
              onClick={() => {
                setSelectedProjectId(project.id);
                onNavigateToTab('projects');
              }}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-subtle hover:border-brand-300 transition-all cursor-pointer space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                      {project.category}
                    </span>
                    <StatusBadge status={project.status} size="sm" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">
                    {project.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{project.location}</span>
                    <span>•</span>
                    <span>Client: {project.clientName}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">Progress</span>
                  <span className="text-xs font-black text-slate-900">{project.progress}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-700"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Schedule Agenda */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Today's Schedule & Inspections
          </h3>
          <button
            onClick={() => onNavigateToTab('schedule')}
            className="text-xs font-bold text-brand-700 flex items-center gap-0.5"
          >
            <span>Calendar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {upcomingToday.map((evt) => (
            <div
              key={evt.id}
              onClick={() => onNavigateToTab('schedule')}
              className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 font-extrabold text-[10px] flex items-center justify-center shrink-0">
                  {evt.time.split(' ')[0]}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 truncate text-xs">{evt.title}</h4>
                  <p className="text-[10px] text-slate-500 truncate">{evt.projectName} • {evt.location}</p>
                </div>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 shrink-0">
                {evt.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Field Photos */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Latest Site Progress Photos
          </h3>
          <button
            onClick={() => onNavigateToTab('updates')}
            className="text-xs font-bold text-brand-700"
          >
            All Photos →
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {dailyUpdates.flatMap(u => u.photos).slice(0, 2).map((photo, i) => (
            <div
              key={i}
              onClick={() => onNavigateToTab('updates')}
              className="rounded-xl overflow-hidden border border-slate-200 aspect-video relative group cursor-pointer"
            >
              <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                <span className="text-[9px] text-white font-medium truncate">{photo.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
