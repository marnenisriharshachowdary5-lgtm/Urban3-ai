import React from 'react';
import { 
  Sparkles, Search, Moon, Sun, Share2, 
  Layers, LayoutGrid, Kanban, Table, BarChart3, 
  ShieldCheck, ShieldAlert, Bot, ArrowLeft, Plus,
  Sliders, Image as ImageIcon, Headphones, MessageSquareHeart, LogOut, Building2
} from 'lucide-react';
import { useTheme, AccentColor } from '../context/ThemeContext';
import { NotificationCenter } from './NotificationCenter';

export type WorkspaceTab = 
  | 'twin'
  | 'grid'
  | 'kanban'
  | 'table'
  | 'analytics'
  | 'audit'
  | 'stress_test'
  | 'copilot';

interface TopBarProps {
  activeTab: WorkspaceTab;
  cityName: string;
  onSelectTab: (tab: WorkspaceTab) => void;
  onOpenGenerateModal: () => void;
  onOpenCustomizerModal: () => void;
  onOpenGalleryModal: () => void;
  onOpenHelplineModal: () => void;
  onOpenFeedbackModal: () => void;
  onOpenFarewellModal: () => void;
  onOpenBriefingModal: () => void;
  onOpenCommandPalette: () => void;
  onOpenShareModal: () => void;
  onOpenAIDrawer: () => void;
  onOpenCreateModal: () => void;
  onReturnToLanding: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  cityName,
  onSelectTab,
  onOpenGenerateModal,
  onOpenCustomizerModal,
  onOpenGalleryModal,
  onOpenHelplineModal,
  onOpenFeedbackModal,
  onOpenFarewellModal,
  onOpenBriefingModal,
  onOpenCommandPalette,
  onOpenShareModal,
  onOpenAIDrawer,
  onOpenCreateModal,
  onReturnToLanding,
}) => {
  const { theme, toggleTheme, accent, setAccent } = useTheme();

  const accentOptions: AccentColor[] = ['cyan', 'indigo', 'emerald', 'rose', 'amber'];

  return (
    <header className="flex items-center justify-between gap-4 px-5 py-2.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 z-40 shrink-0">
      {/* Zone 1: Brand Wordmark & Mode Switcher */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenFarewellModal}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-300 transition-colors mr-1"
          title="Leave Studio & Return to Overview"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Exit Studio</span>
        </button>

        <span className="text-slate-700">|</span>

        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); onSelectTab('twin'); }} 
          className="text-base font-bold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap"
        >
          UrbanMind AI
        </a>
        <span className="text-slate-600">/</span>
        <button
          onClick={onOpenBriefingModal}
          className="text-xs font-medium text-slate-300 hover:text-white truncate max-w-[130px] text-left underline decoration-dotted underline-offset-4"
          title="Click to view full Masterplan Dossier"
        >
          {cityName}
        </button>
      </div>

      {/* Zone 2: Navigation Links for Multi-Views */}
      <nav className="hidden lg:flex items-center gap-4 text-xs font-medium text-slate-300">
        <button
          onClick={() => onSelectTab('twin')}
          className={`flex items-center gap-1.5 pb-0.5 transition-colors whitespace-nowrap ${
            activeTab === 'twin'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'hover:text-white text-slate-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Digital Twin Matrix</span>
        </button>

        <button
          onClick={() => onSelectTab('grid')}
          className={`flex items-center gap-1.5 pb-0.5 transition-colors whitespace-nowrap ${
            activeTab === 'grid'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'hover:text-white text-slate-400'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Districts</span>
        </button>

        <button
          onClick={() => onSelectTab('kanban')}
          className={`flex items-center gap-1.5 pb-0.5 transition-colors whitespace-nowrap ${
            activeTab === 'kanban'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'hover:text-white text-slate-400'
          }`}
        >
          <Kanban className="w-3.5 h-3.5" />
          <span>Kanban</span>
        </button>

        <button
          onClick={() => onSelectTab('table')}
          className={`flex items-center gap-1.5 pb-0.5 transition-colors whitespace-nowrap ${
            activeTab === 'table'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'hover:text-white text-slate-400'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>Table</span>
        </button>

        <button
          onClick={() => onSelectTab('analytics')}
          className={`flex items-center gap-1.5 pb-0.5 transition-colors whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'hover:text-white text-slate-400'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => onSelectTab('audit')}
          className={`flex items-center gap-1.5 pb-0.5 transition-colors whitespace-nowrap ${
            activeTab === 'audit'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'hover:text-white text-slate-400'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>15-Min Audit</span>
        </button>

        <button
          onClick={() => onSelectTab('stress_test')}
          className={`flex items-center gap-1.5 pb-0.5 transition-colors whitespace-nowrap ${
            activeTab === 'stress_test'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'hover:text-white text-slate-400'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Stress-Lab</span>
        </button>

        <button
          onClick={() => onSelectTab('copilot')}
          className={`flex items-center gap-1.5 pb-0.5 transition-colors whitespace-nowrap ${
            activeTab === 'copilot'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'hover:text-white text-slate-400'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Urbanist Copilot</span>
        </button>
      </nav>

      {/* Zone 3: Actions & Modals Triggers */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Custom City Builder Button */}
        <button
          onClick={onOpenCustomizerModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm"
          title="Set population (1M, 100M+), territory size & required facilities"
        >
          <Building2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden xl:inline">Custom Builder</span>
        </button>

        {/* 100+ Realistic Visuals Gallery Button */}
        <button
          onClick={onOpenGalleryModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
          title="Browse 100+ Realistic Architectural Images & Renders"
        >
          <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden 2xl:inline">100+ Visuals</span>
        </button>

        {/* Support & Helpline Button */}
        <button
          onClick={onOpenHelplineModal}
          className="p-1.5 text-slate-400 hover:text-cyan-300 rounded-lg hover:bg-slate-800 transition-colors"
          title="24/7 Customer Helpline Numbers, Emails & Offices"
        >
          <Headphones className="w-4 h-4" />
        </button>

        {/* Client Feedback Button */}
        <button
          onClick={onOpenFeedbackModal}
          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
          title="Submit Feedback & Star Rating"
        >
          <MessageSquareHeart className="w-4 h-4" />
        </button>

        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 border border-slate-700 text-xs transition-colors"
          title="Open Command Palette (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5" />
          <kbd className="px-1 py-0.5 text-[9px] font-mono bg-slate-900 border border-slate-700 rounded text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Accent Color Switcher */}
        <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-800 rounded-lg border border-slate-700">
          {accentOptions.map((c) => (
            <button
              key={c}
              onClick={() => setAccent(c)}
              className={`w-3.5 h-3.5 rounded-full transition-transform ${
                c === 'cyan' ? 'bg-cyan-400' : c === 'indigo' ? 'bg-indigo-500' : c === 'emerald' ? 'bg-emerald-500' : c === 'rose' ? 'bg-rose-500' : 'bg-amber-400'
              } ${accent === c ? 'scale-125 ring-2 ring-white' : 'opacity-60 hover:opacity-100'}`}
              title={`Switch Accent to ${c}`}
            />
          ))}
        </div>

        {/* Dark / Light Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <NotificationCenter />

        {/* Open AI Drawer */}
        <button
          onClick={onOpenAIDrawer}
          className="p-1.5 text-cyan-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Open AI Copilot Drawer"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Share Modal Trigger */}
        <button
          onClick={onOpenShareModal}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Share Masterplan"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Primary Action Button */}
        <button
          onClick={onOpenGenerateModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Masterplan</span>
        </button>
      </div>
    </header>
  );
};
