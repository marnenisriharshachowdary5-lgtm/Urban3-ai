import React from 'react';
import { CityMetrics } from '../types/city';
import { Footprints, Leaf, Zap, Thermometer, Train, Users, ShieldCheck } from 'lucide-react';

interface MetricCockpitProps {
  metrics: CityMetrics;
}

export const MetricCockpit: React.FC<MetricCockpitProps> = ({ metrics }) => {
  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-2.5 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-6">
        {/* Metric 1: 15-Minute Access */}
        <div className="flex items-center gap-2">
          <Footprints className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">15-Min Proximity:</span>
          <span className="font-mono tabular-nums font-semibold text-emerald-400 text-sm">
            {metrics.walkability15MinScore}%
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">
            {metrics.walkability15MinScore >= 90 ? 'Universal Walkable' : metrics.walkability15MinScore >= 75 ? 'Optimal Mixed' : 'Transit-Dependent'}
          </span>
        </div>

        {/* Metric 2: Net-Zero Carbon Balance */}
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-slate-400">Carbon Neutrality:</span>
          <span className="font-mono tabular-nums font-semibold text-amber-300 text-sm">
            {metrics.carbonNeutralityPct}%
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">
            {metrics.carbonNeutralityPct >= 95 ? 'Net-Positive' : 'Low-Emissions'}
          </span>
        </div>

        {/* Metric 3: Green Canopy & Biophilic Coverage */}
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-teal-400" />
          <span className="text-slate-400">Green Canopy:</span>
          <span className="font-mono tabular-nums font-semibold text-teal-400 text-sm">
            {metrics.greenCanopyPct}%
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">Bioswale & Park</span>
        </div>

        {/* Metric 4: Microclimate Cooling Delta */}
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">Microclimate Cooling:</span>
          <span className="font-mono tabular-nums font-semibold text-cyan-300 text-sm">
            -{metrics.coolingDeltaCelsius}°C
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">Urban Heat Sink</span>
        </div>

        {/* Metric 5: Multi-modal Transit Coverage */}
        <div className="flex items-center gap-2">
          <Train className="w-4 h-4 text-orange-400" />
          <span className="text-slate-400">Transit Radius:</span>
          <span className="font-mono tabular-nums font-semibold text-orange-400 text-sm">
            {metrics.transitAccessibilityPct}%
          </span>
        </div>

        {/* Metric 6: Citizen Population Capacity */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-sky-400" />
          <span className="text-slate-400">Citizen Capacity:</span>
          <span className="font-mono tabular-nums font-semibold text-slate-100 text-sm">
            {metrics.totalPopulation.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
