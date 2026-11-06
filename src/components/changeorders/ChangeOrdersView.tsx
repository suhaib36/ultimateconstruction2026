import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChangeOrder, ChangeOrderStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { 
  FileSpreadsheet, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send, 
  DollarSign, 
  ChevronRight, 
  FileText, 
  User, 
  ShieldCheck,
  Edit3,
  PenTool
} from 'lucide-react';

export const ChangeOrdersView: React.FC = () => {
  const { 
    changeOrders, 
    projects, 
    addChangeOrder, 
    updateChangeOrderStatus, 
    setSelectedProjectId, 
    setCurrentTab,
    showToast 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Modals
  const [isAddCOOpen, setIsAddCOOpen] = useState(false);
  const [selectedCO, setSelectedCO] = useState<ChangeOrder | null>(null);
  const [isSimulateSignOpen, setIsSimulateSignOpen] = useState(false);
  const [signatureName, setSignatureName] = useState('');

  // Form State
  const [formProjectId, setFormProjectId] = useState(projects[0]?.id || 'proj-1');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formReason, setFormReason] = useState<ChangeOrder['reason']>('Client Request');
  const [formLabor, setFormLabor] = useState<number>(1800);
  const [formMaterial, setFormMaterial] = useState<number>(2400);
  const [formSubcontractor, setFormSubcontractor] = useState<number>(600);
  const [formOther, setFormOther] = useState<number>(200);
  const [formNotes, setFormNotes] = useState('');

  const targetProject = projects.find(p => p.id === formProjectId);
  const formTotalCost = Number(formLabor) + Number(formMaterial) + Number(formSubcontractor) + Number(formOther);
  const formRevisedTotal = (targetProject?.budget || 80000) + formTotalCost;

  const filteredCOs = changeOrders.filter(co => {
    const matchesSearch = co.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          co.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          co.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          co.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || co.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateCO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !targetProject) return;

    const nextNumber = `CO-00${changeOrders.length + 1}`;

    addChangeOrder({
      orderNumber: nextNumber,
      projectId: formProjectId,
      projectName: targetProject.name,
      clientName: targetProject.clientName,
      title: formTitle,
      description: formDescription,
      reason: formReason,
      laborCost: Number(formLabor),
      materialCost: Number(formMaterial),
      subcontractorCost: Number(formSubcontractor),
      otherCost: Number(formOther),
      totalCost: formTotalCost,
      originalProjectTotal: targetProject.budget,
      revisedProjectTotal: formRevisedTotal,
      status: 'Sent for Approval',
      requestedDate: new Date().toISOString().split('T')[0],
      notes: formNotes
    });

    setIsAddCOOpen(false);
    setFormTitle('');
    setFormDescription('');
  };

  const handleSimulateClientSignature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCO || !signatureName.trim()) return;

    updateChangeOrderStatus(selectedCO.id, 'Approved', signatureName);
    setIsSimulateSignOpen(false);
    setSelectedCO(null);
    setSignatureName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search change orders by number, project, or client..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
          />
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
          >
            <option value="All">All Statuses ({changeOrders.length})</option>
            <option value="Draft">Draft</option>
            <option value="Sent for Approval">Sent for Approval</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button
            onClick={() => setIsAddCOOpen(true)}
            className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Draft Change Order</span>
          </button>
        </div>
      </div>

      {/* Change Orders Cards List */}
      <div className="space-y-4">
        {filteredCOs.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-sm">
            No change orders match your filters.
          </div>
        ) : (
          filteredCOs.map((co) => (
            <div
              key={co.id}
              onClick={() => setSelectedCO(co)}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 hover:border-slate-300 transition-all cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-extrabold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                      {co.orderNumber}
                    </span>
                    <StatusBadge status={co.status} />
                    <span className="text-xs text-slate-400 font-medium">• Reason: {co.reason}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors mt-1.5">
                    {co.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                    <span className="font-semibold text-slate-800">{co.projectName}</span>
                    <span>•</span>
                    <span>Client: {co.clientName}</span>
                    <span>•</span>
                    <span>Requested: {co.requestedDate}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Scope Total</span>
                  <div className="text-xl font-extrabold text-slate-900 leading-tight">
                    ${co.totalCost.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Revised Job Total: ${co.revisedProjectTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {co.description}
              </p>

              {/* Bottom bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2">
                  {co.status === 'Approved' && (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Approved by {co.clientSignature || co.clientName}</span>
                    </span>
                  )}
                  {co.status === 'Sent for Approval' && (
                    <span className="text-amber-700 font-semibold flex items-center gap-1">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>Pending Homeowner Digital Signoff</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {co.status === 'Sent for Approval' && (
                    <button
                      onClick={() => {
                        setSelectedCO(co);
                        setSignatureName(co.clientName.split(' ')[0] + ' ' + co.clientName.split(' ')[1]);
                        setIsSimulateSignOpen(true);
                      }}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-1"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Simulate Client Approval</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedCO(co)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
                  >
                    View Breakdown
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL: DRAFT CHANGE ORDER ================= */}
      <Modal
        isOpen={isAddCOOpen}
        onClose={() => setIsAddCOOpen(false)}
        title="Draft Construction Change Order"
        subtitle="Record additional work, labor, and materials requested by client"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateCO} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Project *</label>
              <select
                value={formProjectId}
                onChange={(e) => setFormProjectId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-brand-600"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.clientName})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Scope Change</label>
              <select
                value={formReason}
                onChange={(e) => setFormReason(e.target.value as ChangeOrder['reason'])}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Client Request">Client Request / Material Upgrade</option>
                <option value="Unforeseen Site Condition">Unforeseen Site Condition</option>
                <option value="City / Code Requirement">City / Building Code Requirement</option>
                <option value="Architectural Modification">Architectural Modification</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Change Order Title *</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Upgrade to French Bifold Doors and Stucco Texture Match"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description of Additional Scope</label>
            <textarea
              rows={3}
              required
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Specify structural work, framing adjustments, material selections, and timeline impact..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
            />
          </div>

          {/* Itemized Cost Breakdown Inputs */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Itemized Cost Breakdown ($)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Additional Labor</label>
                <input
                  type="number"
                  value={formLabor}
                  onChange={(e) => setFormLabor(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Material Costs</label>
                <input
                  type="number"
                  value={formMaterial}
                  onChange={(e) => setFormMaterial(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Subcontractor</label>
                <input
                  type="number"
                  value={formSubcontractor}
                  onChange={(e) => setFormSubcontractor(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Other Expenses</label>
                <input
                  type="number"
                  value={formOther}
                  onChange={(e) => setFormOther(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                />
              </div>
            </div>
          </div>

          {/* Budget Impact Summary */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Additional Change Order Total:</span>
              <span className="font-extrabold text-brand-700 text-sm">${formTotalCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Original Project Total:</span>
              <span>${(targetProject?.budget || 0).toLocaleString()}</span>
            </div>
            <div className="pt-1.5 border-t border-slate-200 flex justify-between font-bold text-slate-900">
              <span>Revised Project Total:</span>
              <span>${formRevisedTotal.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Supporting Notes for Client</label>
            <input
              type="text"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="e.g. Lead time is 10 business days for custom ordered units"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddCOOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Transmit for Client Approval
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: CHANGE ORDER DETAIL ================= */}
      {selectedCO && (
        <Modal
          isOpen={!!selectedCO}
          onClose={() => setSelectedCO(null)}
          title={`${selectedCO.orderNumber}: ${selectedCO.title}`}
          subtitle={`Project: ${selectedCO.projectName} • Client: ${selectedCO.clientName}`}
          maxWidth="3xl"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                <div className="mt-1">
                  <StatusBadge status={selectedCO.status} size="md" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Requested Date</span>
                <p className="text-xs font-mono font-bold text-slate-900 mt-1">{selectedCO.requestedDate}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Scope of Additional Work</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {selectedCO.description}
              </p>
            </div>

            {/* Cost Breakdown */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 p-3 border-b border-slate-200 font-bold text-xs text-slate-700 uppercase tracking-wider">
                Cost Breakdown
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="p-3 flex justify-between">
                  <span className="text-slate-600">Additional Field Labor:</span>
                  <span className="font-mono font-bold text-slate-900">${selectedCO.laborCost.toLocaleString()}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-slate-600">Material & Supply Upgrades:</span>
                  <span className="font-mono font-bold text-slate-900">${selectedCO.materialCost.toLocaleString()}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-slate-600">Specialty Subcontractor:</span>
                  <span className="font-mono font-bold text-slate-900">${selectedCO.subcontractorCost.toLocaleString()}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-slate-600">Administrative & Engineering:</span>
                  <span className="font-mono font-bold text-slate-900">${selectedCO.otherCost.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-brand-50/50 flex justify-between text-sm font-extrabold text-brand-700">
                  <span>Total Change Order Amount:</span>
                  <span>${selectedCO.totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Project Budget Impact */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400">Original Contract:</span>
                <p className="text-base font-bold text-slate-900 mt-0.5">${selectedCO.originalProjectTotal.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Revised Project Total:</span>
                <p className="text-base font-extrabold text-brand-700 mt-0.5">${selectedCO.revisedProjectTotal.toLocaleString()}</p>
              </div>
            </div>

            {selectedCO.clientSignature && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                <span className="font-bold">Digital Signature: </span>
                <span className="italic font-serif">{selectedCO.clientSignature}</span>
                <span className="ml-2 text-slate-500 font-mono">({selectedCO.approvedDate})</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedProjectId(selectedCO.projectId);
                  setCurrentTab('projects');
                }}
                className="text-xs font-bold text-brand-700 hover:underline"
              >
                Go to Project Workspace →
              </button>

              <div className="flex items-center gap-2">
                {selectedCO.status === 'Sent for Approval' && (
                  <button
                    onClick={() => {
                      setSignatureName(selectedCO.clientName);
                      setIsSimulateSignOpen(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Simulate Client Approval</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedCO(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL: SIMULATE CLIENT DIGITAL SIGNATURE ================= */}
      {isSimulateSignOpen && (
        <Modal
          isOpen={isSimulateSignOpen}
          onClose={() => setIsSimulateSignOpen(false)}
          title="Simulate Homeowner Approval & E-Signature"
          subtitle="Test how a client approves change orders via the Homeowner Portal"
          maxWidth="md"
        >
          <form onSubmit={handleSimulateClientSignature} className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              By typing your name below, you simulate the homeowner agreeing to the additional scope of work and authorising the revised project budget.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Type Full Name to Sign *</label>
              <input
                type="text"
                required
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                placeholder="e.g. Elena Martinez"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-serif italic text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="p-3 bg-slate-100 rounded-xl font-mono text-[11px] text-slate-500">
              IP: 192.168.1.84 • Timestamp: {new Date().toLocaleString()} • CA Civil Code § 1633.1 Compliant
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSimulateSignOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Sign Order</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
