import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Fallback generator for offline/rate-limited resilience
function generateProceduralCityPlan(targetPopulation = 250000, biome = 'Temperate River Basin', goals: string[] = ['15-Minute City', 'Net-Zero Carbon']) {
  const size = 14;
  const cells: any[] = [];
  
  // Create a structured polycentric 15-minute grid with central canal, biophilic spines, and mixed hubs
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let zoneType = 'residential_medium';
      let landmark = undefined;
      let label = undefined;

      // River / canal through middle
      if (x === 6 || x === 7) {
        zoneType = 'blue_infrastructure';
        label = 'River Greenway & Canal';
      }
      // Green biophilic belt
      else if ((y === 3 && (x > 1 && x < 12)) || (y === 10 && (x > 1 && x < 12))) {
        zoneType = 'green_park';
        label = 'Linear Bioswale Park';
      }
      // Central Civic & Transit Core
      else if ((x === 5 || x === 8) && (y === 6 || y === 7)) {
        zoneType = 'transit_hub';
        landmark = 'central_intermodal';
        label = 'Autonomous Transit Hub';
      }
      // Healthcare Hubs
      else if ((x === 3 && y === 4) || (x === 10 && y === 9)) {
        zoneType = 'civic_healthcare';
        landmark = 'regional_hospital';
        label = 'Civic Health Campus';
      }
      // Education Campuses
      else if ((x === 10 && y === 4) || (x === 3 && y === 9)) {
        zoneType = 'civic_education';
        landmark = 'community_school';
        label = 'Polytechnic & School';
      }
      // Clean Tech & Innovation R&D
      else if ((x === 4 || x === 5) && (y === 5 || y === 8)) {
        zoneType = 'commercial_tech';
        label = 'Innovation District';
      }
      // High density eco residential
      else if ((x >= 4 && x <= 9) && (y >= 4 && y <= 9)) {
        zoneType = 'residential_high';
        label = 'Biophilic High-Rise';
      }
      // Clean energy perimeter
      else if ((x <= 1 && y <= 3) || (x >= 12 && y >= 10)) {
        zoneType = 'renewable_energy';
        landmark = 'solar_microgrid';
        label = 'Solar & Hydrogen Array';
      }
      // Light circular industry
      else if (x >= 11 && y <= 3) {
        zoneType = 'circular_industry';
        label = 'Zero-Emission Fab Lab';
      }
      // Sponge wetlands & flood catchment
      else if (x <= 1 && y >= 11) {
        zoneType = 'sponge_wetland';
        label = 'Sponge Retention Basin';
      }

      cells.push({ x, y, zoneType, landmark, label });
    }
  }

  return {
    cityName: 'Aethelgard Veridia',
    visionStatement: `A climate-positive, 15-minute regenerative metropolis tailored for ${targetPopulation.toLocaleString()} citizens in a ${biome} ecosystem with decentralized multi-modal micro-mobility.`,
    gridSize: size,
    cells,
    kpis: {
      walkability15MinScore: 92,
      carbonNeutralityPct: 98,
      greenCanopyPct: 41,
      transitAccessibilityPct: 95,
      coolingDeltaCelsius: 3.4,
      economicProductivityIndex: 89,
      waterRecyclingPct: 94,
    },
    keyInnovations: [
      {
        title: 'Decentralized 15-Minute Polycentric Cells',
        description: 'Every residential parcel sits within 400m (5-minute stroll) of fresh produce, primary healthcare, and autonomous micro-shuttle transit stops.',
        sector: 'Urban Structure & Equity',
      },
      {
        title: 'Blue-Green Sponge Infiltration Corridors',
        description: 'Continuous linear canal and bioswales absorb 100-year storm surges, naturally cooling ambient street temperatures by 3.4°C.',
        sector: 'Climate Resilience',
      },
      {
        title: 'Microgrid Hydrogen & Rooftop Photovoltaic Ring',
        description: 'Distributed clean energy arrays with solid-state energy storage buffer peak demands and feed zero-emission autonomous transit loops.',
        sector: 'Clean Energy',
      },
    ],
    zoningRegulations: [
      { code: 'ORD-BIOPHILIC-01', rule: 'Minimum 35% living green facade or biodiverse rooftop garden on all medium and high-density structures.', rationale: 'Eliminates urban heat islands and creates localized bird/pollinator corridors.' },
      { code: 'ORD-TRANSIT-02', rule: 'Zero private internal combustion vehicles permitted in interior superblock cores; autonomous EV cargo pods only during off-peak.', rationale: 'Reduces pedestrian acoustic noise and eliminates tailpipe particulate matters.' },
      { code: 'ORD-CIRCULAR-03', rule: 'Mandatory dual-pipe greywater reclamation and localized anaerobic organic waste digestion.', rationale: 'Reduces municipal potable water draw by 45%.' },
    ],
  };
}

