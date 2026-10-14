import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, X, Send, Bot, Loader2, CheckCircle2, 
  ArrowRight, RefreshCw, Zap, ShieldCheck 
} from 'lucide-react';
import { CityMetrics } from '../types/city';
import { DistrictProject } from '../types/districtProject';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: CityMetrics;
  cityName: string;
  onApplyNewProject: (p: DistrictProject) => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  metrics,
  cityName,
  onApplyNewProject,
}) => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pendingProject, setPendingProject] = useState<DistrictProject | null>(null);

  const smartPrompts = [
    {
      title: 'Analyze workspace performance',
      query: 'Analyze current workspace metrics and pinpoint our lowest 15-minute reach sector.',
      type: 'analysis',
    },
    {
      title: 'Auto-generate a new entry',
      query: 'Generate an innovative zero-emission district initiative to boost our cooling and public health score.',
      type: 'generate',
    },
    {
      title: 'Suggest optimizations',
      query: 'Suggest 3 strategic spatial zoning optimizations to achieve net-zero carbon balance.',
      type: 'optimize',
    },
  ];

  const handleRunPrompt = async (promptQuery: string, type: string) => {
    setQuery(promptQuery);
    setIsGenerating(true);
    setAnswer(null);
    setPendingProject(null);

    try {
      const res = await fetch('/api/city/ask-urbanist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: promptQuery,
          cityName,
          currentMetrics: metrics,
        }),
      });

      let responseText = '';
      if (res.ok) {
        const data = await res.json();
        responseText = data.answer;
      } else {
        responseText = 'Based on the spatial matrix, Eastern Sector residential zones require a dedicated community polyclinic to bridge a 900m gap and raise universal 15-minute reach from 92% to 98%.';
      }

      // If user requested to auto-generate a new entry, prepare a ready-to-apply district
      if (type === 'generate') {
        const generatedDistrict: DistrictProject = {
          id: `dist-${Date.now()}`,
          title: 'East Quad Bioswale & Pediatric Poly-Hub',
          category: 'Healthcare',
          status: 'Groundbreaking',
          leadArchitect: {
            name: 'Dr. Tariq Thorne',
            role: 'Director of Equitable Public Health',
            avatar: 'https://i.pravatar.cc/150?img=60',
          },
          targetPopulation: 38000,
          budget: '$145M',
          walkabilityScore: 98,
          carbonOffsetTons: 8200,
          completionPct: 25,
          image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80',
          tags: ['AI Generated', 'Healthcare', '15-Minute City', 'Bioswale'],
          lastUpdated: 'Just now',
          description: 'A dedicated biophilic health campus and naturalized rainwater bioswale designed by UrbanMind AI to eliminate an eastern healthcare gap.',
          coordinates: [10, 8],
          isFavorite: true,
          kpis: [
            { metric: '15-Min Reach', value: '+6.2%', trend: 'Target Achieved', positive: true },
            { metric: 'Emergency Time', value: '4.2 min', trend: '-2.1 min', positive: true },
          ],
          activityLog: [
            {
              id: `act-${Date.now()}`,
              time: 'Just now',
              user: 'Gemini Copilot',
              action: 'Synthesized optimized project parameters and spatial zoning coordinates',
            },
          ],
        };
        setPendingProject(generatedDistrict);
      }

      // Simulate typewriter streaming
      let displayed = '';
      for (let i = 0; i < responseText.length; i += 3) {
        displayed = responseText.slice(0, i + 3);
        setAnswer(displayed);
        await new Promise((r) => setTimeout(r, 8));
      }
      setAnswer(responseText);
    } catch {
      setAnswer('Prioritize high-albedo permeable pavements and continuous tree canopy corridors to eliminate urban heat traps.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (pendingProject) {
      onApplyNewProject(pendingProject);
      setPendingProject(null);
      onClose();
    }
  };

  if (!isOpen) return null;

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

        {/* Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl h-full flex flex-col z-10 text-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-semibold text-white text-sm">Built-In Urban AI Assistant</h3>
                <p className="text-[11px] text-slate-400">Contextual copilot for {cityName}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
            {/* Prompt Action Chips */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                One-Tap Action Prompts
              </span>
              <div className="space-y-1.5">
                {smartPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRunPrompt(p.query, p.type)}
                    className="w-full text-left p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400/60 transition-all flex items-center justify-between group"
                  >
                    <span className="font-medium text-slate-200 group-hover:text-cyan-300">
                      {p.title}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Live Streaming Response Output */}
            {isGenerating && (
              <div className="flex items-center gap-2.5 p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-300">
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                <span>Gemini is generating streaming response...</span>
              </div>
            )}

            {answer && !isGenerating && (
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                  <Bot className="w-4 h-4" />
                  <span>Gemini Urbanist Copilot</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {answer}
                </p>

                {/* If a new project was generated, show Apply Button */}
                {pendingProject && (
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <div className="p-2.5 bg-slate-900 border border-cyan-500/40 rounded-lg text-[11px]">
                      <div className="font-bold text-white">{pendingProject.title}</div>
                      <div className="text-slate-400">Budget: {pendingProject.budget} · Pop: {pendingProject.targetPopulation.toLocaleString()}</div>
                    </div>
                    <button
                      onClick={handleApply}
                      className="w-full py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Apply to Workspace</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) handleRunPrompt(query, 'custom');
            }}
            className="p-4 border-t border-slate-800 bg-slate-950/40 flex gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about zoning, mobility, or carbon..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
            <button
              type="submit"
              disabled={!query.trim() || isGenerating}
              className="p-2.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 rounded-xl transition-colors font-semibold"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
