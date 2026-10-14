import React from 'react';
import { ZoneType } from '../types/city';
import { ZONE_DEFINITIONS } from '../utils/zoneDefinitions';
import { OverlayMode, ViewPerspective } from './CityCanvas';
import { PRESET_MASTERPLANS } from '../data/presetMasterplans';
import { 
  Paintbrush, Eraser, Pipette, Info, Box, 
  Map as MapIcon, Layers, BookOpen, RefreshCw, Undo2,
  Building2, Image as ImageIcon, Headphones
} from 'lucide-react';

interface ZoningPaletteProps {
  selectedZone: ZoneType;
  toolMode: 'brush' | 'erase' | 'inspect' | 'eyedropper';
  overlayMode: OverlayMode;
  viewPerspective: ViewPerspective;
  onSelectZone: (zone: ZoneType) => void;
  onSetToolMode: (mode: 'brush' | 'erase' | 'inspect' | 'eyedropper') => void;
  onSetOverlayMode: (overlay: OverlayMode) => void;
  onSetViewPerspective: (perspective: ViewPerspective) => void;
  onLoadPreset: (presetId: string) => void;
  onClearGrid: () => void;
  onOpenCustomizer?: () => void;
  onOpenGallery?: () => void;
  onOpenHelpline?: () => void;
}

export const ZoningPalette: React.FC<ZoningPaletteProps> = ({
  selectedZone,
  toolMode,
  overlayMode,
  viewPerspective,
  onSelectZone,
  onSetToolMode,
  onSetOverlayMode,
  onSetViewPerspective,
  onLoadPreset,
  onClearGrid,
  onOpenCustomizer,
  onOpenGallery,
  onOpenHelpline,
}) => {
  const zoneList = Object.values(ZONE_DEFINITIONS);

  const categories = ['Housing', 'Nature', 'Civic', 'Economy', 'Energy'] as const;

  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-200 shrink-0 overflow-y-auto">
      {/* Top Header & Presets */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Archetype Masterplans
          </span>
          {onOpenCustomizer && (
            <button
              onClick={onOpenCustomizer}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Custom Build</span>
            </button>
          )}
        </div>
        <select
          onChange={(e) => {
            if (e.target.value) onLoadPreset(e.target.value);
          }}
          defaultValue=""
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
        >
          <option value="" disabled>Load an Archetype Masterplan...</option>
          {PRESET_MASTERPLANS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Primary Tool Modes & View Modes */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Studio Tools & Perspectives
        </div>
        
        {/* Tool bar: Brush, Erase, Eyedropper, Inspect */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-800/80 rounded-lg border border-slate-700/60">
          <button
            onClick={() => onSetToolMode('brush')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-md text-[11px] transition-colors ${
              toolMode === 'brush' ? 'bg-cyan-400 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title="Paint Zone"
          >
            <Paintbrush className="w-4 h-4 mb-0.5" />
            <span>Paint</span>
          </button>
          <button
            onClick={() => onSetToolMode('erase')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-md text-[11px] transition-colors ${
              toolMode === 'erase' ? 'bg-cyan-400 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title="Clear Parcel"
          >
            <Eraser className="w-4 h-4 mb-0.5" />
            <span>Clear</span>
          </button>
          <button
            onClick={() => onSetToolMode('eyedropper')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-md text-[11px] transition-colors ${
              toolMode === 'eyedropper' ? 'bg-cyan-400 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title="Sample Zone"
          >
            <Pipette className="w-4 h-4 mb-0.5" />
            <span>Pick</span>
          </button>
          <button
            onClick={() => onSetToolMode('inspect')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-md text-[11px] transition-colors ${
              toolMode === 'inspect' ? 'bg-cyan-400 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title="Inspect Parcel"
          >
            <Info className="w-4 h-4 mb-0.5" />
            <span>Inspect</span>
          </button>
        </div>

        {/* View Perspective Switch: 2D vs Isometric */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg border border-slate-700/60">
          <button
            onClick={() => onSetViewPerspective('2d')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewPerspective === '2d' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            2D Blueprint
          </button>
          <button
            onClick={() => onSetViewPerspective('isometric')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewPerspective === 'isometric' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Isometric 2.5D
          </button>
        </div>

        {/* Heatmap Layer Selector */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulation Heatmap Layer</span>
          </label>
          <select
            value={overlayMode}
            onChange={(e) => onSetOverlayMode(e.target.value as OverlayMode)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          >
            <option value="zoning">Architectural Zoning (Masterplan)</option>
            <option value="15min_access">15-Minute Walkability Isochrones</option>
            <option value="heat_island">Urban Heat Island (Thermal)</option>
            <option value="transit_flow">Autonomous Transit Corridors</option>
            <option value="sponge_flood">Sponge Flood & Drainage Retention</option>
          </select>
        </div>
      </div>

      {/* Quick Visuals & Support Shortcut Links */}
      {(onOpenGallery || onOpenHelpline) && (
        <div className="p-3 border-b border-slate-800/80 grid grid-cols-2 gap-2 bg-slate-950/40">
          {onOpenGallery && (
            <button
              onClick={onOpenGallery}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-[11px] text-slate-200 hover:text-white transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>100+ Visuals</span>
            </button>
          )}
          {onOpenHelpline && (
            <button
              onClick={onOpenHelpline}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-[11px] text-slate-200 hover:text-white transition-colors"
            >
              <Headphones className="w-3.5 h-3.5 text-cyan-400" />
              <span>Helplines</span>
            </button>
          )}
        </div>
      )}

      {/* Zoning Palette by Category */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Zoning Parcels & Facilities
        </div>

        {categories.map((cat) => {
          const catZones = zoneList.filter((z) => z.category === cat);
          return (
            <div key={cat} className="space-y-1.5">
              <span className="text-[11px] font-medium text-slate-400">
                {cat}
              </span>
              <div className="space-y-1">
                {catZones.map((zone) => {
                  const isSelected = selectedZone === zone.id && toolMode === 'brush';
                  return (
                    <button
                      key={zone.id}
                      onClick={() => {
                        onSelectZone(zone.id);
                        onSetToolMode('brush');
                      }}
                      className={`w-full text-left p-2 rounded-lg border transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-slate-800 border-cyan-400 ring-1 ring-cyan-400/50'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div 
                        className="w-3.5 h-3.5 rounded-md mt-0.5 shrink-0 shadow-sm"
                        style={{ backgroundColor: zone.color }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-slate-100 flex items-center justify-between">
                          <span className="truncate">{zone.name}</span>
                          {zone.density > 0 && (
                            <span className="text-[10px] font-mono tabular-nums text-slate-400 shrink-0 ml-1">
                              {zone.density}/cell
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 leading-snug">
                          {zone.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs">
        <button
          onClick={onClearGrid}
          className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 px-2 py-1"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>Reset Grid</span>
        </button>
      </div>
    </aside>
  );
};
