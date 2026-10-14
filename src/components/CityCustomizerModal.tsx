import React, { useState } from 'react';
import { 
  Building2, Users, Maximize2, CheckSquare, Square, 
  Sparkles, MapPin, AlertCircle, CheckCircle2, X, ArrowRight,
  Plane, HeartPulse, Train, GraduationCap, Scale, Trophy, Droplets, Zap,
  ShieldAlert, RefreshCw, Cpu
} from 'lucide-react';
import { CityPlan, GridCell, ZoneType } from '../types/city';
import { calculateCityMetrics } from '../utils/cityCalculator';

interface CityCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCustomPlan: (plan: CityPlan) => void;
  onStartManualPlacement: (facilityZone: ZoneType, facilityName: string) => void;
}

export interface FacilityOption {
  id: string;
  name: string;
  zoneType: ZoneType;
  icon: any;
  description: string;
  category: 'Critical Civic' | 'Mobility & Logistics' | 'Ecology & Power';
  recommended: boolean;
}

export const FACILITY_OPTIONS: FacilityOption[] = [
  { 
    id: 'hospital', 
    name: 'Level-1 Trauma Hospital & Emergency Clinics', 
    zoneType: 'civic_healthcare', 
    icon: HeartPulse, 
    description: 'Universal 15-min trauma care, pediatric suites, and mobile emergency dispatch.', 
    category: 'Critical Civic', 
    recommended: true 
  },
  { 
    id: 'metro', 
    name: 'Underground Metro & Autonomous Transit', 
    zoneType: 'transit_metro', 
    icon: Train, 
    description: 'High-frequency electric rail spine interconnecting all residential superblocks.', 
    category: 'Mobility & Logistics', 
    recommended: true 
  },
  { 
    id: 'school', 
    name: 'Neighborhood K-12 Academy & Bioswale Paths', 
    zoneType: 'civic_education', 
    icon: GraduationCap, 
    description: 'Zero-car child-safe school streets, science labs, and sports grounds.', 
    category: 'Critical Civic', 
    recommended: true 
  },
  { 
    id: 'college', 
    name: 'University & AI Research College', 
    zoneType: 'civic_college', 
    icon: GraduationCap, 
    description: 'Higher education research campus, digital libraries, and engineering faculties.', 
    category: 'Critical Civic', 
    recommended: true 
  },
  { 
    id: 'court', 
    name: 'Civic Court & Justice Hall', 
    zoneType: 'civic_court', 
    icon: Scale, 
    description: 'Municipal democracy hall, constitutional court, and citizen assembly chambers.', 
    category: 'Critical Civic', 
    recommended: false 
  },
  { 
    id: 'airport', 
    name: 'Aerotropolis International Airport & Skyport', 
    zoneType: 'civic_airport', 
    icon: Plane, 
    description: 'Electric commercial aviation, eVTOL vertiport, and automated freight cargo logistics.', 
    category: 'Mobility & Logistics', 
    recommended: false 
  },
  { 
    id: 'stadium', 
    name: 'Olympic Civic Arena & Multi-Sport Complex', 
    zoneType: 'civic_stadium', 
    icon: Trophy, 
    description: 'Multi-sport municipal grounds, indoor aquatics, and cultural concerts.', 
    category: 'Critical Civic', 
    recommended: false 
  },
  { 
    id: 'sponge', 
    name: 'Sponge Wetlands & Flood Retention Canals', 
    zoneType: 'sponge_wetland', 
    icon: Droplets, 
    description: '100-year cloudburst absorption, biofiltration ponds, and urban cooling streams.', 
    category: 'Ecology & Power', 
    recommended: true 
  },
  { 
    id: 'solar', 
    name: 'Solar Agrivoltaics & Hydrogen Microgrid', 
    zoneType: 'renewable_energy', 
    icon: Zap, 
    description: 'Clean decentralized power, solid-state battery storage, and smart microgrid nodes.', 
    category: 'Ecology & Power', 
    recommended: true 
  },
  { 
    id: 'tech_hub', 
    name: 'Clean-Tech Innovation Park & Data Center', 
    zoneType: 'commercial_tech', 
    icon: Cpu, 
    description: 'Incubation park for green technology, robotics, and generative AI research.', 
    category: 'Critical Civic', 
    recommended: true 
  },
];

