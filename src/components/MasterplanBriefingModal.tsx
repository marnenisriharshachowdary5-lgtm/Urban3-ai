import React from 'react';
import { CityPlan } from '../types/city';
import { X, Download, Share2, Sparkles, Building2, Droplets, Zap, ShieldCheck } from 'lucide-react';

import { SafeImage } from './SafeImage';

interface MasterplanBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: CityPlan;
}

export const MasterplanBriefingModal: React.FC<MasterplanBriefingModalProps> = ({
  isOpen,
  onClose,
  plan,
}) => {
  if (!isOpen) return null;

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${plan.cityName.toLowerCase().replace(/\s+/g, '_')}_masterplan.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-cyan-400 font-semibold">
              Executive City Dossier
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">{plan.cityName}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Masterplan JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-200">
          {/* Hero Banner with Vision */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
            <div className="h-64 w-full relative">
              <SafeImage
                src="/src/assets/images/hero_biophilic_city_1791958981307.jpg"
                alt="Architectural vision of planned eco city"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-[11px] font-mono text-teal-300 uppercase tracking-wider">
                  Vision Statement & Manifesto
                </span>
                <p className="text-sm font-medium text-slate-100 mt-1 leading-relaxed max-w-2xl">
                  "{plan.visionStatement}"
                </p>
              </div>
            </div>
          </div>

          {/* Key Architectural Innovations Grid */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">
              Core Urban Innovations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {plan.keyInnovations.map((inn, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5"
                >
                  <span className="text-[11px] font-mono text-teal-400">
                    {inn.sector}
                  </span>
                  <div className="font-semibold text-slate-100 text-xs">
                    {inn.title}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {inn.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary Visual Asset Showcase (Sponge City & Smart Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <SafeImage
                src="/src/assets/images/sponge_city_concept_1791958981199.jpg"
                alt="Sponge city retention network"
                className="w-full h-44 object-cover"
              />
              <div className="p-3">
                <div className="font-semibold text-xs text-slate-200">
                  Blue-Green Sponge Floodplain & Retention Wetlands
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Naturalized waterways buffer cloudburst surges and feed cooling breezes into residential streets.
                </p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <SafeImage
                src="/src/assets/images/smart_grid_hub_1791958981260.jpg"
                alt="Clean energy microgrid and transit"
                className="w-full h-44 object-cover"
              />
              <div className="p-3">
                <div className="font-semibold text-xs text-slate-200">
                  Decentralized Microgrid & Autonomous Mobility
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Solar glass architecture paired with electric rapid transit eliminates urban carbon emissions.
                </p>
              </div>
            </div>
          </div>

          {/* Municipal Zoning Regulations */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">
              Official Municipal Zoning Ordinances
            </h3>
            <div className="space-y-2">
              {plan.zoningRegulations.map((reg, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-teal-400 font-semibold text-[11px]">
                      {reg.code}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-200 font-medium text-xs">
                      {reg.rule}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-4 border-l border-slate-800 mt-1">
                    Rationale: {reg.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
