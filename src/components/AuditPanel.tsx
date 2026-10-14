import React, { useState, useEffect } from 'react';
import { GridCell, CityMetrics, AuditReport, ZoneType } from '../types/city';
import { ShieldCheck, AlertTriangle, AlertCircle, CheckCircle2, ArrowRight, RefreshCw, Loader2, Sparkles } from 'lucide-react';

interface AuditPanelProps {
  cells: GridCell[];
  metrics: CityMetrics;
  cityName: string;
  onApplyFix: (x: number, y: number, zoneType: ZoneType) => void;
}

export const AuditPanel: React.FC<AuditPanelProps> = ({
  cells,
  metrics,
  cityName,
  onApplyFix,
}) => {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [appliedFixes, setAppliedFixes] = useState<string[]>([]);

  const runAudit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/city/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cells, metrics, cityName }),
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (e) {
      console.error('Audit failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runAudit();
  }, [cityName]);

  const handleFixClick = (title: string, targetCoords?: [number, number], proposedZone?: ZoneType) => {
    if (targetCoords && proposedZone) {
      onApplyFix(targetCoords[0], targetCoords[1], proposedZone);
      setAppliedFixes([...appliedFixes, title]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto space-y-6 text-slate-200">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">
              UN-Habitat 15-Minute Spatial Audit
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous multi-criteria evaluation of equitable civic access, microclimate heat islands, and mobility flow.
          </p>
        </div>

        <button
          onClick={runAudit}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          <span>Re-Audit Masterplan</span>
        </button>
      </div>

      {isLoading && !report && (
        <div className="p-16 flex flex-col items-center justify-center text-center space-y-3">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
          <p className="text-sm font-medium text-slate-300">Auditing spatial distribution with Gemini...</p>
          <p className="text-xs text-slate-500">Checking 15-minute isochrones, healthcare radius, and green canopy buffers.</p>
        </div>
      )}

      {report && (
        <div className="space-y-6">
          {/* Executive Overview */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Overall Spatial Health Rating
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold font-mono tabular-nums text-teal-400">
                    {report.overallHealthScore}/100
                  </span>
                  <span className="text-xs text-slate-400">
                    {report.overallHealthScore >= 90 ? 'Grade A · Resilient 15-Min Metropolis' : report.overallHealthScore >= 75 ? 'Grade B · Well-Planned with Minor Gaps' : 'Grade C · Requires Strategic Interventions'}
                  </span>
                </div>
              </div>

              {/* Metric indicators */}
              <div className="flex gap-6 text-xs text-slate-400">
                <div>
                  <span className="block text-[11px] text-slate-500">15-Min Score</span>
                  <span className="font-mono tabular-nums text-sm font-semibold text-emerald-400">
                    {metrics.walkability15MinScore}%
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500">Carbon Neutral</span>
                  <span className="font-mono tabular-nums text-sm font-semibold text-amber-400">
                    {metrics.carbonNeutralityPct}%
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500">Cooling Sink</span>
                  <span className="font-mono tabular-nums text-sm font-semibold text-cyan-400">
                    -{metrics.coolingDeltaCelsius}°C
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
              {report.executiveSummary}
            </p>
          </div>

          {/* Identified Bottlenecks */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-200">
              Identified Spatial Bottlenecks & Vulnerabilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.identifiedBottlenecks.map((b, i) => (
                <div
                  key={i}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {b.severity === 'critical' ? (
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span className="font-semibold text-xs text-slate-100">
                        {b.title}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 shrink-0">
                      {b.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {b.description}
                  </p>

                  {b.locationHint && (
                    <div className="text-[11px] font-mono text-teal-400/80 pt-1">
                      Target Area: {b.locationHint}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommended AI Interventions with 1-Click Injection */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>AI Recommended Remediation Interventions</span>
              </h2>
              <span className="text-xs text-slate-500">1-click injection into Digital Twin</span>
            </div>

            <div className="space-y-2.5">
              {report.recommendations.map((rec, idx) => {
                const isApplied = appliedFixes.includes(rec.title);
                return (
                  <div
                    key={idx}
                    className="p-4 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-100">
                          {rec.title}
                        </span>
                        {rec.targetCoords && (
                          <span className="font-mono text-[11px] text-slate-500">
                            · Parcel ({rec.targetCoords[0]}, {rec.targetCoords[1]})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-teal-300">
                        Estimated Impact: {rec.estimatedImpact}
                      </p>
                    </div>

                    {rec.targetCoords && rec.proposedZone && (
                      <button
                        onClick={() => handleFixClick(rec.title, rec.targetCoords, rec.proposedZone)}
                        disabled={isApplied}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                          isApplied
                            ? 'bg-slate-800 text-slate-400 cursor-default'
                            : 'bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-sm'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                            <span>Applied to Twin</span>
                          </>
                        ) : (
                          <>
                            <span>Apply Fix</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
