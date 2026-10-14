/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { CityPlan, GridCell, ZoneType } from './types/city';
import { DistrictProject, ProjectStatus } from './types/districtProject';
import { PRESET_MASTERPLANS } from './data/presetMasterplans';
import { INITIAL_DISTRICT_PROJECTS } from './data/districtProjects';
import { calculateCityMetrics } from './utils/cityCalculator';
import { ThemeProvider } from './context/ThemeContext';
import { TopBar, WorkspaceTab } from './components/TopBar';
import { MetricCockpit } from './components/MetricCockpit';
import { ZoningPalette } from './components/ZoningPalette';
import { CityCanvas, OverlayMode, ViewPerspective } from './components/CityCanvas';
import { WorkspaceViews } from './components/WorkspaceViews';
import { AnalyticsView } from './components/AnalyticsView';
import { AuditPanel } from './components/AuditPanel';
import { StressTestPanel } from './components/StressTestPanel';
import { UrbanistChat } from './components/UrbanistChat';
import { ParcelInspector } from './components/ParcelInspector';
import { ProjectDetailDrawer } from './components/ProjectDetailDrawer';
import { CommandPalette } from './components/CommandPalette';
import { ShareModal } from './components/ShareModal';
import { GeminiPlannerModal } from './components/GeminiPlannerModal';
import { MasterplanBriefingModal } from './components/MasterplanBriefingModal';
import { FloatingCopilotWidget } from './components/FloatingCopilotWidget';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { CreateProjectModal } from './components/CreateProjectModal';
import { ToastContainer, ToastMessage } from './components/ToastContainer';
import { LandingPage } from './components/LandingPage';
import { CityCustomizerModal } from './components/CityCustomizerModal';
import { CityImageGalleryModal } from './components/CityImageGalleryModal';
import { SupportHelplineModal } from './components/SupportHelplineModal';
import { FeedbackModal } from './components/FeedbackModal';
import { GreetingBanner } from './components/GreetingBanner';
import { FarewellModal } from './components/FarewellModal';
import { MapPin, Check, Sparkles } from 'lucide-react';

