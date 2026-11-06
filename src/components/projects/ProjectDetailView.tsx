import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectTask, ProjectMilestone, Priority } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  FileText, 
  Camera, 
  FileSpreadsheet, 
  MessageSquare, 
  Share2, 
  ExternalLink,
  Phone,
  Mail,
  ShieldCheck,
  Check,
  Send,
  Eye,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project, onBack }) => {
  const { 
    team, 
    dailyUpdates, 
    documents, 
    changeOrders, 
    messages, 
    toggleTask, 
    addTask, 
    updateMilestoneStatus,
    sendMessage,
    updateChangeOrderStatus,
    setIsHomeownerPortal,
    setActiveHomeownerProjectId,
    showToast
  } = useApp();

  type TabType = 'overview' | 'timeline' | 'updates' | 'tasks' | 'documents' | 'budget' | 'changeorders' | 'communication';
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Task creation modal
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssigned, setNewTaskAssigned] = useState('Carlos Mendez');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-11-15');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('Medium');

  // Communication message input
  const [chatInput, setChatInput] = useState('');

  // Project data filters
  const projectUpdates = dailyUpdates.filter(u => u.projectId === project.id);
  const projectDocs = documents.filter(d => d.projectId === project.id);
  const projectCOs = changeOrders.filter(co => co.projectId === project.id);
  const projectMessages = messages.filter(m => m.projectId === project.id);

  // Budget calculations
  const approvedCOTotal = projectCOs
    .filter(co => co.status === 'Approved')
    .reduce((sum, co) => sum + co.totalCost, 0);
  const totalRevisedBudget = project.budget + approvedCOTotal;
  const remainingBudget = totalRevisedBudget - project.amountSpent;
  const budgetSpentPercent = Math.round((project.amountSpent / totalRevisedBudget) * 100);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask(project.id, {
      title: newTaskTitle,
      assignedTo: newTaskAssigned,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
      completed: false
    });

    setIsAddTaskOpen(false);
    setNewTaskTitle('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    sendMessage(project.id, chatInput, 'Nancy Paramo');
    setChatInput('');
  };

  const handleOpenClientPortalForThisProject = () => {
    setActiveHomeownerProjectId(project.id);
    setIsHomeownerPortal(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Quick Actions Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 mt-0.5"
              aria-label="Back to projects list"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                  {project.category}
                </span>
                <StatusBadge status={project.status} />
                <span className="text-xs text-slate-400">Permit #{project.permitNumber || 'RIV-2026'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1 truncate">
                {project.name}
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {project.clientName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {project.address}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Target: {project.targetCompletion}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleOpenClientPortalForThisProject}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4 text-brand-400" />
              <span>View as Homeowner</span>
            </button>
          </div>
        </div>

        {/* 8-Tab Workspace Navigation */}
        <div className="flex items-center gap-1 mt-6 border-b border-slate-200 overflow-x-auto scrollbar-none pb-1">
          {[
            { id: 'overview', label: '1. Overview' },
            { id: 'timeline', label: '2. Timeline' },
            { id: 'updates', label: `3. Daily Updates (${projectUpdates.length})` },
            { id: 'tasks', label: `4. Tasks (${project.tasks.length})` },
            { id: 'documents', label: `5. Documents (${projectDocs.length})` },
            { id: 'budget', label: '6. Budget' },
            { id: 'changeorders', label: `7. Change Orders (${projectCOs.length})` },
            { id: 'communication', label: `8. Client Chat (${projectMessages.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-3.5 py-2 rounded-t-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 -mb-1 ${
                activeTab === tab.id
                  ? 'border-brand-700 text-brand-700 bg-brand-50/40'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Col: Project Summary, Image, Milestones */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 sm:p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Project Scope & Summary</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {project.description}
              </p>

              {/* Progress Bar */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Overall Construction Progress</span>
                  <span className="font-extrabold text-brand-700 text-sm">{project.progress}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-700 transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {project.milestones.filter(m => m.status === 'Completed').length} of {project.milestones.length} major milestones accomplished.
                </p>
              </div>

              {/* Image banner */}
              {project.coverImage && (
                <div className="rounded-xl overflow-hidden border border-slate-200 h-64 w-full relative">
                  <img
                    src={project.coverImage}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-4">
                    <span className="text-white text-xs font-semibold backdrop-blur-xs bg-black/40 px-3 py-1 rounded-full">
                      Site Staging & Architectural Render
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Upcoming Milestones List */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">Upcoming Milestones</h3>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className="text-xs font-semibold text-brand-700 hover:text-brand-800"
                >
                  Manage Timeline →
                </button>
              </div>

              <div className="space-y-3">
                {project.milestones.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full shrink-0 ${
                        m.status === 'Completed' ? 'bg-emerald-500 ring-4 ring-emerald-100' :
                        m.status === 'In Progress' ? 'bg-brand-600 ring-4 ring-brand-100' : 'bg-slate-300'
                      }`} />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{m.title}</h4>
                        {m.notes && <p className="text-[11px] text-slate-500">{m.notes}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-mono">{m.date}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        m.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                        m.status === 'In Progress' ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Client Profile & Team */}
          <div className="lg:col-span-4 space-y-6">
            {/* Client Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Homeowner Contact
              </h3>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                  {project.clientName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{project.clientName}</h4>
                  <p className="text-xs text-slate-500">Property Owner</p>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <a href={`tel:${project.clientPhone}`} className="font-semibold text-brand-700 hover:underline">
                    {project.clientPhone}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Email:</span>
                  <a href={`mailto:${project.clientEmail}`} className="font-semibold text-slate-800 hover:underline truncate max-w-[170px]">
                    {project.clientEmail}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Job Address:</span>
                  <span className="font-medium text-slate-800 text-right truncate max-w-[170px]">{project.address}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('communication')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-brand-700" />
                <span>Open Direct Chat</span>
              </button>
            </div>

            {/* Budget Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Budget Overview
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Contract Base:</span>
                  <span className="font-semibold text-slate-900">${project.budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Approved Change Orders:</span>
                  <span className="font-semibold text-brand-700">+${approvedCOTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Revised Project Budget:</span>
                  <span className="font-bold text-slate-900">${totalRevisedBudget.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between text-slate-600">
                  <span>Incurred Costs to Date:</span>
                  <span className="font-semibold text-slate-900">${project.amountSpent.toLocaleString()} ({budgetSpentPercent}%)</span>
                </div>
                <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-1">
                  <span>Remaining Funds:</span>
                  <span className="text-emerald-700">${remainingBudget.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('budget')}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Detailed Line-Item Ledger →
              </button>
            </div>

            {/* Project Assigned Crew */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Assigned Team Members
              </h3>

              <div className="space-y-2">
                {team
                  .filter(m => project.assignedTeamIds.includes(m.id))
                  .map(member => (
                    <div key={member.id} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="w-8 h-8 rounded-full bg-brand-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{member.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{member.role}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: TIMELINE ================= */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Master Project Timeline & City Milestones</h3>
              <p className="text-xs text-slate-500 mt-0.5">Click any milestone status to update progress</p>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {project.milestones.length} Stages
            </span>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-slate-200">
            {project.milestones.map((milestone, idx) => {
              const isCompleted = milestone.status === 'Completed';
              const isInProgress = milestone.status === 'In Progress';

              return (
                <div key={milestone.id} className="relative group">
                  {/* Indicator Node */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 border-white text-white shadow-xs'
                        : isInProgress
                        ? 'bg-brand-700 border-white text-white ring-4 ring-brand-100 animate-pulse'
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <span className="text-[10px] font-bold">{idx + 1}</span>
                    )}
                  </div>

                  <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{milestone.title}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isInProgress
                              ? 'bg-brand-50 text-brand-700 border border-brand-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {milestone.status}
                        </span>
                      </div>
                      {milestone.notes && (
                        <p className="text-xs text-slate-600 mt-1">{milestone.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono font-medium text-slate-500">
                        {milestone.date}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateMilestoneStatus(project.id, milestone.id, 'Completed')}
                          className={`px-2.5 py-1 text-[11px] rounded-lg font-bold transition-colors ${
                            isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => updateMilestoneStatus(project.id, milestone.id, 'In Progress')}
                          className={`px-2.5 py-1 text-[11px] rounded-lg font-bold transition-colors ${
                            isInProgress ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          Active
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 3: DAILY UPDATES ================= */}
      {activeTab === 'updates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Daily Site Reports for this Project</h3>
            <span className="text-xs text-slate-500">{projectUpdates.length} updates recorded</span>
          </div>

          {projectUpdates.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
              No daily updates filed for this project yet.
            </div>
          ) : (
            <div className="space-y-4">
              {projectUpdates.map((upd) => (
                <div key={upd.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {upd.authorName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{upd.authorName}</h4>
                        <p className="text-[10px] text-slate-400">{upd.authorRole}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-800">{upd.date}</span>
                      <span>•</span>
                      <span className="text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                        {upd.weather.temp} - {upd.weather.condition}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-bold text-emerald-700 uppercase text-[10px] tracking-wider block mb-1">
                        Work Completed Today
                      </span>
                      <p className="text-slate-700 leading-relaxed bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                        {upd.workCompleted}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-blue-700 uppercase text-[10px] tracking-wider block mb-1">
                        Work Planned for Tomorrow
                      </span>
                      <p className="text-slate-700 leading-relaxed bg-blue-50/40 p-3 rounded-xl border border-blue-100">
                        {upd.workPlannedTomorrow}
                      </p>
                    </div>
                  </div>

                  {upd.materialsRequired && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                      <span className="font-bold text-slate-800">Materials Needed: </span>
                      {upd.materialsRequired}
                    </div>
                  )}

                  {/* Photos */}
                  {upd.photos && upd.photos.length > 0 && (
                    <div>
                      <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block mb-2">
                        Attached Progress Photos
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {upd.photos.map((p, idx) => (
                          <div key={idx} className="rounded-xl overflow-hidden border border-slate-200 group relative">
                            <img src={p.url} alt={p.caption} className="w-full h-32 object-cover group-hover:scale-105 transition-transform" />
                            <div className="p-2 bg-white text-[10px] text-slate-600 font-medium truncate">
                              {p.caption}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: TASKS ================= */}
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Project Action Items & Work Orders</h3>
              <p className="text-xs text-slate-500 mt-0.5">Assigned craftspeople, priority levels, and due dates</p>
            </div>
            <button
              onClick={() => setIsAddTaskOpen(true)}
              className="px-3.5 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {project.tasks.map((task) => (
              <div
                key={task.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 p-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => toggleTask(project.id, task.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                      task.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-slate-400 bg-white'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="min-w-0">
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-900 font-semibold'
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-medium text-slate-700">Assigned: {task.assignedTo}</span>
                      <span>•</span>
                      <span>Due: {task.dueDate}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <StatusBadge status={task.priority} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: DOCUMENTS ================= */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Project Documents & Municipal Permits</h3>
            <span className="text-xs text-slate-500">{projectDocs.length} files filed</span>
          </div>

          <div className="divide-y divide-slate-100">
            {projectDocs.map((doc) => (
              <div key={doc.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 font-bold text-xs">
                    PDF
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{doc.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Category: {doc.category} • Uploaded by {doc.uploadedBy} on {doc.uploadDate} ({doc.fileSize})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => showToast('Document Download', `Opening ${doc.name}...`, 'info')}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
                >
                  View File
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 6: BUDGET ================= */}
      {activeTab === 'budget' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 sm:p-6 space-y-6">
          <h3 className="text-base font-bold text-slate-900">Financial Ledger & Profitability</h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Original Contract</span>
              <p className="text-lg font-extrabold text-slate-900 mt-1">${project.budget.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Approved Changes</span>
              <p className="text-lg font-extrabold text-brand-700 mt-1">+${approvedCOTotal.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Incurred Job Costs</span>
              <p className="text-lg font-extrabold text-slate-900 mt-1">${project.amountSpent.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Remaining Balance</span>
              <p className="text-lg font-extrabold text-emerald-700 mt-1">${remainingBudget.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Major Cost Allocations</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="font-semibold text-slate-700">Framing & Structural Labor</span>
                <span className="font-mono font-bold text-slate-900">$28,500</span>
              </div>
              <div className="flex justify-between p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="font-semibold text-slate-700">Cabinetry & Millwork Finish Materials</span>
                <span className="font-mono font-bold text-slate-900">$19,200</span>
              </div>
              <div className="flex justify-between p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="font-semibold text-slate-700">Subcontractors (Licensed Electrical & Plumbing)</span>
                <span className="font-mono font-bold text-slate-900">$12,400</span>
              </div>
              <div className="flex justify-between p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="font-semibold text-slate-700">City Permits & Plan Review Fees</span>
                <span className="font-mono font-bold text-slate-900">$4,100</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 7: CHANGE ORDERS ================= */}
      {activeTab === 'changeorders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Project Change Orders</h3>
            <span className="text-xs text-slate-500">{projectCOs.length} change orders</span>
          </div>

          {projectCOs.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
              No change orders created for this project.
            </div>
          ) : (
            <div className="space-y-3">
              {projectCOs.map((co) => (
                <div key={co.id} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-subtle space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-brand-700">{co.orderNumber}</span>
                        <StatusBadge status={co.status} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{co.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{co.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-400">Total Change</span>
                      <div className="text-base font-extrabold text-slate-900">${co.totalCost.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Reason: <strong className="text-slate-700">{co.reason}</strong>
                    </span>
                    {co.status === 'Sent for Approval' && (
                      <button
                        onClick={() => updateChangeOrderStatus(co.id, 'Approved', 'Nancy Paramo (Verified)')}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Simulate Approval
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 8: CLIENT COMMUNICATION ================= */}
      {activeTab === 'communication' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Direct Homeowner Messaging</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time log between Nancy Paramo and {project.clientName}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Portal Connected</span>
            </div>
          </div>

          {/* Chat message stream */}
          <div className="space-y-3 max-h-96 overflow-y-auto p-2">
            {projectMessages.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No messages in chat history yet.</p>
            ) : (
              projectMessages.map((msg) => {
                const isNancy = msg.sender === 'Nancy Paramo';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isNancy ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                      <span className="font-bold text-slate-700">{msg.sender}</span>
                      <span>•</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isNancy
                          ? 'bg-brand-700 text-white rounded-tr-xs'
                          : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message input */}
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-slate-100">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Send message to ${project.clientName}...`}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="px-4 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs sm:text-sm font-bold disabled:opacity-50 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* ================= MODAL: ADD TASK ================= */}
      <Modal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        title="Create Work Order / Project Task"
        subtitle={`Assign task for ${project.name}`}
        maxWidth="md"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="e.g. Schedule City Plumbing Rough-In Inspection"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assignee</label>
              <select
                value={newTaskAssigned}
                onChange={(e) => setNewTaskAssigned(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                {team.map(m => (
                  <option key={m.id} value={m.name}>{m.name} ({m.role.split(' ')[0]})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
            <input
              type="date"
              required
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddTaskOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Add Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
