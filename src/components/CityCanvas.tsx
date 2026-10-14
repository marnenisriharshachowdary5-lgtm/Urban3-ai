import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GridCell, ZoneType, CityMetrics } from '../types/city';
import { ZONE_DEFINITIONS } from '../utils/zoneDefinitions';
import { 
  ZoomIn, ZoomOut, RotateCcw, Eye, Layers, 
  MapPin, Sparkles, Navigation, ShieldCheck, ThermometerSun,
  Train, HeartPulse, GraduationCap, Scale, Plane, Trophy,
  Droplets, Zap, Building2, Trees, Waves, Cpu, Home,
  Factory, Crosshair, Compass, Sun, Wind
} from 'lucide-react';

export type OverlayMode = 'zoning' | '15min_access' | 'heat_island' | 'transit_flow' | 'sponge_flood';
export type ViewPerspective = '2d' | 'isometric';

interface CityCanvasProps {
  cells: GridCell[];
  gridSize: number;
  selectedZone: ZoneType;
  toolMode: 'brush' | 'erase' | 'inspect' | 'eyedropper';
  overlayMode: OverlayMode;
  viewPerspective: ViewPerspective;
  metrics: CityMetrics;
  onCellClick: (x: number, y: number) => void;
  onCellInspect: (cell: GridCell | null) => void;
  onPickZone: (zone: ZoneType) => void;
}

