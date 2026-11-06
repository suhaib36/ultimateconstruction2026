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
  CheckCircle2, 
  Clock, 
  Image as ImageIcon, 
  Upload, 
  X, 
  Eye,
  AlertTriangle
} from 'lucide-react';

export const MobileFieldUpdatesTab: React.FC = () => {
  const { dailyUpdates, projects, team, addDailyUpdate } = useApp();

  const [selectedProjectFilter, setSelectedProjectFilter] = useState('All');
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<{ url: string; caption: string } | null>(null);

  // Form State
  const [formProjectId, setFormProjectId] = useState(projects[0]?.id || 'proj-1');
  const [formWorkCompleted, setFormWorkCompleted] = useState('');
  const [formWorkPlanned, setFormWorkPlanned] = useState('');
  const [formTemp, setFormTemp] = useState('77°F');
  const [formCondition, setFormCondition] = useState('Sunny & Clear');
  const [formMaterials, setFormMaterials] = useState('');
  const [formPhotos, setFormPhotos] = useState<{ url: string; caption: string }[]>([
    {
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=800&q=80',
      caption: 'Roof framing and shear wall inspection'
    }
  ]);

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

    addDailyUpdate({
      projectId: formProjectId,
      projectName: proj.name,
      date: new Date().toISOString().split('T')[0],
      authorName: 'Nancy Paramo',
      authorRole: 'Owner & General Contractor',
      workCompleted: formWorkCompleted,
      workPlannedTomorrow: formWorkPlanned || 'Continue planned phases.',
      weather: {
        temp: formTemp,
        condition: formCondition
      },
      materialsRequired: formMaterials || undefined,
      photos: formPhotos
    });

    setIsLogOpen(false);
    setFormWorkCompleted('');
    setFormWorkPlanned('');
    setFormMaterials('');
  };

  const filteredUpdates = selectedProjectFilter === 'All'
    ? dailyUpdates
    : dailyUpdates.filter(u => u.projectId === selectedProjectFilter);

  return (
    <div className="space-y-4 pb-24">
      {/* Field Logger Banner & Action Button */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Field Reports & Photo Log</h2>
            <p className="text-[11px] text-slate-500">Record daily job site progress on your mobile</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            77°F • Inland Empire
          </span>
        </div>

        <button
          onClick={() => setIsLogOpen(true)}
          className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
        >
          <Camera className="w-4 h-4" />
          <span>Snap Photo & Log Daily Progress</span>
        </button>
      </div>

      {/* Filter by project */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-600">Feed ({filteredUpdates.length})</span>
        <select
          value={selectedProjectFilter}
          onChange={(e) => setSelectedProjectFilter(e.target.value)}
          className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 font-medium text-slate-700 max-w-[200px]"
        >
          <option value="All">All Projects</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Feed of updates */}
      <div className="space-y-3">
        {filteredUpdates.map((upd) => (
          <div key={upd.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">{upd.projectName}</h4>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Logged by {upd.authorName} • {upd.date}
                </div>
              </div>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {upd.weather.temp}
              </span>
            </div>

            <div className="text-xs space-y-1.5">
              <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-800 block uppercase">Work Completed</span>
                <p className="text-slate-800 text-xs mt-0.5 leading-relaxed">{upd.workCompleted}</p>
              </div>

              {upd.workPlannedTomorrow && (
                <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                  <span className="text-[10px] font-bold text-blue-800 block uppercase">Tomorrow Plan</span>
                  <p className="text-slate-800 text-xs mt-0.5 leading-relaxed">{upd.workPlannedTomorrow}</p>
                </div>
              )}
            </div>

            {/* Photos */}
            {upd.photos && upd.photos.length > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {upd.photos.map((photo, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightboxPhoto(photo)}
                    className="rounded-xl overflow-hidden border border-slate-200 aspect-video relative group cursor-pointer"
                  >
                    <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal: Log Daily Update */}
      {isLogOpen && (
        <Modal
          isOpen={isLogOpen}
          onClose={() => setIsLogOpen(false)}
          title="Log Field Update"
          subtitle="Record site progress & photos from job site"
          maxWidth="sm"
        >
          <form onSubmit={handleCreateUpdate} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Project</label>
              <select
                value={formProjectId}
                onChange={(e) => setFormProjectId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Work Completed Today *</label>
              <textarea
                rows={3}
                required
                value={formWorkCompleted}
                onChange={(e) => setFormWorkCompleted(e.target.value)}
                placeholder="Framing completed, rough electrical boxes set..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Planned for Tomorrow</label>
              <input
                type="text"
                value={formWorkPlanned}
                onChange={(e) => setFormWorkPlanned(e.target.value)}
                placeholder="Plumbing inspection at 10 AM"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            {/* Photo upload simulator */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Snap / Attach Photo</label>
              <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center relative cursor-pointer hover:bg-slate-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSimulatePhotoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Camera className="w-5 h-5 text-brand-700 mx-auto mb-1" />
                <span className="text-xs font-bold text-slate-700">Take Photo or Upload</span>
              </div>

              {formPhotos.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {formPhotos.map((p, i) => (
                    <div key={i} className="relative rounded-lg overflow-hidden border w-16 h-12">
                      <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormPhotos(formPhotos.filter((_, idx) => idx !== i))}
                        className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsLogOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-brand-700 text-white rounded-xl text-xs font-bold"
              >
                Publish Update
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <Modal
          isOpen={!!lightboxPhoto}
          onClose={() => setLightboxPhoto(null)}
          title={lightboxPhoto.caption}
          maxWidth="md"
        >
          <div className="rounded-xl overflow-hidden bg-black max-h-[60vh] flex items-center justify-center">
            <img src={lightboxPhoto.url} alt={lightboxPhoto.caption} className="max-h-[60vh] object-contain" />
          </div>
        </Modal>
      )}
    </div>
  );
};
