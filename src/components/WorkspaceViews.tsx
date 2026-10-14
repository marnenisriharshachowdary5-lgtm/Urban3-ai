import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, Filter, ArrowUpDown, Eye, Trash2, Star, 
  CheckCircle2, Clock, AlertTriangle, Users, Footprints, 
  DollarSign, Leaf, Sparkles, Plus, RefreshCw, X, CheckSquare, Square
} from 'lucide-react';
import { DistrictProject, ProjectStatus, ProjectCategory } from '../types/districtProject';
import { useTheme } from '../context/ThemeContext';
import { SafeImage } from './SafeImage';

interface WorkspaceViewsProps {
  viewMode: 'grid' | 'kanban' | 'table';
  projects: DistrictProject[];
  onSelectProject: (p: DistrictProject) => void;
  onUpdateProjectStatus: (id: string, status: ProjectStatus) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onOpenCreateModal: () => void;
  onResetDemoData: () => void;
  onBulkUpdateStatus?: (ids: string[], status: ProjectStatus) => void;
  onBulkDelete?: (ids: string[]) => void;
}

export const WorkspaceViews: React.FC<WorkspaceViewsProps> = ({
  viewMode,
  projects,
  onSelectProject,
  onUpdateProjectStatus,
  onToggleFavorite,
  onDeleteProject,
  onOpenCreateModal,
  onResetDemoData,
  onBulkUpdateStatus,
  onBulkDelete,
}) => {
  const { accentConfig } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortField, setSortField] = useState<'walkability' | 'population' | 'budget' | 'title' | 'newest'>('walkability');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter projects
  const filtered = (projects || []).filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.leadArchitect?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesFav = !onlyFavorites || p.isFavorite;
    return matchesSearch && matchesCat && matchesFav;
  });

  // Sort projects
  const sorted = [...filtered].sort((a, b) => {
    if (sortField === 'title') {
      return sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    }
    if (sortField === 'population') {
      return sortAsc ? a.targetPopulation - b.targetPopulation : b.targetPopulation - a.targetPopulation;
    }
    if (sortField === 'walkability') {
      return sortAsc ? a.walkabilityScore - b.walkabilityScore : b.walkabilityScore - a.walkabilityScore;
    }
    if (sortField === 'budget') {
      const bA = parseFloat(a.budget.replace(/[^0-9.]/g, '')) || 0;
      const bB = parseFloat(b.budget.replace(/[^0-9.]/g, '')) || 0;
      return sortAsc ? bA - bB : bB - bA;
    }
    return 0;
  });

  const categories = ['all', 'Biophilic', 'Mobility', 'Healthcare', 'Energy', 'Housing', 'Circular'];

  const kanbanColumns: ProjectStatus[] = [
    'Planning',
    'Simulation',
    'Groundbreaking',
    'Construction',
    'Operational',
  ];

  // Dynamic spotlight mouse move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'Operational':
        return <span className="text-[10px] font-mono text-emerald-400">● Operational</span>;
      case 'Construction':
        return <span className="text-[10px] font-mono text-amber-400">▲ Under Construction</span>;
      case 'Groundbreaking':
        return <span className="text-[10px] font-mono text-cyan-400">◆ Groundbreaking</span>;
      case 'Simulation':
        return <span className="text-[10px] font-mono text-purple-400">◈ In Simulation</span>;
      default:
        return <span className="text-[10px] font-mono text-slate-400">○ Planning</span>;
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === sorted.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sorted.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-slate-200">
      {/* Top Filter & Search Bar */}
      <div className="px-6 py-3.5 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search districts, tags, or lead architects..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Action cluster: Favorites, Categories, Sort, New District, Reset */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Favorite filter toggle */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium border transition-colors ${
              onlyFavorites
                ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Starred</span>
          </button>

          {/* Segmented Category Buttons */}
          <div className="hidden lg:flex items-center gap-1 p-1 bg-slate-950/60 rounded-xl border border-slate-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-[11px] font-medium capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none"
            >
              <option value="walkability">15-Min Reach</option>
              <option value="population">Population</option>
              <option value="budget">Budget</option>
              <option value="title">Name</option>
            </select>
          </div>

          {/* Create District Button */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold rounded-xl text-xs transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add District</span>
          </button>

          {/* Reset Demo Data button */}
          <button
            onClick={onResetDemoData}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
            title="Reset Demo Records"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bulk Actions Floating Bar (if items selected in table view) */}
      {selectedIds.length > 0 && viewMode === 'table' && (
        <div className="px-6 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2 text-cyan-400 font-mono">
            <span>{selectedIds.length} districts selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBulkUpdateStatus?.(selectedIds, 'Operational')}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 font-medium"
            >
              Mark Operational
            </button>
            <button
              onClick={() => {
                onBulkDelete?.(selectedIds);
                setSelectedIds([]);
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 font-medium"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2 py-1 text-slate-400 hover:text-white"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Main View Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Empty State */}
        {sorted.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white">No Planned Districts Found</h3>
            <p className="text-xs text-slate-400">
              No municipal projects match "{searchQuery}". Try clearing filters or creating a new planned district.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setOnlyFavorites(false);
                }}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-medium transition-colors border border-slate-700"
              >
                Reset Filters
              </button>
              <button
                onClick={onOpenCreateModal}
                className="px-3.5 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg text-xs font-semibold transition-colors"
              >
                Create District
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          /* Bento Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sorted.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                onMouseMove={handleMouseMove}
                onClick={() => onSelectProject(p)}
                className="spotlight-card group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                <div>
                  {/* Card Image Banner */}
                  <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3 border border-slate-800/60">
                    <SafeImage
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    <div className="absolute top-2.5 left-2.5">
                      {getStatusBadge(p.status)}
                    </div>

                    {/* Favorite and Delete quick actions on card */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(p.id);
                        }}
                        className="p-1 rounded-full bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-amber-400 transition-colors"
                        title={p.isFavorite ? 'Unfavorite' : 'Favorite'}
                      >
                        <Star className={`w-3.5 h-3.5 ${p.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(p.id);
                        }}
                        className="p-1 rounded-full bg-slate-950/70 hover:bg-rose-950 text-slate-300 hover:text-rose-400 transition-colors"
                        title="Delete district"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white font-mono">
                      <span>{p.category}</span>
                      <span className="font-semibold text-cyan-300">{p.walkabilityScore}% 15-Min</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Footer KPIs & Lead Architect */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SafeImage
                      src={p.leadArchitect?.avatar}
                      alt={p.leadArchitect?.name}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
                    />
                    <span className="text-[11px] text-slate-300 truncate max-w-[100px]">
                      {p.leadArchitect?.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                    <span className="text-white font-semibold">{p.budget}</span>
                    <span className="text-slate-600">·</span>
                    <span>{p.targetPopulation?.toLocaleString()} pop</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : viewMode === 'kanban' ? (
          /* Kanban Board View */
          <div className="flex gap-4 overflow-x-auto pb-4 h-full">
            {kanbanColumns.map((status) => {
              const columnProjects = sorted.filter((p) => p.status === status);
              return (
                <div
                  key={status}
                  className="w-80 shrink-0 bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex flex-col max-h-full"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2 font-semibold text-slate-200">
                      <span>{status}</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-400">
                        {columnProjects.length}
                      </span>
                    </div>
                  </div>

                  {/* Column Cards */}
                  <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                    {columnProjects.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => onSelectProject(p)}
                        className="p-3 bg-slate-950/80 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl cursor-pointer transition-all space-y-2 group shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="text-cyan-400">{p.category}</span>
                          <div className="flex items-center gap-2">
                            <span>{p.budget}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite(p.id);
                              }}
                              className="text-slate-500 hover:text-amber-400"
                            >
                              <Star className={`w-3 h-3 ${p.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>
                          </div>
                        </div>

                        <h4 className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-2">
                          {p.title}
                        </h4>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px]">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <SafeImage
                              src={p.leadArchitect?.avatar}
                              alt=""
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span className="truncate max-w-[80px]">{p.leadArchitect?.name}</span>
                          </div>
                          <span className="font-mono text-emerald-400 font-semibold">
                            {p.walkabilityScore}% Walk
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Compact Table View with Bulk Selection */
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                  <tr>
                    <th className="py-3 px-4 w-10 text-center">
                      <button onClick={toggleSelectAll} className="hover:text-white">
                        {selectedIds.length === sorted.length && sorted.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-4">District / Initiative</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Lead Architect</th>
                    <th className="py-3 px-4 text-right">Population</th>
                    <th className="py-3 px-4 text-right">15-Min Reach</th>
                    <th className="py-3 px-4 text-right">CO₂ Offset</th>
                    <th className="py-3 px-4 text-right">Budget</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {sorted.map((p) => {
                    const isSelected = selectedIds.includes(p.id);
                    return (
                      <tr
                        key={p.id}
                        onClick={() => onSelectProject(p)}
                        className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                          isSelected ? 'bg-slate-800/40' : ''
                        }`}
                      >
                        <td
                          className="py-3 px-4 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectOne(p.id);
                          }}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-cyan-400 mx-auto" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600 mx-auto" />
                          )}
                        </td>
                        <td className="py-3 px-4 font-semibold text-white flex items-center gap-2.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(p.id);
                            }}
                            className="text-slate-500 hover:text-amber-400 mr-1"
                          >
                            <Star className={`w-3.5 h-3.5 ${p.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                          </button>
                          <SafeImage
                            src={p.image}
                            alt=""
                            className="w-7 h-7 rounded-lg object-cover shrink-0"
                          />
                          <span className="truncate max-w-xs">{p.title}</span>
                        </td>
                        <td className="py-3 px-4 text-cyan-400 font-mono text-[11px]">
                          {p.category}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getStatusBadge(p.status)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <SafeImage
                              src={p.leadArchitect?.avatar}
                              alt=""
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="truncate max-w-[110px] text-slate-300">
                              {p.leadArchitect?.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-300">
                          {p.targetPopulation?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-emerald-400">
                          {p.walkabilityScore}%
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-teal-300">
                          {p.carbonOffsetTons?.toLocaleString()} t
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-white">
                          {p.budget}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectProject(p);
                              }}
                              className="p-1 hover:text-white text-slate-400 rounded transition-colors"
                              title="Inspect details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteProject(p.id);
                              }}
                              className="p-1 hover:text-rose-400 text-slate-400 rounded transition-colors"
                              title="Delete district"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