export const CityCanvas: React.FC<CityCanvasProps> = ({
  cells,
  gridSize,
  selectedZone,
  toolMode,
  overlayMode,
  viewPerspective,
  metrics,
  onCellClick,
  onCellInspect,
  onPickZone,
}) => {
  const [zoom, setZoom] = useState(1);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<GridCell | null>(null);
  const [animationTick, setAnimationTick] = useState(0);

  // High-framerate animation loop for autonomous transit pods and water flow
  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();
    
    const animate = (time: number) => {
      if (time - lastTime >= 50) {
        setAnimationTick((prev) => (prev + 1) % 1000);
        lastTime = time;
      }
      frameId = requestAnimationFrame(animate);
    };
    
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Map cells for instant O(1) coordinate lookup
  const cellMap = useMemo(() => {
    const map = new Map<string, GridCell>();
    for (const c of cells) {
      map.set(`${c.x},${c.y}`, c);
    }
    return map;
  }, [cells]);

  // Compute 15-minute accessibility score map for cells
  const cell15MinScores = useMemo(() => {
    const scores = new Map<string, number>();
    const healthcare: [number, number][] = [];
    const education: [number, number][] = [];
    const transit: [number, number][] = [];
    const green: [number, number][] = [];

    for (const c of cells) {
      if (c.zoneType === 'civic_healthcare') healthcare.push([c.x, c.y]);
      if (c.zoneType === 'civic_education' || c.zoneType === 'civic_college') education.push([c.x, c.y]);
      if (c.zoneType === 'transit_hub' || c.zoneType === 'transit_metro' || c.zoneType === 'civic_airport') transit.push([c.x, c.y]);
      if (c.zoneType === 'green_park' || c.zoneType === 'civic_stadium' || c.zoneType === 'sponge_wetland') green.push([c.x, c.y]);
    }

    function minDist(x: number, y: number, list: [number, number][]) {
      if (list.length === 0) return 99;
      let min = Infinity;
      for (const [tx, ty] of list) {
        const d = Math.sqrt((x - tx) ** 2 + (y - ty) ** 2);
        if (d < min) min = d;
      }
      return min;
    }

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const dh = minDist(x, y, healthcare);
        const de = minDist(x, y, education);
        const dt = minDist(x, y, transit);
        const dg = minDist(x, y, green);

        // Score 0 to 100 based on proximity within 4.0 cells
        const scoreH = Math.max(0, 1 - dh / 4.2);
        const scoreE = Math.max(0, 1 - de / 4.2);
        const scoreT = Math.max(0, 1 - dt / 4.0);
        const scoreG = Math.max(0, 1 - dg / 4.0);
        const avg = Math.round(((scoreH + scoreE + scoreT + scoreG) / 4) * 100);
        scores.set(`${x},${y}`, avg);
      }
    }
    return scores;
  }, [cells, gridSize]);

  // Compute thermal heat island temperature map
  const cellHeatMap = useMemo(() => {
    const map = new Map<string, number>();
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const cell = cellMap.get(`${x},${y}`);
        let temp = 32.5; // base ambient Celsius
        if (!cell) {
          map.set(`${x},${y}`, temp);
          continue;
        }

        if (cell.zoneType === 'green_park') temp -= 3.8;
        else if (cell.zoneType === 'blue_infrastructure') temp -= 4.2;
        else if (cell.zoneType === 'sponge_wetland') temp -= 3.4;
        else if (cell.zoneType === 'residential_high') temp += 1.8;
        else if (cell.zoneType === 'commercial_tech') temp += 1.6;
        else if (cell.zoneType === 'civic_court') temp += 0.8;
        else if (cell.zoneType === 'civic_airport') temp += 2.2;
        else if (cell.zoneType === 'civic_stadium') temp += 1.2;
        else if (cell.zoneType === 'circular_industry') temp += 2.4;
        else if (cell.zoneType === 'residential_medium') temp += 0.4;
        else if (cell.zoneType === 'renewable_energy') temp -= 0.6;
        else if (cell.zoneType === 'civic_healthcare') temp += 0.8;
        else if (cell.zoneType === 'civic_education') temp += 0.2;
        else if (cell.zoneType === 'civic_college') temp += 0.4;

        // Cooling influence of adjacent park or river canal
        let neighborCooling = 0;
        const neighbors = [
          [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
        ];
        for (const [nx, ny] of neighbors) {
          const nCell = cellMap.get(`${nx},${ny}`);
          if (nCell?.zoneType === 'green_park' || nCell?.zoneType === 'blue_infrastructure' || nCell?.zoneType === 'sponge_wetland') {
            neighborCooling += 0.8;
          }
        }
        temp = Math.max(26.0, Math.min(38.0, temp - neighborCooling));
        map.set(`${x},${y}`, Number(temp.toFixed(1)));
      }
    }
    return map;
  }, [cellMap, gridSize]);

  const handlePointerDown = (x: number, y: number) => {
    setIsMouseDown(true);
    triggerAction(x, y);
  };

  const handlePointerEnter = (x: number, y: number) => {
    const cell = cellMap.get(`${x},${y}`) || { x, y, zoneType: 'residential_medium' as ZoneType };
    setHoveredCell(cell);
    if (isMouseDown && toolMode !== 'inspect' && toolMode !== 'eyedropper') {
      triggerAction(x, y);
    }
  };

  const triggerAction = (x: number, y: number) => {
    const current = cellMap.get(`${x},${y}`);
    if (toolMode === 'eyedropper') {
      if (current) onPickZone(current.zoneType);
    } else if (toolMode === 'inspect') {
      onCellInspect(current || null);
    } else {
      onCellClick(x, y);
    }
  };

  // Helper to determine fill color based on active simulation overlay
  const getCellColor = (cell: GridCell): string => {
    const def = ZONE_DEFINITIONS[cell.zoneType] || ZONE_DEFINITIONS.residential_medium;

    if (overlayMode === 'zoning') {
      return def.color;
    }

    if (overlayMode === '15min_access') {
      const score = cell15MinScores.get(`${cell.x},${cell.y}`) || 0;
      if (score >= 85) return '#10b981'; // emerald 100%
      if (score >= 65) return '#34d399'; // light emerald
      if (score >= 50) return '#eab308'; // yellow
      if (score >= 30) return '#f97316'; // orange
      return '#ef4444'; // red (isolated)
    }

    if (overlayMode === 'heat_island') {
      const temp = cellHeatMap.get(`${cell.x},${cell.y}`) || 32;
      if (temp <= 27.5) return '#06b6d4'; // cyan cool oasis
      if (temp <= 29.5) return '#10b981'; // green temperate
      if (temp <= 31.5) return '#eab308'; // warm yellow
      if (temp <= 33.5) return '#f97316'; // hot orange
      return '#dc2626'; // extreme red heat dome
    }

    if (overlayMode === 'transit_flow') {
      if (cell.zoneType === 'transit_metro') return '#f97316';
      if (cell.zoneType === 'transit_hub') return '#fb923c';
      if (cell.zoneType === 'civic_airport') return '#3b82f6';
      if (cell.zoneType === 'commercial_tech') return '#8b5cf6';
      if (cell.zoneType === 'residential_high') return '#0284c7';
      return '#1e293b';
    }

    if (overlayMode === 'sponge_flood') {
      if (cell.zoneType === 'sponge_wetland') return '#0d9488';
      if (cell.zoneType === 'blue_infrastructure') return '#0284c7';
      if (cell.zoneType === 'green_park') return '#16a34a';
      if (cell.zoneType === 'renewable_energy') return '#ca8a04';
      return '#334155';
    }

    return def.color;
  };

  // Distinct volumetric heights for isometric 3D projection
  const getCellHeight = (zone: ZoneType): number => {
    switch (zone) {
      case 'residential_high': return 36;
      case 'commercial_tech': return 28;
      case 'civic_court': return 24;
      case 'civic_college': return 22;
      case 'civic_stadium': return 20;
      case 'civic_healthcare': return 20;
      case 'civic_airport': return 16;
      case 'transit_hub': return 16;
      case 'transit_metro': return 14;
      case 'residential_medium': return 15;
      case 'civic_education': return 15;
      case 'circular_industry': return 12;
      case 'renewable_energy': return 6;
      case 'green_park': return 4;
      case 'sponge_wetland': return 2;
      case 'blue_infrastructure': return 0;
      default: return 10;
    }
  };

  // Icon symbol renderer for 2D blueprint mode
  const renderCellIcon = (zone: ZoneType, isHovered: boolean) => {
    const iconClass = `w-4 h-4 transition-transform duration-200 ${isHovered ? 'scale-125' : 'scale-100'} text-white/90 drop-shadow-md`;
    switch (zone) {
      case 'residential_high': return <Building2 className={iconClass} />;
      case 'residential_medium': return <Home className={iconClass} />;
      case 'commercial_tech': return <Cpu className={iconClass} />;
      case 'civic_healthcare': return <HeartPulse className={`${iconClass} text-rose-100`} />;
      case 'civic_education': return <GraduationCap className={iconClass} />;
      case 'civic_college': return <GraduationCap className={`${iconClass} text-indigo-100`} />;
      case 'civic_court': return <Scale className={`${iconClass} text-amber-100`} />;
      case 'civic_airport': return <Plane className={`${iconClass} text-sky-100`} />;
      case 'civic_stadium': return <Trophy className={`${iconClass} text-pink-100`} />;
      case 'transit_metro': return <Train className={`${iconClass} text-orange-100`} />;
      case 'transit_hub': return <Train className={iconClass} />;
      case 'green_park': return <Trees className={`${iconClass} text-emerald-100`} />;
      case 'blue_infrastructure': return <Waves className={`${iconClass} text-cyan-100`} />;
      case 'sponge_wetland': return <Droplets className={`${iconClass} text-teal-100`} />;
      case 'renewable_energy': return <Zap className={`${iconClass} text-yellow-100`} />;
      case 'circular_industry': return <Factory className={iconClass} />;
      default: return null;
    }
  };

  return (
    <div 
      className="relative flex flex-col h-full w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl select-none"
      onPointerUp={() => setIsMouseDown(false)}
      onPointerLeave={() => {
        setIsMouseDown(false);
        setHoveredCell(null);
      }}
    >
      {/* Top Canvas Controls Strip */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-xs z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="font-bold text-white tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Digital Twin Matrix</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="font-mono tabular-nums text-slate-300">{gridSize}×{gridSize} Autonomous Parcels</span>
            <span className="text-slate-600">·</span>
            <span className="text-cyan-400 font-mono tabular-nums font-semibold">{(gridSize * gridSize * 1.8).toFixed(1)} km² District Territory</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Overlay Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/80 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="capitalize">{overlayMode.replace('_', ' ')} Overlay</span>
          </div>

          {/* Perspective Indicator */}
          <div className="hidden md:flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-800/60 px-2 py-1 rounded-md border border-slate-700/50">
            <span>Projection:</span>
            <span className="text-white font-bold">{viewPerspective === '2d' ? '2D GIS Blueprint' : '2.5D Isometric Twin'}</span>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60">
            <button
              onClick={() => setZoom((z) => Math.max(0.65, Number((z - 0.1).toFixed(2))))}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono tabular-nums text-[11px] text-slate-300 font-semibold min-w-[42px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.7, Number((z + 0.1).toFixed(2))))}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors ml-0.5"
              title="Reset Zoom to 100%"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="relative flex-1 w-full h-full overflow-auto flex items-center justify-center p-6 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
        <div 
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          className="transition-transform duration-150 ease-out"
        >
          {viewPerspective === '2d' ? (
            /* 2D GIS Blueprint Grid View */
            <div 
              className="grid gap-1.5 p-3.5 bg-slate-900/95 rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-xl relative"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                width: `${gridSize * 46}px`,
                height: `${gridSize * 46}px`,
              }}
            >
              {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                const x = index % gridSize;
                const y = Math.floor(index / gridSize);
                const cell = cellMap.get(`${x},${y}`) || { x, y, zoneType: 'residential_medium' as ZoneType };
                const def = ZONE_DEFINITIONS[cell.zoneType] || ZONE_DEFINITIONS.residential_medium;
                const color = getCellColor(cell);
                const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;

                return (
                  <div
                    key={`${x}-${y}`}
                    onPointerDown={() => handlePointerDown(x, y)}
                    onPointerEnter={() => handlePointerEnter(x, y)}
                    className={`relative rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center overflow-hidden border ${
                      isHovered 
                        ? 'ring-2 ring-white scale-110 z-20 shadow-2xl border-white' 
                        : 'border-white/10 hover:border-white/40'
                    }`}
                    style={{
                      backgroundColor: color,
                      boxShadow: isHovered 
                        ? '0 0 20px rgba(255,255,255,0.4), inset 0 0 10px rgba(255,255,255,0.3)' 
                        : 'inset 0 1px 2px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  >
                    {/* Architectural Texture Shading */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/30 pointer-events-none" />

                    {/* Water flow wave animation */}
                    {cell.zoneType === 'blue_infrastructure' && (
                      <div 
                        className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none"
                        style={{
                          transform: `translateX(${(animationTick % 10) * 0.6}px)`,
                        }}
                      />
                    )}

                    {/* Zone Symbolic Icon */}
                    <div className="relative z-10">
                      {renderCellIcon(cell.zoneType, isHovered)}
                    </div>

                    {/* Landmark Gold Ring Indicator */}
                    {cell.landmark && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-300 ring-2 ring-slate-950 shadow-md animate-pulse" />
                    )}

                    {/* Autonomous Transit Pulse */}
                    {(cell.zoneType === 'transit_hub' || cell.zoneType === 'transit_metro') && (
                      <div 
                        className="absolute inset-0 rounded-xl border border-orange-300/80 animate-ping opacity-60 pointer-events-none"
                        style={{ animationDuration: '3s' }}
                      />
                    )}

                    {/* Coordinates & Label on hover */}
                    {isHovered && (
                      <span className="absolute bottom-0.5 inset-x-0 text-center text-[7px] font-mono text-white font-bold truncate px-0.5 pointer-events-none bg-slate-950/70">
                        {x},{y}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* 2.5D Isometric Volumetric Digital Twin Model */
            <div className="relative py-12 px-16">
              <svg 
                width={gridSize * 64 + 240} 
                height={gridSize * 36 + 340} 
                className="overflow-visible drop-shadow-2xl"
              >
                <defs>
                  {/* Subtle terrain glow */}
                  <radialGradient id="matrixGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Ground foundation glow */}
                <ellipse 
                  cx={gridSize * 32 + 120} 
                  cy={gridSize * 18 + 180} 
                  rx={gridSize * 28 + 60} 
                  ry={gridSize * 14 + 40} 
                  fill="url(#matrixGlow)" 
                />

                <g transform={`translate(${gridSize * 32 + 120}, 90)`}>
                  {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                    const x = index % gridSize;
                    const y = Math.floor(index / gridSize);
                    const cell = cellMap.get(`${x},${y}`) || { x, y, zoneType: 'residential_medium' as ZoneType };
                    const def = ZONE_DEFINITIONS[cell.zoneType] || ZONE_DEFINITIONS.residential_medium;
                    const color = getCellColor(cell);
                    const height = getCellHeight(cell.zoneType);
                    const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;

                    // Isometric projection coordinate transformation
                    const tileW = 48;
                    const tileH = 24;
                    const isoX = (x - y) * (tileW / 2);
                    const isoY = (x + y) * (tileH / 2);

                    const topPoints = [
                      [isoX, isoY - height],
                      [isoX + tileW / 2, isoY + tileH / 2 - height],
                      [isoX, isoY + tileH - height],
                      [isoX - tileW / 2, isoY + tileH / 2 - height],
                    ].map(p => p.join(',')).join(' ');

                    const rightFacePoints = [
                      [isoX, isoY + tileH - height],
                      [isoX + tileW / 2, isoY + tileH / 2 - height],
                      [isoX + tileW / 2, isoY + tileH / 2],
                      [isoX, isoY + tileH],
                    ].map(p => p.join(',')).join(' ');

                    const leftFacePoints = [
                      [isoX - tileW / 2, isoY + tileH / 2 - height],
                      [isoX, isoY + tileH - height],
                      [isoX, isoY + tileH],
                      [isoX - tileW / 2, isoY + tileH / 2],
                    ].map(p => p.join(',')).join(' ');

                    return (
                      <g 
                        key={`iso-${x}-${y}`} 
                        className="cursor-pointer transition-all duration-150"
                        onPointerDown={() => handlePointerDown(x, y)}
                        onPointerEnter={() => handlePointerEnter(x, y)}
                      >
                        {/* Terrain Base Shadow */}
                        {height > 0 && (
                          <polygon
                            points={[
                              [isoX, isoY + 2],
                              [isoX + tileW / 2, isoY + tileH / 2 + 2],
                              [isoX, isoY + tileH + 2],
                              [isoX - tileW / 2, isoY + tileH / 2 + 2],
                            ].map(p => p.join(',')).join(' ')}
                            fill="#020617"
                            opacity="0.45"
                          />
                        )}

                        {/* Left extruded building face (shadowed side) */}
                        {height > 0 && (
                          <polygon
                            points={leftFacePoints}
                            fill={color}
                            filter="brightness(0.68)"
                            stroke="#0f172a"
                            strokeWidth="0.75"
                          />
                        )}

                        {/* Right extruded building face (ambient side) */}
                        {height > 0 && (
                          <polygon
                            points={rightFacePoints}
                            fill={color}
                            filter="brightness(0.85)"
                            stroke="#0f172a"
                            strokeWidth="0.75"
                          />
                        )}

                        {/* Top surface face (direct sunlight) */}
                        <polygon
                          points={topPoints}
                          fill={color}
                          filter={isHovered ? 'brightness(1.35)' : 'brightness(1.0)'}
                          stroke={isHovered ? '#ffffff' : '#0f172a'}
                          strokeWidth={isHovered ? '2' : '0.75'}
                        />

                        {/* Architectural Glass Floor Bands on High-Rise Towers */}
                        {height >= 26 && (
                          <>
                            <line
                              x1={isoX - tileW / 4}
                              y1={isoY + tileH / 4 - height * 0.65}
                              x2={isoX}
                              y2={isoY + tileH / 2 - height * 0.65}
                              stroke="#ffffff"
                              strokeWidth="0.8"
                              strokeOpacity="0.4"
                            />
                            <line
                              x1={isoX}
                              y1={isoY + tileH / 2 - height * 0.65}
                              x2={isoX + tileW / 4}
                              y2={isoY + tileH / 4 - height * 0.65}
                              stroke="#ffffff"
                              strokeWidth="0.8"
                              strokeOpacity="0.5"
                            />
                          </>
                        )}

                        {/* Rooftop Trauma Helipad Indicator for Hospitals */}
                        {cell.zoneType === 'civic_healthcare' && (
                          <circle
                            cx={isoX}
                            cy={isoY + tileH / 2 - height}
                            r={4}
                            fill="#ef4444"
                            stroke="#ffffff"
                            strokeWidth="1"
                          />
                        )}

                        {/* Aerotropolis Airport Runway Stripes */}
                        {cell.zoneType === 'civic_airport' && (
                          <line
                            x1={isoX - 6}
                            y1={isoY + tileH / 2 - height}
                            x2={isoX + 6}
                            y2={isoY + tileH / 2 - height}
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            strokeDasharray="2 1"
                          />
                        )}

                        {/* Landmark Beacon */}
                        {cell.landmark && (
                          <circle
                            cx={isoX}
                            cy={isoY + tileH / 2 - height}
                            r={3.5}
                            fill="#f59e0b"
                            stroke="#ffffff"
                            strokeWidth="1.2"
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* Animated Autonomous Electric Transit Pod gliding along the main boulevard */}
                  {(() => {
                    const podStep = (animationTick % 100) / 100;
                    const startX = 6;
                    const startY = 1;
                    const endX = 6;
                    const endY = 12;
                    const currentY = startY + (endY - startY) * podStep;
                    const tileW = 48;
                    const tileH = 24;
                    const podIsoX = (startX - currentY) * (tileW / 2);
                    const podIsoY = (startX + currentY) * (tileH / 2) - 8;

                    return (
                      <g className="pointer-events-none">
                        <circle
                          cx={podIsoX}
                          cy={podIsoY}
                          r={3.5}
                          fill="#f97316"
                          stroke="#ffffff"
                          strokeWidth="1"
                          className="drop-shadow-[0_0_8px_#f97316]"
                        />
                        <circle
                          cx={podIsoX}
                          cy={podIsoY}
                          r={6}
                          fill="none"
                          stroke="#fb923c"
                          strokeWidth="0.75"
                          opacity="0.7"
                        />
                      </g>
                    );
                  })()}
                </g>
              </svg>
            </div>
          )}
        </div>

        {/* Hover Parcel HUD Telemetry Inspector (Floating bottom-left) */}
        {hoveredCell && (
          <div className="absolute bottom-4 left-4 p-3.5 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl max-w-xs text-xs pointer-events-none z-30 transition-all animate-in fade-in">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: ZONE_DEFINITIONS[hoveredCell.zoneType]?.color || '#38bdf8' }}
                />
                <span className="font-bold text-white text-xs">
                  {ZONE_DEFINITIONS[hoveredCell.zoneType]?.name || 'Residential Parcel'}
                </span>
              </div>
              <span className="font-mono text-cyan-400 font-semibold text-[11px]">
                Coord ({hoveredCell.x}, {hoveredCell.y})
              </span>
            </div>

            <div className="space-y-1.5 text-slate-300 text-[11px]">
              {hoveredCell.label && (
                <div className="text-cyan-300 font-semibold">{hoveredCell.label}</div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-slate-400">15-Minute Access:</span>
                <span className="font-mono tabular-nums font-bold text-emerald-400">
                  {cell15MinScores.get(`${hoveredCell.x},${hoveredCell.y}`) || 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Thermal Index:</span>
                <span className="font-mono tabular-nums text-amber-400 font-semibold">
                  {cellHeatMap.get(`${hoveredCell.x},${hoveredCell.y}`) || 32}°C
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Resident Capacity:</span>
                <span className="font-mono tabular-nums text-white">
                  {(ZONE_DEFINITIONS[hoveredCell.zoneType]?.density || 0).toLocaleString()} citizens
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                <span>Carbon Absorption:</span>
                <span className="font-mono text-cyan-400">
                  {(ZONE_DEFINITIONS[hoveredCell.zoneType]?.carbonDelta || 0) < 0 
                    ? `${Math.abs(ZONE_DEFINITIONS[hoveredCell.zoneType]?.carbonDelta || 0)} tons CO₂/yr (Absorbs)`
                    : `${ZONE_DEFINITIONS[hoveredCell.zoneType]?.carbonDelta || 0} tons CO₂/yr (Emits)`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Overlay Legend Indicator (Floating bottom-right) */}
        <div className="absolute bottom-4 right-4 p-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl shadow-xl text-xs z-20">
          <div className="text-[11px] font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="capitalize">{overlayMode.replace('_', ' ')} Simulation</span>
          </div>
          
          {overlayMode === '15min_access' && (
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-rose-400 font-mono">Unserved (0%)</span>
              <div className="w-24 h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500 shadow-inner" />
              <span className="text-emerald-400 font-mono font-bold">100% Access</span>
            </div>
          )}

          {overlayMode === 'heat_island' && (
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-cyan-400 font-mono">26°C Cool Oasis</span>
              <div className="w-24 h-2 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 via-yellow-400 to-red-600 shadow-inner" />
              <span className="text-rose-400 font-mono font-bold">38°C Heat Dome</span>
            </div>
          )}

          {overlayMode === 'transit_flow' && (
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1 text-orange-400"><span className="w-2 h-2 rounded-full bg-orange-500"/> Metro Transit</span>
              <span className="flex items-center gap-1 text-sky-400"><span className="w-2 h-2 rounded-full bg-blue-500"/> Airport Hub</span>
              <span className="flex items-center gap-1 text-purple-400"><span className="w-2 h-2 rounded-full bg-purple-500"/> Tech Corridor</span>
            </div>
          )}

          {overlayMode === 'sponge_flood' && (
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1 text-teal-400"><span className="w-2 h-2 rounded-full bg-teal-500"/> Sponge Wetland</span>
              <span className="flex items-center gap-1 text-cyan-400"><span className="w-2 h-2 rounded-full bg-cyan-500"/> Cooling River</span>
              <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500"/> Bioswale Park</span>
            </div>
          )}

          {overlayMode === 'zoning' && (
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500"/> Eco-Housing</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"/> Clean Tech</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"/> Green Forest</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"/> Trauma Health</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
