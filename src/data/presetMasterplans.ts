import { CityPlan, GridCell, ZoneType } from '../types/city';
import { calculateCityMetrics } from '../utils/cityCalculator';

// 1. Eco-Ring Biophilic City (Curitiba & Singapore inspiration)
function createBiophilicCity(): CityPlan {
  const size = 14;
  const cells: GridCell[] = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let zoneType: ZoneType = 'residential_medium';
      let landmark: string | undefined = undefined;
      let label: string | undefined = undefined;

      // Natural river spine & cooling ribbon
      if (x === 6 || x === 7) {
        zoneType = 'blue_infrastructure';
        label = 'River Greenway & Canal';
      }
      // Linear green finger corridors
      else if (y === 3 || y === 10) {
        zoneType = 'green_park';
        label = 'Linear Bioswale Park';
      }
      // Dense biophilic housing near core
      else if (x >= 4 && x <= 9 && y >= 4 && y <= 9) {
        zoneType = 'residential_high';
        label = 'Biophilic Eco-Towers';
      }
      // Clean Tech & R&D
      else if ((x === 4 || x === 5) && (y === 5 || y === 8)) {
        zoneType = 'commercial_tech';
        label = 'Innovation District';
      }
      // Renewable energy fields on outer fringe
      else if (x <= 1 && y <= 2) {
        zoneType = 'renewable_energy';
        landmark = 'solar_microgrid';
        label = 'Solar & Hydrogen Array';
      }
      // Sponge wetlands
      else if (x <= 1 && y >= 11) {
        zoneType = 'sponge_wetland';
        label = 'Sponge Retention Basin';
      }
      // Circular industry
      else if (x >= 12 && y <= 2) {
        zoneType = 'circular_industry';
        label = 'Zero-Emission Fab Lab';
      }

      cells.push({ x, y, zoneType, landmark, label });
    }
  }

  // Helper stamp function for precise facility anchoring
  const stamp = (x: number, y: number, z: ZoneType, lm: string, lbl: string) => {
    const idx = cells.findIndex((c) => c.x === x && c.y === y);
    if (idx >= 0) {
      cells[idx] = { x, y, zoneType: z, landmark: lm, label: lbl };
    }
  };

  // Critical Municipal Facilities Stamping
  stamp(3, 4, 'civic_healthcare', 'regional_hospital', 'Level-1 Trauma Center');
  stamp(10, 9, 'civic_healthcare', 'polyclinic', 'East Satellite Polyclinic');
  stamp(6, 6, 'transit_metro', 'metro_nexus', 'Grand Central Metro Nexus');
  stamp(7, 7, 'transit_hub', 'central_intermodal', 'Autonomous Multi-Modal Hub');
  stamp(10, 4, 'civic_education', 'school', 'Neighborhood K-12 Academy');
  stamp(3, 9, 'civic_education', 'school', 'Polytechnic Science School');
  stamp(4, 9, 'civic_college', 'university', 'Metropolitan Science University');
  stamp(5, 5, 'civic_court', 'justice_palace', 'Palace of Justice & Town Hall');
  stamp(8, 4, 'civic_stadium', 'olympic_arena', 'Olympic Civic Arena & Dome');
  stamp(13, 13, 'civic_airport', 'airport_hub', 'Aerotropolis International Terminal');
  stamp(13, 12, 'civic_airport', 'cargo', 'Electric Aviation Skyport');

  const kpis = calculateCityMetrics(cells, size);

  return {
    cityName: 'Veridia Biophilic Metropole',
    visionStatement: 'A biophilic regenerative planned city featuring radial green fingers, natural river corridors, and polycentric transit that places every citizen within a 5-minute walk of nature, healthcare, and schools.',
    gridSize: size,
    cells,
    kpis,
    keyInnovations: [
      {
        title: 'Radial Biophilic Cooling Fingers',
        description: 'Green linear forest fingers funnel cool river breezes through residential blocks, dropping summer temperatures by 3.4°C.',
        sector: 'Microclimate & Resilience',
      },
      {
        title: 'Autonomous Multi-Modal Loop & Metro Nexus',
        description: 'High-frequency electric metro rail and autonomous pods replace private cars, eliminating urban traffic congestion and particulate emissions.',
        sector: 'Sustainable Mobility',
      },
      {
        title: 'Equidistant Civic Health & School Pods',
        description: 'Decentralized healthcare clinics and schools ensure zero student or patient travels more than 400 meters.',
        sector: 'Social Equity',
      },
      {
        title: 'Acoustic Perimeter Aerotropolis',
        description: 'Electric aviation and freight terminal situated on the outer perimeter buffer with direct high-speed maglev connection.',
        sector: 'Aviation & Logistics',
      },
    ],
    zoningRegulations: [
      { code: 'ORD-BIO-101', rule: 'All buildings above 4 stories must dedicate 35% of facade area to living green vertical gardens.', rationale: 'Improves air quality and localized biodiversity.' },
      { code: 'ORD-MOB-202', rule: 'Intermodal transit hubs must provide universal micro-mobility charging and lock-and-ride e-bike bays.', rationale: 'Encourages active transit adoption.' },
    ],
  };
}

