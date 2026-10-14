export type ProjectStatus = 'Planning' | 'Simulation' | 'Groundbreaking' | 'Construction' | 'Operational';

export type ProjectCategory = 'Mobility' | 'Healthcare' | 'Energy' | 'Biophilic' | 'Housing' | 'Circular';

export interface ProjectKPI {
  metric: string;
  value: string;
  trend: string;
  positive: boolean;
}

export interface ProjectActivity {
  id: string;
  time: string;
  user: string;
  action: string;
}

export interface DistrictProject {
  id: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  leadArchitect: {
    name: string;
    role: string;
    avatar: string;
  };
  targetPopulation: number;
  budget: string;
  walkabilityScore: number;
  carbonOffsetTons: number;
  completionPct: number;
  image: string;
  tags: string[];
  lastUpdated: string;
  description: string;
  kpis: ProjectKPI[];
  activityLog: ProjectActivity[];
  coordinates?: [number, number];
  isFavorite?: boolean;
}
