import React from 'react';
import { GridCell, ZoneType, CityMetrics } from '../types/city';
import { ZONE_DEFINITIONS } from '../utils/zoneDefinitions';
import { X, HeartPulse, GraduationCap, Train, Trees, Zap, Building } from 'lucide-react';

interface ParcelInspectorProps {
  cell: GridCell | null;
  cells: GridCell[];
  metrics: CityMetrics;
  onClose: () => void;
  onChangeZone: (x: number, y: number, zone: ZoneType) => void;
}

export const ParcelInspector: React.FC<ParcelInspectorProps> = ({
  cell,
  cells,
  metrics,
  onClose,
  onChangeZone,
}) => {
  if (!cell) return null;

  const def = ZONE_DEFINITIONS[cell.zoneType] || ZONE_DEFINITIONS.residential_medium;

  // Calculate distance from this cell to nearest vital assets
  function getMinDistanceTo(targetTypes: ZoneType[]): number {
    let min = Infinity;
    for (const c of cells) {
      if (targetTypes.includes(c.zoneType)) {
        const d = Math.sqrt((c.x - cell!.x) ** 2 + (c.y - cell!.y) ** 2);
        if (d < min) min = d;
      }
    }
    return min === Infinity ? 99 : Number(min.toFixed(1));
  }

  const distHospital = getMinDistanceTo(['civic_healthcare']);
  const distSchool = getMinDistanceTo(['civic_education', 'civic_college']);
  const distTransit = getMinDistanceTo(['transit_hub', 'transit_metro', 'civic_airport']);
  const distPark = getMinDistanceTo(['green_park', 'civic_stadium', 'sponge_wetland']);

  return (
    <div className="fixed bottom-6 right-6 z-40 w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-xs text-slate-200 animate-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div
            className="w-3.5 h-3.5 rounded-md"
            style={{ backgroundColor: def.color }}
          />
          <div>
            <span className="font-semibold text-slate-100">{def.name}</span>
            <span className="text-slate-500 font-mono text-[11px] ml-1.5">
              P({cell.x}, {cell.y})
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Body details */}
      <div className="p-4 space-y-3.5">
        <p className="text-slate-400 text-[11px] leading-relaxed">
          {def.description}
        </p>

        {/* 15-Minute Access Proximity Matrix */}
        <div className="space-y-1.5 border-t border-slate-800 pt-3">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
            15-Minute Proximity Distances
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-slate-800/60 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                <span>Clinic:</span>
              </span>
              <span className="font-mono tabular-nums text-slate-100 font-semibold">
                {distHospital > 20 ? 'None' : `${distHospital} blk`}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-800/60 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>School:</span>
              </span>
              <span className="font-mono tabular-nums text-slate-100 font-semibold">
                {distSchool > 20 ? 'None' : `${distSchool} blk`}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-800/60 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Train className="w-3.5 h-3.5 text-orange-400" />
                <span>Transit:</span>
              </span>
              <span className="font-mono tabular-nums text-slate-100 font-semibold">
                {distTransit > 20 ? 'None' : `${distTransit} blk`}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-800/60 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Trees className="w-3.5 h-3.5 text-emerald-400" />
                <span>Park:</span>
              </span>
              <span className="font-mono tabular-nums text-slate-100 font-semibold">
                {distPark > 20 ? 'None' : `${distPark} blk`}
              </span>
            </div>
          </div>
        </div>

        {/* Parcel Capacity & Environment */}
        <div className="space-y-1 text-[11px] border-t border-slate-800 pt-2.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Resident Density:</span>
            <span className="font-mono tabular-nums text-slate-200">
              {def.density.toLocaleString()} residents
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Microclimate Cooling:</span>
            <span className="font-mono tabular-nums text-cyan-400">
              +{def.coolingEffect}°C cooling
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Carbon Flux:</span>
            <span className={`font-mono tabular-nums ${def.carbonDelta <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {def.carbonDelta <= 0 ? `${def.carbonDelta} t CO₂/yr (Sequestered)` : `+${def.carbonDelta} t CO₂/yr (Footprint)`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
