import React, { useState } from 'react';
import { X, Plus, Sparkles, Building2, Image as ImageIcon, Users, DollarSign } from 'lucide-react';
import { DistrictProject, ProjectCategory, ProjectStatus } from '../types/districtProject';
import { FALLBACK_IMAGE_URL } from './SafeImage';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: DistrictProject) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Biophilic');
  const [status, setStatus] = useState<ProjectStatus>('Planning');
  const [population, setPopulation] = useState(45000);
  const [budget, setBudget] = useState('$160M');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('15-Minute, Sustainable, Smart City');
  const [architectName, setArchitectName] = useState('Dr. Maya Lin');
  const [architectRole, setArchitectRole] = useState('Senior Urban Systems Architect');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a district or initiative title.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newProject: DistrictProject = {
      id: `dist-${Date.now()}`,
      title: title.trim(),
      category,
      status,
      leadArchitect: {
        name: architectName.trim() || 'Lead Architect',
        role: architectRole.trim() || 'Municipal Planner',
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50) + 10}`,
      },
      targetPopulation: Number(population) || 25000,
      budget: budget.trim() || '$100M',
      walkabilityScore: 92,
      carbonOffsetTons: Math.round(Number(population) * 0.25) || 5000,
      completionPct: status === 'Operational' ? 100 : status === 'Construction' ? 60 : status === 'Groundbreaking' ? 30 : 10,
      image: imageUrl.trim() || FALLBACK_IMAGE_URL,
      tags: tags.length ? tags : ['Sustainable', '15-Minute'],
      lastUpdated: 'Just now',
      description: description.trim() || 'A modern planned civic infrastructure district designed to enhance mobility, public health, and ecological resilience.',
      coordinates: [Math.floor(Math.random() * 10) + 2, Math.floor(Math.random() * 10) + 2],
      isFavorite: false,
      kpis: [
        { metric: '15-Min Reach', value: '94%', trend: '+8.4%', positive: true },
        { metric: 'Carbon Sink', value: 'Nominal', trend: 'Certified', positive: true },
        { metric: 'Pedestrian Flow', value: 'Optimal', trend: '+12%', positive: true },
      ],
      activityLog: [
        {
          id: `act-${Date.now()}`,
          time: 'Just now',
          user: architectName,
          action: 'Registered initiative in municipal planning register',
        },
      ],
    };

    onCreateProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-xs text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Create New Planned District</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              District Initiative Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Zephyr Wind Microgrid & Sky-Garden Tower"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Pillar Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
              >
                <option value="Biophilic">Biophilic & Cooling</option>
                <option value="Mobility">Mobility & Transit</option>
                <option value="Healthcare">Healthcare & Civic</option>
                <option value="Energy">Energy & Microgrid</option>
                <option value="Housing">Housing & Superblocks</option>
                <option value="Circular">Circular & Industry</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
              >
                <option value="Planning">Planning</option>
                <option value="Simulation">Simulation & Review</option>
                <option value="Groundbreaking">Groundbreaking</option>
                <option value="Construction">Active Construction</option>
                <option value="Operational">Operational</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Target Population</label>
              <input
                type="number"
                value={population}
                onChange={(e) => setPopulation(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Capital Budget</label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. $180M"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Architectural Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail spatial arrangement, 15-minute access goals, and climate resilience..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Cover Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Tags (Comma Separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold rounded-xl shadow-md transition-colors"
            >
              Create District
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
