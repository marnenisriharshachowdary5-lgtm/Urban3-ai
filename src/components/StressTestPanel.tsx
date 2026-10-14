import React, { useState } from 'react';
import { CityMetrics, GridCell, StressTestReport } from '../types/city';
import { 
  ShieldAlert, Flame, Droplets, Zap, Activity, 
  Train, Play, Loader2, CheckCircle2, ShieldCheck, AlertTriangle
} from 'lucide-react';

interface StressTestPanelProps {
  cells: GridCell[];
  metrics: CityMetrics;
  cityName: string;
}

export const StressTestPanel: React.FC<StressTestPanelProps> = ({
  cells,
  metrics,
  cityName,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<'heatwave' | 'flash_flood' | 'power_grid_surge' | 'pandemic_lockdown'>('heatwave');
  const [severity, setSeverity] = useState<'moderate' | 'extreme' | 'catastrophic'>('extreme');
  const [report, setReport] = useState<StressTestReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scenarios = [
    {
      id: 'heatwave',
      title: 'Category-5 Heat Dome (+42°C)',
      icon: Flame,
      color: 'text-amber-400',
      desc: 'Simulates 5 consecutive days of extreme ambient heat testing green canopy cooling, AC power surge, and public hydration corridors.',
    },
    {
      id: 'flash_flood',
      title: '100-Year Atmospheric River Flood',
      icon: Droplets,
      color: 'text-cyan-400',
      desc: 'Dumps 240mm of precipitation in 6 hours, evaluating sponge wetland infiltration, bioswales, and rapid runoff absorption.',
    },
    {
      id: 'power_grid_surge',
      title: 'Clean Energy Grid Surge & Blackout',
      icon: Zap,
      color: 'text-yellow-400',
      desc: 'Simulates sudden cloud cover cutting solar output by 70%, testing decentralized hydrogen battery reserves and hospital priority microgrids.',
    },
    {
      id: 'pandemic_lockdown',
      title: 'Respiratory Pathogen Surge',
      icon: Activity,
      color: 'text-rose-400',
      desc: 'Tests polycentric quarantine containment, neighborhood healthcare capacity, and autonomous grocery delivery without cross-district sprawl.',
    },
  ];

  const runSimulation = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/city/stress-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: selectedScenario,
          severity,
          cells,
          metrics,
          cityName,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto space-y-6 text-slate-200">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">
              Municipal Resilience & Climate Stress-Lab
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Subject your planned city's digital twin to extreme climate and infrastructure shocks to measure cascading impacts.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-rose-400 hover:bg-rose-300 disabled:opacity-50 rounded-lg shadow-md transition-all"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          <span>Execute Simulation</span>
        </button>
      </div>

      {/* Scenario Selector Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          const isSelected = selectedScenario === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(sc.id as any)}
              className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-rose-400 ring-1 ring-rose-400/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <Icon className={`w-5 h-5 ${sc.color} mb-2`} />
                <div className="font-semibold text-xs text-slate-100">{sc.title}</div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {sc.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Severity selection */}
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span>Shock Severity:</span>
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
          {(['moderate', 'extreme', 'catastrophic'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSeverity(lvl)}
              className={`px-3 py-1 rounded-md capitalize font-medium transition-colors ${
                severity === lvl ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Simulation Results Display */}
      {report && (
        <div className="space-y-6 pt-2">
          {/* Top Score Box */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Scenario: {report.scenarioTitle}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold font-mono tabular-nums text-rose-400">
                    {report.resilienceRating}/100
                  </span>
                  <span className="text-xs text-slate-400">
                    {report.resilienceRating >= 85 ? 'High Structural Immunity' : report.resilienceRating >= 70 ? 'Moderate Absorption with Manageable Disruptions' : 'Severe Cascading Failures Detected'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sector Damage Progress Bars */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-800 pt-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Mobility Disruption</span>
                  <span className="font-mono tabular-nums text-slate-200">{report.sectorDamages.mobility}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 rounded-full" style={{ width: `${report.sectorDamages.mobility}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Healthcare Surge</span>
                  <span className="font-mono tabular-nums text-slate-200">{report.sectorDamages.healthcare}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 rounded-full" style={{ width: `${report.sectorDamages.healthcare}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Energy Grid Strain</span>
                  <span className="font-mono tabular-nums text-slate-200">{report.sectorDamages.energy}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${report.sectorDamages.energy}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Water Runoff Load</span>
                  <span className="font-mono tabular-nums text-slate-200">{report.sectorDamages.waterEnvironment}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${report.sectorDamages.waterEnvironment}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* 24-Hour Cascade Timeline */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-200">
              24-Hour Systemic Impact Cascade
            </h2>
            <div className="space-y-2">
              {report.failureCascade.map((c, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-4 text-xs"
                >
                  <span className="font-mono tabular-nums font-semibold text-teal-400 shrink-0 w-16">
                    T + {c.timeHour} hrs
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-200 flex-1">{c.event}</span>
                  <span className="font-mono text-slate-400 shrink-0">{c.sector}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Strengths & Mitigation Playbook */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Demonstrated Masterplan Strengths</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {report.keyStrengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 shrink-0">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-semibold text-teal-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" />
                <span>Municipal Adaptation Playbook</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {report.postDisasterRecoveryPlan.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-teal-400 shrink-0">→</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