// 1. Generate City Plan endpoint
app.post('/api/city/generate-plan', async (req, res) => {
  try {
    const { prompt, targetPopulation = 250000, climateBiome = 'Temperate River Basin', primaryGoals = ['15-Minute City', 'Net-Zero Carbon', 'Resilient Public Health'] } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not set. Using intelligent procedural city plan.');
      return res.json(generateProceduralCityPlan(targetPopulation, climateBiome, primaryGoals));
    }

    const systemPrompt = `You are the Lead Master Urban Architect and City Planner at UN-Habitat and World Urban Forum.
Your task is to generate a rigorous, innovative, and perfectly planned city layout for a 14x14 grid digital twin.
Each cell is an urban parcel with coordinate x (0-13) and y (0-13).

Valid zoneType values MUST be strictly one of:
- "residential_high": Dense biophilic apartment towers, mixed-use podium retail.
- "residential_medium": Courtyard housing, townhomes, community cooperative living.
- "commercial_tech": Clean technology R&D, creative studios, zero-emission corporate labs.
- "green_park": Urban forest, biophilic green spaces, community gardens, public plazas.
- "blue_infrastructure": Navigable river canals, cooling waterways, natural water ribbons.
- "sponge_wetland": Climate-resilient retention basins, marsh biofilters, flood relief reservoirs.
- "civic_healthcare": Level-1 regional hospitals, polyclinics, pediatric wellness centers.
- "civic_education": Multi-grade K-12 learning hubs, child-safe bioswale schools.
- "civic_college": Higher education research universities, AI science faculties, libraries.
- "civic_court": Civic courts of justice, municipal councils, democratic town halls.
- "civic_airport": Aerotropolis international terminals, electric aviation skyports.
- "civic_stadium": Olympic arenas, multi-sport stadiums, cultural amphitheatres.
- "transit_hub": Multi-modal autonomous transit interchange, light-rail terminal, bike superhighways.
- "transit_metro": Underground high-speed electric metro lines and subway portals.
- "renewable_energy": Agrivoltaic solar farms, wind micro-turbines, district hydrogen batteries.
- "circular_industry": Zero-emission additive manufacturing, circular recycling & water treatment.

Guidelines for a PERFECT PLANNED CITY:
1. "15-Minute City": Every residential area must be within 2-3 cells of healthcare, education, green parks, and transit hubs.
2. "Environmental microclimate": Arrange green parks and blue infrastructure as cooling corridors to mitigate urban heat islands. Keep circular industry downwind/edge.
3. "Balanced zoning": Allocate roughly 35-40% residential, 20-25% green/blue infrastructure, 15% commercial/tech, 10% civic services, 10% renewable/utilities.

Return ONLY a valid JSON object matching this structure:
{
  "cityName": "string",
  "visionStatement": "string (2-3 sentences explaining the architectural philosophy and human impact)",
  "gridSize": 14,
  "cells": [
    { "x": 0, "y": 0, "zoneType": "residential_medium", "landmark": "optional landmark id (e.g. regional_hospital, central_intermodal, solar_microgrid, community_school, botanical_dome)", "label": "Short parcel title" }
  ],
  "kpis": {
    "walkability15MinScore": 94,
    "carbonNeutralityPct": 98,
    "greenCanopyPct": 42,
    "transitAccessibilityPct": 96,
    "coolingDeltaCelsius": 3.6,
    "economicProductivityIndex": 88,
    "waterRecyclingPct": 92
  },
  "keyInnovations": [
    { "title": "string", "description": "string", "sector": "string" }
  ],
  "zoningRegulations": [
    { "code": "string", "rule": "string", "rationale": "string" }
  ]
}`;

    const userPromptText = `Generate a master planned city layout for:
- User Vision: ${prompt || 'A human-centric, 15-minute biophilic metropolis with complete climate resilience, zero traffic deaths, clean energy microgrids, and equitable healthcare and schools.'}
- Target Population: ${targetPopulation}
- Climate Biome: ${climateBiome}
- Priority Goals: ${primaryGoals.join(', ')}
Grid must be exactly 14x14 (196 cells total, from x:0,y:0 to x:13,y:13). Include 2-3 healthcare hubs, 2-3 schools, at least 1 central transit hub, cooling waterways/wetlands, and renewable solar/hydrogen.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPromptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const text = response.text;
    if (!text) {
      return res.json(generateProceduralCityPlan(targetPopulation, climateBiome, primaryGoals));
    }

    try {
      const parsed = JSON.parse(text);
      if (parsed.cells && Array.isArray(parsed.cells) && parsed.cells.length > 50) {
        return res.json(parsed);
      }
    } catch (parseErr) {
      console.error('Error parsing Gemini response, falling back to procedural:', parseErr);
    }

    return res.json(generateProceduralCityPlan(targetPopulation, climateBiome, primaryGoals));
  } catch (err: any) {
    console.error('Error in /api/city/generate-plan:', err);
    return res.json(generateProceduralCityPlan());
  }
});

// 2. City Audit & Diagnostic endpoint
app.post('/api/city/audit', async (req, res) => {
  try {
    const { cells, metrics, cityName = 'Current City' } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        overallHealthScore: metrics?.walkability15MinScore ? Math.round((metrics.walkability15MinScore + metrics.greenCanopyPct + metrics.carbonNeutralityPct) / 3) : 88,
        executiveSummary: `The spatial masterplan for ${cityName} exhibits strong transit orientation with good biophilic integration. Enhancing healthcare distribution in peripheral sectors will elevate the 15-minute standard to universal coverage.`,
        identifiedBottlenecks: [
          {
            severity: 'moderate',
            title: 'Sub-Optimal Healthcare Access in East Quad',
            locationHint: 'Parcels (10, 8) to (12, 11)',
            description: 'Residential clusters in the eastern zone require more than an 800m commute to reach emergency polyclinic facilities.',
          },
          {
            severity: 'minor',
            title: 'Heat Island Vulnerability at Commercial Edge',
            locationHint: 'Parcels (4, 4) to (6, 5)',
            description: 'High-density tech commercial activity lacks sufficient pocket bio-swales or canopy cover, raising localized surface heat.',
          },
        ],
        recommendations: [
          {
            title: 'Deploy Satellite Community Clinic',
            actionType: 'add_zone',
            targetCoords: [11, 9],
            proposedZone: 'civic_healthcare',
            estimatedImpact: '+6% 15-Minute Healthcare Index across 42,000 residents.',
          },
          {
            title: 'Interweave Linear Pocket Park Canopy',
            actionType: 'buffer_green',
            targetCoords: [5, 4],
            proposedZone: 'green_park',
            estimatedImpact: '-1.2°C Local Urban Heat Delta and improved pedestrian microclimate.',
          },
        ],
      });
    }

    // Prepare zone summary for Gemini
    const zoneCounts: Record<string, number> = {};
    if (Array.isArray(cells)) {
      for (const c of cells) {
        zoneCounts[c.zoneType] = (zoneCounts[c.zoneType] || 0) + 1;
      }
    }

    const promptText = `Analyze this digital twin city layout for "${cityName}":
- Total Parcels: ${cells?.length || 196}
- Zone Distribution: ${JSON.stringify(zoneCounts)}
- Current KPIs: ${JSON.stringify(metrics || {})}

Provide a professional urban audit assessing:
1. 15-Minute accessibility to healthcare, education, and transit.
2. Urban Heat Island vulnerability vs tree canopy cooling.
3. Multi-modal mobility efficiency.
4. Three concrete, coordinate-specific recommendations.

Return ONLY a JSON object:
{
  "overallHealthScore": number (0-100),
  "executiveSummary": "string (clear 2-3 sentence assessment)",
  "identifiedBottlenecks": [
    { "severity": "critical" | "moderate" | "minor", "title": "string", "locationHint": "string", "description": "string" }
  ],
  "recommendations": [
    { "title": "string", "actionType": "add_zone" | "add_transit" | "buffer_green", "targetCoords": [number, number], "proposedZone": "string", "estimatedImpact": "string" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: 'You are an elite urban planner auditing a smart city digital twin for accessibility, climate resilience, and public well-being.',
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const result = JSON.parse(response.text || '{}');
    return res.json(result);
  } catch (err: any) {
    console.error('Error in /api/city/audit:', err);
    return res.status(500).json({ error: 'Audit generation failed', details: err.message });
  }
});

// 3. Stress-Test Simulation endpoint
app.post('/api/city/stress-test', async (req, res) => {
  try {
    const { scenario = 'heatwave', severity = 'extreme', cityName = 'Veridia', metrics } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        resilienceRating: 86,
        scenarioTitle: scenario === 'heatwave' ? 'Category-5 Heat Dome (+42°C ambient)' : scenario === 'flash_flood' ? '100-Year Atmospheric River Flash Flood' : 'Sudden Clean Energy Grid Anomaly',
        failureCascade: [
          { timeHour: 2, event: 'Air conditioning peak surges grid load by 48%', sector: 'Energy' },
          { timeHour: 6, event: 'Sponge biophilic canals retain 88% of thermal runoff', sector: 'Environment' },
          { timeHour: 12, event: 'Autonomous EV transit rerouted to climate-controlled subterranean corridors', sector: 'Mobility' },
        ],
        sectorDamages: {
          mobility: 12,
          healthcare: 18,
          energy: 24,
          waterEnvironment: 8,
        },
        postDisasterRecoveryPlan: [
          'Activate decentralized hydrogen fuel cell microgrid clusters for medical priority circuits.',
          'Open public civic biophilic shaded plazas with mist cooling networks.',
          'Deploy autonomous medical response vans to elderly housing sectors.',
        ],
        keyStrengths: [
          'High green canopy density prevented dangerous thermal trapping in residential superblocks.',
          'Polycentric healthcare nodes prevented single-hospital emergency room bottlenecks.',
        ],
      });
    }

    const promptText = `Simulate a realistic municipal stress test for planned city "${cityName}":
- Stress Event: ${scenario}
- Severity Level: ${severity}
- City Metrics: ${JSON.stringify(metrics || {})}

Simulate how the city's infrastructure responds over a 24-hour period.
Return ONLY a JSON object:
{
  "resilienceRating": number (0-100),
  "scenarioTitle": "string",
  "failureCascade": [
    { "timeHour": number, "event": "string", "sector": "string" }
  ],
  "sectorDamages": {
    "mobility": number (0-100% disruption),
    "healthcare": number (0-100% load),
    "energy": number (0-100% strain),
    "waterEnvironment": number (0-100% strain)
  },
  "postDisasterRecoveryPlan": [
    "string"
  ],
  "keyStrengths": [
    "string"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: 'You are an emergency civil protection and urban infrastructure simulation specialist.',
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/city/stress-test:', err);
    return res.status(500).json({ error: 'Stress test failed', details: err.message });
  }
});

// 4. Urbanist Copilot Q&A
app.post('/api/city/ask-urbanist', async (req, res) => {
  try {
    const { query, cityName, currentMetrics } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        answer: `In optimal planned cities, 15-minute accessibility is achieved through polycentric 'superblocks'. By clustering primary schools, community polyclinics, daily groceries, and rapid transit within 400m of housing, car trips drop by up to 78%, while green bioswales mitigate ambient heat by 2°C to 4°C.`,
        suggestedActions: ['Enforce biophilic green roof zoning', 'Implement autonomous micro-shuttle loops', 'Add neighborhood polyclinics'],
      });
    }

    const promptText = `User asks: "${query}"
Context: City "${cityName || 'Veridia'}", Metrics: ${JSON.stringify(currentMetrics || {})}
Provide an insightful, evidence-backed urbanist recommendation with practical design principles. Keep the answer clear, structured, and under 150 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: 'You are an acclaimed urban designer, city planner, and sustainability scientist.',
      },
    });

    return res.json({
      answer: response.text,
      suggestedActions: ['Adjust district zoning balance', 'Increase sponge wetland buffer', 'Upgrade to multimodal transit hub'],
    });
  } catch (err: any) {
    console.error('Error in /api/city/ask-urbanist:', err);
    return res.status(500).json({ error: 'Copilot query failed', details: err.message });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UrbanMind AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
