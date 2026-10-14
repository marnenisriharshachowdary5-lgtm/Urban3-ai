import React, { useState } from 'react';
import { Sparkles, X, Loader2, ArrowRight } from 'lucide-react';
import { CityPlan } from '../types/city';

interface GeminiPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPlan: (plan: CityPlan) => void;
}

export const GeminiPlannerModal: React.FC<GeminiPlannerModalProps> = ({
  isOpen,
  onClose,
  onApplyPlan,
}) => {
  const [prompt, setPrompt] = useState(
    'A circular biophilic planned city for 250,000 citizens with 15-minute universal access to hospitals and schools, radial cooling canals, and autonomous micro-transit loops.'
  );
  const [population, setPopulation] = useState(250000);
  const [biome, setBiome] = useState('Temperate River Basin');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    '15-Minute Proximity',
    'Net-Zero Carbon',
    'Flood Resilience',
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const availableGoals = [
    '15-Minute Proximity',
    'Net-Zero Carbon',
    'Flood Resilience',
    'Healthcare Equity',
    'Autonomous Transit',
    'Urban Heat Island Mitigation',
    'Circular Water Recycling',
  ];

  const quickPrompts = [
    {
      title: 'Biophilic 15-Minute Metropole',
      prompt: 'Design a biophilic planned city with green finger corridors, river canals, distributed polyclinics, and high-density timber eco-towers.',
      pop: 280000,
      biome: 'Temperate River Basin',
    },
    {
      title: 'Decarbonized Desert Oasis',
      prompt: 'Design a zero-emission desert arcology powered by solar-hydrogen microgrids, shaded pedestrian canyons, and closed-loop circular agriculture.',
      pop: 180000,
      biome: 'Arid Desert Plain',
    },
    {
      title: 'Coastal Sponge Resilience City',
      prompt: 'A climate-resilient coastal delta city with permeable plazas, tidal retention canals, mangrove buffers, and elevated rapid transit.',
      pop: 320000,
      biome: 'Coastal Estuary',
    },
  ];

  const handleToggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/city/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          targetPopulation: population,
          climateBiome: biome,
          primaryGoals: selectedGoals,
        }),
      });

      if (!res.ok) {
        throw new Error(`Generation failed: ${res.statusText}`);
      }

      const plan: CityPlan = await res.json();
      onApplyPlan(plan);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-sm font-semibold text-white">Gemini Autonomous Urban Planner</h2>
              <p className="text-xs text-slate-400">Synthesize masterplans optimized for human well-being, equity, and climate resilience.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-200">
          {/* Quick Prompts */}
          <div>
            <label className="block text-slate-400 font-medium mb-2">
              Archetype Starting Prompts
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {quickPrompts.map((qp) => (
                <button
                  key={qp.title}
                  type="button"
                  onClick={() => {
                    setPrompt(qp.prompt);
                    setPopulation(qp.pop);
                    setBiome(qp.biome);
                  }}
                  className="text-left p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:border-teal-400/60 hover:bg-slate-800 transition-all group"
                >
                  <div className="font-semibold text-slate-200 group-hover:text-teal-300">
                    {qp.title}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {qp.prompt}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt textarea */}
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">
              Urban Planning Directive & Philosophy
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400 leading-relaxed"
              placeholder="Describe target urban density, biophilic greenery, healthcare proximity, and mobility goals..."
            />
          </div>

          {/* Grid Settings: Population & Biome */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">
                Target Citizen Population
              </label>
              <select
                value={population}
                onChange={(e) => setPopulation(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-400"
              >
                <option value={100000}>100,000 citizens (Compact Eco-Town)</option>
                <option value={200000}>200,000 citizens (Regional Mid-City)</option>
                <option value={250000}>250,000 citizens (15-Minute Polycentric)</option>
                <option value={400000}>400,000 citizens (High-Density Arcology)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1.5">
                Geographic Biome & Climate
              </label>
              <select
                value={biome}
                onChange={(e) => setBiome(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-400"
              >
                <option value="Temperate River Basin">Temperate River Basin</option>
                <option value="Coastal Estuary">Coastal Estuary & Delta</option>
                <option value="Arid Desert Plain">Arid Desert Plain</option>
                <option value="Tropical Archipelago">Tropical Archipelago</option>
              </select>
            </div>
          </div>

          {/* Goals Selection */}
          <div>
            <label className="block text-slate-400 font-medium mb-2">
              Optimization Goals (Select Priorities)
            </label>
            <div className="flex flex-wrap gap-2">
              {availableGoals.map((g) => {
                const isSelected = selectedGoals.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleToggleGoal(g)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGenerate}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 disabled:opacity-50 rounded-lg transition-all shadow-md"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating Urban Layout with Gemini...</span>
              </>
            ) : (
              <>
                <span>Generate City Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
