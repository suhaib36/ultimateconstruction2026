import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  MessageSquare, 
  Phone, 
  Mail, 
  AlertCircle, 
  Send, 
  Download, 
  PenTool, 
  ShieldCheck, 
  Check, 
  Eye,
  Camera,
  ChevronRight,
  User,
  XCircle,
  HelpCircle,
  Sparkles,
  FileCheck,
  Home,
  X,
  ExternalLink
} from 'lucide-react';

export const HomeownerPortal: React.FC = () => {
  const { 
    projects, 
    dailyUpdates, 
    documents, 
    changeOrders, 
    messages, 
    activeHomeownerProjectId, 
    setActiveHomeownerProjectId, 
    setIsHomeownerPortal,
    updateChangeOrderStatus,
    sendMessage,
    showToast 
  } = useApp();

  type PortalTab = 'myproject' | 'progress' | 'schedule' | 'documents' | 'approvals' | 'contact';
  const [activeTab, setActiveTab] = useState<PortalTab>('myproject');

  // Interactive Modals
  const [signingCO, setSigningCO] = useState<typeof changeOrders[0] | null>(null);
  const [rejectingCO, setRejectingCO] = useState<typeof changeOrders[0] | null>(null);
  const [signatureText, setSignatureText] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [portalChatInput, setPortalChatInput] = useState('');
  const [previewDoc, setPreviewDoc] = useState<typeof documents[0] | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<{ url: string; caption: string; date?: string } | null>(null);
  const [isNancyTyping, setIsNancyTyping] = useState(false);

  const activeProject = projects.find(p => p.id === activeHomeownerProjectId) || projects[0];
  const projectUpdates = dailyUpdates.filter(u => u.projectId === activeProject.id);
  const projectDocs = documents.filter(d => d.projectId === activeProject.id);
  const projectCOs = changeOrders.filter(co => co.projectId === activeProject.id);
  const pendingCOs = projectCOs.filter(co => co.status === 'Sent for Approval');
  const projectMessages = messages.filter(m => m.projectId === activeProject.id);

  // Send message to Nancy with realistic simulated auto-reply
  const handlePortalSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalChatInput.trim()) return;

    const userMsg = portalChatInput.trim();
    sendMessage(activeProject.id, userMsg, 'Homeowner');
    setPortalChatInput('');

    // Simulate Nancy Paramo live auto-response after 1.2 seconds
    setIsNancyTyping(true);
    setTimeout(() => {
      setIsNancyTyping(false);
      let reply = `Hi ${activeProject.clientName.split(' ')[0]}! Nancy here. Thanks for your note. I'm reviewing our job site logs with the superintendent and will follow up with you directly. Let me know if you need anything else!`;
      
      if (userMsg.toLowerCase().includes('inspection')) {
        reply = `Hi ${activeProject.clientName.split(' ')[0]}! The city inspector is scheduled for this coming week. All rough MEP and framing sign-offs are on schedule.`;
      } else if (userMsg.toLowerCase().includes('saturday') || userMsg.toLowerCase().includes('weekend')) {
        reply = `Hi ${activeProject.clientName.split(' ')[0]}! Yes, our tile and finish crew will be doing quiet interior prep on Saturday between 9am and 2pm.`;
      } else if (userMsg.toLowerCase().includes('cost') || userMsg.toLowerCase().includes('price') || userMsg.toLowerCase().includes('change')) {
        reply = `Hi ${activeProject.clientName.split(' ')[0]}! You can review the itemized breakdown under the Approvals tab. Feel free to call me directly at (951) 609-7164 if you have questions!`;
      }

      sendMessage(activeProject.id, reply, 'Nancy Paramo');
    }, 1400);
  };

  const handleQuickChipClick = (promptText: string) => {
    setPortalChatInput(promptText);
  };

  // Sign Change Order
  const handleSignCOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signingCO || !signatureText.trim()) return;

    updateChangeOrderStatus(signingCO.id, 'Approved', signatureText);
    showToast('Change Order Authorized', `You approved ${signingCO.orderNumber}. Nancy has been notified.`, 'success');
    
    // Also post confirmation in chat
    sendMessage(
      activeProject.id, 
      `[Change Order Approved]: I have electronically authorized ${signingCO.orderNumber} (${signingCO.title}) for $${signingCO.totalCost.toLocaleString()}.`, 
      'Homeowner'
    );
    
    setSigningCO(null);
    setSignatureText('');
  };

  // Request Revision / Reject Change Order
  const handleRejectCOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingCO) return;

    updateChangeOrderStatus(rejectingCO.id, 'Rejected');
    showToast('Revision Requested', `Nancy Paramo was alerted to review your questions regarding ${rejectingCO.orderNumber}.`, 'info');
    
    // Auto post revision notes to chat
    sendMessage(
      activeProject.id, 
      `[Revision Request for ${rejectingCO.orderNumber}]: ${rejectReason || 'I would like to discuss alternative materials or pricing adjustments for this item.'}`, 
      'Homeowner'
    );

    setRejectingCO(null);
    setRejectReason('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col selection:bg-brand-100 selection:text-brand-900">
      {/* ================= TOP MOBILE APP HEADER (CLIENT PORTAL) ================= */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          {/* Brand & Portal Label */}
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
              <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider block mt-0.5 truncate">
                Homeowner Portal
              </span>
            </div>
          </div>

          {/* Quick Actions: Call Nancy & Return to Contractor App */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="tel:9516097164"
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Call Nancy Paramo"
            >
              <Phone className="w-3.5 h-3.5 text-brand-700" />
              <span className="hidden sm:inline">(951) 609-7164</span>
            </a>

            <button
              onClick={() => setIsHomeownerPortal(false)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Contractor Mode</span>
            </button>
          </div>
        </div>

        {/* Client / Project Selector Banner */}
        <div className="bg-slate-50 border-t border-slate-100 px-4 py-2">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-slate-400 font-semibold shrink-0 text-[11px]">Viewing as:</span>
              <select
                value={activeHomeownerProjectId}
                onChange={(e) => setActiveHomeownerProjectId(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 truncate max-w-[220px] sm:max-w-xs"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.clientName} ({p.name.split('–')[0].trim()})
                  </option>
                ))}
              </select>
            </div>

            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Project
            </span>
          </div>
        </div>

        {/* Top Horizontal Pill Navigation for Quick Thumb Scrubbing */}
        <div className="bg-white border-t border-slate-100 px-4 py-1.5 overflow-x-auto scrollbar-none">
          <div className="max-w-4xl mx-auto flex items-center gap-1.5">
            {[
              { id: 'myproject', label: 'My Project' },
              { id: 'progress', label: `Progress & Photos (${projectUpdates.length})` },
              { id: 'schedule', label: 'Schedule' },
              { id: 'documents', label: `Documents (${projectDocs.length})` },
              { id: 'approvals', label: 'Approvals', badge: pendingCOs.length > 0 ? pendingCOs.length : undefined },
              { id: 'contact', label: 'Contact Nancy' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as PortalTab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-extrabold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-brand-700 text-white animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ================= MAIN HOMEOWNER CONTENT VIEW ================= */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-3.5 sm:px-6 py-4 pb-28 space-y-4">
        {/* ================= TAB 1: MY PROJECT OVERVIEW ================= */}
        {activeTab === 'myproject' && (
          <div className="space-y-4">
            {/* Project Hero Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] sm:text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200/60">
                      {activeProject.category}
                    </span>
                    <StatusBadge status={activeProject.status} size="sm" />
                    <span className="text-[11px] text-slate-400 font-medium">
                      Permit #{activeProject.permitNumber || 'RIV-2026-8802'}
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    {activeProject.name}
                  </h1>

                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                    <span>{activeProject.address}</span>
                  </p>
                </div>

                {/* Progress Metric Box */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center shrink-0 min-w-[140px] sm:min-w-[160px] self-start sm:self-auto">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Completion
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-brand-700 tracking-tight mt-0.5">
                    {activeProject.progress}%
                  </div>
                  <div className="mt-1 text-[11px] font-semibold text-slate-600 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Target: {activeProject.targetCompletion}</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-700 transition-all duration-700"
                    style={{ width: `${activeProject.progress}%` }}
                  />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                {activeProject.description}
              </p>
            </div>

            {/* Pending Approvals Urgent Callout Banner */}
            {pendingCOs.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-amber-950">
                      Scope Change Awaiting Your Authorization ({pendingCOs.length})
                    </h3>
                    <p className="text-xs text-amber-800 mt-0.5">
                      <strong>{pendingCOs[0].title}</strong> (+${pendingCOs[0].totalCost.toLocaleString()}). Review cost breakdown and authorize online.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('approvals')}
                  className="px-4 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center justify-center gap-1.5"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Review & Approve Now</span>
                </button>
              </div>
            )}

            {/* Nancy Paramo Direct Contact Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-700 text-white font-black text-sm flex items-center justify-center shrink-0 ring-4 ring-brand-100">
                  NP
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">Nancy Paramo</h3>
                  <p className="text-xs text-brand-700 font-bold uppercase tracking-wider">General Contractor & Owner</p>
                  <p className="text-[11px] text-slate-400">California License #1040445 (Class B)</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-100">
                "We take personal pride in your home. Feel free to call, text, or message me directly in this portal anytime."
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="tel:9516097164"
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-700" />
                  <span>Call Nancy</span>
                </a>

                <button
                  onClick={() => setActiveTab('contact')}
                  className="py-2.5 px-3 bg-brand-700 hover:bg-brand-800 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message Nancy</span>
                </button>
              </div>
            </div>

            {/* Latest Daily Field Update Snippet */}
            {projectUpdates.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-brand-700" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">Latest Field Update</h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {projectUpdates[0].date}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {projectUpdates[0].workCompleted}
                </p>

                {projectUpdates[0].photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {projectUpdates[0].photos.slice(0, 2).map((photo, i) => (
                      <div
                        key={i}
                        onClick={() => setLightboxPhoto(photo)}
                        className="rounded-xl overflow-hidden border border-slate-200 aspect-video relative group cursor-pointer"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] text-slate-500">Reported by: <strong className="text-slate-800">{projectUpdates[0].authorName}</strong></span>
                  <button
                    onClick={() => setActiveTab('progress')}
                    className="text-xs font-bold text-brand-700 hover:underline"
                  >
                    View All Updates →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: PROGRESS & PHOTOS ================= */}
        {activeTab === 'progress' && (
          <div className="space-y-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-subtle flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Daily Site Progress Logs</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Field logs & photos logged by Nancy Paramo and field crew for {activeProject.name}
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {projectUpdates.length} Updates
              </span>
            </div>

            <div className="space-y-4">
              {projectUpdates.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                  No progress updates logged for this project yet.
                </div>
              ) : (
                projectUpdates.map((upd) => (
                  <div key={upd.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 space-y-3.5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-brand-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {upd.authorName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">{upd.authorName}</h4>
                          <span className="text-[11px] text-slate-400">{upd.authorRole}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-xs text-slate-700 font-bold block">
                          {upd.date}
                        </span>
                        <span className="text-[10px] text-amber-700 font-medium">
                          {upd.weather.temp} • {upd.weather.condition}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-0.5">
                          Work Completed Today
                        </span>
                        <p className="text-slate-800 leading-relaxed">
                          {upd.workCompleted}
                        </p>
                      </div>

                      {upd.workPlannedTomorrow && (
                        <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block mb-0.5">
                            Work Planned Next
                          </span>
                          <p className="text-slate-800 leading-relaxed">
                            {upd.workPlannedTomorrow}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Photos with Click to View Lightbox */}
                    {upd.photos && upd.photos.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                          Photos ({upd.photos.length}) — Tap to view full size
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {upd.photos.map((p, idx) => (
                            <div
                              key={idx}
                              onClick={() => setLightboxPhoto(p)}
                              className="rounded-xl overflow-hidden border border-slate-200 group bg-slate-100 aspect-video relative cursor-pointer"
                            >
                              <img
                                src={p.url}
                                alt={p.caption}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                                <span className="text-[10px] text-white font-medium truncate">{p.caption}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: SCHEDULE ================= */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 sm:p-6 space-y-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Project Timeline & Milestones</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Key construction phases, city inspections, and completion target dates
              </p>
            </div>

            <div className="relative pl-6 sm:pl-7 space-y-5 border-l-2 border-slate-200">
              {activeProject.milestones.map((m, idx) => (
                <div key={m.id} className="relative group">
                  <div className={`absolute -left-[31px] sm:-left-[35px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                    m.status === 'Completed' ? 'bg-emerald-600 border-white text-white shadow-xs' :
                    m.status === 'In Progress' ? 'bg-brand-700 border-white text-white ring-4 ring-brand-100' : 'bg-white border-slate-300 text-slate-400'
                  }`}>
                    {m.status === 'Completed' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                  </div>

                  <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{m.title}</h4>
                      {m.notes && <p className="text-[11px] text-slate-600 mt-0.5">{m.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      <span className="text-[11px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                        {m.date}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        m.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        m.status === 'In Progress' ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: DOCUMENTS ================= */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 sm:p-6 space-y-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Project Documents & Permits</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Master agreement, city building permits, and architectural drawings
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {projectDocs.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400">No documents uploaded for this project yet.</p>
              ) : (
                projectDocs.map((doc) => (
                  <div key={doc.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-xs shrink-0 border border-brand-100">
                        PDF
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{doc.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {doc.category} • {doc.fileSize} • Uploaded {doc.uploadDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={() => showToast('Downloading File', `Downloading ${doc.name}...`)}
                        className="px-3 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 5: APPROVALS & CHANGE ORDERS ================= */}
        {activeTab === 'approvals' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-subtle">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Change Orders & Authorizations</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review any additional work requested or required by field conditions with transparent pricing
              </p>
            </div>

            {projectCOs.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                No change orders currently on file for your project.
              </div>
            ) : (
              <div className="space-y-4">
                {projectCOs.map((co) => (
                  <div key={co.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 space-y-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                            {co.orderNumber}
                          </span>
                          <StatusBadge status={co.status} size="sm" />
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">{co.title}</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">Reason: {co.reason}</p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Additional Cost</span>
                        <div className="text-lg sm:text-xl font-black text-slate-900">${co.totalCost.toLocaleString()}</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {co.description}
                    </p>

                    {/* Cost Breakdown */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Labor</span>
                        <p className="font-bold text-slate-900 text-xs mt-0.5">${co.laborCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Materials</span>
                        <p className="font-bold text-slate-900 text-xs mt-0.5">${co.materialCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Subcontractors</span>
                        <p className="font-bold text-slate-900 text-xs mt-0.5">${co.subcontractorCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Fees / Other</span>
                        <p className="font-bold text-slate-900 text-xs mt-0.5">${co.otherCost.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Interactive Action Buttons */}
                    {co.status === 'Sent for Approval' && (
                      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                        <button
                          onClick={() => setRejectingCO(co)}
                          className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                        >
                          Request Revision / Questions
                        </button>

                        <button
                          onClick={() => {
                            setSigningCO(co);
                            setSignatureText(activeProject.clientName);
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <PenTool className="w-3.5 h-3.5" />
                          <span>Approve & Sign Electronically</span>
                        </button>
                      </div>
                    )}

                    {co.status === 'Approved' && (
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Authorized by <strong>{co.clientSignature || activeProject.clientName}</strong> on {co.approvedDate || 'Today'}.</span>
                      </div>
                    )}

                    {co.status === 'Rejected' && (
                      <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 flex items-center gap-2 font-medium">
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Revision requested. Nancy Paramo has been alerted in chat to review your notes.</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 6: CONTACT NANCY (LIVE CHAT & PROFILE) ================= */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            {/* Nancy Paramo Profile & Phone Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-700 text-white font-black text-sm flex items-center justify-center shrink-0 ring-4 ring-brand-100">
                  NP
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900">Nancy Paramo</h3>
                  <p className="text-xs text-brand-700 font-bold uppercase tracking-wider">General Contractor & Owner</p>
                  <p className="text-[11px] text-slate-400">California License #1040445 (Class B)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <a
                  href="tel:9516097164"
                  className="flex items-center gap-2 text-slate-700 hover:text-brand-700 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100 transition-colors"
                >
                  <Phone className="w-4 h-4 text-brand-700 shrink-0" />
                  <span>(951) 609-7164</span>
                </a>

                <a
                  href="mailto:unlimitedconstruction@mail.com"
                  className="flex items-center gap-2 text-slate-700 hover:text-brand-700 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100 transition-colors truncate"
                >
                  <Mail className="w-4 h-4 text-brand-700 shrink-0" />
                  <span className="truncate">unlimitedconstruction@mail.com</span>
                </a>
              </div>

              <div className="flex items-start gap-2 text-slate-500 text-[11px] p-2 bg-slate-50/50 rounded-xl">
                <MapPin className="w-3.5 h-3.5 text-brand-700 shrink-0 mt-0.5" />
                <span>4193 Flat Rock Dr, Suite 200-435, Riverside, CA 92505</span>
              </div>
            </div>

            {/* Direct Interactive Mobile Chat with Nancy */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-4 sm:p-5 flex flex-col justify-between space-y-3 min-h-[380px]">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">Direct Message Thread</h3>
                  <p className="text-[11px] text-slate-400">Instant direct messages to Nancy Paramo</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Nancy Online
                </span>
              </div>

              {/* Chat Message Stream */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto p-3 bg-slate-50/70 rounded-2xl border border-slate-100 flex-1">
                {projectMessages.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">No messages in chat history yet. Send a note below!</p>
                ) : (
                  projectMessages.map((m) => {
                    const isHomeowner = m.sender === 'Homeowner';
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isHomeowner ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 mb-0.5">
                          <span className="font-bold text-slate-700">{m.sender}</span>
                          <span>•</span>
                          <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div
                          className={`max-w-[85%] sm:max-w-md p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isHomeowner
                              ? 'bg-brand-700 text-white rounded-tr-xs shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs'
                          }`}
                        >
                          {m.content}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Simulated Typing Indicator */}
                {isNancyTyping && (
                  <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 max-w-[140px] text-xs text-slate-500 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-brand-700 animate-ping" />
                    <span className="text-[10px] font-bold">Nancy is typing...</span>
                  </div>
                )}
              </div>

              {/* Quick suggestion prompt chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickChipClick("When is the next inspection scheduled?")}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 font-medium whitespace-nowrap transition-colors"
                >
                  "When is next inspection?"
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickChipClick("Will the crew be working this Saturday?")}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 font-medium whitespace-nowrap transition-colors"
                >
                  "Working this Saturday?"
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickChipClick("Can we review the paint and finish options?")}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 font-medium whitespace-nowrap transition-colors"
                >
                  "Review paint options?"
                </button>
              </div>

              {/* Chat Composer */}
              <form onSubmit={handlePortalSendMessage} className="flex gap-2 pt-1 border-t border-slate-100">
                <input
                  type="text"
                  value={portalChatInput}
                  onChange={(e) => setPortalChatInput(e.target.value)}
                  placeholder="Type a message or question for Nancy..."
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                />
                <button
                  type="submit"
                  disabled={!portalChatInput.trim()}
                  className="px-4 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs sm:text-sm font-bold disabled:opacity-50 transition-colors shadow-xs flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ================= PROPER MOBILE BOTTOM NAVIGATION BAR (HOMEOWNER PORTAL) ================= */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg py-1.5 px-2 select-none">
        <div className="max-w-4xl mx-auto flex items-center justify-around">
          {[
            { id: 'myproject', label: 'Project', icon: Home },
            { id: 'progress', label: 'Progress', icon: Camera, badge: projectUpdates.length },
            { id: 'schedule', label: 'Schedule', icon: Calendar },
            { id: 'documents', label: 'Docs', icon: FileText },
            { id: 'approvals', label: 'Approvals', icon: CheckCircle2, badge: pendingCOs.length > 0 ? pendingCOs.length : undefined },
            { id: 'contact', label: 'Chat', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as PortalTab)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative min-h-[46px] ${
                  isActive
                    ? 'text-brand-700 font-bold scale-105'
                    : 'text-slate-400 hover:text-slate-700 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                  {tab.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 px-1.5 py-0.2 text-[9px] font-black rounded-full bg-brand-700 text-white">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">
                  {tab.label}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-brand-700 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ================= MODAL: E-SIGN CHANGE ORDER ================= */}
      {signingCO && (
        <Modal
          isOpen={!!signingCO}
          onClose={() => setSigningCO(null)}
          title={`Electronic Authorization: ${signingCO.orderNumber}`}
          subtitle={`Amount: +$${signingCO.totalCost.toLocaleString()}`}
          maxWidth="md"
        >
          <form onSubmit={handleSignCOSubmit} className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              By typing your legal name below, you confirm and authorize Unlimited Construction to perform the additional scope described in <strong>{signingCO.title}</strong> for an additional <strong>${signingCO.totalCost.toLocaleString()}</strong>.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Type Full Name (Legal E-Signature) *</label>
              <input
                type="text"
                required
                value={signatureText}
                onChange={(e) => setSignatureText(e.target.value)}
                placeholder="e.g. Elena Martinez"
                className="w-full px-3 py-2 text-base bg-slate-50 border border-slate-200 rounded-xl font-serif italic text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 font-mono">
              Timestamp: {new Date().toLocaleString()} • Authorized via Unlimited Construction Client Portal • CSLB #1040445
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSigningCO(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Authorize</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MODAL: REVISE / QUESTIONS ON CHANGE ORDER ================= */}
      {rejectingCO && (
        <Modal
          isOpen={!!rejectingCO}
          onClose={() => setRejectingCO(null)}
          title={`Request Revision: ${rejectingCO.orderNumber}`}
          subtitle="Submit questions or adjustments to Nancy Paramo"
          maxWidth="md"
        >
          <form onSubmit={handleRejectCOSubmit} className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Let Nancy know what modifications, questions, or alternative pricing you would like to explore for <strong>{rejectingCO.title}</strong>.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Questions / Reason for Revision</label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Can we look at alternative door hardware or finishes to lower cost?"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingCO(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs"
              >
                Submit Note to Nancy
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MODAL: DOCUMENT PREVIEW ================= */}
      {previewDoc && (
        <Modal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title={previewDoc.name}
          subtitle={`Category: ${previewDoc.category} • Related Project: ${previewDoc.projectName}`}
          maxWidth="2xl"
        >
          <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-xl space-y-4 text-slate-800">
            <div className="flex justify-between items-start pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                  UNLIMITED CONSTRUCTION
                </h3>
                <p className="text-xs text-brand-700 font-bold">CA License #1040445 • Nancy Paramo</p>
                <p className="text-[11px] text-slate-500 mt-0.5">4193 Flat Rock Dr, Riverside, CA 92505 • (951) 609-7164</p>
              </div>

              <div className="text-right">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                  OFFICIAL RECORD
                </span>
                <p className="text-[11px] text-slate-400 font-mono mt-1">Date: {previewDoc.uploadDate}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs leading-relaxed">
              <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-200 pb-2">
                <span>DOCUMENT: {previewDoc.name}</span>
                <span>SIZE: {previewDoc.fileSize}</span>
              </div>
              <p>
                This document constitutes official construction and municipal compliance records executed under the supervision of <strong>Nancy Paramo</strong>, licensed general contractor for Unlimited Construction.
              </p>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1 text-[11px]">
                <div className="font-bold text-slate-800">Verification Stamps & Approvals:</div>
                <div>• Verified against California Title 24 Energy Compliance standards.</div>
                <div>• Approved structural load calculations by Registered Professional Civil Engineer.</div>
                <div>• Job site permit postings active for Riverside County inspections.</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => showToast('Simulated Download', `Downloading ${previewDoc.name}...`)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Copy</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL: PHOTO LIGHTBOX ================= */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col justify-between p-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-white max-w-4xl mx-auto w-full">
            <span className="text-xs font-bold text-slate-300">Job Site Progress Photo</span>
            <button
              onClick={() => setLightboxPhoto(null)}
              className="p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center max-w-4xl mx-auto w-full my-auto p-2">
            <img
              src={lightboxPhoto.url}
              alt={lightboxPhoto.caption}
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>

          <div className="max-w-4xl mx-auto w-full text-center text-white pb-2">
            <p className="text-sm font-semibold text-white/95">{lightboxPhoto.caption}</p>
            <p className="text-xs text-white/60 mt-0.5">Verified on-site by Unlimited Construction field team</p>
          </div>
        </div>
      )}
    </div>
  );
};