// 2. Barcelona-Paris Polycentric 15-Minute Superblocks
function createSuperblocksCity(): CityPlan {
  const size = 14;
  const cells: GridCell[] = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let zoneType: ZoneType = 'residential_medium';
      let landmark: string | undefined = undefined;
      let label: string | undefined = undefined;

      // Superblock grid intersections as green public plazas
      const isBlockCenter = (x % 4 === 2) && (y % 4 === 2);

      if (isBlockCenter) {
        zoneType = 'green_park';
        label = 'Superblock Green Plaza';
      } else if ((x >= 5 && x <= 8) && (y >= 4 && y <= 5)) {
        zoneType = 'commercial_tech';
        label = 'Civic Tech District';
      } else if ((x >= 5 && x <= 8) && (y >= 8 && y <= 9)) {
        zoneType = 'residential_high';
        label = 'Mixed-Use Apartments';
      } else if (y === 0 && x >= 10) {
        zoneType = 'renewable_energy';
        label = 'Rooftop Agrivoltaic Ring';
      } else if (x === 0 && y >= 11) {
        zoneType = 'sponge_wetland';
        label = 'Permeable Rain Garden';
      } else if (x >= 12 && y >= 12) {
        zoneType = 'circular_industry';
        label = 'Circular Workshop';
      }

      cells.push({ x, y, zoneType, landmark, label });
    }
  }

  const stamp = (x: number, y: number, z: ZoneType, lm: string, lbl: string) => {
    const idx = cells.findIndex((c) => c.x === x && c.y === y);
    if (idx >= 0) {
      cells[idx] = { x, y, zoneType: z, landmark: lm, label: lbl };
    }
  };

  stamp(6, 6, 'transit_metro', 'central_intermodal', 'Central Metro Nexus');
  stamp(7, 7, 'transit_hub', 'central_intermodal', 'Boulevard Light Rail');
  stamp(2, 6, 'transit_hub', 'west_hub', 'West Transit Stop');
  stamp(10, 6, 'transit_hub', 'east_hub', 'East Transit Stop');
  stamp(2, 2, 'civic_healthcare', 'hospital', 'Community Polyclinic');
  stamp(11, 10, 'civic_healthcare', 'hospital', 'South Polyclinic');
  stamp(10, 2, 'civic_education', 'school', 'Neighborhood Academy');
  stamp(2, 10, 'civic_education', 'school', 'Southwest Academy');
  stamp(6, 4, 'civic_college', 'university', 'Polytechnic College');
  stamp(5, 5, 'civic_court', 'town_hall', 'Civic Council & Justice Hall');
  stamp(8, 2, 'civic_stadium', 'sports_park', 'Municipal Velodrome');
  stamp(13, 0, 'civic_airport', 'airport', 'Regional Skyport Hub');

  const kpis = calculateCityMetrics(cells, size);

  return {
    cityName: 'Octavia 15-Minute Superblocks',
    visionStatement: 'Inspired by Barcelona Superblocks and the Parisian 15-Minute City, Octavia converts vehicle roadways into pedestrian-first community courtyards, eliminating traffic casualties and fostering hyper-local neighborhood vibrancy.',
    gridSize: size,
    cells,
    kpis,
    keyInnovations: [
      {
        title: '3x3 Modular Superblocks',
        description: 'Vehicles remain on outer arterial rings while interior streets are peaceful pedestrian commons with children play spaces and open-air cafes.',
        sector: 'Pedestrian Sovereignty',
      },
      {
        title: 'Hyper-Local Service Rings',
        description: 'Daycare, primary care, groceries, and green commons exist in every 4x4 parcel cluster, achieving 96% 15-minute access.',
        sector: 'Urban Proximity',
      },
      {
        title: 'Circulating Autonomous Micro-Transit',
        description: 'Low-speed autonomous pods run along perimeter arterials to link superblocks seamlessly to the central subway core.',
        sector: 'Public Transit',
      },
    ],
    zoningRegulations: [
      { code: 'ORD-SUPER-01', rule: 'Vehicular speed inside superblocks capped at 10 km/h with strict pedestrian right-of-way.', rationale: 'Reduces road accidents to zero.' },
      { code: 'ORD-MIX-02', rule: 'Minimum 25% ground-floor space dedicated to local essential commerce and public services.', rationale: 'Eliminates food deserts and promotes local employment.' },
    ],
  };
}

