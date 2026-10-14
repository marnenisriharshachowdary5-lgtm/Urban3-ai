import React, { useState, useEffect } from 'react';
import { Sparkles, Sun, Moon, Sunrise, X, Heart, ShieldCheck } from 'lucide-react';

interface GreetingBannerProps {
  cityName: string;
  onOpenCustomizer?: () => void;
}

export const GreetingBanner: React.FC<GreetingBannerProps> = ({
  cityName,
  onOpenCustomizer,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [greeting, setGreeting] = useState<{
    salutation: string;
    wish: string;
    icon: any;
    color: string;
  }>({
    salutation: 'Welcome to UrbanMind AI Studio',
    wish: 'Wishing you an inspiring session designing tomorrow’s perfect sustainable cities!',
    icon: Sparkles,
    color: 'text-cyan-400',
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting({
        salutation: 'Good morning, Urban Visionary!',
        wish: 'Wishing you a bright, energizing day and inspiring breakthroughs designing vibrant, healthy communities.',
        icon: Sunrise,
        color: 'text-amber-400',
      });
    } else if (hour >= 12 && hour < 18) {
      setGreeting({
        salutation: 'Good afternoon, Chief City Planner!',
        wish: 'Wishing you high productivity and effortless modeling as you craft equitable 15-minute neighborhoods.',
        icon: Sun,
        color: 'text-amber-300',
      });
    } else {
      setGreeting({
        salutation: 'Good evening, Master Architect!',
        wish: 'Wishing you peaceful focus, harmony, and creative inspiration shaping sustainable urban futures under the stars.',
        icon: Moon,
        color: 'text-indigo-400',
      });
    }
  }, []);

  if (!isVisible) return null;

  const Icon = greeting.icon;

  return (
    <div className="relative mx-4 mt-3 mb-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-slate-700/60 shadow-lg backdrop-blur-md flex items-center justify-between gap-3 text-xs text-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={`p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 ${greeting.color} shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className="font-bold text-white text-xs mr-2">
            {greeting.salutation}
          </span>
          <span className="text-[11px] text-slate-300 hidden sm:inline">
            {greeting.wish}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onOpenCustomizer && (
          <button
            onClick={onOpenCustomizer}
            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-semibold text-[11px] transition-colors whitespace-nowrap"
          >
            Customize Population & Facilities
          </button>
        )}
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Dismiss greeting"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
