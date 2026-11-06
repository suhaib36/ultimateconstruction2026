import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DailyUpdate } from '../../types';
import { Modal } from '../common/Modal';
import { 
  Camera, 
  Plus, 
  Calendar, 
  MapPin, 
  Sun, 
  CloudSun, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  User, 
  ChevronRight, 
  Image as ImageIcon,
  Upload,
  X,
  Eye,
  Filter
} from 'lucide-react';

export const DailyUpdatesView: React.FC = () => {
  const { 
    dailyUpdates, 
    projects, 
    team, 
    addDailyUpdate, 
    setSelectedProjectId, 
    setCurrentTab 
  } = useApp();

  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('All');
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<{ url: string; caption: string; project: string } | null>(null);

  // New Update Form State
  const [formProjectId, setFormProjectId] = useState<string>(projects[0]?.id || 'proj-1');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formAuthorName, setFormAuthorName] = useState<string>('Carlos Mendez');
  const [formWorkCompleted, setFormWorkCompleted] = useState<string>('');
  const [formWorkPlanned, setFormWorkPlanned] = useState<string>('');
  const [formIssues, setFormIssues] = useState<string>('');
  const [formMaterials, setFormMaterials] = useState<string>('');
  const [formTemp, setFormTemp] = useState<string>('76°F');
  const [formCondition, setFormCondition] = useState<string>('Sunny & Clear');
  const [formNotes, setFormNotes] = useState<string>('');
  const [formPhotos, setFormPhotos] = useState<{ url: string; caption: string }[]>([
    {
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=800&q=80',
      caption: 'Roof framing and shear wall nailing inspection'
    }
  ]);

  // Handle Simulated Photo Upload
  const handleSimulatePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setFormPhotos(prev => [
            ...prev,
            {
              url: uploadEvent.target?.result as string,
              caption: file.name.replace(/\.[^/.]+$/, '')
            }
          ]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === formProjectId);
    if (!proj || !formWorkCompleted.trim()) return;

    const authorMember = team.find(t => t.name === formAuthorName);

    addDailyUpdate({
      projectId: formProjectId,
      projectName: proj.name,
      date: formDate,
      authorName: formAuthorName,
      authorRole: authorMember?.role || 'Job Site Foreman',
      workCompleted: formWorkCompleted,
      workPlannedTomorrow: formWorkPlanned || 'Continue planned construction phases.',
      issuesOrDelays: formIssues || undefined,
      materialsRequired: formMaterials || undefined,
      weather: {
        temp: formTemp,
        condition: formCondition
      },
      photos: formPhotos,
      additionalNotes: formNotes || undefined
    });

    setIsAddUpdateOpen(false);
    setFormWorkCompleted('');
    setFormWorkPlanned('');
    setFormIssues('');
    setFormMaterials('');
    setFormNotes('');
  };

  const filteredUpdates = selectedProjectFilter === 'All'
    ? dailyUpdates
    : dailyUpdates.filter(u => u.projectId === selectedProjectFilter);

  return (
    <div className="space-y-6">
      {/* Top Header & Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Job Site Daily Field Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time activity logs, photo updates, and weather conditions from Nancy’s project managers
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <select
            value={selectedProjectFilter}
            onChange={(e) => setSelectedProjectFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:border-brand-600 max-w-xs"
          >
            <option value="All">All Construction Sites ({dailyUpdates.length})</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button
            onClick={() => setIsAddUpdateOpen(true)}
            className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Log Daily Update</span>
          </button>
        </div>
      </div>

      {/* Chronological Activity Feed */}
      <div className="space-y-5">
        {filteredUpdates.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-sm">
            No daily site updates match the selected project filter.
          </div>
        ) : (
          filteredUpdates.map((update) => (
            <div
              key={update.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 sm:p-6 space-y-4 hover:border-slate-300 transition-all"
            >
              {/* Header: Author, Role, Date, Weather */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-700 text-white font-extrabold text-xs flex items-center justify-center shrink-0 ring-2 ring-brand-100">
                    {update.authorName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{update.authorName}</h4>
                      <span className="text-[11px] text-slate-400 font-medium">• {update.authorRole}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProjectId(update.projectId);
                        setCurrentTab('projects');
                      }}
                      className="text-xs font-bold text-brand-700 hover:underline flex items-center gap-1 text-left mt-0.5"
                    >
                      <span>{update.projectName}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{update.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200/70">
                    <Sun className="w-3.5 h-3.5 text-amber-600" />
                    <span>{update.weather.temp} • {update.weather.condition}</span>
                  </div>
                </div>
              </div>

              {/* Progress descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/90">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Work Completed Today
                  </span>
                  <p className="text-slate-800 leading-relaxed font-normal">
                    {update.workCompleted}
                  </p>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/90">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5 mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    Work Planned for Tomorrow
                  </span>
                  <p className="text-slate-800 leading-relaxed font-normal">
                    {update.workPlannedTomorrow}
                  </p>
                </div>
              </div>

              {/* Issues or Delays & Materials */}
              {(update.issuesOrDelays || update.materialsRequired) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {update.issuesOrDelays && (
                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-rose-900 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Site Issues / Delays: </span>
                        <span>{update.issuesOrDelays}</span>
                      </div>
                    </div>
                  )}

                  {update.materialsRequired && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                      <span className="font-bold text-slate-900">Materials Required on Site: </span>
                      <span>{update.materialsRequired}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Photo Thumbnails */}
              {update.photos && update.photos.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Site Progress Photos ({update.photos.length})
                    </span>
                    <span className="text-[11px] text-slate-400">Click photo to enlarge</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {update.photos.map((photo, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={() => setSelectedPhotoModal({ url: photo.url, caption: photo.caption, project: update.projectName })}
                        className="rounded-xl overflow-hidden border border-slate-200 cursor-pointer group relative aspect-video bg-slate-100"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-5 h-5" />
                        </div>
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white text-[10px] font-medium truncate">
                          {photo.caption}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {update.additionalNotes && (
                <p className="text-xs text-slate-500 italic pt-2 border-t border-slate-100">
                  Note from foreman: "{update.additionalNotes}"
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL: ADD DAILY UPDATE ================= */}
      <Modal
        isOpen={isAddUpdateOpen}
        onClose={() => setIsAddUpdateOpen(false)}
        title="Record Daily Job Site Field Update"
        subtitle="Log what was completed, upcoming tasks, materials, and attach site photos"
        maxWidth="3xl"
      >
        <form onSubmit={handleCreateUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Construction Project *</label>
              <select
                value={formProjectId}
                onChange={(e) => setFormProjectId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-brand-600"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Update Date</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reporting Team Member</label>
              <select
                value={formAuthorName}
                onChange={(e) => setFormAuthorName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                {team.map(m => (
                  <option key={m.id} value={m.name}>{m.name} ({m.role.split(' ')[0]})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Weather Conditions</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formTemp}
                  onChange={(e) => setFormTemp(e.target.value)}
                  placeholder="e.g. 76°F"
                  className="w-24 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <input
                  type="text"
                  value={formCondition}
                  onChange={(e) => setFormCondition(e.target.value)}
                  placeholder="e.g. Clear & Sunny"
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Materials Required Tomorrow</label>
              <input
                type="text"
                value={formMaterials}
                onChange={(e) => setFormMaterials(e.target.value)}
                placeholder="e.g. 8 bags rapid set mortar, 2x6 framing lumber..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Work Completed Today *</label>
            <textarea
              rows={3}
              required
              value={formWorkCompleted}
              onChange={(e) => setFormWorkCompleted(e.target.value)}
              placeholder="Detailed description of what the crew accomplished on site today..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Work Planned for Tomorrow</label>
            <textarea
              rows={2}
              value={formWorkPlanned}
              onChange={(e) => setFormWorkPlanned(e.target.value)}
              placeholder="Scheduled inspections, concrete pours, deliveries, or crew objectives..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Issues, Delays, or City Corrections (Optional)</label>
            <input
              type="text"
              value={formIssues}
              onChange={(e) => setFormIssues(e.target.value)}
              placeholder="e.g. Inspector requested extra earthquake hold-down clip on bedroom shear wall"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          {/* Photo Upload Simulator */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Upload Site Progress Photos (Simulation)</label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleSimulatePhotoUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-700">Click to browse or drop progress photos</p>
              <p className="text-[10px] text-slate-400 mt-0.5">JPEG, PNG up to 20MB</p>
            </div>

            {/* Attached Photos Preview */}
            {formPhotos.length > 0 && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {formPhotos.map((photo, i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden border border-slate-200 w-20 h-16 group">
                    <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormPhotos(formPhotos.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddUpdateOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Publish Daily Report
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: PHOTO LIGHTBOX ================= */}
      {selectedPhotoModal && (
        <Modal
          isOpen={!!selectedPhotoModal}
          onClose={() => setSelectedPhotoModal(null)}
          title={selectedPhotoModal.project}
          subtitle={selectedPhotoModal.caption}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-black flex items-center justify-center max-h-[70vh]">
              <img
                src={selectedPhotoModal.url}
                alt={selectedPhotoModal.caption}
                className="max-h-[70vh] w-auto object-contain mx-auto"
              />
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 font-medium">
              Caption: {selectedPhotoModal.caption}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
