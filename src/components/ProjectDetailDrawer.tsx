import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, MapPin, Users, DollarSign, Footprints, Leaf, 
  Send, Clock, CheckCircle2, Tag, Edit3, Sparkles, Navigation,
  Star, Trash2
} from 'lucide-react';
import { DistrictProject, ProjectStatus } from '../types/districtProject';
import { useTheme } from '../context/ThemeContext';
import { SafeImage } from './SafeImage';

interface ProjectDetailDrawerProps {
  project: DistrictProject | null;
  onClose: () => void;
  onUpdateProject: (updated: DistrictProject) => void;
  onDeleteProject?: (id: string) => void;
  onJumpToTwinCoord?: (coords: [number, number]) => void;
}

export const ProjectDetailDrawer: React.FC<ProjectDetailDrawerProps> = ({
  project,
  onClose,
  onUpdateProject,
  onDeleteProject,
  onJumpToTwinCoord,
}) => {
  const { accentConfig } = useTheme();
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDesc, setEditedDesc] = useState('');
  const [editedStatus, setEditedStatus] = useState<ProjectStatus>('Planning');
  const [newComment, setNewComment] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  useEffect(() => {
    if (project) {
      setEditedTitle(project.title);
      setEditedDesc(project.description);
      setEditedStatus(project.status);
    }
  }, [project]);

  if (!project) return null;

  const handleSaveStatus = (status: ProjectStatus) => {
    setEditedStatus(status);
    const updated: DistrictProject = {
      ...project,
      status,
      activityLog: [
        {
          id: `act-${Date.now()}`,
          time: 'Just now',
          user: 'Lead Architect',
          action: `Updated project status to ${status}`,
        },
        ...(project.activityLog || []),
      ],
    };
    onUpdateProject(updated);
  };

  const handleToggleFavorite = () => {
    onUpdateProject({
      ...project,
      isFavorite: !project.isFavorite,
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const updated: DistrictProject = {
      ...project,
      activityLog: [
        {
          id: `act-${Date.now()}`,
          time: 'Just now',
          user: 'Municipal Reviewer',
          action: newComment.trim(),
        },
        ...(project.activityLog || []),
      ],
    };
    onUpdateProject(updated);
    setNewComment('');
  };

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    if (editedTitle.trim()) {
      onUpdateProject({ ...project, title: editedTitle.trim() });
    }
  };

  const handleSaveDesc = () => {
    setIsEditingDesc(false);
    if (editedDesc.trim()) {
      onUpdateProject({ ...project, description: editedDesc.trim() });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Slide-Over Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="relative w-full max-w-xl bg-slate-900 border-l border-slate-800 shadow-2xl h-full flex flex-col z-10 text-slate-200 overflow-hidden"
        >
          {/* Top Header */}
          <div className="relative h-48 w-full shrink-0">
            <SafeImage
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            
            {/* Top action buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleToggleFavorite}
                className="p-2 rounded-full bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-amber-400 transition-colors"
                title={project.isFavorite ? 'Remove Star' : 'Star District'}
              >
                <Star className={`w-4 h-4 ${project.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>
              {onDeleteProject && (
                <button
                  onClick={() => {
                    onDeleteProject(project.id);
                    onClose();
                  }}
                  className="p-2 rounded-full bg-slate-950/70 hover:bg-rose-950 text-slate-300 hover:text-rose-400 transition-colors"
                  title="Delete District"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute bottom-4 left-6 right-6">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                {project.category} Sector
              </span>
              {isEditingTitle ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={handleSaveTitle}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                    autoFocus
                    className="flex-1 bg-slate-950 border border-cyan-400 rounded-lg px-2.5 py-1 text-sm text-white font-bold"
                  />
                  <button
                    onClick={handleSaveTitle}
                    className="px-2 py-1 bg-cyan-400 text-slate-950 rounded text-xs font-semibold"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => setIsEditingTitle(true)}
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <h2 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h2>
                  <Edit3 className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
            {/* Status and Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">Lifecycle Status:</span>
                <select
                  value={editedStatus}
                  onChange={(e) => handleSaveStatus(e.target.value as ProjectStatus)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 font-medium"
                >
                  <option value="Planning">Planning</option>
                  <option value="Simulation">Simulation & Review</option>
                  <option value="Groundbreaking">Groundbreaking</option>
                  <option value="Construction">Active Construction</option>
                  <option value="Operational">Operational</option>
                </select>
              </div>

              {project.coordinates && onJumpToTwinCoord && (
                <button
                  onClick={() => {
                    onJumpToTwinCoord(project.coordinates!);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg font-medium transition-colors"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Locate in Digital Twin</span>
                </button>
              )}
            </div>

            {/* Lead Architect Profile */}
            <div className="flex items-center gap-3.5 p-3.5 bg-slate-950/40 border border-slate-800 rounded-xl">
              <SafeImage
                src={project.leadArchitect?.avatar}
                alt={project.leadArchitect?.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-xs">{project.leadArchitect?.name}</div>
                <div className="text-slate-400 text-[11px] truncate">{project.leadArchitect?.role}</div>
              </div>
              <span className="text-[10px] font-mono text-slate-500 shrink-0">
                Lead Director
              </span>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Executive Architecture Description
                </span>
                <button
                  onClick={() => setIsEditingDesc(!isEditingDesc)}
                  className="text-slate-500 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditingDesc ? 'Done' : 'Edit'}</span>
                </button>
              </div>

              {isEditingDesc ? (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={editedDesc}
                    onChange={(e) => setEditedDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-cyan-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                  />
                  <button
                    onClick={handleSaveDesc}
                    className="px-3 py-1 bg-cyan-400 text-slate-950 rounded-lg font-semibold"
                  >
                    Save Description
                  </button>
                </div>
              ) : (
                <p className="text-slate-300 leading-relaxed text-xs">
                  {project.description}
                </p>
              )}
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Population</span>
                <span className="text-sm font-bold font-mono tabular-nums text-white mt-0.5 block">
                  {project.targetPopulation?.toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Capital Budget</span>
                <span className="text-sm font-bold font-mono tabular-nums text-amber-300 mt-0.5 block">
                  {project.budget}
                </span>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">15-Min Score</span>
                <span className="text-sm font-bold font-mono tabular-nums text-emerald-400 mt-0.5 block">
                  {project.walkabilityScore}%
                </span>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">CO₂ Sequestered</span>
                <span className="text-sm font-bold font-mono tabular-nums text-cyan-400 mt-0.5 block">
                  {project.carbonOffsetTons?.toLocaleString()} t
                </span>
              </div>
            </div>

            {/* Domain KPIs & Trends */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Verification KPIs & Benchmarks
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {project.kpis?.map((kpi, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl space-y-1"
                  >
                    <span className="text-[10px] text-slate-400 block truncate">{kpi.metric}</span>
                    <div className="flex items-baseline justify-between">
                      <span className="font-bold font-mono tabular-nums text-xs text-white">
                        {kpi.value}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        {kpi.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Taxonomy & Urban Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700/80 text-[11px] text-slate-300 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Activity History & Comment Form */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Municipal Activity Log
              </span>

              {/* Add comment input */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Record an inspection milestone or municipal note..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-3 py-2 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-semibold rounded-xl transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Logs */}
              <div className="space-y-2">
                {project.activityLog?.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl flex items-start gap-3"
                  >
                    <Clock className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                    <div className="space-y-0.5">
                      <div className="text-[11px] text-slate-300">{act.action}</div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {act.user} · {act.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
