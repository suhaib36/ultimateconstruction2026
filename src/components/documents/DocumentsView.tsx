import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentItem, DocumentCategory } from '../../types';
import { Modal } from '../common/Modal';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  Plus, 
  FileSpreadsheet, 
  ShieldCheck, 
  Check, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { 
    documents, 
    projects, 
    addDocument, 
    deleteDocument, 
    setSelectedProjectId, 
    setCurrentTab,
    showToast 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<string>('All');

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formProjectId, setFormProjectId] = useState(projects[0]?.id || 'proj-1');
  const [formCategory, setFormCategory] = useState<DocumentCategory>('Contracts');
  const [formUploadedBy, setFormUploadedBy] = useState('Nancy Paramo');

  const categories: DocumentCategory[] = [
    'Contracts',
    'Estimates',
    'Permits',
    'Architectural Plans',
    'Inspection Reports',
    'Invoices',
    'Other Documents'
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesProject = selectedProject === 'All' || doc.projectId === selectedProject;
    return matchesSearch && matchesCategory && matchesProject;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const proj = projects.find(p => p.id === formProjectId);
    const projectName = proj ? proj.name : 'Unlimited Construction';

    addDocument({
      projectId: formProjectId,
      projectName,
      name: formName.endsWith('.pdf') ? formName : `${formName}.pdf`,
      category: formCategory,
      uploadedBy: formUploadedBy,
      fileSize: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
      fileType: 'PDF'
    });

    setIsUploadOpen(false);
    setFormName('');
  };

  const getCategoryColor = (cat: DocumentCategory) => {
    switch (cat) {
      case 'Contracts':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Estimates':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Permits':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Architectural Plans':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Inspection Reports':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Invoices':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search documents by filename or project name..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
            />
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium max-w-xs"
            >
              <option value="All">All Projects ({documents.length})</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Categories ({documents.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-700 text-white font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-4">Related Project</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Upload Date</th>
                <th className="py-3 px-4">Uploaded By</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No documents match your filters.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-[10px] shrink-0 border border-brand-100">
                          PDF
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 hover:text-brand-700 cursor-pointer truncate max-w-sm" onClick={() => setPreviewDoc(doc)}>
                            {doc.name}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-mono">{doc.fileSize}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      <button
                        onClick={() => {
                          setSelectedProjectId(doc.projectId);
                          setCurrentTab('projects');
                        }}
                        className="hover:text-brand-700 hover:underline text-left truncate max-w-xs block"
                      >
                        {doc.projectName}
                      </button>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryColor(doc.category)}`}>
                        {doc.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500 text-xs">
                      {doc.uploadDate}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {doc.uploadedBy}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={() => showToast('Simulated Download', `Downloading ${doc.name}...`)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                          title="Download document"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Delete file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: SIMULATED UPLOAD ================= */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Project Document"
        subtitle="File prime contracts, city permits, engineering plans, or invoices"
        maxWidth="lg"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Document Title *</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. City of Riverside Stamped Architectural Plans Rev-2.pdf"
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Document Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as DocumentCategory)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Uploaded By</label>
            <input
              type="text"
              value={formUploadedBy}
              onChange={(e) => setFormUploadedBy(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          {/* Drag & Drop Simulation */}
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">Drag PDF, DWG, or DOCX files here</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Frontend simulation • Files saved to active local workspace</p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Upload to Project
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: DOCUMENT PREVIEW ================= */}
      {previewDoc && (
        <Modal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title={previewDoc.name}
          subtitle={`Category: ${previewDoc.category} • Related Project: ${previewDoc.projectName}`}
          maxWidth="4xl"
        >
          <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-6 text-slate-800">
            {/* Document Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  UNLIMITED CONSTRUCTION
                </h3>
                <p className="text-xs text-brand-700 font-bold">CA License #1040445 • Nancy Paramo</p>
                <p className="text-xs text-slate-500 mt-1">4193 Flat Rock Dr, Riverside, CA 92505 • (951) 609-7164</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                  OFFICIALLY FILED
                </span>
                <p className="text-xs text-slate-400 font-mono mt-1">Uploaded: {previewDoc.uploadDate}</p>
                <p className="text-xs text-slate-400">By: {previewDoc.uploadedBy}</p>
              </div>
            </div>

            {/* Document Simulated Content */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-xs leading-relaxed font-sans">
              <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-200 pb-2">
                <span>DOCUMENT TITLE: {previewDoc.name}</span>
                <span>FILE SIZE: {previewDoc.fileSize}</span>
              </div>

              <p>
                This document constitutes official construction and municipal compliance records executed under the supervision of <strong>Nancy Paramo</strong>, licensed general contractor for Unlimited Construction.
              </p>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800">Verification Stamps & Approvals:</div>
                <div>• Verified against California Title 24 Energy Compliance standards.</div>
                <div>• Approved structural load calculations by Registered Professional Civil Engineer.</div>
                <div>• Job site permit postings active for Riverside County inspections.</div>
              </div>

              <div className="pt-6 grid grid-cols-2 gap-8 text-xs text-slate-500">
                <div>
                  <div className="h-8 border-b border-slate-300 font-serif italic text-slate-800">Nancy Paramo</div>
                  <span className="mt-1 block text-[10px]">Unlimited Construction Verification</span>
                </div>
                <div>
                  <div className="h-8 border-b border-slate-300 font-serif italic text-slate-800">Verified & Stamped</div>
                  <span className="mt-1 block text-[10px]">Municipal Authority Review</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => showToast('Simulated Download', `Downloading ${previewDoc.name}...`)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Copy</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
