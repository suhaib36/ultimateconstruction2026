import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectTask, Priority } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Check, 
  DollarSign, 
  Camera, 
  FileText, 
  FileSpreadsheet, 
  MessageSquare, 
  ChevronRight,
  ExternalLink,
  Send,
  User
} from 'lucide-react';

export const MobileProjectsTab: React.FC = () => {
  const { 
    projects, 
    selectedProjectId, 
    setSelectedProjectId, 
    dailyUpdates, 
    documents, 
    changeOrders, 
    messages, 
    toggleTask, 
    addTask, 
    sendMessage,
    setIsHomeownerPortal,
    setActiveHomeownerProjectId,
    addProject,
    showToast 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Project Detail Tab inside mobile view
  type DetailSubTab = 'overview' | 'tasks' | 'photos' | 'changeorders' | 'docs' | 'chat';
  const [detailTab, setDetailTab] = useState<DetailSubTab>('overview');

  // Modals inside mobile view
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssigned, setNewTaskAssigned] = useState('Carlos Mendez');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-11-15');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('Medium');
  const [mobileChatInput, setMobileChatInput] = useState('');

  // Form for New Project
  const [newProjName, setNewProjName] = useState('');
  const [newProjClient, setNewProjClient] = useState('');
  const [newProjCategory, setNewProjCategory] = useState<any>('Kitchen & Bath Remodeling');
  const [newProjLocation, setNewProjLocation] = useState('Riverside, CA');
  const [newProjBudget, setNewProjBudget] = useState(65000);

  const activeProject = projects.find(p => p.id === selectedProjectId);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !newTaskTitle.trim()) return;

    addTask(activeProject.id, {
      title: newTaskTitle,
      assignedTo: newTaskAssigned,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
      completed: false
    });

    setIsAddTaskOpen(false);
    setNewTaskTitle('');
  };

  const handleSendMobileMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !mobileChatInput.trim()) return;

    sendMessage(activeProject.id, mobileChatInput, 'Nancy Paramo');
    setMobileChatInput('');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim() || !newProjClient.trim()) return;

    addProject({
      name: newProjName,
      clientId: `client-${Date.now()}`,
      clientName: newProjClient,
      clientEmail: 'client@example.com',
      clientPhone: '(951) 609-7164',
      category: newProjCategory,
      location: newProjLocation,
      address: `${newProjLocation}, CA`,
      assignedTeamIds: ['team-1', 'team-2'],
      startDate: new Date().toISOString().split('T')[0],
      targetCompletion: '2026-12-30',
      budget: Number(newProjBudget),
      amountSpent: 0,
      progress: 5,
      status: 'Planning',
      description: `New project created on mobile by Nancy Paramo.`,
      coverImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      milestones: [
        { id: `m-${Date.now()}-1`, projectId: '', title: 'Contract & Retainer', date: new Date().toISOString().split('T')[0], status: 'In Progress' },
        { id: `m-${Date.now()}-2`, projectId: '', title: 'City Permitting', date: '2026-11-25', status: 'Upcoming' },
        { id: `m-${Date.now()}-3`, projectId: '', title: 'Rough Framing', date: '2026-12-10', status: 'Upcoming' }
      ],
      tasks: [
        { id: `t-${Date.now()}-1`, projectId: '', title: 'Upload signed agreement to project documents', assignedTo: 'Nancy Paramo', dueDate: '2026-11-15', priority: 'High', completed: false }
      ]
    });

    setIsNewProjectOpen(false);
    setNewProjName('');
    setNewProjClient('');
  };

  /* ================= RENDER SINGLE PROJECT DETAILS VIEW ================= */
  if (activeProject) {
    const projectUpdates = dailyUpdates.filter(u => u.projectId === activeProject.id);
    const projectCOs = changeOrders.filter(co => co.projectId === activeProject.id);
    const projectDocs = documents.filter(d => d.projectId === activeProject.id);
    const projectMessages = messages.filter(m => m.projectId === activeProject.id);

    return (
      <div className="space-y-4 pb-24">
        {/* Top Breadcrumb Nav */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2">
          <button
            onClick={() => setSelectedProjectId(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-brand-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Projects</span>
          </button>

          <button
            onClick={() => {
              setActiveHomeownerProjectId(activeProject.id);
              setIsHomeownerPortal(true);
            }}
            className="text-[11px] font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Client View</span>
          </button>
        </div>

        {/* Project Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                  {activeProject.category}
                </span>
                <StatusBadge status={activeProject.status} size="sm" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 mt-1 leading-snug">
                {activeProject.name}
              </h2>
            </div>
            <div className="text-right shrink-0">
              <span className="text-sm font-black text-brand-700">{activeProject.progress}%</span>
              <span className="text-[9px] text-slate-400 block">Complete</span>
            </div>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-brand-700" style={{ width: `${activeProject.progress}%` }} />
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <a href={`tel:${activeProject.clientPhone}`} className="flex items-center gap-1 text-slate-700 font-bold hover:text-brand-700">
              <Phone className="w-3.5 h-3.5 text-brand-700" />
              <span>Call Client</span>
            </a>
            <span className="text-slate-400 font-mono text-[11px]">Due: {activeProject.targetCompletion}</span>
          </div>
        </div>

        {/* Horizontal Mobile Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'tasks', label: `Tasks (${activeProject.tasks.length})` },
            { id: 'photos', label: `Photos (${projectUpdates.flatMap(u => u.photos).length})` },
            { id: 'changeorders', label: `COs (${projectCOs.length})` },
            { id: 'docs', label: `Docs (${projectDocs.length})` },
            { id: 'chat', label: `Chat (${projectMessages.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDetailTab(tab.id as DetailSubTab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                detailTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ============ SUBTAB: OVERVIEW ============ */}
        {detailTab === 'overview' && (
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Project Scope</h3>
              <p className="text-slate-700 leading-relaxed">{activeProject.description}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Financial Overview</h3>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Contract Base</span>
                  <span className="font-extrabold text-slate-900 text-sm">${activeProject.budget.toLocaleString()}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Job Incurred</span>
                  <span className="font-extrabold text-brand-700 text-sm">${activeProject.amountSpent.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Job Milestones</h3>
              <div className="space-y-1.5">
                {activeProject.milestones.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                    <span className="font-semibold text-slate-800">{m.title}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      m.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============ SUBTAB: TASKS / PUNCHLIST ============ */}
        {detailTab === 'tasks' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Punch List Items</span>
              <button
                onClick={() => setIsAddTaskOpen(true)}
                className="px-2.5 py-1 bg-brand-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {activeProject.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(activeProject.id, task.id)}
                  className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                      task.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                    }`}>
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="min-w-0">
                      <span className={`font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.title}
                      </span>
                      <div className="text-[10px] text-slate-400">{task.assignedTo} • Due: {task.dueDate}</div>
                    </div>
                  </div>
                  <StatusBadge status={task.priority} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============ SUBTAB: DAILY PHOTOS ============ */}
        {detailTab === 'photos' && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700">Job Site Progress Feed</span>
            {projectUpdates.map((u) => (
              <div key={u.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{u.authorName} ({u.date})</span>
                  <span className="text-amber-700 font-medium">{u.weather.temp}</span>
                </div>
                <p className="text-slate-600">{u.workCompleted}</p>
                {u.photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {u.photos.map((p, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden border border-slate-200 aspect-video">
                        <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ============ SUBTAB: CHANGE ORDERS ============ */}
        {detailTab === 'changeorders' && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700">Change Orders ({projectCOs.length})</span>
            {projectCOs.map((co) => (
              <div key={co.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-brand-700">{co.orderNumber}</span>
                  <StatusBadge status={co.status} size="sm" />
                </div>
                <h4 className="font-bold text-slate-900">{co.title}</h4>
                <p className="text-slate-600 text-[11px]">{co.description}</p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 font-extrabold text-slate-900">
                  <span>Total Cost:</span>
                  <span className="text-brand-700">${co.totalCost.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============ SUBTAB: DOCUMENTS ============ */}
        {detailTab === 'docs' && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700">Project Documents</span>
            {projectDocs.map((doc) => (
              <div key={doc.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{doc.name}</h4>
                  <span className="text-[10px] text-slate-400">{doc.category} • {doc.fileSize}</span>
                </div>
                <button
                  onClick={() => showToast('Opening File', `Viewing ${doc.name}...`, 'info')}
                  className="px-2.5 py-1 bg-slate-100 font-bold rounded-lg text-slate-800 text-[11px] shrink-0"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ============ SUBTAB: CHAT ============ */}
        {detailTab === 'chat' && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase">Messaging with {activeProject.clientName}</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto p-2 bg-slate-50 rounded-xl">
              {projectMessages.map((msg) => {
                const isNancy = msg.sender === 'Nancy Paramo';
                return (
                  <div key={msg.id} className={`flex flex-col ${isNancy ? 'items-end' : 'items-start'}`}>
                    <span className="text-[9px] text-slate-400 mb-0.5">{msg.sender}</span>
                    <div className={`p-2.5 rounded-xl text-xs max-w-[85%] ${
                      isNancy ? 'bg-brand-700 text-white rounded-tr-xs' : 'bg-white border text-slate-800 rounded-tl-xs'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMobileMessage} className="flex gap-2">
              <input
                type="text"
                value={mobileChatInput}
                onChange={(e) => setMobileChatInput(e.target.value)}
                placeholder="Type message to homeowner..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
              />
              <button
                type="submit"
                disabled={!mobileChatInput.trim()}
                className="px-3.5 py-2 bg-brand-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Modal: Add Task */}
        {isAddTaskOpen && (
          <Modal
            isOpen={isAddTaskOpen}
            onClose={() => setIsAddTaskOpen(false)}
            title="Add Punch List Task"
            subtitle={activeProject.name}
            maxWidth="sm"
          >
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Touch up paint on kitchen door trim"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Person</label>
                <input
                  type="text"
                  value={newTaskAssigned}
                  onChange={(e) => setNewTaskAssigned(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-brand-700 text-white rounded-xl text-xs font-bold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    );
  }

  /* ================= RENDER PROJECT LIST VIEW ================= */
  return (
    <div className="space-y-3 pb-24">
      {/* Mobile Search & Add Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
          />
        </div>

        <button
          onClick={() => setIsNewProjectOpen(true)}
          className="p-2 bg-brand-700 text-white rounded-xl shadow-xs shrink-0"
          title="Add New Project"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Status Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {['All', 'In Progress', 'Planning', 'Completed'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
              statusFilter === s
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Projects Cards List */}
      <div className="space-y-3">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedProjectId(p.id)}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle hover:border-brand-300 transition-all cursor-pointer overflow-hidden p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                    {p.category}
                  </span>
                  <StatusBadge status={p.status} size="sm" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                  {p.name}
                </h3>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{p.location}</span>
                  <span>•</span>
                  <span>{p.clientName}</span>
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-black text-brand-700">{p.progress}%</span>
                <span className="text-[9px] text-slate-400 block">Complete</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-brand-700" style={{ width: `${p.progress}%` }} />
            </div>

            {/* Bottom info */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500 text-[11px]">
                Budget: <strong className="text-slate-800">${p.budget.toLocaleString()}</strong>
              </span>
              <span className="text-brand-700 font-bold flex items-center gap-0.5 text-xs">
                <span>View Job</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New Project */}
      {isNewProjectOpen && (
        <Modal
          isOpen={isNewProjectOpen}
          onClose={() => setIsNewProjectOpen(false)}
          title="New Job Site Project"
          subtitle="Add project to active pipeline"
          maxWidth="sm"
        >
          <form onSubmit={handleCreateProject} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Project Name *</label>
              <input
                type="text"
                required
                value={newProjName}
                onChange={(e) => setNewProjName(e.target.value)}
                placeholder="e.g. Cooper – Custom ADU"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Client Name *</label>
              <input
                type="text"
                required
                value={newProjClient}
                onChange={(e) => setNewProjClient(e.target.value)}
                placeholder="Mark Cooper"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={newProjLocation}
                  onChange={(e) => setNewProjLocation(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Budget ($)</label>
                <input
                  type="number"
                  value={newProjBudget}
                  onChange={(e) => setNewProjBudget(Number(e.target.value))}
                  className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsNewProjectOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-brand-700 text-white rounded-xl text-xs font-bold"
              >
                Create Project
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