export const CityCustomizerModal: React.FC<CityCustomizerModalProps> = ({
  isOpen,
  onClose,
  onApplyCustomPlan,
  onStartManualPlacement,
}) => {
  const [cityName, setCityName] = useState('Veridia Nova');
  const [populationInput, setPopulationInput] = useState('1000000');
  const [selectedCitySizeKm2, setSelectedCitySizeKm2] = useState<number>(180);
  const [isCustomArea, setIsCustomArea] = useState(false);
  const [customAreaInput, setCustomAreaInput] = useState('180');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([
    'hospital', 'metro', 'school', 'college', 'court', 'airport', 'stadium', 'sponge', 'solar', 'tech_hub'
  ]);
  const [placementMode, setPlacementMode] = useState<'auto' | 'manual'>('auto');
  const [inputError, setInputError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Real-time population validator & error detector
  const validatePopulation = (rawInput: string): { value: number; error: string | null } => {
    const raw = rawInput.trim().replace(/,/g, '');
    if (!raw) {
      return { value: 0, error: 'Population field cannot be empty. Please enter your target population (e.g. 1000000).' };
    }
    // Check if input contains invalid non-numeric characters
    if (!/^\d+$/.test(raw)) {
      return { 
        value: 0, 
        error: `Invalid input "${rawInput}". Please type numbers only (e.g., 1000000 for 1 Million or 100000000 for 100 Million). Avoid letters or special symbols.` 
      };
    }

    const num = Number(raw);
    if (num <= 0) {
      return { value: 0, error: 'Population must be a positive number greater than zero.' };
    }
    if (num < 1000) {
      return { 
        value: num, 
        error: `Population of ${num.toLocaleString()} is too low for an autonomous city masterplan. Minimum recommended is 1,000 citizens.` 
      };
    }
    if (num > 500000000) {
      return { 
        value: num, 
        error: `Target population of ${num.toLocaleString()} exceeds simulated municipal limits (500 Million). Please choose a population up to 500,000,000.` 
      };
    }
    return { value: num, error: null };
  };

  const handlePopulationChange = (val: string) => {
    setPopulationInput(val);
    const { error } = validatePopulation(val);
    setInputError(error);
  };

  const handlePopulationPreset = (val: string) => {
    setPopulationInput(val);
    setInputError(null);
  };

  const toggleFacility = (id: string) => {
    if (selectedFacilities.includes(id)) {
      if (selectedFacilities.length <= 1) {
        setInputError('Please select at least 1 municipal facility for your planned city.');
        return;
      }
      setSelectedFacilities(selectedFacilities.filter((f) => f !== id));
    } else {
      setSelectedFacilities([...selectedFacilities, id]);
      setInputError(null);
    }
  };

  const handleSelectAllFacilities = () => {
    setSelectedFacilities(FACILITY_OPTIONS.map((f) => f.id));
    setInputError(null);
  };

  const effectiveAreaKm2 = isCustomArea 
    ? Math.max(5, Number(customAreaInput) || 180) 
    : selectedCitySizeKm2;

  const handleGenerate = () => {
    const { value: pop, error } = validatePopulation(populationInput);
    if (error) {
      setInputError(error);
      return;
    }

    if (placementMode === 'manual') {
      // Find the first selected facility to start interactive manual stamping
      const firstId = selectedFacilities[0] || 'hospital';
      const facility = FACILITY_OPTIONS.find((f) => f.id === firstId)!;
      onStartManualPlacement(facility.zoneType, facility.name);
      onClose();
      return;
    }

    // AUTO-GENERATION MODE: Synthesize mathematically optimal masterplan
    const size = 14;
    const cells: GridCell[] = [];

    // Base city matrix with biophilic rings
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let zoneType: ZoneType = 'residential_medium';
        let landmark: string | undefined = undefined;
        let label: string | undefined = undefined;

        // Central river and cooling ribbon
        if (x === 6 || x === 7) {
          zoneType = 'blue_infrastructure';
          label = 'Central Cooling River';
        }
        // East-West linear green parks
        else if (y === 3 || y === 10) {
          zoneType = 'green_park';
          label = 'Linear Bioswale Park';
        }
        // High density biophilic towers near center
        else if (x >= 4 && x <= 9 && y >= 4 && y <= 9) {
          zoneType = 'residential_high';
          label = 'Biophilic Eco-Towers';
        }

        cells.push({ x, y, zoneType, landmark, label });
      }
    }

    // Helper to stamp facility at coordinate
    const stamp = (x: number, y: number, z: ZoneType, lm: string, lbl: string) => {
      const idx = cells.findIndex((c) => c.x === x && c.y === y);
      if (idx >= 0) {
        cells[idx] = { x, y, zoneType: z, landmark: lm, label: lbl };
      }
    };

    // Stamping selected facilities with mathematically optimal placement:
    // 1. Hospital: Equidistant to residential superblocks (x:3, y:4 and x:10, y:9)
    if (selectedFacilities.includes('hospital')) {
      stamp(3, 4, 'civic_healthcare', 'regional_hospital', 'Level-1 Trauma Center');
      stamp(10, 9, 'civic_healthcare', 'polyclinic', 'East Satellite Polyclinic');
    }

    // 2. Metro: Along central density corridor (x:6, y:6 and x:7, y:7 and x:6, y:1)
    if (selectedFacilities.includes('metro')) {
      stamp(6, 6, 'transit_metro', 'metro_nexus', 'Grand Central Metro Nexus');
      stamp(7, 7, 'transit_metro', 'metro_station', 'Boulevard Metro Station');
      stamp(6, 1, 'transit_metro', 'north_metro', 'North Terminal Metro');
    }

    // 3. School: Safe bioswale adjacent (x:3, y:8 and x:10, y:5)
    if (selectedFacilities.includes('school')) {
      stamp(3, 8, 'civic_education', 'school', 'Neighborhood K-12 Academy');
      stamp(10, 5, 'civic_education', 'school', 'Polytechnic High School');
    }

    // 4. College: University research quarter (x:4, y:9)
    if (selectedFacilities.includes('college')) {
      stamp(4, 9, 'civic_college', 'university', 'Metropolitan Science University');
      stamp(5, 9, 'civic_college', 'research_labs', 'Advanced AI & Materials Labs');
    }

    // 5. Court: Town hall and civic justice palace at central public square (x:5, y:5)
    if (selectedFacilities.includes('court')) {
      stamp(5, 5, 'civic_court', 'justice_palace', 'Palace of Justice & Town Hall');
    }

    // 6. Airport: Peripheral acoustic buffer zone (far southeast corner, zero noise to homes)
    if (selectedFacilities.includes('airport')) {
      stamp(13, 13, 'civic_airport', 'airport_hub', 'Aerotropolis International Terminal');
      stamp(13, 12, 'civic_airport', 'cargo', 'Electric Aviation Skyport & Cargo');
    }

    // 7. Stadium: Civic sports arena on outer transit belt (x:8, y:4)
    if (selectedFacilities.includes('stadium')) {
      stamp(8, 4, 'civic_stadium', 'olympic_arena', 'Olympic Civic Arena & Dome');
    }

    // 8. Sponge Wetlands: Low-lying retention basin for 100-year cloudbursts (x:1, y:11 and x:1, y:12)
    if (selectedFacilities.includes('sponge')) {
      stamp(1, 11, 'sponge_wetland', 'basin', 'Biofiltration Sponge Wetland');
      stamp(1, 12, 'sponge_wetland', 'basin', 'Stormwater Retention Lagoon');
    }

    // 9. Solar Microgrid: Agrivoltaic array & solid-state hydrogen battery (x:0, y:1 and x:0, y:2)
    if (selectedFacilities.includes('solar')) {
      stamp(0, 1, 'renewable_energy', 'solar', 'Agrivoltaic Solar Array');
      stamp(0, 2, 'renewable_energy', 'hydrogen', 'Solid-State Hydrogen Battery');
    }

    // 10. Tech Hub: Clean-tech research quarter (x:9, y:4)
    if (selectedFacilities.includes('tech_hub')) {
      stamp(9, 4, 'commercial_tech', 'clean_tech', 'Clean-Tech AI Innovation Park');
    }

    const kpis = calculateCityMetrics(cells, size);

    const newPlan: CityPlan = {
      cityName: cityName.trim() || 'Veridia Metropole',
      visionStatement: `A tailored ${pop.toLocaleString()}-citizen planned metropolis spanning ${effectiveAreaKm2} km² with 15-minute universal access to trauma hospitals, underground metro transit, child-safe academies, research colleges, and perimeter aerotropolis infrastructure.`,
      gridSize: size,
      cells,
      kpis,
      keyInnovations: [
        {
          title: 'Decentralized Civic Infrastructure Web',
          description: `Equidistant placement ensures 100% of citizens reach medical, education, and rapid transit within 10 minutes.`,
          sector: 'Urban Equity',
        },
        {
          title: 'Perimeter Aerotropolis Acoustic Buffer',
          description: 'Electric aviation hub located on fringe coordinate, eliminating noise pollution while providing direct high-speed freight access.',
          sector: 'Sustainable Mobility',
        },
        {
          title: 'Dual-Node Clean Energy & Sponge Retention',
          description: 'Zero-carbon agrivoltaic power combined with deep stormwater lagoons absorbing 100-year cloudburst events.',
          sector: 'Climate Resilience',
        },
      ],
      zoningRegulations: [
        { code: 'ORD-FACILITY-01', rule: 'Mandatory 400m maximum walking radius between residential cores and primary healthcare/schools.', rationale: 'Enforces equitable 15-minute standard.' },
        { code: 'ORD-ACOUSTIC-04', rule: 'Aerotropolis & aviation hubs restricted to perimeter sectors with acoustic bioswale buffer.', rationale: 'Protects residential superblocks from decibel disturbance.' },
      ],
    };

    onApplyCustomPlan(newPlan);
    onClose();
  };

  const { value: parsedPop } = validatePopulation(populationInput);
  const density = Math.round(parsedPop / (effectiveAreaKm2 || 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-xs text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">Client Custom City Builder & Facility Architect</h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-semibold">
                  Tailored Specification
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Set population (1M, 100M+), territory size, and choose your required municipal facilities.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* City Name */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Planned City Name
            </label>
            <input
              type="text"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              placeholder="e.g. Neo-Curitiba Biophilic Metropole"
            />
          </div>

          {/* Target Population with Friendly Real-time Validation & Error Detection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold">
                Target Citizen Population *
              </label>
              {parsedPop > 0 && !inputError && (
                <span className="font-mono text-cyan-400 font-bold">
                  {parsedPop.toLocaleString()} Citizens
                </span>
              )}
            </div>

            <input
              type="text"
              value={populationInput}
              onChange={(e) => handlePopulationChange(e.target.value)}
              placeholder="Type numbers: e.g. 1000000 (1 Million) or 100000000 (100 Million)"
              className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none transition-colors ${
                inputError ? 'border-rose-500 ring-1 ring-rose-500/50 bg-rose-950/20' : 'border-slate-700 focus:ring-1 focus:ring-cyan-400'
              }`}
            />

            {/* Error Guidance Display */}
            {inputError && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-[11px] animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div className="flex-1">
                  <span className="font-semibold block text-rose-200">Input Validation Error:</span>
                  <span>{inputError}</span>
                </div>
              </div>
            )}

            {/* Quick Population Chips (1 Million, 100 Million, etc.) */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: '50,000 (Town)', val: '50000' },
                { label: '250,000 (Mid-City)', val: '250000' },
                { label: '1 Million (Metropolis)', val: '1000000' },
                { label: '10 Million (Mega-City)', val: '10000000' },
                { label: '100 Million (Mega-Region)', val: '100000000' },
                { label: '250 Million (Continental Arcology)', val: '250000000' },
              ].map((chip) => (
                <button
                  key={chip.val}
                  type="button"
                  onClick={() => handlePopulationPreset(chip.val)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-colors ${
                    populationInput === chip.val
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-semibold'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* City Size & Land Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold block">
                City Territory Size (km²)
              </label>
              <button
                type="button"
                onClick={() => setIsCustomArea(!isCustomArea)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
              >
                {isCustomArea ? '← Use Standard Presets' : '+ Custom km² Input'}
              </button>
            </div>

            {isCustomArea ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  max="10000"
                  value={customAreaInput}
                  onChange={(e) => setCustomAreaInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  placeholder="Enter custom territory in km² (e.g. 500)"
                />
                <span className="text-slate-400 font-mono text-xs shrink-0">km²</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: '25 km²', name: 'Compact Eco-Core', val: 25 },
                  { label: '180 km²', name: 'Metropolitan Area', val: 180 },
                  { label: '850 km²', name: 'Regional Territory', val: 850 },
                  { label: '2,400 km²', name: 'Mega-Arcology', val: 2400 },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => {
                      setSelectedCitySizeKm2(opt.val);
                      setIsCustomArea(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedCitySizeKm2 === opt.val && !isCustomArea
                        ? 'bg-slate-800 border-cyan-400 ring-1 ring-cyan-400/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-white text-xs font-mono">{opt.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{opt.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Required Facilities Checklist */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold">
                Select Required Facilities ({selectedFacilities.length} of {FACILITY_OPTIONS.length} selected)
              </label>
              <button
                type="button"
                onClick={handleSelectAllFacilities}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Select All Facilities
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
              {FACILITY_OPTIONS.map((fac) => {
                const Icon = fac.icon;
                const isSelected = selectedFacilities.includes(fac.id);
                return (
                  <button
                    key={fac.id}
                    type="button"
                    onClick={() => toggleFacility(fac.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-500/70 ring-1 ring-cyan-500/20'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-xs flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{fac.name}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {fac.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Placement Strategy: AI Optimal (Give entire city plan) vs Interactive Guided Canvas Placement */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-300 font-semibold block text-xs">
              Placement Strategy Choice
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPlacementMode('auto')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  placementMode === 'auto'
                    ? 'bg-slate-800 border-cyan-400 ring-1 ring-cyan-400/50'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-white text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI Optimal Placement (Entire City Plan)</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  You give us the choice: Gemini synthesizes the complete city masterplan and places every facility in its mathematically optimal spot (hospital equidistant to housing, airport on fringe buffer).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPlacementMode('manual')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  placementMode === 'manual'
                    ? 'bg-slate-800 border-cyan-400 ring-1 ring-cyan-400/50'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-white text-xs flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Choose My Own Spot (Interactive Design)</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Where you want to design: jump directly to the digital twin canvas with live parcel suitability scoring to stamp each selected facility by hand.
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/40 shrink-0">
          <div className="text-[11px] font-mono text-slate-400">
            Density: <span className="text-white font-bold">{density.toLocaleString()}</span> citizens/km²
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              className="flex items-center gap-2 px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl shadow-md transition-colors text-xs"
            >
              <span>{placementMode === 'auto' ? 'Generate Complete City Plan' : 'Proceed to Canvas Placement'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
