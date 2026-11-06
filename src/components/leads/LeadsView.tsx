import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead, LeadStatus, ProjectCategory, Estimate, EstimateLineItem } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText, 
  ChevronRight, 
  Plus, 
  CheckCircle, 
  Clock, 
  FileSpreadsheet, 
  Eye, 
  Send, 
  Edit3, 
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Building2,
  Trash2
} from 'lucide-react';

export const LeadsView: React.FC = () => {
  const { 
    leads, 
    estimates, 
    addLead, 
    updateLead, 
    addLeadNote, 
    scheduleLeadVisit, 
    convertLeadToProject,
    addEstimate,
    updateEstimateStatus,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'leads' | 'estimates'>('leads');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Modal States
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isScheduleVisitOpen, setIsScheduleVisitOpen] = useState(false);
  const [isCreateEstimateOpen, setIsCreateEstimateOpen] = useState(false);
  const [isPreviewEstimateOpen, setIsPreviewEstimateOpen] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);

  // Form States for New Lead
  const [newLeadData, setNewLeadData] = useState({
    clientName: '',
    phone: '',
    email: '',
    projectType: 'Kitchen & Bath Remodeling' as ProjectCategory,
    location: 'Riverside, CA',
    budgetRange: '$50,000 - $75,000',
    notes: ''
  });

  // Form States for Schedule Visit
  const [visitDate, setVisitDate] = useState('2026-11-10');
  const [visitTime, setVisitTime] = useState('10:00 AM');
  const [visitNotes, setVisitNotes] = useState('Bring laser measure, sample finish materials, and structural beam span tables.');

  // Form States for New Note
  const [newNoteText, setNewNoteText] = useState('');

  // Form States for Estimate Creation
  const [estimateClientName, setEstimateClientName] = useState('');
  const [estimateClientEmail, setEstimateClientEmail] = useState('');
  const [estimateClientPhone, setEstimateClientPhone] = useState('');
  const [estimateAddress, setEstimateAddress] = useState('');
  const [estimateType, setEstimateType] = useState<ProjectCategory>('Kitchen & Bath Remodeling');
  const [estimateScope, setEstimateScope] = useState('');
  const [estimateItems, setEstimateItems] = useState<EstimateLineItem[]>([
    { id: '1', category: 'Labor', description: 'Demolition & debris disposal', quantity: 1, unit: 'LS', unitCost: 4500, total: 4500 },
    { id: '2', category: 'Labor', description: 'Rough framing, electrical & plumbing updates', quantity: 1, unit: 'LS', unitCost: 8200, total: 8200 },
    { id: '3', category: 'Material', description: 'Custom cabinetry & hardware package', quantity: 24, unit: 'Lin Ft', unitCost: 650, total: 15600 },
    { id: '4', category: 'Permits & Fees', description: 'City plan check and building permit issuance', quantity: 1, unit: 'LS', unitCost: 2400, total: 2400 }
  ]);
  const [contingencyPercent, setContingencyPercent] = useState<number>(10);
  const [estimateNotes, setEstimateNotes] = useState('Includes 2-year craftsmanship warranty. Unlimited Construction CA License #1040445.');

  // Calculate totals
  const subtotal = estimateItems.reduce((sum, item) => sum + item.total, 0);
  const contingencyAmount = Math.round((subtotal * contingencyPercent) / 100);
  const totalEstimatedCost = subtotal + contingencyAmount;

  // Filtered Leads
  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.clientName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          l.location.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          l.projectType.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || l.projectType === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories: ProjectCategory[] = [
    'Kitchen & Bath Remodeling',
    'Room Additions',
    'ADUs & Garage Conversions',
    'Casitas & Guest Houses',
    'Patio Covers',
    'Concrete Patios & Driveways',
    'Walkways & Hardscape',
    'Retaining & Garden Walls',
    'Architectural Design',
    'Commercial Construction'
  ];

  const leadStatuses: LeadStatus[] = [
    'New',
    'Contacted',
    'Site Visit Scheduled',
    'Estimate in Progress',
    'Estimate Sent',
    'Converted',
    'Lost'
  ];

  // Handlers
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadData.clientName) return;

    addLead({
      clientName: newLeadData.clientName,
      phone: newLeadData.phone || '(951) 555-0199',
      email: newLeadData.email || 'client@example.com',
      projectType: newLeadData.projectType,
      location: newLeadData.location,
      inquiryDate: new Date().toISOString().split('T')[0],
      status: 'New',
      budgetRange: newLeadData.budgetRange,
      notes: newLeadData.notes ? [{
        id: `ln-${Date.now()}`,
        text: newLeadData.notes,
        date: new Date().toISOString().split('T')[0],
        author: 'Nancy Paramo'
      }] : []
    });

    setIsAddLeadOpen(false);
    setNewLeadData({
      clientName: '',
      phone: '',
      email: '',
      projectType: 'Kitchen & Bath Remodeling',
      location: 'Riverside, CA',
      budgetRange: '$50,000 - $75,000',
      notes: ''
    });
  };

  const handleAddNoteToSelectedLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;
    addLeadNote(selectedLead.id, newNoteText);
    setNewNoteText('');
    // refresh selected lead reference
    const updated = leads.find(l => l.id === selectedLead.id);
    if (updated) setSelectedLead(updated);
  };

  const handleScheduleVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    scheduleLeadVisit(selectedLead.id, visitDate, visitTime, visitNotes);
    setIsScheduleVisitOpen(false);
    const updated = leads.find(l => l.id === selectedLead.id);
    if (updated) setSelectedLead(updated);
  };

  const handleOpenEstimateForLead = (lead: Lead) => {
    setEstimateClientName(lead.clientName);
    setEstimateClientEmail(lead.email);
    setEstimateClientPhone(lead.phone);
    setEstimateAddress(lead.location);
    setEstimateType(lead.projectType);
    setEstimateScope(`Construction & remodeling scope for ${lead.projectType} at ${lead.location}.`);
    setIsCreateEstimateOpen(true);
  };

  const handleAddLineItem = () => {
    setEstimateItems(prev => [
      ...prev,
      {
        id: `${Date.now()}`,
        category: 'Labor',
        description: 'New scope item description',
        quantity: 1,
        unit: 'LS',
        unitCost: 1500,
        total: 1500
      }
    ]);
  };

  const handleUpdateLineItem = (id: string, field: keyof EstimateLineItem, value: any) => {
    setEstimateItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === 'quantity' || field === 'unitCost') {
        updated.total = Number(updated.quantity) * Number(updated.unitCost);
      }
      return updated;
    }));
  };

  const handleDeleteLineItem = (id: string) => {
    setEstimateItems(prev => prev.filter(i => i.id !== id));
  };

  const handleSaveEstimate = (status: 'Draft' | 'Sent') => {
    const newEst: Omit<Estimate, 'id'> = {
      estimateNumber: `EST-2026-${Math.floor(1050 + Math.random() * 500)}`,
      clientName: estimateClientName,
      clientEmail: estimateClientEmail,
      clientPhone: estimateClientPhone,
      projectAddress: estimateAddress,
      projectType: estimateType,
      scopeOfWork: estimateScope,
      items: estimateItems,
      subtotal,
      contingencyPercent,
      contingencyAmount,
      totalEstimatedCost,
      status,
      createdAt: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: estimateNotes
    };

    addEstimate(newEst);
    setIsCreateEstimateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'leads'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Leads Pipeline ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('estimates')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'estimates'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Estimates Repository ({estimates.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEstimateClientName('');
              setEstimateClientEmail('');
              setEstimateClientPhone('');
              setEstimateAddress('Riverside, CA');
              setEstimateScope('');
              setIsCreateEstimateOpen(true);
            }}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-brand-700" />
            <span>Create Estimate</span>
          </button>

          <button
            onClick={() => setIsAddLeadOpen(true)}
            className="px-3.5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {activeTab === 'leads' ? (
        /* ================= LEADS PIPELINE TAB ================= */
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search leads by client name, city or project type..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:border-brand-600"
              >
                <option value="All">All Statuses</option>
                {leadStatuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:border-brand-600 max-w-xs"
              >
                <option value="All">All Project Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Leads Table / Grid */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Project Type</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Inquiry Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No leads match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr 
                        key={lead.id} 
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                            {lead.clientName}
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Budget: {lead.budgetRange}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{lead.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[140px]">{lead.email}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-medium text-slate-800">
                            {lead.projectType}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{lead.location}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 text-xs">
                          {lead.inquiryDate}
                        </td>

                        <td className="py-3.5 px-4">
                          <StatusBadge status={lead.status} />
                        </td>

                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                              Details
                            </button>
                            {lead.status !== 'Converted' && (
                              <button
                                onClick={() => convertLeadToProject(lead.id)}
                                className="px-2.5 py-1 text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-lg transition-colors shadow-xs"
                              >
                                Convert
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ================= ESTIMATES REPOSITORY TAB ================= */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Estimate #</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Project Category</th>
                    <th className="py-3 px-4">Address</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {estimates.map((est) => (
                    <tr key={est.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {est.estimateNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{est.clientName}</div>
                        <div className="text-[11px] text-slate-400">{est.clientPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {est.projectType}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {est.projectAddress}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900 text-sm">
                        ${est.totalEstimatedCost.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            est.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : est.status === 'Sent'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {est.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedEstimate(est);
                              setIsPreviewEstimateOpen(true);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                          {est.status === 'Draft' && (
                            <button
                              onClick={() => updateEstimateStatus(est.id, 'Sent')}
                              className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Send</span>
                            </button>
                          )}
                          {est.status === 'Sent' && (
                            <button
                              onClick={() => updateEstimateStatus(est.id, 'Approved')}
                              className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: LEAD DETAILS ================= */}
      {selectedLead && (
        <Modal
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          title={selectedLead.clientName}
          subtitle={`Lead Record • Inquired on ${selectedLead.inquiryDate}`}
          maxWidth="3xl"
        >
          <div className="space-y-6">
            {/* Header info bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Type</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedLead.projectType}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Location</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {selectedLead.location}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Budget Range</span>
                <p className="text-sm font-bold text-emerald-700 mt-0.5">{selectedLead.budgetRange}</p>
              </div>
            </div>

            {/* Contact details & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4 text-xs">
                <a 
                  href={`tel:${selectedLead.phone}`}
                  className="flex items-center gap-1.5 font-bold text-slate-800 hover:text-brand-700 bg-slate-100 px-3 py-1.5 rounded-lg"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{selectedLead.phone}</span>
                </a>
                <a 
                  href={`mailto:${selectedLead.email}`}
                  className="flex items-center gap-1.5 font-medium text-slate-800 hover:text-brand-700 bg-slate-100 px-3 py-1.5 rounded-lg"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{selectedLead.email}</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Status:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as LeadStatus;
                    updateLead({ ...selectedLead, status: newStatus });
                    setSelectedLead({ ...selectedLead, status: newStatus });
                  }}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg font-bold text-slate-800"
                >
                  {leadStatuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Scheduled Site Visit Section */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-brand-700" />
                  <span>On-Site Consultation & Walkthrough</span>
                </h4>
                <button
                  onClick={() => setIsScheduleVisitOpen(true)}
                  className="text-xs font-bold text-brand-700 hover:text-brand-800"
                >
                  {selectedLead.scheduledVisit ? 'Reschedule' : '+ Schedule Visit'}
                </button>
              </div>

              {selectedLead.scheduledVisit ? (
                <div className="p-3 bg-brand-50/50 rounded-lg border border-brand-100 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-700 text-white flex flex-col items-center justify-center font-bold shrink-0">
                    <span className="text-[9px] uppercase">
                      {new Date(selectedLead.scheduledVisit.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-sm leading-none">
                      {selectedLead.scheduledVisit.date.split('-')[2]}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Walkthrough at {selectedLead.scheduledVisit.time}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {selectedLead.scheduledVisit.notes}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-1">
                  No site visit currently scheduled for this lead.
                </p>
              )}
            </div>

            {/* Notes Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Consultation Notes & Communication Log
              </h4>

              <form onSubmit={handleAddNoteToSelectedLead} className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add notes from phone conversation or site walkthrough..."
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                />
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-colors"
                >
                  Add Note
                </button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedLead.notes.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">No notes recorded yet.</p>
                ) : (
                  selectedLead.notes.map((note) => (
                    <div key={note.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                        <span className="font-semibold text-slate-700">{note.author}</span>
                        <span>{note.date}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{note.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Action Bar Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => handleOpenEstimateForLead(selectedLead)}
                className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4 text-brand-700" />
                <span>Create Formal Estimate</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Close
                </button>
                {selectedLead.status !== 'Converted' && (
                  <button
                    onClick={() => {
                      convertLeadToProject(selectedLead.id);
                      setSelectedLead(null);
                    }}
                    className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <span>Convert to Project</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL: ADD NEW LEAD ================= */}
      <Modal
        isOpen={isAddLeadOpen}
        onClose={() => setIsAddLeadOpen(false)}
        title="Add New Lead Inquiry"
        subtitle="Record prospective client consultation details"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateLead} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Customer / Homeowner Name *</label>
            <input
              type="text"
              required
              value={newLeadData.clientName}
              onChange={(e) => setNewLeadData({ ...newLeadData, clientName: e.target.value })}
              placeholder="e.g. Michael & Emily Roberts"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={newLeadData.phone}
                onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })}
                placeholder="(951) 555-0182"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={newLeadData.email}
                onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })}
                placeholder="client@gmail.com"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Project Category</label>
              <select
                value={newLeadData.projectType}
                onChange={(e) => setNewLeadData({ ...newLeadData, projectType: e.target.value as ProjectCategory })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location / City</label>
              <input
                type="text"
                value={newLeadData.location}
                onChange={(e) => setNewLeadData({ ...newLeadData, location: e.target.value })}
                placeholder="e.g. Temecula, CA"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Budget Range</label>
            <input
              type="text"
              value={newLeadData.budgetRange}
              onChange={(e) => setNewLeadData({ ...newLeadData, budgetRange: e.target.value })}
              placeholder="e.g. $60,000 - $85,000"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Initial Inquiry Scope / Notes</label>
            <textarea
              rows={3}
              value={newLeadData.notes}
              onChange={(e) => setNewLeadData({ ...newLeadData, notes: e.target.value })}
              placeholder="Client wants to tear down kitchen soffits and expand into breakfast nook..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddLeadOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Save Lead
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: SCHEDULE SITE VISIT ================= */}
      <Modal
        isOpen={isScheduleVisitOpen}
        onClose={() => setIsScheduleVisitOpen(false)}
        title="Schedule On-Site Consultation"
        subtitle={selectedLead ? `Consultation with ${selectedLead.clientName}` : ''}
        maxWidth="md"
      >
        <form onSubmit={handleScheduleVisitSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
              <input
                type="text"
                required
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
                placeholder="10:00 AM"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Prep Notes & Checklist</label>
            <textarea
              rows={3}
              value={visitNotes}
              onChange={(e) => setVisitNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsScheduleVisitOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold"
            >
              Confirm Site Visit
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: CREATE ESTIMATE WORKFLOW ================= */}
      <Modal
        isOpen={isCreateEstimateOpen}
        onClose={() => setIsCreateEstimateOpen(false)}
        title="Estimate Creation & Cost Breakdown"
        subtitle="Generate itemized construction bid for client review"
        maxWidth="4xl"
      >
        <div className="space-y-5">
          {/* Client & Project Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Client Name</label>
              <input
                type="text"
                value={estimateClientName}
                onChange={(e) => setEstimateClientName(e.target.value)}
                placeholder="e.g. David Johnson"
                className="w-full mt-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Client Email</label>
              <input
                type="email"
                value={estimateClientEmail}
                onChange={(e) => setEstimateClientEmail(e.target.value)}
                placeholder="client@gmail.com"
                className="w-full mt-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Project Address / City</label>
              <input
                type="text"
                value={estimateAddress}
                onChange={(e) => setEstimateAddress(e.target.value)}
                placeholder="Temecula, CA"
                className="w-full mt-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* Project Type & Scope */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Project Category</label>
              <select
                value={estimateType}
                onChange={(e) => setEstimateType(e.target.value as ProjectCategory)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Scope of Work Summary</label>
              <input
                type="text"
                value={estimateScope}
                onChange={(e) => setEstimateScope(e.target.value)}
                placeholder="Demolition, structural LVL installation, cabinetry, quartz counters, electrical..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Itemized Cost Breakdown Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Itemized Cost Breakdown (Labor, Materials, Subcontractors, Permits)
              </h4>
              <button
                type="button"
                onClick={handleAddLineItem}
                className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Line Item</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Description</th>
                    <th className="py-2 px-3 w-16">Qty</th>
                    <th className="py-2 px-3 w-20">Unit</th>
                    <th className="py-2 px-3 w-24">Unit Cost ($)</th>
                    <th className="py-2 px-3 w-24 text-right">Total ($)</th>
                    <th className="py-2 px-2 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {estimateItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3">
                        <select
                          value={item.category}
                          onChange={(e) => handleUpdateLineItem(item.id, 'category', e.target.value)}
                          className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-semibold"
                        >
                          <option value="Labor">Labor</option>
                          <option value="Material">Material</option>
                          <option value="Equipment / Sub">Equipment / Sub</option>
                          <option value="Permits & Fees">Permits & Fees</option>
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleUpdateLineItem(item.id, 'description', e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateLineItem(item.id, 'quantity', Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => handleUpdateLineItem(item.id, 'unit', e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={item.unitCost}
                          onChange={(e) => handleUpdateLineItem(item.id, 'unitCost', Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                        />
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">
                        ${item.total.toLocaleString()}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteLineItem(item.id)}
                          className="text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col sm:flex-row justify-end items-end gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Costs:</span>
                <span className="font-semibold text-slate-900">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1">
                  Contingency / Margin:
                  <input
                    type="number"
                    value={contingencyPercent}
                    onChange={(e) => setContingencyPercent(Number(e.target.value))}
                    className="w-12 px-1 py-0.5 text-xs bg-white border border-slate-200 rounded text-center"
                  />
                  %
                </span>
                <span className="font-semibold text-slate-900">${contingencyAmount.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Total Estimated Cost:</span>
                <span className="text-brand-700 text-base">${totalEstimatedCost.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Estimate Terms & Warranty Guarantee</label>
            <textarea
              rows={2}
              value={estimateNotes}
              onChange={(e) => setEstimateNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                const tempEst: Estimate = {
                  id: 'temp',
                  estimateNumber: 'EST-PREVIEW',
                  clientName: estimateClientName || 'Client Preview',
                  clientEmail: estimateClientEmail || 'client@example.com',
                  clientPhone: estimateClientPhone || '(951) 609-7164',
                  projectAddress: estimateAddress || 'Southern California',
                  projectType: estimateType,
                  scopeOfWork: estimateScope || 'Full construction scope',
                  items: estimateItems,
                  subtotal,
                  contingencyPercent,
                  contingencyAmount,
                  totalEstimatedCost,
                  status: 'Draft',
                  createdAt: new Date().toISOString().split('T')[0],
                  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  notes: estimateNotes
                };
                setSelectedEstimate(tempEst);
                setIsPreviewEstimateOpen(true);
              }}
              className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview PDF Format</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreateEstimateOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveEstimate('Draft')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSaveEstimate('Sent')}
                className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Mark as Sent</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* ================= MODAL: PREVIEW ESTIMATE ================= */}
      {selectedEstimate && (
        <Modal
          isOpen={isPreviewEstimateOpen}
          onClose={() => setIsPreviewEstimateOpen(false)}
          title={`Estimate Preview: ${selectedEstimate.estimateNumber}`}
          subtitle="Official Unlimited Construction Letterhead"
          maxWidth="4xl"
        >
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-6 text-slate-800">
            {/* Header Letterhead */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-brand-700">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  UNLIMITED CONSTRUCTION
                </h2>
                <p className="text-xs text-brand-700 font-bold uppercase tracking-widest mt-0.5">
                  General Building Contractor • Class B
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  California State License #1040445
                </p>
                <p className="text-xs text-slate-500">
                  4193 Flat Rock Dr, Suite 200-435, Riverside, CA 92505
                </p>
                <p className="text-xs text-slate-500">
                  Phone: (951) 609-7164 • Nancy Paramo, Owner
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-block px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-lg border border-brand-200">
                  OFFICIAL ESTIMATE
                </span>
                <div className="text-sm font-mono font-bold text-slate-900 mt-2">
                  {selectedEstimate.estimateNumber}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Date: {selectedEstimate.createdAt}
                </div>
                <div className="text-xs text-slate-500">
                  Valid Until: {selectedEstimate.validUntil}
                </div>
              </div>
            </div>

            {/* Prepared For */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prepared For</span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{selectedEstimate.clientName}</h4>
                <p className="text-xs text-slate-600">{selectedEstimate.projectAddress}</p>
                <p className="text-xs text-slate-600">{selectedEstimate.clientPhone} • {selectedEstimate.clientEmail}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Specification</span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{selectedEstimate.projectType}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{selectedEstimate.scopeOfWork}</p>
              </div>
            </div>

            {/* Line items table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Item #</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Description of Work / Materials</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedEstimate.items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="py-2.5 px-3 text-slate-400">{index + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">{item.category}</td>
                      <td className="py-2.5 px-3 text-slate-900">{item.description}</td>
                      <td className="py-2.5 px-3 text-center text-slate-600">{item.quantity} {item.unit}</td>
                      <td className="py-2.5 px-3 text-right text-slate-600">${item.unitCost.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">${item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="text-xs text-slate-500 max-w-md">
                <span className="font-bold text-slate-700">Contractor Warranty:</span>
                <p className="mt-1 leading-relaxed">{selectedEstimate.notes}</p>
              </div>

              <div className="w-full sm:w-64 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">${selectedEstimate.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Contingency & Supervision ({selectedEstimate.contingencyPercent}%):</span>
                  <span className="font-semibold text-slate-900">${selectedEstimate.contingencyAmount.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>Total Bid:</span>
                  <span className="text-brand-700 text-base">${selectedEstimate.totalEstimatedCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Signature Area */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-500">
              <div>
                <div className="h-10 border-b border-slate-300 flex items-end pb-1 font-serif text-slate-700 italic">
                  Nancy Paramo
                </div>
                <span className="mt-1 block">Nancy Paramo, Unlimited Construction</span>
              </div>
              <div>
                <div className="h-10 border-b border-slate-300"></div>
                <span className="mt-1 block">Homeowner Acceptance Signature</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