function AppContent() {
  // Navigation Architecture: View A (Landing Page) vs View B (Interactive App)
  const [currentViewMode, setCurrentViewMode] = useState<'landing' | 'app'>('app');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<WorkspaceTab>('twin');

  // Masterplan and Cells State with Persistence
  const [currentPlan, setCurrentPlan] = useState<CityPlan>(() => {
    const saved = localStorage.getItem('urbanmind_active_plan');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return PRESET_MASTERPLANS[0].plan;
  });

  const [cells, setCells] = useState<GridCell[]>(() => {
    return currentPlan.cells || PRESET_MASTERPLANS[0].plan.cells;
  });

  // District Projects State with Persistence
  const [projects, setProjects] = useState<DistrictProject[]>(() => {
    const saved = localStorage.getItem('urbanmind_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_DISTRICT_PROJECTS;
  });

  // Canvas Zoning Tooling
  const [selectedZone, setSelectedZone] = useState<ZoneType>('residential_high');
  const [toolMode, setToolMode] = useState<'brush' | 'erase' | 'inspect' | 'eyedropper'>('brush');
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('zoning');
  const [viewPerspective, setViewPerspective] = useState<ViewPerspective>('2d');

  // Slide-Over & Modals State
  const [inspectedCell, setInspectedCell] = useState<GridCell | null>(null);
  const [selectedProject, setSelectedProject] = useState<DistrictProject | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);

  // New Client Customizer, Gallery, Helpline, Feedback & Farewell Modals
  const [isCustomizerModalOpen, setIsCustomizerModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isHelplineModalOpen, setIsHelplineModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isFarewellModalOpen, setIsFarewellModalOpen] = useState(false);

  // Interactive Manual Stamping Mode State
  const [manualStampingFacility, setManualStampingFacility] = useState<{
    zoneType: ZoneType;
    name: string;
  } | null>(null);

  // Toasts with Undo
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Welcome Toast on Arrival
  useEffect(() => {
    const hasGreeted = sessionStorage.getItem('urbanmind_session_greeted');
    if (!hasGreeted) {
      sessionStorage.setItem('urbanmind_session_greeted', 'true');
      const hour = new Date().getHours();
      const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
      setTimeout(() => {
        addToast({
          title: `${timeGreeting}! Welcome to UrbanMind AI`,
          description: 'Wishing you an inspiring session designing tomorrow’s sustainable, flourishing planned cities.',
        });
      }, 1000);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('urbanmind_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('urbanmind_active_plan', JSON.stringify({ ...currentPlan, cells }));
  }, [currentPlan, cells]);

  const gridSize = currentPlan.gridSize || 14;

  // Real-time spatial metrics calculation
  const metrics = useMemo(() => {
    return calculateCityMetrics(cells, gridSize);
  }, [cells, gridSize]);

  // Handle cell click / paint
  const handleCellClick = (x: number, y: number) => {
    setCells((prev) => {
      const copy = [...prev];
      const index = copy.findIndex((c) => c.x === x && c.y === y);
      const prevZone = index >= 0 ? copy[index].zoneType : 'residential_medium';

      // If in manual stamping mode, stamp the custom facility
      const targetZone = manualStampingFacility ? manualStampingFacility.zoneType : (toolMode === 'erase' ? 'residential_medium' : selectedZone);
      const targetLabel = manualStampingFacility ? manualStampingFacility.name : undefined;

      if (index >= 0) {
        copy[index] = {
          ...copy[index],
          zoneType: targetZone,
          label: targetLabel,
          landmark: manualStampingFacility ? 'custom_facility' : undefined,
        };
      } else {
        copy.push({ x, y, zoneType: targetZone, label: targetLabel });
      }

      if (manualStampingFacility) {
        addToast({
          title: `Placed ${manualStampingFacility.name}`,
          description: `Constructed at parcel coordinates (${x}, ${y})`,
          undoAction: () => {
            setCells((current) => {
              const uCopy = [...current];
              const idx = uCopy.findIndex((c) => c.x === x && c.y === y);
              if (idx >= 0) uCopy[idx] = { ...uCopy[idx], zoneType: prevZone, label: undefined };
              return uCopy;
            });
          },
        });
      } else if (targetZone !== prevZone && toolMode === 'brush') {
        addToast({
          title: `Updated Parcel (${x}, ${y})`,
          description: `Zoned to ${targetZone.replace('_', ' ')}`,
          undoAction: () => {
            setCells((current) => {
              const uCopy = [...current];
              const idx = uCopy.findIndex((c) => c.x === x && c.y === y);
              if (idx >= 0) uCopy[idx] = { ...uCopy[idx], zoneType: prevZone };
              return uCopy;
            });
          },
        });
      }

      return copy;
    });
  };

  // 1-Click Fix from AI Auditor
  const handleApplyFix = (x: number, y: number, zoneType: ZoneType) => {
    setCells((prev) => {
      const copy = [...prev];
      const index = copy.findIndex((c) => c.x === x && c.y === y);
      const prevZone = index >= 0 ? copy[index].zoneType : 'residential_medium';

      if (index >= 0) {
        copy[index] = { ...copy[index], zoneType, label: 'AI Remediated Hub' };
      } else {
        copy.push({ x, y, zoneType, label: 'AI Remediated Hub' });
      }

      addToast({
        title: 'AI Remediation Injected',
        description: `Parcel (${x}, ${y}) zoned to ${zoneType.replace('_', ' ')}`,
        undoAction: () => {
          setCells((curr) => {
            const uCopy = [...curr];
            const idx = uCopy.findIndex((c) => c.x === x && c.y === y);
            if (idx >= 0) uCopy[idx] = { ...uCopy[idx], zoneType: prevZone };
            return uCopy;
          });
        },
      });

      return copy;
    });
  };

  // Load a preset masterplan
  const handleLoadPreset = (presetId: string) => {
    const found = PRESET_MASTERPLANS.find((p) => p.id === presetId);
    if (found) {
      setCurrentPlan(found.plan);
      setCells(found.plan.cells);
      setInspectedCell(null);
      setManualStampingFacility(null);
      addToast({
        title: `Masterplan Loaded: ${found.name}`,
        description: 'Updated digital twin spatial matrix and parameters.',
      });
    }
  };

  // Apply plan generated by Gemini or Custom City Builder
  const handleApplyPlan = (newPlan: CityPlan) => {
    setCurrentPlan(newPlan);
    setCells(newPlan.cells);
    setInspectedCell(null);
    setManualStampingFacility(null);
    addToast({
      title: `Applied Masterplan: ${newPlan.cityName}`,
      description: 'Synthesized tailored population and optimal facility layout.',
    });
  };

  // Start manual interactive stamping on canvas
  const handleStartManualPlacement = (facilityZone: ZoneType, facilityName: string) => {
    setActiveWorkspaceTab('twin');
    setSelectedZone(facilityZone);
    setToolMode('brush');
    setManualStampingFacility({ zoneType: facilityZone, name: facilityName });
    addToast({
      title: `Interactive Stamping Mode: ${facilityName}`,
      description: 'Click any parcel on the digital twin canvas to choose the exact design location.',
    });
  };

  // Clear grid
  const handleClearGrid = () => {
    const emptyCells: GridCell[] = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        emptyCells.push({ x, y, zoneType: 'residential_medium' });
      }
    }
    setCells(emptyCells);
    setInspectedCell(null);
    setManualStampingFacility(null);
    addToast({
      title: 'Digital Twin Reset',
      description: 'Parcels cleared to baseline open community housing.',
    });
  };

  // Create new project
  const handleCreateProject = (newProject: DistrictProject) => {
    setProjects((curr) => [newProject, ...curr]);
    addToast({
      title: `Created District: ${newProject.title}`,
      description: `Added to ${newProject.category} portfolio.`,
      undoAction: () => {
        setProjects((curr) => curr.filter((p) => p.id !== newProject.id));
      },
    });
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setProjects((curr) =>
      curr.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  // Delete project with Undo
  const handleDeleteProject = (id: string) => {
    const toDelete = projects.find((p) => p.id === id);
    if (!toDelete) return;

    setProjects((curr) => curr.filter((p) => p.id !== id));
    addToast({
      title: `Deleted: ${toDelete.title}`,
      description: 'District removed from municipal records.',
      undoAction: () => {
        setProjects((curr) => [toDelete, ...curr]);
      },
    });
  };

  // Reset Demo Data
  const handleResetDemoData = () => {
    setProjects(INITIAL_DISTRICT_PROJECTS);
    localStorage.setItem('urbanmind_projects', JSON.stringify(INITIAL_DISTRICT_PROJECTS));
    addToast({
      title: 'Demo Data Restored',
      description: 'Re-populated 8 production-grade planned city initiatives.',
    });
  };

  // Bulk update
  const handleBulkUpdateStatus = (ids: string[], status: ProjectStatus) => {
    setProjects((curr) =>
      curr.map((p) => (ids.includes(p.id) ? { ...p, status } : p))
    );
    addToast({
      title: `Bulk Status Updated`,
      description: `Marked ${ids.length} districts as ${status}.`,
    });
  };

  // Bulk delete
  const handleBulkDelete = (ids: string[]) => {
    const deletedItems = projects.filter((p) => ids.includes(p.id));
    setProjects((curr) => curr.filter((p) => !ids.includes(p.id)));
    addToast({
      title: `Bulk Deleted`,
      description: `Removed ${ids.length} districts.`,
      undoAction: () => {
        setProjects((curr) => [...deletedItems, ...curr]);
      },
    });
  };

  // Update district project status / details
  const handleUpdateProject = (updated: DistrictProject) => {
    const prev = projects.find((p) => p.id === updated.id);
    setProjects((curr) => curr.map((p) => (p.id === updated.id ? updated : p)));
    setSelectedProject(updated);

    if (prev && prev.status !== updated.status) {
      addToast({
        title: `Status Changed: ${updated.title}`,
        description: `Moved from ${prev.status} to ${updated.status}`,
        undoAction: () => {
          setProjects((curr) => curr.map((p) => (p.id === updated.id ? { ...p, status: prev.status } : p)));
        },
      });
    }
  };

  const handleUpdateProjectStatus = (id: string, newStatus: ProjectStatus) => {
    const found = projects.find((p) => p.id === id);
    if (!found) return;
    const prevStatus = found.status;
    const updated = { ...found, status: newStatus };
    setProjects((curr) => curr.map((p) => (p.id === id ? updated : p)));

    addToast({
      title: `Updated Status: ${found.title}`,
      description: `Moved to ${newStatus}`,
      undoAction: () => {
        setProjects((curr) => curr.map((p) => (p.id === id ? { ...p, status: prevStatus } : p)));
      },
    });
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ plan: currentPlan, cells, metrics, projects }, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `${currentPlan.cityName.toLowerCase().replace(/\s+/g, '_')}_workspace.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    addToast({ title: 'Workspace Exported', description: 'Downloaded complete JSON dataset.' });
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Title', 'Category', 'Status', 'LeadArchitect', 'Population', 'Walkability', 'Budget', 'CO2OffsetTons'];
    const rows = (projects || []).map((p) => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.category,
      p.status,
      `"${p.leadArchitect?.name || ''}"`,
      p.targetPopulation,
      p.walkabilityScore,
      `"${p.budget}"`,
      p.carbonOffsetTons,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const a = document.createElement('a');
    a.href = encodeURI(csvContent);
    a.download = `${currentPlan.cityName.toLowerCase().replace(/\s+/g, '_')}_districts.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    addToast({ title: 'Spreadsheet Exported', description: 'Downloaded CSV file.' });
  };

  // Jump to twin coordinate from inspector
  const handleJumpToTwinCoord = (coord: [number, number]) => {
    setActiveWorkspaceTab('twin');
    const cell = cells.find((c) => c.x === coord[0] && c.y === coord[1]);
    if (cell) {
      setInspectedCell(cell);
      setToolMode('inspect');
    }
  };

  // If in Marketing Landing Page mode
  if (currentViewMode === 'landing') {
    return (
      <>
        <LandingPage
          onLaunchApp={() => setCurrentViewMode('app')}
          onOpenArchetype={(presetId) => {
            handleLoadPreset(presetId);
            setCurrentViewMode('app');
            setActiveWorkspaceTab('twin');
          }}
          onOpenCustomizer={() => setIsCustomizerModalOpen(true)}
          onOpenGallery={() => setIsGalleryModalOpen(true)}
          onOpenHelpline={() => setIsHelplineModalOpen(true)}
          onOpenFeedback={() => setIsFeedbackModalOpen(true)}
        />
        {/* Modals accessible from landing page */}
        <CityCustomizerModal
          isOpen={isCustomizerModalOpen}
          onClose={() => setIsCustomizerModalOpen(false)}
          onApplyCustomPlan={(plan) => {
            handleApplyPlan(plan);
            setCurrentViewMode('app');
          }}
          onStartManualPlacement={(zone, name) => {
            handleStartManualPlacement(zone, name);
            setCurrentViewMode('app');
          }}
        />
        <CityImageGalleryModal
          isOpen={isGalleryModalOpen}
          onClose={() => setIsGalleryModalOpen(false)}
        />
        <SupportHelplineModal
          isOpen={isHelplineModalOpen}
          onClose={() => setIsHelplineModalOpen(false)}
        />
        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
        />
      </>
    );
  }

  // Interactive Web Application Mode
  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      {/* 3-Zone Top Navigation Bar */}
      <TopBar
        activeTab={activeWorkspaceTab}
        cityName={currentPlan.cityName}
        onSelectTab={setActiveWorkspaceTab}
        onOpenGenerateModal={() => setIsGenerateModalOpen(true)}
        onOpenCustomizerModal={() => setIsCustomizerModalOpen(true)}
        onOpenGalleryModal={() => setIsGalleryModalOpen(true)}
        onOpenHelplineModal={() => setIsHelplineModalOpen(true)}
        onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
        onOpenFarewellModal={() => setIsFarewellModalOpen(true)}
        onOpenBriefingModal={() => setIsBriefingModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onReturnToLanding={() => setIsFarewellModalOpen(true)}
      />

      {/* Dynamic Time-of-Day Welcome & Wishing Banner */}
      <GreetingBanner
        cityName={currentPlan.cityName}
        onOpenCustomizer={() => setIsCustomizerModalOpen(true)}
      />

      {/* Active Interactive Manual Stamping Indicator */}
      {manualStampingFacility && (
        <div className="mx-4 my-1.5 px-4 py-2 rounded-xl bg-amber-950/80 border border-amber-600/80 text-amber-200 text-xs flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>
              <strong>Active Manual Stamping:</strong> Choose where you want to design <strong>{manualStampingFacility.name}</strong>. Click any parcel on the canvas to place it!
            </span>
          </div>
          <button
            onClick={() => {
              setManualStampingFacility(null);
              addToast({
                title: 'Stamping Completed',
                description: 'Returned to standard digital twin brush mode.',
              });
            }}
            className="flex items-center gap-1 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs transition-colors shrink-0"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Done Stamping</span>
          </button>
        </div>
      )}

      {/* Live Tabular Telemetry Metric Cockpit */}
      <MetricCockpit metrics={metrics} />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* View 1: Digital Twin Studio (Canvas + Palette) */}
        {activeWorkspaceTab === 'twin' && (
          <>
            <ZoningPalette
              selectedZone={selectedZone}
              toolMode={toolMode}
              overlayMode={overlayMode}
              viewPerspective={viewPerspective}
              onSelectZone={(z) => {
                setSelectedZone(z);
                setManualStampingFacility(null);
              }}
              onSetToolMode={(m) => {
                setToolMode(m);
                if (m !== 'brush') setManualStampingFacility(null);
              }}
              onSetOverlayMode={setOverlayMode}
              onSetViewPerspective={setViewPerspective}
              onLoadPreset={handleLoadPreset}
              onClearGrid={handleClearGrid}
              onOpenCustomizer={() => setIsCustomizerModalOpen(true)}
              onOpenGallery={() => setIsGalleryModalOpen(true)}
              onOpenHelpline={() => setIsHelplineModalOpen(true)}
            />

            <main className="flex-1 h-full p-4 overflow-hidden flex flex-col">
              <CityCanvas
                cells={cells}
                gridSize={gridSize}
                selectedZone={selectedZone}
                toolMode={toolMode}
                overlayMode={overlayMode}
                viewPerspective={viewPerspective}
                metrics={metrics}
                onCellClick={handleCellClick}
                onCellInspect={setInspectedCell}
                onPickZone={(z) => {
                  setSelectedZone(z);
                  setManualStampingFacility(null);
                }}
              />
            </main>
          </>
        )}

        {/* View 2: Bento Grid View */}
        {activeWorkspaceTab === 'grid' && (
          <WorkspaceViews
            viewMode="grid"
            projects={projects}
            onSelectProject={setSelectedProject}
            onUpdateProjectStatus={handleUpdateProjectStatus}
            onToggleFavorite={handleToggleFavorite}
            onDeleteProject={handleDeleteProject}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onResetDemoData={handleResetDemoData}
            onBulkUpdateStatus={handleBulkUpdateStatus}
            onBulkDelete={handleBulkDelete}
          />
        )}

        {/* View 3: Kanban Board View */}
        {activeWorkspaceTab === 'kanban' && (
          <WorkspaceViews
            viewMode="kanban"
            projects={projects}
            onSelectProject={setSelectedProject}
            onUpdateProjectStatus={handleUpdateProjectStatus}
            onToggleFavorite={handleToggleFavorite}
            onDeleteProject={handleDeleteProject}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onResetDemoData={handleResetDemoData}
            onBulkUpdateStatus={handleBulkUpdateStatus}
            onBulkDelete={handleBulkDelete}
          />
        )}

        {/* View 4: Compact Spreadsheet Table View */}
        {activeWorkspaceTab === 'table' && (
          <WorkspaceViews
            viewMode="table"
            projects={projects}
            onSelectProject={setSelectedProject}
            onUpdateProjectStatus={handleUpdateProjectStatus}
            onToggleFavorite={handleToggleFavorite}
            onDeleteProject={handleDeleteProject}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onResetDemoData={handleResetDemoData}
            onBulkUpdateStatus={handleBulkUpdateStatus}
            onBulkDelete={handleBulkDelete}
          />
        )}

        {/* View 5: Analytics & Data Viz */}
        {activeWorkspaceTab === 'analytics' && (
          <AnalyticsView metrics={metrics} projects={projects} />
        )}

        {/* View 6: 15-Minute UN-Habitat Spatial Audit */}
        {activeWorkspaceTab === 'audit' && (
          <AuditPanel
            cells={cells}
            metrics={metrics}
            cityName={currentPlan.cityName}
            onApplyFix={handleApplyFix}
          />
        )}

        {/* View 7: Resilience & Climate Stress-Lab */}
        {activeWorkspaceTab === 'stress_test' && (
          <StressTestPanel
            cells={cells}
            metrics={metrics}
            cityName={currentPlan.cityName}
          />
        )}

        {/* View 8: Urbanist AI Copilot Consultation */}
        {activeWorkspaceTab === 'copilot' && (
          <UrbanistChat
            cityName={currentPlan.cityName}
            metrics={metrics}
          />
        )}
      </div>

      {/* Floating Deep Parcel Inspector */}
      <ParcelInspector
        cell={inspectedCell}
        cells={cells}
        metrics={metrics}
        onClose={() => setInspectedCell(null)}
        onChangeZone={(x, y, z) => {
          handleApplyFix(x, y, z);
          setInspectedCell((prev) => (prev ? { ...prev, zoneType: z } : null));
        }}
      />

      {/* Slide-Over Project Detail Drawer */}
      <ProjectDetailDrawer
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
        onJumpToTwinCoord={handleJumpToTwinCoord}
      />

      {/* Create New District Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreateProject}
      />

      {/* Built-In AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
        metrics={metrics}
        cityName={currentPlan.cityName}
        onApplyNewProject={handleCreateProject}
      />

      {/* Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectView={(v) => {
          setActiveWorkspaceTab(v as any);
        }}
        onOpenGenerateModal={() => setIsGenerateModalOpen(true)}
        onExportJson={handleExportJson}
        onExportCsv={handleExportCsv}
        onLoadPreset={handleLoadPreset}
        projects={projects}
        onSelectProject={(p) => setSelectedProject(p)}
        onOpenCustomizer={() => setIsCustomizerModalOpen(true)}
        onOpenGallery={() => setIsGalleryModalOpen(true)}
        onOpenHelpline={() => setIsHelplineModalOpen(true)}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        plan={currentPlan}
        onExportJson={handleExportJson}
        onExportCsv={handleExportCsv}
      />

      {/* Gemini AI City Generator Modal */}
      <GeminiPlannerModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onApplyPlan={handleApplyPlan}
      />

      {/* Masterplan Executive Dossier Modal */}
      <MasterplanBriefingModal
        isOpen={isBriefingModalOpen}
        onClose={() => setIsBriefingModalOpen(false)}
        plan={currentPlan}
      />

      {/* Custom City Builder & Facility Architect Modal */}
      <CityCustomizerModal
        isOpen={isCustomizerModalOpen}
        onClose={() => setIsCustomizerModalOpen(false)}
        onApplyCustomPlan={handleApplyPlan}
        onStartManualPlacement={handleStartManualPlacement}
      />

      {/* 100+ Realistic City & Architectural Visuals Gallery Modal */}
      <CityImageGalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
      />

      {/* Customer Helpline, 24/7 Phone Numbers, Emails & Offices Modal */}
      <SupportHelplineModal
        isOpen={isHelplineModalOpen}
        onClose={() => setIsHelplineModalOpen(false)}
      />

      {/* Client Feedback & Review Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmitFeedback={(fb) => {
          addToast({
            title: 'Feedback Received',
            description: `Thank you for rating us ${fb.overallRating}/5 stars!`,
          });
        }}
      />

      {/* Warm Farewell Wishing Modal on Exit */}
      <FarewellModal
        isOpen={isFarewellModalOpen}
        cityName={currentPlan.cityName}
        plan={currentPlan}
        onConfirmExit={() => {
          setIsFarewellModalOpen(false);
          setCurrentViewMode('landing');
          addToast({
            title: 'Safe Travels!',
            description: 'Wishing you great success and inspiration in building sustainable communities.',
          });
        }}
        onCancel={() => setIsFarewellModalOpen(false)}
      />

      {/* Contextual AI Copilot Floating Widget */}
      <FloatingCopilotWidget
        metrics={metrics}
        cityName={currentPlan.cityName}
      />

      {/* Interactive Undo Toast System */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
