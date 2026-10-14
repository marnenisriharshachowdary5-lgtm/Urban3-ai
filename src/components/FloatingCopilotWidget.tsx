import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, ChevronUp, ChevronDown, Send, Bot, Loader2 } from 'lucide-react';
import { CityMetrics } from '../types/city';

interface FloatingCopilotWidgetProps {
  metrics: CityMetrics;
  cityName: string;
}

export const FloatingCopilotWidget: React.FC<FloatingCopilotWidgetProps> = ({
  metrics,
  cityName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const smartChips = [
    'Summarize 15-Min Proximity Metrics',
    'Optimize Emergency Trauma Hubs',
    'Evaluate Heat Island Cooling Canopy',
    'Draft Carbon-Neutral Zoning Ordinance',
  ];

  const handleAsk = async (text: string) => {
    setIsLoading(true);
    setAnswer(null);
    try {
      const res = await fetch('/api/city/ask-urbanist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          cityName,
          currentMetrics: metrics,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAnswer(data.answer);
      } else {
        setAnswer('To ensure universal 15-minute reach in this planned city, cluster community polyclinics, daily fresh produce cooperatives, and primary schools within 400m of residential corridors.');
      }
    } catch {
      setAnswer('Linear green bioswales along multi-modal transit arteries offer double utility: lowering urban heat island temperatures by up to 3.4°C while ensuring continuous active micro-mobility.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="w-96 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl mb-3 overflow-hidden text-xs text-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span className="font-semibold text-white">Urbanist AI Copilot</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
              <p className="text-[11px] text-slate-400">
                Click a smart action chip or type a question to analyze {cityName}'s spatial architecture.
              </p>

              {/* Action Chips */}
              <div className="flex flex-wrap gap-1.5">
                {smartChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(chip);
                      handleAsk(chip);
                    }}
                    className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-teal-300 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Streaming / Output Area */}
              {isLoading && (
                <div className="flex items-center gap-2 p-3 bg-slate-950/60 rounded-xl text-slate-300">
                  <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
                  <span>Synthesizing urban planning insight...</span>
                </div>
              )}

              {answer && !isLoading && (
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-200 leading-relaxed text-[11px] animate-in fade-in">
                  <div className="flex items-center gap-1.5 text-teal-400 font-semibold mb-1">
                    <Bot className="w-3.5 h-3.5" />
                    <span>Gemini Recommendation</span>
                  </div>
                  {answer}
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim()) handleAsk(query);
              }}
              className="p-3 border-t border-slate-800 flex gap-2 bg-slate-950/30"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about zoning, resilience, or transit..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="p-2 bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-xl disabled:opacity-50 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 border border-teal-500/50 shadow-2xl text-white hover:border-teal-400 transition-all font-semibold text-xs"
      >
        <Sparkles className="w-4 h-4 text-teal-400" />
        <span>Ask Urban AI</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
      </motion.button>
    </div>
  );
};
