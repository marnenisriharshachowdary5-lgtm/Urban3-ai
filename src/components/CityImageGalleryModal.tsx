import React, { useState, useMemo } from 'react';
import { 
  X, Search, Filter, Image as ImageIcon, ExternalLink, 
  Download, Sparkles, MapPin, Eye, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { REALISTIC_CITY_IMAGES, CityRealisticImage } from '../data/cityRealisticImages';
import { SafeImage } from './SafeImage';

interface CityImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage?: (img: CityRealisticImage) => void;
}

export const CityImageGalleryModal: React.FC<CityImageGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
}) => {
  const categories = useMemo(() => {
    const set = new Set(REALISTIC_CITY_IMAGES.map((img) => img.category));
    return Array.from(set);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return REALISTIC_CITY_IMAGES[0]?.category || 'Healthcare';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeImage, setActiveImage] = useState<CityRealisticImage | null>(null);

  const filteredImages = useMemo(() => {
    return REALISTIC_CITY_IMAGES.filter((img) => {
      const matchCat = img.category === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.locationTag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-xs text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Realistic City & Architectural Visuals
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[11px] font-semibold">
                  {categories.length} Individual Sectors
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Browse verified high-resolution photography and spatial twin renders organized by individual municipal sector.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Individual Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:max-w-[72%]">
            {categories.map((cat) => {
              const count = REALISTIC_CITY_IMAGES.filter((img) => img.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60 hover:bg-slate-800'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono leading-none ${
                      isSelected
                        ? 'bg-cyan-400/20 text-cyan-200'
                        : 'bg-slate-900/80 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${selectedCategory}...`}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              onClick={() => setActiveImage(img)}
              className="group relative bg-slate-950/70 border border-slate-800 hover:border-cyan-500/60 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
            >
              {/* Image Preview */}
              <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                <SafeImage
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity" />
                
                {/* Category Pill */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-medium text-cyan-300">
                  {img.category}
                </div>

                {/* Inspect Overlay Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 text-white font-semibold text-xs border border-cyan-400/50 shadow-lg flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View High-Res</span>
                  </div>
                </div>
              </div>

              {/* Text Info */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-white text-xs line-clamp-1 group-hover:text-cyan-300 transition-colors">
                    {img.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                    {img.description}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1 truncate text-slate-400">
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{img.locationTag}</span>
                  </span>
                  <span className="font-mono text-cyan-400/80 shrink-0 uppercase">
                    {img.aspect}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredImages.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-500">
              <ImageIcon className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-400">No matching images found in {selectedCategory}</p>
              <p className="text-xs text-slate-500 mt-1">Try clearing your search keyword or switch to another individual facility category above.</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs hover:bg-cyan-500/30 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>
            Showing <strong className="text-white font-mono">{filteredImages.length}</strong> individual assets in <span className="text-cyan-400 font-semibold">{selectedCategory}</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Gallery
          </button>
        </div>
      </div>

      {/* Lightbox High-Resolution Inspector Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
              <SafeImage
                src={activeImage.url}
                alt={activeImage.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white border border-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-medium text-xs">
                      {activeImage.category}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {activeImage.locationTag}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{activeImage.title}</h2>
                  <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                    {activeImage.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <a
                    href={activeImage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Open Full Image</span>
                  </a>

                  {onSelectImage && (
                    <button
                      onClick={() => {
                        onSelectImage(activeImage);
                        setActiveImage(null);
                        onClose();
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Use In Plan</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
