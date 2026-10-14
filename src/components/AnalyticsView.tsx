import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, ArrowUpRight, Clock, 
  BarChart3, Zap, Footprints, Leaf, Thermometer, DollarSign 
} from 'lucide-react';
import { CityMetrics } from '../types/city';
import { DistrictProject } from '../types/districtProject';

interface AnalyticsViewProps {
  metrics: CityMetrics;
  projects: DistrictProject[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ metrics, projects }) => {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');

  // Timeframe multipliers for realistic dynamic recalculation
  const multiplier = timeRange === '7D' ? 0.88 : timeRange === '30D' ? 1.0 : timeRange === '90D' ? 1.15 : 1.34;

  const totalBudgetNumeric = useMemo(() => {
    return (projects || []).reduce((acc, p) => {
      const num = parseFloat(p.budget.replace(/[^0-9.]/g, '')) || 0;
      return acc + num;
    }, 0);
  }, [projects]);

  const totalCarbonOffset = useMemo(() => {
    return Math.round(((projects || []).reduce((acc, p) => acc + (p.carbonOffsetTons || 0), 0) || 142000) * multiplier);
  }, [projects, multiplier]);

  // Dynamic walkability trajectory based on timeRange
  const walkabilityPoints = useMemo(() => {
    const base = metrics.walkability15MinScore || 92;
    if (timeRange === '7D') {
      return [
        { label: 'Mon', val: Math.max(60, base - 6) },
        { label: 'Tue', val: Math.max(60, base - 4) },
        { label: 'Wed', val: Math.max(60, base - 3) },
        { label: 'Thu', val: Math.max(60, base - 2) },
        { label: 'Fri', val: Math.max(60, base - 1) },
        { label: 'Sun', val: base },
      ];
    }
    if (timeRange === '90D') {
      return [
        { label: 'Wk 1', val: Math.max(50, base - 14) },
        { label: 'Wk 4', val: Math.max(55, base - 10) },
        { label: 'Wk 8', val: Math.max(60, base - 6) },
        { label: 'Wk 10', val: Math.max(65, base - 3) },
        { label: 'Wk 12', val: base },
      ];
    }
    if (timeRange === '1Y') {
      return [
        { label: 'Q1', val: Math.max(45, base - 22) },
        { label: 'Q2', val: Math.max(55, base - 14) },
        { label: 'Q3', val: Math.max(65, base - 7) },
        { label: 'Q4', val: base },
      ];
    }
    // 30D default
    return [
      { label: 'Day 1', val: Math.max(60, base - 10) },
      { label: 'Day 7', val: Math.max(65, base - 7) },
      { label: 'Day 14', val: Math.max(70, base - 5) },
      { label: 'Day 21', val: Math.max(75, base - 2) },
      { label: 'Day 30', val: base },
    ];
  }, [metrics.walkability15MinScore, timeRange]);

  // Sector spend distribution computed from projects
  const sectorSpend = useMemo(() => {
    const groups: Record<string, number> = {};
    for (const p of projects || []) {
      const b = parseFloat(p.budget.replace(/[^0-9.]/g, '')) || 0;
      groups[p.category] = (groups[p.category] || 0) + b;
    }
    const colors: Record<string, string> = {
      Biophilic: '#10b981',
      Mobility: '#06b6d4',
      Healthcare: '#ef4444',
      Energy: '#eab308',
      Housing: '#8b5cf6',
      Circular: '#64748b',
    };
    const total = Object.values(groups).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(groups).map(([cat, amt]) => ({
      sector: `${cat} Infrastructure`,
      amount: `$${amt}M`,
      pct: Math.round((amt / total) * 100),
      color: colors[cat] || '#06b6d4',
    }));
  }, [projects]);

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto space-y-6 text-slate-200">
      {/* Top Banner & Time Range Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">
              Citywide Digital Twin Analytics & KPI Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time empirical telemetry on 15-minute accessibility, microclimate thermal sinks, and net-zero energy balances.
          </p>
        </div>

        {/* Time-range filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
          {(['7D', '30D', '90D', '1Y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                timeRange === range
                  ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Headline Cards with Trend Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>15-Min Proximity Reach</span>
            <span className="flex items-center text-emerald-400 font-mono text-[11px] font-semibold">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +28.4%
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {metrics.walkability15MinScore}%
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {timeRange} interval performance
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Net-Zero Carbon Balance</span>
            <span className="flex items-center text-amber-400 font-mono text-[11px] font-semibold">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +18.2%
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-300">
            {metrics.carbonNeutralityPct}%
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {totalCarbonOffset.toLocaleString()} t CO₂/yr offset
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Thermal Island Cooling</span>
            <span className="flex items-center text-cyan-400 font-mono text-[11px] font-semibold">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> -3.4°C
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-cyan-300">
            -{metrics.coolingDeltaCelsius}°C
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            vs. conventional asphalt grid
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Capital Deployed</span>
            <span className="flex items-center text-emerald-400 font-mono text-[11px] font-semibold">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +14.6%
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            ${totalBudgetNumeric}M
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Across {projects.length} planned districts
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: 15-Minute Accessibility Trajectory (Custom SVG Area Chart) */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-white">15-Minute Accessibility Evolution ({timeRange})</h3>
              <p className="text-xs text-slate-400">Proximity gain as new clinics and transit links are activated.</p>
            </div>
            <span className="font-mono text-xs text-emerald-400 font-semibold">{metrics.walkability15MinScore}%</span>
          </div>

          <div className="h-52 w-full pt-4">
            <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="walkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="40" x2="500" y2="40" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeDasharray="3 3" />

              <path
                d="M 0,110 Q 120,95 240,70 T 400,45 T 500,30 L 500,160 L 0,160 Z"
                fill="url(#walkGrad)"
              />

              <path
                d="M 0,110 Q 120,95 240,70 T 400,45 T 500,30"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {walkabilityPoints.map((pt, i) => {
                const step = 500 / Math.max(1, walkabilityPoints.length - 1);
                const cx = i * step;
                const cy = 160 - (pt.val / 100) * 140;
                return (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r={4} fill="#10b981" stroke="#0f172a" strokeWidth="2" />
                    <text x={cx} y={cy - 10} fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                      {pt.val}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
            {walkabilityPoints.map((t) => (
              <span key={t.label}>{t.label}</span>
            ))}
          </div>
        </div>

        {/* Chart 2: 24h Clean Microgrid Generation vs Demand */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-white">Microgrid Solar & Hydrogen Profile</h3>
              <p className="text-xs text-slate-400">Clean power generation vs municipal consumption.</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-yellow-400">
                <span className="w-2 h-2 rounded-full bg-yellow-400" /> Gen
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Load
              </span>
            </div>
          </div>

          <div className="h-52 w-full pt-4">
            <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
              <path
                d="M 0,110 Q 150,110 250,20 Q 350,30 500,105"
                fill="none"
                stroke="#eab308"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 0,120 Q 150,80 250,60 Q 350,55 500,115"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
              <circle cx="250" cy="20" r="4" fill="#eab308" />
              <text x="250" y="10" fill="#eab308" fontSize="10" fontFamily="monospace" textAnchor="middle">
                Midday Peak +130 MWh
              </text>
            </svg>
          </div>

          <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
            <span>00:00</span>
            <span>04:00</span>
            <span>08:00</span>
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00</span>
            <span>23:59</span>
          </div>
        </div>
      </div>

      {/* Capital Budget Distribution Progress Bars */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h3 className="font-semibold text-sm text-white">Capital Expenditure by Infrastructure Pillar</h3>
        <div className="space-y-3">
          {sectorSpend.map((s) => (
            <div key={s.sector} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">{s.sector}</span>
                <span className="font-mono tabular-nums text-slate-400">{s.amount} ({s.pct}%)</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${s.pct}%`, backgroundColor: s.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
