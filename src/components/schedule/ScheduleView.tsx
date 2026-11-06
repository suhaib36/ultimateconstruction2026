import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScheduleEvent } from '../../types';
import { Modal } from '../common/Modal';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  MapPin, 
  Clock, 
  User, 
  AlertCircle, 
  Truck, 
  ShieldCheck, 
  CheckCircle, 
  Filter,
  Trash2,
  Edit2
} from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const { 
    scheduleEvents, 
    projects, 
    team, 
    addScheduleEvent, 
    updateScheduleEvent, 
    deleteScheduleEvent 
  } = useApp();

  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 10, 1)); // November 2026

  // Modal States
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formProjectId, setFormProjectId] = useState(projects[0]?.id || 'proj-1');
  const [formType, setFormType] = useState<ScheduleEvent['type']>('Inspection');
  const [formDate, setFormDate] = useState('2026-11-14');
  const [formTime, setFormTime] = useState('09:00 AM');
  const [formAssignedTo, setFormAssignedTo] = useState('Nancy Paramo');
  const [formLocation, setFormLocation] = useState('Riverside, CA');
  const [formNotes, setFormNotes] = useState('');

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 10 is Nov
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const filteredEvents = scheduleEvents.filter(e => {
    if (selectedFilter === 'All') return true;
    return e.type === selectedFilter;
  });

  const getEventsForDay = (day: number) => {
    const formattedDay = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredEvents.filter(e => e.date === formattedDay);
  };

  const getTypeStyle = (type: ScheduleEvent['type']) => {
    switch (type) {
      case 'Inspection':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Site Visit':
        return 'bg-brand-50 text-brand-700 border-brand-200';
      case 'Material Delivery':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Milestone':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Team Assignment':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleCreateOrUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === formProjectId);
    const projectName = proj ? proj.name : 'Unlimited Construction';

    if (editingEvent) {
      updateScheduleEvent({
        ...editingEvent,
        title: formTitle,
        projectId: formProjectId,
        projectName,
        type: formType,
        date: formDate,
        time: formTime,
        assignedTo: formAssignedTo,
        location: formLocation,
        notes: formNotes
      });
      setEditingEvent(null);
    } else {
      addScheduleEvent({
        title: formTitle,
        projectId: formProjectId,
        projectName,
        type: formType,
        date: formDate,
        time: formTime,
        assignedTo: formAssignedTo,
        location: formLocation,
        status: 'Scheduled',
        notes: formNotes
      });
      setIsAddEventOpen(false);
    }

    setFormTitle('');
    setFormNotes('');
  };

  const handleOpenEdit = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setFormTitle(event.title);
    setFormProjectId(event.projectId);
    setFormType(event.type);
    setFormDate(event.date);
    setFormTime(event.time);
    setFormAssignedTo(event.assignedTo || 'Nancy Paramo');
    setFormLocation(event.location);
    setFormNotes(event.notes || '');
  };

  const handleOpenNewEvent = (dayDateStr?: string) => {
    setEditingEvent(null);
    setFormTitle('');
    setFormDate(dayDateStr || '2026-11-12');
    setFormTime('10:00 AM');
    setFormLocation('Riverside, CA');
    setFormNotes('');
    setIsAddEventOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & View Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 px-2 min-w-[140px] text-center">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'week' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Weekly Schedule
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleOpenNewEvent()}
            className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Event</span>
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Event Types:
        </span>
        {['All', 'Inspection', 'Site Visit', 'Material Delivery', 'Milestone', 'Team Assignment'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedFilter(type)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedFilter === type
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Calendar Grid (Month View) */}
      {viewMode === 'month' ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 min-h-[520px]">
            {/* Empty slots for leading offset */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-slate-50/40 p-2 min-h-[90px]" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = getEventsForDay(day);
              const isToday = day === 6; // Current demo mock date: Nov 6

              return (
                <div
                  key={day}
                  onClick={() => handleOpenNewEvent(dateStr)}
                  className={`p-2 min-h-[105px] transition-colors hover:bg-slate-50/80 cursor-pointer flex flex-col justify-between group ${
                    isToday ? 'bg-brand-50/20' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-brand-700 text-white font-extrabold shadow-xs'
                          : 'text-slate-800 group-hover:text-brand-700'
                      }`}
                    >
                      {day}
                    </span>
                    <Plus className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Day Events Pills */}
                  <div className="space-y-1 mt-1 flex-1">
                    {dayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(evt);
                        }}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold border truncate hover:brightness-95 transition-all shadow-2xs ${getTypeStyle(
                          evt.type
                        )}`}
                        title={`${evt.time} - ${evt.title}`}
                      >
                        <span className="font-mono mr-1">{evt.time.split(' ')[0]}</span>
                        <span>{evt.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Week View List */
        <div className="space-y-3">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => handleOpenEdit(evt)}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-subtle hover:border-slate-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-brand-700 uppercase">
                    {new Date(evt.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-base font-extrabold text-slate-900 leading-none">
                    {evt.date.split('-')[2]}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTypeStyle(evt.type)}`}>
                      {evt.type}
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-400">
                      {evt.time}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      • {evt.projectName}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">
                    {evt.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {evt.location}
                    </span>
                    {evt.assignedTo && (
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {evt.assignedTo}
                      </span>
                    )}
                  </div>
                  {evt.notes && (
                    <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded-lg">
                      {evt.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleOpenEdit(evt)}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit event"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteScheduleEvent(evt.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT SCHEDULE EVENT ================= */}
      {(isAddEventOpen || editingEvent) && (
        <Modal
          isOpen={isAddEventOpen || !!editingEvent}
          onClose={() => {
            setIsAddEventOpen(false);
            setEditingEvent(null);
          }}
          title={editingEvent ? 'Edit Schedule Event' : 'Schedule New Job Site Event'}
          subtitle="Manage inspections, walkthroughs, milestone dates, and concrete pours"
          maxWidth="lg"
        >
          <form onSubmit={handleCreateOrUpdateEvent} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. City of Murrieta Shower Pan Flood Inspection"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Related Project</label>
                <select
                  value={formProjectId}
                  onChange={(e) => setFormProjectId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Event Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as ScheduleEvent['type'])}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="Inspection">Inspection</option>
                  <option value="Site Visit">Site Visit</option>
                  <option value="Material Delivery">Material Delivery</option>
                  <option value="Milestone">Milestone</option>
                  <option value="Team Assignment">Team Assignment</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                <input
                  type="text"
                  required
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  placeholder="09:30 AM"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Person</label>
                <select
                  value={formAssignedTo}
                  onChange={(e) => setFormAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {team.map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location / Job Site</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Temecula, CA"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Notes & Checklist</label>
              <textarea
                rows={3}
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Ensure permit card is posted at job site entrance, ladder is secured, etc."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {editingEvent && (
                <button
                  type="button"
                  onClick={() => {
                    deleteScheduleEvent(editingEvent.id);
                    setEditingEvent(null);
                  }}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Event</span>
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddEventOpen(false);
                    setEditingEvent(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  {editingEvent ? 'Save Changes' : 'Confirm Event'}
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
