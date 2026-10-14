import React, { useState } from 'react';
import { X, Copy, Check, Share2, Download, Globe } from 'lucide-react';
import { CityPlan } from '../types/city';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: CityPlan;
  onExportJson: () => void;
  onExportCsv: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  plan,
  onExportJson,
  onExportCsv,
}) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const shareUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 text-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-teal-400" />
            <h3 className="font-semibold text-white text-sm">Share Masterplan Workspace</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Share this active digital twin for <span className="text-white font-medium">{plan.cityName}</span> with city stakeholders, council members, or ecological review teams.
        </p>

        {/* Copyable link input */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-xl">
          <Globe className="w-4 h-4 text-slate-500 ml-2" />
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent text-xs text-slate-300 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Direct Data Exports */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Direct Data Exports
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { onExportJson(); onClose(); }}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => { onExportCsv(); onClose(); }}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
