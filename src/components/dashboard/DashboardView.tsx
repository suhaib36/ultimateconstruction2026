import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Briefcase, 
  UserPlus, 
  FileSpreadsheet, 
  AlertCircle, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Camera, 
  FileText, 
  ExternalLink,
  DollarSign,
  TrendingUp,
  HardHat
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    projects, 
    leads, 
    estimates, 
    changeOrders, 
    scheduleEvents, 
    dailyUpdates, 
    setCurrentTab, 
    setSelectedProjectId,
    updateChangeOrderStatus,
    updateMilestoneStatus,
    showToast
  } = useApp();

  // Metrics
  const activeProjects = projects.filter(p => p.status === 'In Progress' || p.status === 'Planning');
  const newLeads = leads.filter(l => l.status === 'New' || l.status === 'Contacted' || l.status === 'Site Visit Scheduled');
  const pendingEstimates = estimates.filter(e => e.status === 'Draft' || e.status === 'Sent');
  const pendingApprovals = changeOrders.filter(co => co.status === 'Sent for Approval');
  const upcomingVisits = scheduleEvents.filter(e => e.type === 'Site Visit' || e.type === 'Inspection');

  const totalActiveBudget = activeProjects.reduce((sum, p) => sum + p.budget, 0);

  // Quick Action Handler
  const handleApproveCO = (coId: string) => {
    updateChangeOrderStatus(coId, 'Approved', 'Nancy Paramo (Verified with Client)');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-card relative overflow-hidden">
        {/* Subtle decorative construction blueprint pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              California License #1040445 • All Sites Operational
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Good morning, Nancy
            </h2>
            <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              You have <strong className="text-white">{activeProjects.length} active projects</strong> across Riverside, Temecula, Corona, and Murrieta with <strong className="text-white">{pendingApprovals.length} change order</strong> awaiting homeowner approval.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('schedule')}
              className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-brand-700" />
              <span>Today’s Schedule</span>
            </button>
            <button
              onClick={() => setCurrentTab('projects')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold backdrop-blur-xs transition-colors flex items-center gap-1.5"
            >
              <span>View All Projects</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* 1. Active Projects */}
        <div 
          onClick={() => setCurrentTab('projects')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-subtle hover:border-brand-300 hover:shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Projects</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{activeProjects.length}</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 100% on track
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            ${(totalActiveBudget / 1000).toFixed(0)}k active pipeline value
          </p>
        </div>

        {/* 2. New Leads */}
        <div 
          onClick={() => setCurrentTab('leads')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-subtle hover:border-brand-300 hover:shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">New Leads</span>
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{newLeads.length}</span>
            <span className="text-xs text-brand-700 font-bold bg-brand-50 px-1.5 py-0.5 rounded">
              +{leads.filter(l => l.status === 'New').length} new
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            Riverside & Temecula inquiries
          </p>
        </div>

        {/* 3. Pending Estimates */}
        <div 
          onClick={() => setCurrentTab('leads')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-subtle hover:border-brand-300 hover:shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Estimates</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{pendingEstimates.length}</span>
            <span className="text-xs text-amber-700 font-medium">Bids in review</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            ${(pendingEstimates.reduce((s, e) => s + e.totalEstimatedCost, 0) / 1000).toFixed(0)}k proposed total
          </p>
        </div>

        {/* 4. Pending Approvals */}
        <div 
          onClick={() => setCurrentTab('changeorders')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-subtle hover:border-brand-300 hover:shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Approvals</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-brand-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-brand-700">{pendingApprovals.length}</span>
            <span className="text-xs text-brand-700 font-bold bg-brand-50 px-1.5 py-0.5 rounded">
              Needs signature
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            Martinez ADU Fleetwood door
          </p>
        </div>

        {/* 5. Upcoming Site Visits */}
        <div 
          onClick={() => setCurrentTab('schedule')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-subtle hover:border-brand-300 hover:shadow-card transition-all cursor-pointer group col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Upcoming Visits</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{upcomingVisits.length}</span>
            <span className="text-xs text-purple-700 font-medium">This week</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            Inspections & consultations
          </p>
        </div>
      </div>

      {/* Section D: Pending Actions Requiring Nancy's Attention */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            <h3 className="text-sm font-bold text-amber-900">
              Pending Actions Requiring Nancy’s Immediate Attention
            </h3>
          </div>
          <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
            3 items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Action 1 */}
          <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider">Change Order #2</span>
                <span className="text-xs font-bold text-slate-900">$9,800</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 mt-1">Martinez ADU – Fleetwood Bifold Door</h4>
              <p className="text-[11px] text-slate-600 mt-1">Elena reviewed scope; awaiting digital signoff or verbal verification.</p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleApproveCO('co-2')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verify & Approve</span>
              </button>
              <button
                onClick={() => { setSelectedProjectId('proj-2'); setCurrentTab('projects'); }}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
              >
                <span>Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action 2 */}
          <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Site Consultation</span>
                <span className="text-xs font-medium text-slate-500">Sat, Nov 8 • 10 AM</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 mt-1">Scott Residence – Kitchen & Wall Removal</h4>
              <p className="text-[11px] text-slate-600 mt-1">Bring laser meter, cabinet chips & engineered LVL span sheets.</p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => { setCurrentTab('leads'); }}
                className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
              >
                <span>View Lead Scope</span>
              </button>
              <button
                onClick={() => { setCurrentTab('schedule'); }}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
              >
                <span>Calendar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action 3 */}
          <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">City Inspection</span>
                <span className="text-xs font-medium text-slate-500">Nov 14 • 1:00 PM</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 mt-1">City of Riverside – 4-Way Combination</h4>
              <p className="text-[11px] text-slate-600 mt-1">Martinez ADU plumbing, electrical, framing combo inspection.</p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => { setSelectedProjectId('proj-2'); setCurrentTab('projects'); }}
                className="text-xs font-bold text-brand-700 hover:text-brand-800"
              >
                Check Checklist
              </button>
              <button
                onClick={() => setCurrentTab('schedule')}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
              >
                <span>Confirm</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: A. Active Projects & Side Col: B. Recent Activity + C. Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): A. Active Projects */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  A. Active Construction Projects
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct oversight of job progress, budgets, and milestone schedules
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('projects')}
                className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
              >
                <span>View Full List</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {activeProjects.map((project) => {
                const percent = project.progress;
                return (
                  <div
                    key={project.id}
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setCurrentTab('projects');
                    }}
                    className="p-4 rounded-xl border border-slate-200/80 hover:border-brand-300 hover:shadow-card transition-all cursor-pointer group bg-slate-50/40 hover:bg-white"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                            {project.name}
                          </h4>
                          <StatusBadge status={project.status} />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                          <span className="font-medium text-slate-700">Client: {project.clientName}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {project.location}
                          </span>
                          <span>•</span>
                          <span className="text-slate-500">
                            Target: <strong className="text-slate-700">{project.targetCompletion}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-semibold text-slate-500">Budget Progress</div>
                        <div className="text-sm font-bold text-slate-900">
                          ${(project.amountSpent / 1000).toFixed(1)}k / ${(project.budget / 1000).toFixed(0)}k
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[11px] text-slate-500">Construction Milestone Progress</span>
                        <span className="text-xs font-bold text-slate-900">{percent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            percent >= 80 ? 'bg-emerald-500' : percent >= 50 ? 'bg-brand-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* C. Upcoming Schedule / Calendar Highlights */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  C. Upcoming Schedule & Site Visits
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scheduled inspections, client consultations, and crew work
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('schedule')}
                className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
              >
                <span>Full Calendar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scheduleEvents.slice(0, 4).map((evt) => (
                <div
                  key={evt.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex flex-col items-center justify-center shrink-0 border border-slate-200">
                    <span className="text-[10px] font-bold text-brand-700 uppercase">
                      {new Date(evt.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 leading-none">
                      {evt.date.split('-')[2]}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-1.5 py-0.2 rounded">
                        {evt.type}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {evt.time}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">
                      {evt.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {evt.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): B. Recent Activity Feed */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  B. Recent Activity Feed
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live updates from Nancy and field crew
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('updates')}
                className="text-xs font-semibold text-brand-700 hover:text-brand-800"
              >
                View Updates
              </button>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {dailyUpdates.slice(0, 3).map((upd) => (
                <div key={upd.id} className="relative pl-6 pb-4 border-l border-slate-200 last:pb-0">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-brand-600 ring-4 ring-brand-50" />
                  
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900">{upd.authorName}</span>
                    <span className="text-[11px] text-slate-400">{upd.date}</span>
                  </div>
                  
                  <p className="text-[11px] font-semibold text-brand-700 mb-1">
                    {upd.projectName}
                  </p>
                  
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {upd.workCompleted}
                  </p>

                  {/* Thumbnail Preview */}
                  {upd.photos && upd.photos.length > 0 && (
                    <div className="mt-2.5 flex items-center gap-2">
                      {upd.photos.slice(0, 2).map((photo, i) => (
                        <div key={i} className="relative rounded-lg overflow-hidden border border-slate-200 w-16 h-12 shrink-0 group">
                          <img
                            src={photo.url}
                            alt={photo.caption}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                      <span className="text-[10px] text-slate-400 font-medium">
                        {upd.photos.length} photos attached
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {/* Estimate Sent Activity */}
              <div className="relative pl-6 pb-4 border-l border-slate-200">
                <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-50" />
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-900">Nancy Paramo</span>
                  <span className="text-[11px] text-slate-400">Nov 04</span>
                </div>
                <p className="text-[11px] font-semibold text-blue-700 mb-1">
                  Estimate #EST-1049 Sent
                </p>
                <p className="text-xs text-slate-600">
                  Transmitted itemized scope ($77,770) for Dr. Vance’s second-story master suite addition in Corona.
                </p>
              </div>

              {/* Milestone Completed Activity */}
              <div className="relative pl-6 border-l border-slate-200">
                <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-50" />
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-900">Mateo Rivera</span>
                  <span className="text-[11px] text-slate-400">Nov 05</span>
                </div>
                <p className="text-[11px] font-semibold text-emerald-700 mb-1">
                  Concrete Pour Completed
                </p>
                <p className="text-xs text-slate-600">
                  Williams Driveway – 42 yards stamped ashlar slate poured and textured.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Support / Nancy's Contractor Hotline Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                UC
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-tight">Unlimited Construction</h4>
                <p className="text-xs text-slate-400">Riverside County HQ • (951) 609-7164</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              General B Licensed Contractor #1040445. Dedicated to quality craftsmanship, honest communication, and on-schedule delivery.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Bonded & Insured
              </span>
              <button
                onClick={() => setCurrentTab('settings')}
                className="text-brand-300 hover:text-white font-medium"
              >
                License Details →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