// 3. Coastal Sponge City (Copenhagen & Shenzhen)
function createSpongeCity(): CityPlan {
  const size = 14;
  const cells: GridCell[] = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let zoneType: ZoneType = 'residential_medium';
      let landmark: string | undefined = undefined;
      let label: string | undefined = undefined;

      // Coastal buffer and winding flood bypass canal
      if (y === 12 || y === 13) {
        zoneType = 'sponge_wetland';
        label = 'Coastal Mangrove Wetland';
      } else if ((x === 4 || x === 5) && y >= 4 && y <= 11) {
        zoneType = 'blue_infrastructure';
        label = 'Flood Retention Canal';
      } else if (y === 6 && x >= 4 && x <= 11) {
        zoneType = 'blue_infrastructure';
        label = 'East-West Tidal Canal';
      } else if ((x === 2 || x === 9) && (y === 3 || y === 9)) {
        zoneType = 'green_park';
        label = 'Sponge Biofiltration Basin';
      } else if (x >= 6 && x <= 9 && y >= 2 && y <= 4) {
        zoneType = 'commercial_tech';
        label = 'Blue Economy Lab';
      } else if (x <= 2 && y <= 2) {
        zoneType = 'renewable_energy';
        landmark = 'solar_microgrid';
        label = 'Tidal & Offshore Solar Hub';
      } else if (x >= 11 && y <= 2) {
        zoneType = 'circular_industry';
        label = 'Desalination & Water Plant';
      } else if (y >= 8 && y <= 10 && x >= 6 && x <= 9) {
        zoneType = 'residential_high';
        label = 'Stilt Eco-Towers';
      }

      cells.push({ x, y, zoneType, landmark, label });
    }
  }

  const stamp = (x: number, y: number, z: ZoneType, lm: string, lbl: string) => {
    const idx = cells.findIndex((c) => c.x === x && c.y === y);
    if (idx >= 0) {
      cells[idx] = { x, y, zoneType: z, landmark: lm, label: lbl };
    }
  };

  stamp(7, 7, 'transit_metro', 'central_intermodal', 'Aquatic Metro Terminal');
  stamp(4, 7, 'transit_hub', 'ferry_hub', 'Canal Ferry Interchange');
  stamp(3, 2, 'civic_healthcare', 'regional_hospital', 'Elevated Resilient Hospital');
  stamp(10, 2, 'civic_education', 'community_school', 'Marine Polytechnic Academy');
  stamp(8, 2, 'civic_college', 'ocean_uni', 'Oceanic Science University');
  stamp(5, 3, 'civic_court', 'civic_hall', 'Maritime Justice Hall');
  stamp(9, 6, 'civic_stadium', 'aquatics', 'Olympic Aquatics Stadium');
  stamp(13, 11, 'civic_airport', 'seaplane', 'Coastal Skyport & eVTOL');

  const kpis = calculateCityMetrics(cells, size);

  return {
    cityName: 'Aquaria Sponge Metropolis',
    visionStatement: 'Engineered as a living sponge to capture, store, and purify 100-year storm surges through interconnected wetlands, tidal canals, and permeable civic plazas while producing clean renewable energy.',
    gridSize: size,
    cells,
    kpis,
    keyInnovations: [
      {
        title: 'Tiered Storm Retention Basins',
        description: 'Subterranean detention vaults beneath permeable public plazas absorb 250mm/hr cloudbursts without surface inundation.',
        sector: 'Flood Engineering',
      },
      {
        title: 'Integrated Marine Heat Pumps & Water Reclamation',
        description: 'Tidal canals double as district cooling thermal sinks, cutting air conditioning energy requirements by 42%.',
        sector: 'Circular Energy & Water',
      },
      {
        title: 'Elevated Autonomous Skytram Network',
        description: 'Transit lines sit on resilient pylons above flood lines, ensuring 100% emergency service mobility during extreme storms.',
        sector: 'Resilient Mobility',
      },
    ],
    zoningRegulations: [
      { code: 'ORD-SPONGE-01', rule: '100% of non-permeable surface runoff must be retained on-site via rain gardens or retention tanks.', rationale: 'Prevents storm drain overloads.' },
      { code: 'ORD-BLUE-02', rule: 'Mandatory 50m green setback along all tidal and canal waterfronts for public park access.', rationale: 'Guarantees universal public access to cooling shorelines.' },
    ],
  };
}

