import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, ArrowRight, ShieldCheck, Footprints, Leaf, Zap, 
  Droplets, Train, Users, CheckCircle2, ChevronDown, ChevronUp, 
  Play, Building2, Globe, BarChart3, Layers, Star, DollarSign
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SafeImage } from './SafeImage';

interface LandingPageProps {
  onLaunchApp: () => void;
  onOpenArchetype: (presetId: string) => void;
  onOpenCustomizer?: () => void;
  onOpenGallery?: () => void;
  onOpenHelpline?: () => void;
  onOpenFeedback?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchApp,
  onOpenArchetype,
  onOpenCustomizer,
  onOpenGallery,
  onOpenHelpline,
  onOpenFeedback,
}) => {
  const { accentConfig } = useTheme();
  const [calculatorPop, setCalculatorPop] = useState(250000);
  const [billingPeriod, setBillingPeriod] = useState<'annual' | 'monthly'>('annual');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Pricing calculations
  // Base monthly rate $0.025 per citizen, annual discount 20%
  const baseMonthlyPrice = Math.round(calculatorPop * 0.024);
  const calculatedPrice = billingPeriod === 'annual'
    ? Math.round(baseMonthlyPrice * 0.8)
    : baseMonthlyPrice;

  // Impact calculations
  const co2Offset = Math.round(calculatorPop * 0.58);
  const vehicleTripsSaved = Math.round(calculatorPop * 0.34);
  const healthcareCoverage = Math.min(100, Math.round(92 + (calculatorPop / 500000) * 6));
  const estimatedCapexSaved = (calculatorPop * 0.0012).toFixed(1);

  // Cursor spotlight handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const testimonials = [
    {
      name: 'Dr. Helene Aris',
      role: 'Director of Urban Futures, Copenhagen Institute',
      avatar: 'https://i.pravatar.cc/150?img=47',
      stars: 5,
      quote: 'UrbanMind AI cut our 15-minute accessibility audit cycle from four months of manual GIS analysis to four seconds. The microclimate heat sink simulations were instrumental in passing our 2030 climate ordinance.',
    },
    {
      name: 'Kenji Takahashi',
      role: 'Chief Infrastructure Architect, Neo-Tokyo Mobility',
      avatar: 'https://i.pravatar.cc/150?img=12',
      stars: 5,
      quote: 'The autonomous transit loop simulations and 100-year cloudburst stress-testing saved our municipal council an estimated $420M in avoided drainage retrofits.',
    },
    {
      name: 'Amara Diop',
      role: 'Senior Advisor, UN-Habitat Sustainable Cities',
      avatar: 'https://i.pravatar.cc/150?img=32',
      stars: 5,
      quote: 'Finally, an urban planning platform that treats social equity, healthcare proximity, and clean energy microgrids as interconnected living organisms rather than isolated siloed spreadsheets.',
    },
  ];

  const faqs = [
    {
      q: 'How does UrbanMind AI enforce the 15-Minute City standard?',
      a: 'The engine calculates continuous spatial Euclidean and isochrone distances from every residential parcel to essential public assets: primary healthcare polyclinics, K-12 education, rapid transit hubs, and biophilic green parks. Any residential parcel requiring more than an 800m stroll or 5-minute e-bike ride is flagged with coordinate-specific remediation interventions.',
    },
    {
      q: 'How does the digital twin model microclimate and heat islands?',
      a: 'Our microclimate simulator couples high-density biophilic vertical forestry with blue-green sponge canals. Living tree canopies and evaporative waterways act as thermal sinks, cooling ambient street temperatures by 2.8°C to 4.2°C compared to conventional asphalt city blocks.',
    },
    {
      q: 'Can real municipal data and local geographic GIS maps be imported and exported?',
      a: 'Yes. Planners can export and import complete geo-spatial zoning grids as GeoJSON or structured JSON datasets, run Gemini-driven compliance audits, and test 100-year cloudburst and peak heat dome stresses.',
    },
    {
      q: 'How does the Autonomous Masterplanner leverage Google Gemini?',
      a: 'Gemini processes population targets, climate biomes, and civic policy goals to synthesize optimal parcel allocations, draft official municipal zoning codes, and recommend real-time systemic mitigation playbooks during infrastructure stress testing.',
    },
  ];

  const partners = [
    'UN-Habitat Urban Agenda',
    'World Urban Forum',
    'Copenhagen Climate Council',
    'Barcelona Superblock Alliance',
    'Curitiba Sustainable Mobility',
    'Masdar Clean Energy Hub',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-white">
      {/* Dynamic Ambient Background Aurora */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-cyan-500/15 via-indigo-500/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-2/3 -right-40 w-[600px] h-[600px] bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
      </div>

      {/* Floating Sticky Top Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-6 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight text-white">UrbanMind AI</span>
            <span className="text-xs font-mono text-cyan-400">· Digital Twin Studio</span>
          </div>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Innovations</a>
            <a href="#twin-preview" className="hover:text-white transition-colors">Digital Twin</a>
            <a href="#calculator" className="hover:text-white transition-colors">Pricing & ROI</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-white transition-colors">Architecture FAQ</a>
            {onOpenGallery && (
              <button
                onClick={onOpenGallery}
                className="hover:text-cyan-400 text-slate-300 transition-colors"
              >
                100+ Visuals
              </button>
            )}
            {onOpenHelpline && (
              <button
                onClick={onOpenHelpline}
                className="hover:text-cyan-400 text-slate-300 transition-colors"
              >
                24/7 Helplines
              </button>
            )}
          </nav>

          {/* Launch CTA */}
          <div className="flex items-center gap-2.5">
            {onOpenCustomizer && (
              <button
                onClick={onOpenCustomizer}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 hover:bg-cyan-900/80 rounded-xl transition-all"
              >
                <span>Custom City Builder</span>
              </button>
            )}
            <button
              onClick={onLaunchApp}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-6 max-w-7xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs text-slate-300 shadow-inner"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Generative Urban Planning & Living City Digital Twin powered by Gemini</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.08] text-balance"
        >
          Build Cities Where Every Citizen Thrives in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">15 Minutes</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          An autonomous digital twin platform that simulates decarbonized transit, universal healthcare access, biophilic cooling corridors, and sponge flood defenses.
        </motion.p>

        {/* Primary CTA Cluster */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <button
            onClick={onLaunchApp}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all shadow-xl shadow-cyan-500/25 active:scale-95"
          >
            <span>Enter Interactive Digital Twin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onOpenArchetype('biophilic')}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current text-cyan-400" />
            <span>Load Biophilic Archetype</span>
          </button>
        </motion.div>

        {/* Hero Interactive Media Showcase */}
        <motion.div
          id="twin-preview"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-10 max-w-5xl mx-auto"
        >
          <div 
            onClick={onLaunchApp}
            className="group relative rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-900 shadow-2xl cursor-pointer hover:border-slate-700 transition-all"
          >
            <SafeImage
              src="/src/assets/images/hero_biophilic_city_1791958981307.jpg"
              alt="Live Digital Twin Masterplan"
              className="w-full h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Veridia Digital Twin Active · 14×14 Parcels</span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
              <div className="text-left">
                <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider">
                  Featured Masterplan
                </span>
                <h3 className="text-xl font-bold text-white">Veridia Biophilic Metropole</h3>
                <p className="text-xs text-slate-300 max-w-lg mt-0.5">
                  Radial biophilic cooling fingers funnel cool river breezes through residential blocks, dropping summer temperatures by 3.4°C.
                </p>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-semibold text-xs shadow-lg group-hover:bg-cyan-300 transition-colors">
                <span>Explore in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Social Proof Marquee */}
      <section className="py-12 border-y border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-mono uppercase tracking-wider text-slate-500 mb-6">
            Aligned with global urban research frameworks & sustainable city councils
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 text-xs font-semibold text-slate-400">
            {partners.map((p) => (
              <span key={p} className="hover:text-cyan-400 transition-colors">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Feature Showcase */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Architectural Pillars
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineering the Living City of Tomorrow
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Every feature resolves a concrete systemic urban breakdown—from pedestrian isolation to flash flooding and heat island grid strain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Card 1: 15-Minute City */}
          <div
            onMouseMove={handleMouseMove}
            className="spotlight-card md:col-span-2 p-8 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Footprints className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Universal 15-Minute Polycentric Cells</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
                Eliminate car-dependency by ensuring every residence sits within 400m of community polyclinics, K-12 learning hubs, daily fresh groceries, and autonomous electric shuttle hubs.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 font-mono text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Pedestrian Access</span>
                <span className="text-lg font-bold text-emerald-400">98% Reach</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Traffic Fatalities</span>
                <span className="text-lg font-bold text-white">0 Vision Zero</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Daily Active Trips</span>
                <span className="text-lg font-bold text-cyan-300">84% Transit/Walk</span>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Sponge City Infiltration */}
          <div
            onMouseMove={handleMouseMove}
            className="spotlight-card p-8 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Sponge City Flood Resilience</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Permeable plazas and subterranean detention vaults buffer 100-year cloudburst surges without road inundation.
              </p>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800 h-32">
              <SafeImage
                src="/src/assets/images/sponge_city_concept_1791958981199.jpg"
                alt="Sponge City"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Bento Card 3: Decarbonized Microgrid */}
          <div
            onMouseMove={handleMouseMove}
            className="spotlight-card p-8 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Net-Zero Hydrogen Microgrid</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Agrivoltaic perimeter solar arrays paired with solid-state green hydrogen batteries deliver continuous 24/7 power.
              </p>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800 h-32">
              <SafeImage
                src="/src/assets/images/smart_grid_hub_1791958981260.jpg"
                alt="Clean Energy Microgrid"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Bento Card 4: Biophilic Cooling Canals */}
          <div
            onMouseMove={handleMouseMove}
            className="spotlight-card md:col-span-2 p-8 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Biophilic Cooling Corridors & Heat Island Sink</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
                Continuous linear forest fingers funnel cool breezes across superblocks, dropping surface heat by -3.4°C and removing 14,200 tons of carbon annually.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 font-mono text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Microclimate Drop</span>
                <span className="text-lg font-bold text-cyan-300">-3.4°C Cool</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Canopy Coverage</span>
                <span className="text-lg font-bold text-emerald-400">42% Citywide</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Greywater Recycle</span>
                <span className="text-lg font-bold text-teal-300">94% Closed-Loop</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Pricing & ROI Calculator */}
      <section id="calculator" className="py-20 px-6 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Municipal Deployment Pricing & ROI
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Transparent Municipal Licensing
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Calculate software platform subscription and projected capital savings based on citizen population.
            </p>

            {/* Monthly / Annual Toggle with 20% discount */}
            <div className="inline-flex items-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl mt-3">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  billingPeriod === 'monthly' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  billingPeriod === 'annual' ? 'bg-cyan-400 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-900 text-cyan-300 text-[10px] font-mono">
                  -20%
                </span>
              </button>
            </div>
          </div>

          <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl space-y-8 shadow-2xl">
            {/* Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-semibold text-slate-300">
                  Target Citizen Population:
                </label>
                <span className="text-xl font-bold font-mono tabular-nums text-cyan-400">
                  {calculatorPop.toLocaleString()} citizens
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="500000"
                step="10000"
                value={calculatorPop}
                onChange={(e) => setCalculatorPop(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>50k (Eco-Town)</span>
                <span>250k (Polycentric Metropole)</span>
                <span>500k (High-Density Arcology)</span>
              </div>
            </div>

            {/* Dynamic Calculated Price Display */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Municipal Platform Subscription:</span>
                <div className="text-2xl font-bold font-mono text-white">
                  ${calculatedPrice.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-slate-400">/ month</span>
                </div>
              </div>
              <div className="text-right font-mono text-xs text-emerald-400">
                ROI Multiplier: ~14.8x CapEx Savings
              </div>
            </div>

            {/* Computed Impact Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Annual CO₂ Offset</span>
                <span className="text-xl font-bold font-mono tabular-nums text-cyan-300 mt-1 block">
                  {co2Offset.toLocaleString()} t
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Cars Off Road</span>
                <span className="text-xl font-bold font-mono tabular-nums text-emerald-400 mt-1 block">
                  {vehicleTripsSaved.toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">15-Min Reach</span>
                <span className="text-xl font-bold font-mono tabular-nums text-white mt-1 block">
                  {healthcareCoverage}%
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Est. CapEx Saved</span>
                <span className="text-xl font-bold font-mono tabular-nums text-amber-300 mt-1 block">
                  ${estimatedCapexSaved}B
                </span>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={onLaunchApp}
                className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs rounded-xl shadow-lg transition-all active:scale-95"
              >
                Launch Studio & Simulate this Scale
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Social Proof & Endorsements
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Trusted by World-Leading Urban Planners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <SafeImage
                  src={t.avatar}
                  alt={t.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700"
                />
                <div>
                  <div className="font-semibold text-white text-xs">{t.name}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Planned City Science & Technical Invariants
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-800 rounded-2xl bg-slate-900/60 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-cyan-400" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-500" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800 text-xs text-slate-400 bg-slate-950/80">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800/80">
            {/* Brand & Wishing */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <span>UrbanMind AI</span>
                <span className="text-cyan-400 font-mono text-xs">· Studio</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Autonomous planned city generator & living digital twin simulator. Empowering planners to craft carbon-neutral 15-minute communities.
              </p>
              <p className="text-[11px] text-emerald-400 font-medium">
                🌿 Wishing you safety, inspiration, and flourishing health in your city.
              </p>
            </div>

            {/* Helpline Numbers */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-400">
                24/7 Customer Helplines
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-400 font-mono">
                <li><span className="text-slate-300">Toll-Free (US):</span> +1 (800) 555-URBAN</li>
                <li><span className="text-slate-300">Emergency Ops:</span> +1 (888) 724-HELP</li>
                <li><span className="text-slate-300">Europe Desk:</span> +44 20 7946 0991</li>
                <li><span className="text-slate-300">Asia-Pac Desk:</span> +65 6789 0123</li>
              </ul>
              {onOpenHelpline && (
                <button
                  onClick={onOpenHelpline}
                  className="text-[11px] text-cyan-400 hover:underline pt-1 block"
                >
                  View All Regional Helplines →
                </button>
              )}
            </div>

            {/* Contact Emails & Feedback */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-400">
                Official Support Emails
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-400 font-mono">
                <li><a href="mailto:planning@urbanmind.ai" className="hover:text-cyan-300">planning@urbanmind.ai</a></li>
                <li><a href="mailto:support@urbanmind.ai" className="hover:text-cyan-300">support@urbanmind.ai</a></li>
                <li><a href="mailto:civic-partners@urbanmind.ai" className="hover:text-cyan-300">civic-partners@urbanmind.ai</a></li>
              </ul>
              {onOpenFeedback && (
                <button
                  onClick={onOpenFeedback}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] transition-colors"
                >
                  <span>Submit Client Review</span>
                </button>
              )}
            </div>

            {/* Global Offices */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-400">
                Global Headquarters
              </h4>
              <p className="text-[11px] text-slate-400 leading-snug font-mono">
                100 Innovation Promenade, Suite 4000<br />
                San Francisco, CA 94105, USA<br />
                <span className="text-slate-500">Regional centers: Copenhagen · Singapore</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 UrbanMind AI Technologies Inc. All rights reserved.
            </div>
            <div>
              Empowered by Google Gemini 2.5/Flash & UN-Habitat 15-Minute Urban Invariants
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
