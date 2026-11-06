import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScheduleEvent } from '../../types';
import { Modal } from '../common/Modal';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  MapPin, 
  Clock, 
  User, 
  ChevronRight, 
  Filter,
  CheckCircle2
} from 'lucide-react';

export const MobileScheduleTab: React.FC = () => {
  const { scheduleEvents, projects, addScheduleEvent } = useApp();

  const [selectedDay, setSelectedDay] = useState<number>(6); // Default: Nov 6
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formProjectId, setFormProjectId] = useState(projects[0]?.id || 'proj-1');
  const [formType, setFormType] = useState<ScheduleEvent['type']>('Inspection');
  const [formDate, setFormDate] = useState('2026-11-06');
  const [formTime, setFormTime] = useState('10:00 AM');
  const [formLocation, setFormLocation] = useState('Riverside, CA');
  const [formNotes, setFormNotes] = useState('');

  // 7 days of current week
  const weekDays = [
    { name: 'Sun', dayNum: 1, fullDate: '2026-11-01' },
    { name: 'Mon', dayNum: 2, fullDate: '2026-11-02' },
    { name: 'Tue', dayNum: 3, fullDate: '2026-11-03' },
    { name: 'Wed', dayNum: 4, fullDate: '2026-11-04' },
    { name: 'Thu', dayNum: 5, fullDate: '2026-11-05' },
    { name: 'Fri', dayNum: 6, fullDate: '2026-11-06', isToday: true },
    { name: 'Sat', dayNum: 7, fullDate: '2026-11-07' },
    { name: 'Sun', dayNum: 8, fullDate: '2026-11-08' },
    { name: 'Mon', dayNum: 9, fullDate: '2026-11-09' },
    { name: 'Tue', dayNum: 10, fullDate: '2026-11-10' },
    { name: 'Wed', dayNum: 11, fullDate: '2026-11-11' },
    { name: 'Thu', dayNum: 12, fullDate: '2026-11-12' },
    { name: 'Fri', dayNum: 13, fullDate: '2026-11-13' },
    { name: 'Sat', dayNum: 14, fullDate: '2026-11-14' },
  ];

  const currentSelectedDateStr = weekDays.find(d => d.dayNum === selectedDay)?.fullDate || '2026-11-06';
  const dayEvents = scheduleEvents.filter(e => e.date === currentSelectedDateStr);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === formProjectId);

    addScheduleEvent({
      title: formTitle,
      projectId: formProjectId,
      projectName: proj ? proj.name : 'Unlimited Construction',
      type: formType,
      date: formDate,
      time: formTime,
      location: formLocation,
      status: 'Scheduled',
      notes: formNotes
    });

    setIsAddEventOpen(false);
    setFormTitle('');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Month Header and Quick Action */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">November 2026</h2>
            <p className="text-[11px] text-slate-500">Job site inspections, walkthroughs & delivery agenda</p>
          </div>
          <button
            onClick={() => {
              setFormDate(currentSelectedDateStr);
              setIsAddEventOpen(true);
            }}
            className="p-2 bg-brand-700 text-white rounded-xl shadow-xs"
            title="Schedule event"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal Days Strip (Mobile Native Style) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {weekDays.map((d) => {
            const isSelected = selectedDay === d.dayNum;
            const hasEvents = scheduleEvents.some(e => e.date === d.fullDate);

            return (
              <button
                key={d.dayNum}
                onClick={() => setSelectedDay(d.dayNum)}
                className={`flex flex-col items-center justify-center min-w-[44px] py-2 px-1.5 rounded-2xl transition-all ${
                  isSelected
                    ? 'bg-brand-700 text-white shadow-xs font-bold scale-105'
                    : d.isToday
                    ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-[10px] uppercase opacity-75">{d.name}</span>
                <span className="text-sm font-extrabold mt-0.5 leading-none">{d.dayNum}</span>
                {hasEvents && (
                  <span className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-brand-600'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Agenda for Selected Day */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-600">
            Agenda for {new Date(currentSelectedDateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ({dayEvents.length})
          </span>
        </div>

        {dayEvents.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No events scheduled for this date. Tap <strong className="text-brand-700">+</strong> to schedule an inspection or walkthrough.
          </div>
        ) : (
          dayEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-4 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 font-black text-xs flex items-center justify-center shrink-0">
                    {evt.time.split(' ')[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{evt.title}</h4>
                    <p className="text-[10px] text-slate-500">{evt.projectName}</p>
                  </div>
                </div>

                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 shrink-0">
                  {evt.type}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{evt.location}</span>
              </div>

              {evt.notes && (
                <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                  {evt.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Upcoming inspections across other days */}
      <div className="space-y-2 pt-2">
        <span className="text-xs font-bold text-slate-600 px-1">Upcoming This Month</span>
        <div className="space-y-2">
          {scheduleEvents.filter(e => e.date !== currentSelectedDateStr).slice(0, 3).map((evt) => (
            <div key={evt.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="min-w-0">
                <h5 className="font-bold text-slate-900 truncate">{evt.title}</h5>
                <span className="text-[10px] text-slate-400 font-mono">{evt.date} • {evt.time}</span>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 shrink-0">
                {evt.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add Schedule Event */}
      {isAddEventOpen && (
        <Modal
          isOpen={isAddEventOpen}
          onClose={() => setIsAddEventOpen(false)}
          title="Schedule Event"
          subtitle="Add inspection, walkthrough or delivery"
          maxWidth="sm"
        >
          <form onSubmit={handleAddSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. City Combo Rough-In Inspection"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project</label>
                <select
                  value={formProjectId}
                  onChange={(e) => setFormProjectId(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name.split('–')[0]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Inspection">Inspection</option>
                  <option value="Site Visit">Site Visit</option>
                  <option value="Material Delivery">Material Delivery</option>
                  <option value="Milestone">Milestone</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                <input
                  type="text"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  placeholder="10:00 AM"
                  className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Checklist</label>
              <input
                type="text"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Ensure permit card is posted..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddEventOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-brand-700 text-white rounded-xl text-xs font-bold"
              >
                Confirm
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
