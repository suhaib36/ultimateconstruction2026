import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectCategory, ProjectStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { ProjectDetailView } from './ProjectDetailView';
import { 
  Briefcase, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  DollarSign, 
  User, 
  ChevronRight, 
  Plus, 
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  LayoutGrid,
  List
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const { 
    projects, 
    selectedProjectId, 
    setSelectedProjectId, 
    addProject, 
    team 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // New Project Modal State
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    category: 'Kitchen & Bath Remodeling' as ProjectCategory,
    location: 'Riverside, CA',
    address: '4193 Flat Rock Dr, Riverside, CA 92505',
    budget: 75000,
    startDate: new Date().toISOString().split('T')[0],
    targetCompletion: '2026-12-30',
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80'
  });

  // If a project is selected, render the 8-tab workspace!
  const currentProject = projects.find(p => p.id === selectedProjectId);
  if (currentProject) {
    return (
      <ProjectDetailView 
        project={currentProject} 
        onBack={() => setSelectedProjectId(null)} 
      />
    );
  }

  // Filter logic
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
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

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.clientName) return;

    addProject({
      name: newProject.name,
      clientId: `client-${Date.now()}`,
      clientName: newProject.clientName,
      clientEmail: newProject.clientEmail || 'client@example.com',
      clientPhone: newProject.clientPhone || '(951) 609-7164',
      category: newProject.category,
      location: newProject.location,
      address: newProject.address,
      assignedTeamIds: ['team-1', 'team-2'],
      startDate: newProject.startDate,
      targetCompletion: newProject.targetCompletion,
      budget: Number(newProject.budget),
      amountSpent: 0,
      progress: 0,
      status: 'Planning',
      description: newProject.description || `New construction project managed by Nancy Paramo.`,
      coverImage: newProject.coverImage,
      milestones: [
        { id: `m-${Date.now()}-1`, projectId: '', title: 'Contract Execution & Retainer', date: newProject.startDate, status: 'In Progress' },
        { id: `m-${Date.now()}-2`, projectId: '', title: 'City Plan Check & Permitting', date: '2026-11-20', status: 'Upcoming' },
        { id: `m-${Date.now()}-3`, projectId: '', title: 'Rough Framing & MEP Rough-Ins', date: '2026-12-05', status: 'Upcoming' },
        { id: `m-${Date.now()}-4`, projectId: '', title: 'Final City Inspection & Walkthrough', date: newProject.targetCompletion, status: 'Upcoming' }
      ],
      tasks: [
        { id: `t-${Date.now()}-1`, projectId: '', title: 'Submit signed architectural prints to city building department', assignedTo: 'Sofia Rodriguez', dueDate: '2026-11-12', priority: 'High', completed: false }
      ]
    });

    setIsAddProjectOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects by name, client, or city..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
            />
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid Cards"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setIsAddProjectOpen(true)}
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="All">All Statuses ({projects.length})</option>
            <option value="In Progress">In Progress</option>
            <option value="Planning">Planning</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium max-w-xs"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {(selectedStatus !== 'All' || selectedCategory !== 'All' || searchTerm) && (
            <button
              onClick={() => { setSelectedStatus('All'); setSelectedCategory('All'); setSearchTerm(''); }}
              className="text-xs text-brand-700 hover:underline font-semibold ml-2"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProjectId(project.id)}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle hover:border-brand-300 hover:shadow-card transition-all cursor-pointer group overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Project Image */}
                <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={project.coverImage}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={project.status} />
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors leading-snug line-clamp-1">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-700">{project.clientName}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Target: {project.targetCompletion}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-500">Budget Spent:</span>
                      <span className="font-bold text-slate-900">
                        ${project.amountSpent.toLocaleString()} / <span className="text-slate-500">${project.budget.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[11px] text-slate-400">Milestone Completion</span>
                      <span className="text-xs font-bold text-slate-900">{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          project.progress >= 80 ? 'bg-emerald-500' : 'bg-brand-600'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {project.tasks.filter(t => t.completed).length}/{project.tasks.length} tasks completed
                </span>
                <span className="font-bold text-brand-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>Open Workspace</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Projects Table View */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Project Name</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Target Date</th>
                  <th className="py-3 px-4">Budget Progress</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedProjectId(p.id)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-brand-700">
                      {p.name}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {p.clientName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {p.category}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {p.location}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                      {p.targetCompletion}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-xs">
                        ${(p.amountSpent / 1000).toFixed(1)}k / ${(p.budget / 1000).toFixed(0)}k ({p.progress}%)
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="px-3 py-1 bg-slate-100 group-hover:bg-brand-700 group-hover:text-white rounded-lg text-xs font-bold transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE PROJECT ================= */}
      <Modal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        title="Initialize New Construction Project"
        subtitle="Create dedicated project workspace and milestone tracking"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Project Name *</label>
            <input
              type="text"
              required
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              placeholder="e.g. Miller – Stamped Pool Deck & Patio"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Client Name *</label>
              <input
                type="text"
                required
                value={newProject.clientName}
                onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                placeholder="Sandra & Wayne Miller"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Project Category</label>
              <select
                value={newProject.category}
                onChange={(e) => setNewProject({ ...newProject, category: e.target.value as ProjectCategory })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City / Region</label>
              <input
                type="text"
                value={newProject.location}
                onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                placeholder="Menifee, CA"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Exact Job Site Address</label>
              <input
                type="text"
                value={newProject.address}
                onChange={(e) => setNewProject({ ...newProject, address: e.target.value })}
                placeholder="29810 Bradley Rd, Menifee, CA 92586"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contract Budget ($)</label>
              <input
                type="number"
                value={newProject.budget}
                onChange={(e) => setNewProject({ ...newProject, budget: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={newProject.startDate}
                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Completion</label>
              <input
                type="date"
                value={newProject.targetCompletion}
                onChange={(e) => setNewProject({ ...newProject, targetCompletion: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Project Description & Scope</label>
            <textarea
              rows={3}
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Excavate, compact substrate, pour 1,200 sq.ft decorative stamped concrete with slate pattern..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddProjectOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Create Project Workspace
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
