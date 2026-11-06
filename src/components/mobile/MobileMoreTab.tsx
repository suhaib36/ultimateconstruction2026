import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { 
  UserPlus, 
  FileSpreadsheet, 
  Contact, 
  Users, 
  FileText, 
  Settings, 
  ChevronRight, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  PenTool, 
  Plus, 
  ShieldCheck, 
  RotateCcw,
  ExternalLink,
  Eye,
  Download
} from 'lucide-react';

export const MobileMoreTab: React.FC = () => {
  const { 
    leads, 
    estimates, 
    changeOrders, 
    clients, 
    team, 
    documents, 
    updateChangeOrderStatus,
    convertLeadToProject,
    setIsHomeownerPortal,
    showToast 
  } = useApp();

  type MoreSection = 'menu' | 'leads' | 'changeorders' | 'clients' | 'team' | 'documents' | 'settings';
  const [activeSection, setActiveSection] = useState<MoreSection>('menu');

  // Interactive Sign Modal
  const [signingCO, setSigningCO] = useState<typeof changeOrders[0] | null>(null);
  const [sigName, setSigName] = useState('');

  const pendingCOs = changeOrders.filter(co => co.status === 'Sent for Approval');
  const newLeads = leads.filter(l => l.status === 'New' || l.status === 'Site Visit Scheduled');

  const handleSignCO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signingCO || !sigName.trim()) return;

    updateChangeOrderStatus(signingCO.id, 'Approved', sigName);
    setSigningCO(null);
    setSigName('');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data to initial factory state?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  /* ================= SUBVIEW: LEADS & ESTIMATES ================= */
  if (activeSection === 'leads') {
    return (
      <div className="space-y-3 pb-24">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveSection('menu')}
            className="text-xs font-bold text-slate-700 flex items-center gap-1 hover:text-brand-700"
          >
            ← Back to Menu
          </button>
          <span className="text-xs font-bold text-slate-900">Leads & Estimates ({leads.length})</span>
        </div>

        <div className="space-y-2.5">
          {leads.map((l) => (
            <div key={l.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{l.clientName}</h4>
                  <span className="text-[10px] text-brand-700 font-semibold">{l.projectType} • {l.location}</span>
                </div>
                <StatusBadge status={l.status} size="sm" />
              </div>

              <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-100">
                <a href={`tel:${l.phone}`} className="flex items-center gap-1 font-bold text-brand-700">
                  <Phone className="w-3 h-3" />
                  <span>{l.phone}</span>
                </a>
                <span>Budget: <strong className="text-slate-800">{l.budgetRange}</strong></span>
              </div>

              {l.status !== 'Converted' && (
                <button
                  onClick={() => convertLeadToProject(l.id)}
                  className="w-full py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold mt-1"
                >
                  Convert to Active Project →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ================= SUBVIEW: CHANGE ORDERS ================= */
  if (activeSection === 'changeorders') {
    return (
      <div className="space-y-3 pb-24">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveSection('menu')}
            className="text-xs font-bold text-slate-700 flex items-center gap-1 hover:text-brand-700"
          >
            ← Back to Menu
          </button>
          <span className="text-xs font-bold text-slate-900">Change Orders ({changeOrders.length})</span>
        </div>

        <div className="space-y-2.5">
          {changeOrders.map((co) => (
            <div key={co.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono font-bold text-brand-700 text-[11px]">{co.orderNumber}</span>
                  <h4 className="font-bold text-slate-900 text-xs mt-0.5">{co.title}</h4>
                  <p className="text-[10px] text-slate-500">{co.projectName}</p>
                </div>
                <StatusBadge status={co.status} size="sm" />
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Labor: ${co.laborCost}</span>
                  <span className="text-slate-500">Materials: ${co.materialCost}</span>
                </div>
                <div className="flex justify-between font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Total Additional:</span>
                  <span className="text-brand-700">${co.totalCost.toLocaleString()}</span>
                </div>
              </div>

              {co.status === 'Sent for Approval' && (
                <button
                  onClick={() => {
                    setSigningCO(co);
                    setSigName(co.clientName);
                  }}
                  className="w-full py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Simulate Client Approval Signature</span>
                </button>
              )}

              {co.status === 'Approved' && (
                <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approved by {co.clientSignature || co.clientName}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal: Sign CO */}
        {signingCO && (
          <Modal
            isOpen={!!signingCO}
            onClose={() => setSigningCO(null)}
            title="Authorize Change Order"
            subtitle={`${signingCO.orderNumber} - $${signingCO.totalCost.toLocaleString()}`}
            maxWidth="sm"
          >
            <form onSubmit={handleSignCO} className="space-y-3">
              <p className="text-xs text-slate-600">
                Type name below to simulate client authorization:
              </p>
              <input
                type="text"
                required
                value={sigName}
                onChange={(e) => setSigName(e.target.value)}
                placeholder="e.g. Elena Martinez"
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
                  Confirm E-Signature
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    );
  }

  /* ================= SUBVIEW: CLIENTS ================= */
  if (activeSection === 'clients') {
    return (
      <div className="space-y-3 pb-24">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveSection('menu')}
            className="text-xs font-bold text-slate-700 flex items-center gap-1 hover:text-brand-700"
          >
            ← Back to Menu
          </button>
          <span className="text-xs font-bold text-slate-900">Clients Directory ({clients.length})</span>
        </div>

        <div className="space-y-2.5">
          {clients.map((c) => (
            <div key={c.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                <span className="text-[10px] font-mono text-slate-400">{c.portalAccessCode}</span>
              </div>
              <p className="text-slate-500">{c.address}, {c.city}</p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <a href={`tel:${c.phone}`} className="font-bold text-brand-700 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{c.phone}</span>
                </a>
                <span className="font-bold text-slate-800">${c.totalSpent.toLocaleString()} spent</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ================= SUBVIEW: TEAM ================= */
  if (activeSection === 'team') {
    return (
      <div className="space-y-3 pb-24">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveSection('menu')}
            className="text-xs font-bold text-slate-700 flex items-center gap-1 hover:text-brand-700"
          >
            ← Back to Menu
          </button>
          <span className="text-xs font-bold text-slate-900">Crew Directory ({team.length})</span>
        </div>

        <div className="space-y-2.5">
          {team.map((m) => (
            <div key={m.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">{m.name}</h4>
                  <span className="text-[10px] text-brand-700 font-semibold">{m.role}</span>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {m.availability}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Trade: {m.tradeSpecialty}</p>
              <div className="pt-1 border-t border-slate-100 flex items-center justify-between">
                <a href={`tel:${m.phone}`} className="text-brand-700 font-bold flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{m.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ================= SUBVIEW: DOCUMENTS ================= */
  if (activeSection === 'documents') {
    return (
      <div className="space-y-3 pb-24">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveSection('menu')}
            className="text-xs font-bold text-slate-700 flex items-center gap-1 hover:text-brand-700"
          >
            ← Back to Menu
          </button>
          <span className="text-xs font-bold text-slate-900">Documents & Permits ({documents.length})</span>
        </div>

        <div className="space-y-2">
          {documents.map((d) => (
            <div key={d.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs">
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 truncate">{d.name}</h4>
                <span className="text-[10px] text-slate-400">{d.projectName.split('–')[0]} • {d.category}</span>
              </div>
              <button
                onClick={() => showToast('Opening Document', `Viewing ${d.name}...`, 'info')}
                className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold shrink-0"
              >
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ================= SUBVIEW: SETTINGS ================= */
  if (activeSection === 'settings') {
    return (
      <div className="space-y-3 pb-24">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveSection('menu')}
            className="text-xs font-bold text-slate-700 flex items-center gap-1 hover:text-brand-700"
          >
            ← Back to Menu
          </button>
          <span className="text-xs font-bold text-slate-900">Contractor Settings</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>CSLB State License Verification</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Entity</span>
            <span className="font-bold text-slate-800">Unlimited Construction</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Owner / RMO</span>
            <span className="font-bold text-slate-800">Nancy Paramo</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">CA License #</span>
            <span className="font-mono font-bold text-brand-700">1040445 (Class B General Contractor)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Office Address</span>
            <span className="text-slate-700">4193 Flat Rock Dr, Suite 200-435, Riverside, CA 92505</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Contact</span>
            <span className="text-slate-700">(951) 609-7164 • unlimitedconstruction@mail.com</span>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={handleResetData}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo App Data</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= DEFAULT MENU SCREEN ================= */
  const menuItems = [
    { id: 'leads', title: 'Leads & Estimates', desc: 'Inquiries, walkthroughs, bids', icon: UserPlus, badge: newLeads.length > 0 ? `${newLeads.length} new` : undefined },
    { id: 'changeorders', title: 'Change Orders', desc: 'Scope modifications & approvals', icon: FileSpreadsheet, badge: pendingCOs.length > 0 ? `${pendingCOs.length} pending` : undefined },
    { id: 'clients', title: 'Client Directory', desc: 'Homeowner contacts & access codes', icon: Contact },
    { id: 'team', title: 'Crew & Specialists', desc: 'Trade roster & field contacts', icon: Users },
    { id: 'documents', title: 'Documents & Permits', desc: 'Contracts, plans, inspection reports', icon: FileText },
    { id: 'settings', title: 'License & Settings', desc: 'CSLB #1040445, rates, backup', icon: Settings },
  ];

  return (
    <div className="space-y-4 pb-24">
      {/* Menu Header */}
      <div>
        <h2 className="text-sm font-extrabold text-slate-900">Contractor Tools & Management</h2>
        <p className="text-[11px] text-slate-500">Access project tools on your mobile device</p>
      </div>

      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => setActiveSection(item.id as MoreSection)}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-subtle hover:border-brand-300 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                  <p className="text-[10px] text-slate-400">{item.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-brand-50 text-brand-700">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Switch to Homeowner Portal shortcut */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold">Client Mobile Experience</span>
          <span className="text-[9px] bg-brand-600 text-white px-2 py-0.5 rounded-full font-bold">
            Portal Mode
          </span>
        </div>
        <p className="text-[11px] text-slate-300">
          Preview how Nancy's clients track progress, view photos, and approve change orders on their phones.
        </p>
        <button
          onClick={() => setIsHomeownerPortal(true)}
          className="w-full py-2 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open Client Mobile Portal</span>
        </button>
      </div>
    </div>
  );
};
