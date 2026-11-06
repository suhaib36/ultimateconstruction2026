import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { 
  Home, 
  Camera, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  AlertCircle, 
  PenTool, 
  Send, 
  Download, 
  ChevronRight,
  ShieldCheck,
  Check,
  ArrowLeft
} from 'lucide-react';

export const MobileClientPortal: React.FC = () => {
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

  type ClientMobileTab = 'project' | 'photos' | 'schedule' | 'approvals' | 'chat';
  const [activeTab, setActiveTab] = useState<ClientMobileTab>('project');

  // Interactive Sign Modal
  const [signingCO, setSigningCO] = useState<typeof changeOrders[0] | null>(null);
  const [signName, setSignName] = useState('');
  const [chatText, setChatText] = useState('');

  const activeProject = projects.find(p => p.id === activeHomeownerProjectId) || projects[0];
  const projectUpdates = dailyUpdates.filter(u => u.projectId === activeProject.id);
  const projectCOs = changeOrders.filter(co => co.projectId === activeProject.id);
  const pendingCOs = projectCOs.filter(co => co.status === 'Sent for Approval');
  const projectDocs = documents.filter(d => d.projectId === activeProject.id);
  const projectMessages = messages.filter(m => m.projectId === activeProject.id);

  const handleSendClientMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;

    sendMessage(activeProject.id, chatText, 'Homeowner');
    setChatText('');
  };

  const handleSignConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signingCO || !signName.trim()) return;

    updateChangeOrderStatus(signingCO.id, 'Approved', signName);
    setSigningCO(null);
    setSignName('');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top Banner with Project Switcher */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Homeowner Project</span>
          <select
            value={activeHomeownerProjectId}
            onChange={(e) => setActiveHomeownerProjectId(e.target.value)}
            className="text-xs font-bold text-slate-900 bg-transparent focus:outline-none truncate max-w-[200px]"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsHomeownerPortal(false)}
          className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl hover:bg-slate-200 shrink-0"
        >
          Exit Client Mode
        </button>
      </div>

      {/* ================= TAB 1: MY PROJECT ================= */}
      {activeTab === 'project' && (
        <div className="space-y-4">
          {/* Hero Project Status Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full">
                  {activeProject.category}
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-1 leading-snug">
                  {activeProject.name}
                </h2>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeProject.address}</span>
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xl font-black text-brand-700">{activeProject.progress}%</span>
                <span className="text-[9px] text-slate-400 block">Complete</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-700 transition-all duration-500"
                style={{ width: `${activeProject.progress}%` }}
              />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              {activeProject.description}
            </p>
          </div>

          {/* Pending Approval Callout */}
          {pendingCOs.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Scope Change Awaiting Your Review</span>
              </div>
              <div className="text-xs text-amber-800">
                <strong>{pendingCOs[0].title}</strong> (+${pendingCOs[0].totalCost.toLocaleString()})
              </div>
              <button
                onClick={() => setActiveTab('approvals')}
                className="w-full py-2 bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs mt-1"
              >
                Review & Sign Change Order
              </button>
            </div>
          )}

          {/* General Contractor Nancy Paramo Direct Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-brand-700 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                NP
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Nancy Paramo</h3>
                <p className="text-xs text-brand-700 font-semibold">General Contractor & Owner</p>
                <p className="text-[10px] text-slate-400">California License #1040445</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <a
                href="tel:9516097164"
                className="py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-brand-700" />
                <span>Call Nancy</span>
              </a>
              <button
                onClick={() => setActiveTab('chat')}
                className="py-2 bg-brand-700 hover:bg-brand-800 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message</span>
              </button>
            </div>
          </div>

          {/* Recent Photos Preview */}
          {projectUpdates.length > 0 && projectUpdates[0].photos.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase">Recent Site Photos</span>
                <button onClick={() => setActiveTab('photos')} className="text-xs text-brand-700 font-bold">
                  View All →
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {projectUpdates[0].photos.slice(0, 2).map((p, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden border aspect-video">
                    <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: PHOTOS & PROGRESS ================= */}
      {activeTab === 'photos' && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-900 uppercase block">Daily Progress Updates</span>
          {projectUpdates.map((u) => (
            <div key={u.id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>{u.date}</span>
                <span className="text-amber-700 font-medium">{u.weather.temp}</span>
              </div>
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl">{u.workCompleted}</p>
              {u.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {u.photos.map((p, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden border aspect-video">
                      <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= TAB 3: SCHEDULE ================= */}
      {activeTab === 'schedule' && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-900 uppercase block">Project Milestones</span>
          <div className="space-y-2">
            {activeProject.milestones.map((m, idx) => (
              <div key={m.id} className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{m.title}</h4>
                  <span className="text-[11px] text-slate-500 font-mono">{m.date}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  m.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                  m.status === 'In Progress' ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: APPROVALS ================= */}
      {activeTab === 'approvals' && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-900 uppercase block">Pending Approvals ({projectCOs.length})</span>
          {projectCOs.map((co) => (
            <div key={co.id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono font-bold text-brand-700">{co.orderNumber}</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">{co.title}</h4>
                </div>
                <StatusBadge status={co.status} size="sm" />
              </div>

              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">{co.description}</p>

              <div className="flex items-center justify-between font-extrabold text-slate-900 text-sm pt-1 border-t border-slate-100">
                <span>Cost:</span>
                <span className="text-brand-700">${co.totalCost.toLocaleString()}</span>
              </div>

              {co.status === 'Sent for Approval' && (
                <button
                  onClick={() => {
                    setSigningCO(co);
                    setSignName(activeProject.clientName);
                  }}
                  className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Approve & Sign Electronically</span>
                </button>
              )}

              {co.status === 'Approved' && (
                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-800 font-bold flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Signed by {co.clientSignature || activeProject.clientName}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= TAB 5: CHAT ================= */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900">Direct Chat with Nancy Paramo</span>
            <span className="text-[10px] text-emerald-600 font-bold">• Active</span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto p-2 bg-slate-50 rounded-xl">
            {projectMessages.map((m) => {
              const isHomeowner = m.sender === 'Homeowner';
              return (
                <div key={m.id} className={`flex flex-col ${isHomeowner ? 'items-end' : 'items-start'}`}>
                  <span className="text-[9px] text-slate-400 mb-0.5">{m.sender}</span>
                  <div className={`p-2.5 rounded-xl text-xs max-w-[85%] ${
                    isHomeowner ? 'bg-brand-700 text-white rounded-tr-xs' : 'bg-white border text-slate-800 rounded-tl-xs'
                  }`}>
                    {m.content}
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSendClientMessage} className="flex gap-2">
            <input
              type="text"
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder="Type message to Nancy..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
            />
            <button
              type="submit"
              disabled={!chatText.trim()}
              className="px-3.5 py-2 bg-brand-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Client Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 select-none">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {[
            { id: 'project', label: 'My Project', icon: Home },
            { id: 'photos', label: 'Photos', icon: Camera },
            { id: 'schedule', label: 'Schedule', icon: Calendar },
            { id: 'approvals', label: 'Approvals', icon: CheckCircle2, badge: pendingCOs.length > 0 ? pendingCOs.length : undefined },
            { id: 'chat', label: 'Chat', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ClientMobileTab)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                  isActive ? 'text-brand-700 font-bold scale-105' : 'text-slate-400 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                  {tab.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 px-1.5 text-[9px] font-black rounded-full bg-brand-700 text-white">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5">{tab.label}</span>
                {isActive && <span className="w-1 h-1 rounded-full bg-brand-700 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Modal: Homeowner E-Sign */}
      {signingCO && (
        <Modal
          isOpen={!!signingCO}
          onClose={() => setSigningCO(null)}
          title={`Approve ${signingCO.orderNumber}`}
          subtitle={`Total: $${signingCO.totalCost.toLocaleString()}`}
          maxWidth="sm"
        >
          <form onSubmit={handleSignConfirm} className="space-y-3">
            <p className="text-xs text-slate-600">
              I authorize the work described in {signingCO.orderNumber} for an additional ${signingCO.totalCost.toLocaleString()}.
            </p>
            <input
              type="text"
              required
              value={signName}
              onChange={(e) => setSignName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-serif italic text-slate-900"
            />
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSigningCO(null)}
                className="px-3 py-1.5 text-xs text-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl"
              >
                Authorize & Sign
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