// 4. Solar-Hydrogen Tech Oasis (Masdar & Copenhagen)
function createSolarOasisCity(): CityPlan {
  const size = 14;
  const cells: GridCell[] = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let zoneType: ZoneType = 'residential_medium';
      let landmark: string | undefined = undefined;
      let label: string | undefined = undefined;

      // Outer solar-hydrogen generation perimeter
      if (y === 0 || y === 13 || x === 0 || x === 13) {
        zoneType = 'renewable_energy';
        label = 'Solar PV & Hydrogen Ring';
      }
      // Central high-tech spine
      else if (x >= 5 && x <= 8 && y >= 5 && y <= 8) {
        zoneType = 'commercial_tech';
        label = 'CleanTech Innovation Hub';
      } else if ((x === 4 || x === 9) && (y === 3 || y === 10)) {
        zoneType = 'green_park';
        label = 'Shaded Micro-Canopy Oasis';
      } else if (x >= 4 && x <= 9 && (y === 2 || y === 11)) {
        zoneType = 'residential_high';
        label = 'Passive Solar Arcology';
      } else if (x >= 11 && y >= 10) {
        zoneType = 'circular_industry';
        label = 'Circular Zero-Waste Fab';
      }

      cells.push({ x, y, zoneType, landmark, label });
    }
  }

  const stamp = (x: number, y: number, z: ZoneType, lm: string, lbl: string) => {
    const idx = cells.findIndex((c) => c.x === x && c.y === y);
    if (idx >= 0) {
      cells[idx] = { x, y, zoneType: z, landmark: lm, label: lbl };
    }
  };

  stamp(6, 4, 'transit_metro', 'central_intermodal', 'Pneumatic Maglev Nexus');
  stamp(7, 9, 'transit_hub', 'pod_station', 'South Pod Station');
  stamp(3, 6, 'civic_healthcare', 'hospital', 'Smart Diagnostics Hospital');
  stamp(10, 6, 'civic_education', 'school', 'STEM Academy');
  stamp(5, 7, 'civic_college', 'materials_lab', 'Clean Energy University');
  stamp(8, 7, 'civic_court', 'governance', 'Desert Governance Hall');
  stamp(6, 8, 'civic_stadium', 'arena', 'Solar Shaded Arena');
  stamp(12, 1, 'civic_airport', 'skyport', 'Aero Logistics Vertiport');

  const kpis = calculateCityMetrics(cells, size);

  return {
    cityName: 'Helios Carbon-Negative Oasis',
    visionStatement: 'A world-leading clean technology oasis designed with zero fossil fuels, self-shading pedestrian wind corridors, and continuous hydrogen battery microgrids powering 100% of municipal transit and life support.',
    gridSize: size,
    cells,
    kpis,
    keyInnovations: [
      {
        title: 'Aerodynamic Canyon Microclimate Cooling',
        description: 'Oriented street corridors funnel desert breezes through moist botanical mist towers, achieving a 4.1°C temperature drop.',
        sector: 'Passive Architecture',
      },
      {
        title: 'District Hydrogen Microgrid & Thermal Storage',
        description: 'Excess daytime agrivoltaic electricity splits greywater into green hydrogen, providing 24/7 baseload power.',
        sector: 'Net-Zero Energy',
      },
      {
        title: 'Subterranean Autonomous Freight Pods',
        description: 'All commercial deliveries and solid waste logistics travel in automated underground pneumatic tubes, keeping streets 100% car-free.',
        sector: 'Smart Logistics',
      },
    ],
    zoningRegulations: [
      { code: 'ORD-NETZERO-01', rule: 'Every structure must achieve net-positive annual energy generation via integrated photovoltaic glass.', rationale: 'Accelerates decarbonization.' },
      { code: 'ORD-SHADE-02', rule: 'Continuous covered pedestrian colonnades required along all commercial street frontages.', rationale: 'Enables comfortable all-day walking in hot climates.' },
    ],
  };
}

export const PRESET_MASTERPLANS = [
  { id: 'biophilic', name: 'Biophilic Metropole (Curitiba / Singapore)', plan: createBiophilicCity() },
  { id: 'superblocks', name: '15-Minute Superblocks (Barcelona / Paris)', plan: createSuperblocksCity() },
  { id: 'sponge', name: 'Coastal Sponge City (Copenhagen / Shenzhen)', plan: createSpongeCity() },
  { id: 'solar', name: 'Solar-Hydrogen Oasis (Masdar / NEOM)', plan: createSolarOasisCity() },
];
