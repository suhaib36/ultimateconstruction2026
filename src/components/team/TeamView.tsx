import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TeamMember } from '../../types';
import { Modal } from '../common/Modal';
import { 
  Users, 
  Plus, 
  Phone, 
  Mail, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Edit3, 
  ChevronRight,
  ListTodo
} from 'lucide-react';

export const TeamView: React.FC = () => {
  const { 
    team, 
    projects, 
    addTeamMember, 
    updateTeamMember, 
    setSelectedProjectId, 
    setCurrentTab 
  } = useApp();

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [viewingTasksMember, setViewingTasksMember] = useState<TeamMember | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formPhone, setFormPhone] = useState('(951) ');
  const [formEmail, setFormEmail] = useState('');
  const [formTrade, setFormTrade] = useState('');
  const [formAvailability, setFormAvailability] = useState<TeamMember['availability']>('Active on Site');

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormName('');
    setFormRole('Master Carpenter');
    setFormPhone('(951) 609-7164');
    setFormEmail('craft@unlimited-construction.com');
    setFormTrade('Framing, Finish Carpentry');
    setFormAvailability('Active on Site');
    setIsAddMemberOpen(true);
  };

  const handleOpenEdit = (m: TeamMember) => {
    setEditingMember(m);
    setFormName(m.name);
    setFormRole(m.role);
    setFormPhone(m.phone);
    setFormEmail(m.email);
    setFormTrade(m.tradeSpecialty);
    setFormAvailability(m.availability);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingMember) {
      updateTeamMember({
        ...editingMember,
        name: formName,
        role: formRole,
        phone: formPhone,
        email: formEmail,
        tradeSpecialty: formTrade,
        availability: formAvailability
      });
      setEditingMember(null);
    } else {
      addTeamMember({
        name: formName,
        role: formRole,
        phone: formPhone,
        email: formEmail,
        tradeSpecialty: formTrade,
        availability: formAvailability,
        assignedProjectIds: ['proj-1']
      });
      setIsAddMemberOpen(false);
    }
  };

  const getAvailabilityBadge = (status: TeamMember['availability']) => {
    switch (status) {
      case 'Active on Site':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Available':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'In Transit':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'On Leave':
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Unlimited Construction Craft Crew & Specialists
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Southern California field superintendents, master carpenters, concrete craftsmen, and permit drafters
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Team Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {team.map((member) => {
          const assignedProjects = projects.filter(p => member.assignedProjectIds.includes(p.id));
          const allAssignedTasks = projects.flatMap(p => 
            p.tasks.filter(t => t.assignedTo.includes(member.name) || member.name.includes(t.assignedTo))
          );

          return (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle hover:border-slate-300 transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-700 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs ring-2 ring-brand-100">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900 truncate">
                          {member.name}
                        </h3>
                        {member.name === 'Nancy Paramo' && (
                          <span title="Licensed General Contractor">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-brand-700 font-semibold truncate mt-0.5">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${getAvailabilityBadge(member.availability)}`}>
                    {member.availability}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Specialty Trade</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{member.tradeSpecialty}</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`tel:${member.phone}`} className="hover:text-brand-700 font-medium">{member.phone}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`mailto:${member.email}`} className="hover:text-brand-700 truncate">{member.email}</a>
                  </div>
                </div>

                {/* Assigned Projects */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Assigned Job Sites ({assignedProjects.length})
                  </div>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {assignedProjects.length === 0 ? (
                      <span className="text-[11px] text-slate-400">No active site assignments</span>
                    ) : (
                      assignedProjects.map(proj => (
                        <div
                          key={proj.id}
                          onClick={() => {
                            setSelectedProjectId(proj.id);
                            setCurrentTab('projects');
                          }}
                          className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 hover:bg-brand-50 text-slate-700 hover:text-brand-700 text-xs cursor-pointer transition-colors"
                        >
                          <span className="font-medium truncate">{proj.name}</span>
                          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setViewingTasksMember(member)}
                  className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <ListTodo className="w-3.5 h-3.5 text-brand-700" />
                  <span>Tasks ({allAssignedTasks.length})</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(member)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= MODAL: ADD / EDIT TEAM MEMBER ================= */}
      {(isAddMemberOpen || editingMember) && (
        <Modal
          isOpen={isAddMemberOpen || !!editingMember}
          onClose={() => {
            setIsAddMemberOpen(false);
            setEditingMember(null);
          }}
          title={editingMember ? `Edit ${editingMember.name}` : 'Add New Craft Team Member'}
          subtitle="Directory information for Unlimited Construction crew"
          maxWidth="md"
        >
          <form onSubmit={handleSaveMember} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Carlos Mendez"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Role / Job Title</label>
              <input
                type="text"
                required
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                placeholder="Senior Project Manager & Master Carpenter"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
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
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Specialty Trade</label>
              <input
                type="text"
                value={formTrade}
                onChange={(e) => setFormTrade(e.target.value)}
                placeholder="e.g. Custom Cabinetry, Architectural Design, Tile Work"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Availability</label>
              <select
                value={formAvailability}
                onChange={(e) => setFormAvailability(e.target.value as TeamMember['availability'])}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Active on Site">Active on Site</option>
                <option value="Available">Available</option>
                <option value="In Transit">In Transit</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddMemberOpen(false);
                  setEditingMember(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Save Team Member
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MODAL: VIEW ASSIGNED TASKS ================= */}
      {viewingTasksMember && (
        <Modal
          isOpen={!!viewingTasksMember}
          onClose={() => setViewingTasksMember(null)}
          title={`Assigned Tasks: ${viewingTasksMember.name}`}
          subtitle={`Current work orders and punch-list items assigned across all sites`}
          maxWidth="lg"
        >
          <div className="space-y-3">
            {projects.flatMap(p => 
              p.tasks
                .filter(t => t.assignedTo.includes(viewingTasksMember.name) || viewingTasksMember.name.includes(t.assignedTo))
                .map(t => ({ ...t, projectName: p.name, projectId: p.id }))
            ).map((t, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className={`font-bold ${t.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {t.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="font-semibold text-brand-700">{t.projectName}</span>
                    <span>•</span>
                    <span>Due: {t.dueDate}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  t.completed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {t.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};
