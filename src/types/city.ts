export type ZoneType =
  | 'residential_high'
  | 'residential_medium'
  | 'commercial_tech'
  | 'green_park'
  | 'blue_infrastructure'
  | 'sponge_wetland'
  | 'civic_healthcare'
  | 'civic_education'
  | 'civic_college'
  | 'civic_court'
  | 'civic_airport'
  | 'civic_stadium'
  | 'transit_hub'
  | 'transit_metro'
  | 'renewable_energy'
  | 'circular_industry';

export interface GridCell {
  x: number;
  y: number;
  zoneType: ZoneType;
  landmark?: string;
  label?: string;
}

export interface CityMetrics {
  walkability15MinScore: number; // 0 - 100
  carbonNeutralityPct: number; // 0 - 100
  greenCanopyPct: number; // 0 - 100
  transitAccessibilityPct: number; // 0 - 100
  coolingDeltaCelsius: number; // e.g. 3.4
  economicProductivityIndex: number; // 0 - 100
  waterRecyclingPct: number; // 0 - 100
  totalPopulation: number;
  unservedResidentialPct: number;
}

export interface ZoneDefinition {
  id: ZoneType;
  name: string;
  category: 'Housing' | 'Economy' | 'Nature' | 'Civic' | 'Energy';
  color: string;
  borderColor: string;
  description: string;
  density: number; // people per cell
  carbonDelta: number; // negative = absorbs CO2, positive = emits
  coolingEffect: number; // degrees Celsius
  iconName: string;
}

export interface KeyInnovation {
  title: string;
  description: string;
  sector: string;
}

export interface ZoningRegulation {
  code: string;
  rule: string;
  rationale: string;
}

export interface CityPlan {
  cityName: string;
  visionStatement: string;
  gridSize: number;
  cells: GridCell[];
  kpis: CityMetrics;
  keyInnovations: KeyInnovation[];
  zoningRegulations: ZoningRegulation[];
}

export interface AuditBottleneck {
  severity: 'critical' | 'moderate' | 'minor';
  title: string;
  locationHint?: string;
  description: string;
}

export interface AuditRecommendation {
  title: string;
  actionType: 'add_zone' | 'add_transit' | 'buffer_green';
  targetCoords?: [number, number];
  proposedZone?: ZoneType;
  estimatedImpact: string;
}

export interface AuditReport {
  overallHealthScore: number;
  executiveSummary: string;
  identifiedBottlenecks: AuditBottleneck[];
  recommendations: AuditRecommendation[];
}

export interface FailureCascadeEvent {
  timeHour: number;
  event: string;
  sector: string;
}

export interface StressTestReport {
  resilienceRating: number;
  scenarioTitle: string;
  failureCascade: FailureCascadeEvent[];
  sectorDamages: {
    mobility: number;
    healthcare: number;
    energy: number;
    waterEnvironment: number;
  };
  postDisasterRecoveryPlan: string[];
  keyStrengths: string[];
}
