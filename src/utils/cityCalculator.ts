import { CityMetrics, GridCell, ZoneType } from '../types/city';
import { ZONE_DEFINITIONS } from './zoneDefinitions';

export function calculateCityMetrics(cells: GridCell[], gridSize = 14): CityMetrics {
  const totalCells = cells.length || gridSize * gridSize;
  if (totalCells === 0) {
    return {
      walkability15MinScore: 0,
      carbonNeutralityPct: 0,
      greenCanopyPct: 0,
      transitAccessibilityPct: 0,
      coolingDeltaCelsius: 0,
      economicProductivityIndex: 0,
      waterRecyclingPct: 0,
      totalPopulation: 0,
      unservedResidentialPct: 0,
    };
  }

  // Find coordinates of critical civic assets
  const healthcareCells: [number, number][] = [];
  const educationCells: [number, number][] = [];
  const transitCells: [number, number][] = [];
  const greenParkCells: [number, number][] = [];
  const residentialCells: [number, number][] = [];
  const commercialCells: [number, number][] = [];
  const renewableCells: [number, number][] = [];
  const waterWetlandCells: [number, number][] = [];
  const circularFabCells: [number, number][] = [];

  let totalPopulation = 0;
  let grossCarbonEmission = 0;
  let grossCarbonAbsorption = 0;

  for (const cell of cells) {
    const def = ZONE_DEFINITIONS[cell.zoneType];
    if (def) {
      totalPopulation += def.density;
      if (def.carbonDelta > 0) {
        grossCarbonEmission += def.carbonDelta;
      } else {
        grossCarbonAbsorption += Math.abs(def.carbonDelta);
      }
    }

    if (cell.zoneType === 'civic_healthcare') healthcareCells.push([cell.x, cell.y]);
    else if (cell.zoneType === 'civic_education' || cell.zoneType === 'civic_college') educationCells.push([cell.x, cell.y]);
    else if (cell.zoneType === 'transit_hub' || cell.zoneType === 'transit_metro' || cell.zoneType === 'civic_airport') transitCells.push([cell.x, cell.y]);
    else if (cell.zoneType === 'green_park' || cell.zoneType === 'civic_stadium') greenParkCells.push([cell.x, cell.y]);
    else if (cell.zoneType === 'residential_high' || cell.zoneType === 'residential_medium') residentialCells.push([cell.x, cell.y]);
    else if (cell.zoneType === 'commercial_tech' || cell.zoneType === 'civic_court') commercialCells.push([cell.x, cell.y]);
    else if (cell.zoneType === 'renewable_energy') renewableCells.push([cell.x, cell.y]);
    else if (cell.zoneType === 'sponge_wetland' || cell.zoneType === 'blue_infrastructure') waterWetlandCells.push([cell.x, cell.y]);
    else if (cell.zoneType === 'circular_industry') circularFabCells.push([cell.x, cell.y]);
  }

  // 15-Minute City calculation for each residential cell:
  // Must be within threshold distance (3.5 grid units ~ 10-15 min stroll / e-bike) of:
  // 1. Healthcare
  // 2. Education
  // 3. Transit Hub
  // 4. Green Park
  const MAX_15MIN_RADIUS = 3.6;

  function minDistance(origin: [number, number], targets: [number, number][]): number {
    if (targets.length === 0) return 999;
    let min = Infinity;
    for (const t of targets) {
      const dx = origin[0] - t[0];
      const dy = origin[1] - t[1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < min) min = dist;
    }
    return min;
  }

  let fullyServedResidentialCount = 0;
  let transitServedResidentialCount = 0;
  let unservedResidentialCount = 0;

  if (residentialCells.length > 0) {
    for (const resCoord of residentialCells) {
      const distHealth = minDistance(resCoord, healthcareCells);
      const distEdu = minDistance(resCoord, educationCells);
      const distTransit = minDistance(resCoord, transitCells);
      const distGreen = minDistance(resCoord, greenParkCells);

      if (distTransit <= MAX_15MIN_RADIUS) {
        transitServedResidentialCount++;
      }

      const is15MinCompliant =
        distHealth <= MAX_15MIN_RADIUS &&
        distEdu <= MAX_15MIN_RADIUS &&
        distTransit <= MAX_15MIN_RADIUS &&
        distGreen <= MAX_15MIN_RADIUS;

      if (is15MinCompliant) {
        fullyServedResidentialCount++;
      }

      // If missing healthcare or education beyond 5 cells, marked unserved
      if (distHealth > 5 || distEdu > 5 || distTransit > 5) {
        unservedResidentialCount++;
      }
    }
  }

  const walkability15MinScore = residentialCells.length > 0
    ? Math.round((fullyServedResidentialCount / residentialCells.length) * 100)
    : 0;

  const transitAccessibilityPct = residentialCells.length > 0
    ? Math.round((transitServedResidentialCount / residentialCells.length) * 100)
    : 0;

  const unservedResidentialPct = residentialCells.length > 0
    ? Math.round((unservedResidentialCount / residentialCells.length) * 100)
    : 0;

  // Green canopy percentage
  const pureGreenCells = greenParkCells.length;
  const wetlandCells = waterWetlandCells.length;
  const greenCanopyPct = Math.min(100, Math.round(((pureGreenCells * 1.0 + wetlandCells * 0.7 + residentialCells.length * 0.25) / totalCells) * 100));

  // Carbon neutrality
  const carbonRatio = grossCarbonEmission > 0 ? (grossCarbonAbsorption / grossCarbonEmission) : 1;
  const carbonNeutralityPct = Math.min(100, Math.round(carbonRatio * 85));

  // Cooling delta in Celsius: up to -4.5°C with high canopy and water networks
  const baseCooling = (greenCanopyPct / 100) * 2.8;
  const waterCooling = Math.min(1.6, (waterWetlandCells.length / totalCells) * 10);
  const coolingDeltaCelsius = Math.min(4.8, Number((baseCooling + waterCooling).toFixed(1)));

  // Economic productivity index
  const jobBase = commercialCells.length * 3 + circularFabCells.length * 2 + renewableCells.length;
  const housingBase = residentialCells.length;
  const jobHousingBalance = housingBase > 0 ? Math.min(1, jobBase / (housingBase * 1.2)) : 0.5;
  const economicProductivityIndex = Math.min(99, Math.round(jobHousingBalance * 70 + (transitAccessibilityPct * 0.3)));

  // Water recycling percentage: sponge wetlands and circular fab infrastructure
  const waterRecyclingPct = Math.min(98, Math.round(
    (waterWetlandCells.length * 3.5 + circularFabCells.length * 6) + 35
  ));

  return {
    walkability15MinScore,
    carbonNeutralityPct,
    greenCanopyPct,
    transitAccessibilityPct,
    coolingDeltaCelsius,
    economicProductivityIndex,
    waterRecyclingPct,
    totalPopulation,
    unservedResidentialPct,
  };
}
