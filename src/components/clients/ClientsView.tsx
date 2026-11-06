import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Client } from '../../types';
import { Modal } from '../common/Modal';
import { 
  Contact, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  ExternalLink, 
  FileText, 
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const ClientsView: React.FC = () => {
  const { 
    clients, 
    projects, 
    documents, 
    addClient, 
    updateClient, 
    setSelectedProjectId, 
    setCurrentTab,
    setIsHomeownerPortal,
    setActiveHomeownerProjectId 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);

  // New Client Form
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('(951) ');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('Riverside, CA');

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    addClient({
      name: formName,
      phone: formPhone,
      email: formEmail,
      address: formAddress,
      city: formCity,
      activeProjectIds: [],
      completedProjectIds: [],
      totalSpent: 0,
      lastCommunication: new Date().toISOString().split('T')[0],
      portalAccessCode: `UC-SOCAL-${Math.floor(100 + Math.random() * 900)}`
    });

    setIsAddClientOpen(false);
    setFormName('');
  };

  const handleOpenClientPortal = (client: Client) => {
    // find first active project for this client or default
    const clientProj = projects.find(p => p.clientName.includes(client.name.split(' ')[0]) || client.name.includes(p.clientName.split(' ')[0]));
    if (clientProj) {
      setActiveHomeownerProjectId(clientProj.id);
    }
    setIsHomeownerPortal(true);
    setSelectedClient(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clients by name, city, or email..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
          />
        </div>

        <button
          onClick={() => setIsAddClientOpen(true)}
          className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map((client) => {
          const clientProjects = projects.filter(p => 
            p.clientName.toLowerCase().includes(client.name.split(' ')[0].toLowerCase()) ||
            client.name.toLowerCase().includes(p.clientName.split(' ')[0].toLowerCase())
          );
          const activeProjCount = clientProjects.filter(p => p.status === 'In Progress' || p.status === 'Planning').length;

          return (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle hover:border-slate-300 transition-all p-5 flex flex-col justify-between space-y-4 cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 font-extrabold text-slate-700 text-sm flex items-center justify-center shrink-0 group-hover:bg-brand-50 group-hover:text-brand-700 transition-colors">
                      {client.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors truncate">
                        {client.name}
                      </h3>
                      <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {client.city}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 shrink-0">
                    {activeProjCount} Active
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                </div>

                {/* Projects Summary */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Projects ({clientProjects.length})
                  </div>
                  <div className="space-y-1">
                    {clientProjects.map(cp => (
                      <div key={cp.id} className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                        <span className="truncate">{cp.name}</span>
                        <span className="text-brand-700 font-bold shrink-0">{cp.progress}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Info Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Investment</span>
                  <span className="font-extrabold text-slate-900">${client.totalSpent.toLocaleString()}</span>
                </div>
                <span className="text-xs font-bold text-brand-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>View Profile</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= MODAL: CLIENT PROFILE ================= */}
      {selectedClient && (
        <Modal
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          title={selectedClient.name}
          subtitle={`Client Account • Property: ${selectedClient.address}, ${selectedClient.city}`}
          maxWidth="3xl"
        >
          <div className="space-y-6">
            {/* Quick stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Phone</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedClient.phone}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5 truncate">{selectedClient.email}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Portal Access Code</span>
                <p className="text-sm font-mono font-bold text-brand-700 mt-0.5">{selectedClient.portalAccessCode}</p>
              </div>
            </div>

            {/* Project History */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Construction History & Projects
              </h4>

              <div className="space-y-3">
                {projects
                  .filter(p => 
                    p.clientName.toLowerCase().includes(selectedClient.name.split(' ')[0].toLowerCase()) ||
                    selectedClient.name.toLowerCase().includes(p.clientName.split(' ')[0].toLowerCase())
                  )
                  .map(p => (
                    <div
                      key={p.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 hover:border-brand-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">{p.name}</h5>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {p.category} • Budget: ${p.budget.toLocaleString()} • Target: {p.targetCompletion}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-900">{p.progress}% Completed</span>
                        <button
                          onClick={() => {
                            setSelectedProjectId(p.id);
                            setCurrentTab('projects');
                            setSelectedClient(null);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-800 transition-colors"
                        >
                          Workspace
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleOpenClientPortal(selectedClient)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-brand-400" />
                <span>Open in Homeowner Portal</span>
              </button>

              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL: ADD CLIENT ================= */}
      <Modal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        title="Register New Client Record"
        subtitle="Save homeowner contact information and property location"
        maxWidth="md"
      >
        <form onSubmit={handleCreateClient} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name(s) *</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Thomas & Patricia Anderson"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="client@gmail.com"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Property Street Address</label>
            <input
              type="text"
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
              placeholder="e.g. 5420 Victoria Ave"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">City & Zip</label>
            <input
              type="text"
              value={formCity}
              onChange={(e) => setFormCity(e.target.value)}
              placeholder="Riverside, CA 92506"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddClientOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Save Client
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
