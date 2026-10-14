import React, { useState, useEffect } from 'react';
import { 
  Search, Command, X, Sparkles, LayoutGrid, Kanban, Table, 
  BarChart3, ShieldCheck, ShieldAlert, Bot, Moon, Sun, Download, 
  Share2, ArrowRight, Layers, Building2, Image as ImageIcon, Headphones, MessageSquareHeart
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { DistrictProject } from '../types/districtProject';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: 'twin' | 'grid' | 'kanban' | 'table' | 'analytics' | 'audit' | 'stress_test' | 'copilot') => void;
  onOpenGenerateModal: () => void;
  onExportJson: () => void;
  onExportCsv: () => void;
  onLoadPreset: (id: string) => void;
  projects: DistrictProject[];
  onSelectProject: (p: DistrictProject) => void;
  onOpenCustomizer?: () => void;
  onOpenGallery?: () => void;
  onOpenHelpline?: () => void;
  onOpenFeedback?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectView,
  onOpenGenerateModal,
  onExportJson,
  onExportCsv,
  onLoadPreset,
  projects,
  onSelectProject,
  onOpenCustomizer,
  onOpenGallery,
  onOpenHelpline,
  onOpenFeedback,
}) => {
  const [query, setQuery] = useState('');
  const { theme, toggleTheme, accent, setAccent, accentConfig } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickCommands = [
    {
      id: 'custom-build',
      title: 'Custom City Builder (Population 1M, 100M+ & Facilities)',
      category: 'City Generation',
      icon: Building2,
      action: () => { onOpenCustomizer?.(); onClose(); },
    },
    {
      id: 'gallery-visuals',
      title: '100+ Realistic City & Architectural Visuals',
      category: 'Visual Assets',
      icon: ImageIcon,
      action: () => { onOpenGallery?.(); onClose(); },
    },
    {
      id: 'support-helpline',
      title: 'Customer Helplines, Phone Numbers, Emails & Offices',
      category: 'Support & Care',
      icon: Headphones,
      action: () => { onOpenHelpline?.(); onClose(); },
    },
    {
      id: 'client-feedback',
      title: 'Submit Client Feedback & Star Rating',
      category: 'Feedback',
      icon: MessageSquareHeart,
      action: () => { onOpenFeedback?.(); onClose(); },
    },
    {
      id: 'gen-plan',
      title: 'Synthesize Masterplan with Gemini AI',
      category: 'AI & Generation',
      icon: Sparkles,
      action: () => { onOpenGenerateModal(); onClose(); },
    },
    {
      id: 'view-twin',
      title: 'Digital Twin Studio (2D/3D Canvas)',
      category: 'Navigation',
      icon: Layers,
      action: () => { onSelectView('twin'); onClose(); },
    },
    {
      id: 'view-grid',
      title: 'Districts Bento Grid View',
      category: 'Navigation',
      icon: LayoutGrid,
      action: () => { onSelectView('grid'); onClose(); },
    },
    {
      id: 'view-kanban',
      title: 'Infrastructure Kanban Board',
      category: 'Navigation',
      icon: Kanban,
      action: () => { onSelectView('kanban'); onClose(); },
    },
    {
      id: 'view-table',
      title: 'Compact Municipal Spreadsheet Table',
      category: 'Navigation',
      icon: Table,
      action: () => { onSelectView('table'); onClose(); },
    },
    {
      id: 'view-analytics',
      title: 'Citywide Analytics & Decarbonization Viz',
      category: 'Navigation',
      icon: BarChart3,
      action: () => { onSelectView('analytics'); onClose(); },
    },
    {
      id: 'view-audit',
      title: '15-Minute UN-Habitat Spatial Audit',
      category: 'Diagnostics',
      icon: ShieldCheck,
      action: () => { onSelectView('audit'); onClose(); },
    },
    {
      id: 'view-stress',
      title: 'Climate Resilience Stress-Lab',
      category: 'Diagnostics',
      icon: ShieldAlert,
      action: () => { onSelectView('stress_test'); onClose(); },
    },
    {
      id: 'toggle-theme',
      title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      category: 'Appearance',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => { toggleTheme(); onClose(); },
    },
    {
      id: 'export-json',
      title: 'Export Workspace Data as JSON',
      category: 'Data Export',
      icon: Download,
      action: () => { onExportJson(); onClose(); },
    },
    {
      id: 'export-csv',
      title: 'Export Workspace Data as CSV',
      category: 'Data Export',
      icon: Download,
      action: () => { onExportCsv(); onClose(); },
    },
  ];

  const filteredCommands = quickCommands.filter(
    (c) => c.title.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProjects = projects.filter(
    (p) => p.title.toLowerCase().includes(query.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search districts, custom builder, 100+ visuals, helplines, or press Esc to exit..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 border border-slate-700 text-slate-400 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-4 text-xs">
          {/* Quick Commands */}
          {filteredCommands.length > 0 && (
            <div className="space-y-1">
              <span className="px-3 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Commands & Features
              </span>
              {filteredCommands.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-100">{cmd.title}</div>
                        <div className="text-[10px] text-slate-400">{cmd.category}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })}
            </div>
          )}

          {/* District Projects */}
          {filteredProjects.length > 0 && (
            <div className="space-y-1">
              <span className="px-3 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Matching District Projects
              </span>
              {filteredProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    onSelectProject(project);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white transition-colors group text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <div>
                      <div className="font-medium">{project.title}</div>
                      <div className="text-[10px] text-slate-400">
                        {project.category} • {project.status} • {project.targetPopulation.toLocaleString()} citizens
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">
                    Walk: {project.walkabilityScore}%
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
