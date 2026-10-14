import React from 'react';
import { 
  Heart, Sparkles, Compass, CheckCircle2, 
  ArrowRight, ShieldCheck, Sun, Moon, Home 
} from 'lucide-react';
import { CityPlan } from '../types/city';

interface FarewellModalProps {
  isOpen: boolean;
  cityName: string;
  plan: CityPlan;
  onConfirmExit: () => void;
  onCancel: () => void;
}

export const FarewellModal: React.FC<FarewellModalProps> = ({
  isOpen,
  cityName,
  plan,
  onConfirmExit,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-xs text-slate-200 text-center p-6 space-y-4">
        {/* Heart Icon / Visual */}
        <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-cyan-500/20 to-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg">
          <Heart className="w-7 h-7 fill-rose-500 text-rose-400 animate-pulse" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Wishing You Safe Travels & Great Success!
          </h2>
          <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
            Thank you for crafting the cities of tomorrow with UrbanMind AI. May your endeavors be filled with inspiration, harmony, and sustainable impact.
          </p>
        </div>

        {/* Masterplan Snapshot */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-left grid grid-cols-3 gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block">Masterplan</span>
            <span className="font-bold text-white text-xs truncate block">{cityName}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">15-Min Access</span>
            <span className="font-bold text-cyan-400 text-xs block font-mono">
              {Math.round(plan.kpis?.walkability15MinScore || 92)}%
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Session Status</span>
            <span className="font-bold text-emerald-400 text-xs flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Auto-Saved
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 italic">
          "The measure of a city is how equitably it serves its children, elders, and the earth."
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors text-xs"
          >
            Stay in Studio
          </button>

          <button
            type="button"
            onClick={onConfirmExit}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold shadow-md transition-colors text-xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Overview</span>
          </button>
        </div>
      </div>
    </div>
  );
};
