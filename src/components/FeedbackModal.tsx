import React, { useState } from 'react';
import { 
  X, Star, MessageSquareHeart, CheckCircle2, 
  Send, ThumbsUp, Heart, Sparkles 
} from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback?: (feedback: any) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmitFeedback,
}) => {
  const [overallRating, setOverallRating] = useState<number>(5);
  const [spatialRating, setSpatialRating] = useState<number>(5);
  const [visualsRating, setVisualsRating] = useState<number>(5);
  const [speedRating, setSpeedRating] = useState<number>(5);
  const [role, setRole] = useState('Urban Planner');
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const quickTags = [
    'Intuitive 15-Minute Analysis',
    'Stunning 100+ Realistic Images',
    'Custom Population Builder is Great',
    'Accurate Facility Placements',
    'Responsive AI Stress-Testing',
    'Clean Bento-Grid Aesthetic',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFeedback = {
      id: `fb-${Date.now()}`,
      timestamp: new Date().toISOString(),
      overallRating,
      spatialRating,
      visualsRating,
      speedRating,
      role,
      feedbackText,
      selectedTags,
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('urbanmind_client_feedbacks') || '[]');
      existing.unshift(newFeedback);
      localStorage.setItem('urbanmind_client_feedbacks', JSON.stringify(existing));
    } catch (e) {
      // ignore
    }

    if (onSubmitFeedback) {
      onSubmitFeedback(newFeedback);
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-xs text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Client & Planner Feedback
              </h2>
              <p className="text-[11px] text-slate-400">
                Your evaluation directly guides our autonomous planned city algorithms and architectural standards.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {isSubmitted ? (
          <div className="p-10 text-center flex flex-col items-center justify-center space-y-3 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Thank You for Your Feedback!</h3>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed">
              We deeply appreciate your time. Your review has been logged and shared with our urban architecture engineering team.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 max-h-[80vh]">
            {/* Overall Rating */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <label className="text-xs font-semibold text-slate-200 block">
                How would you rate your overall experience with UrbanMind AI?
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setOverallRating(star)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= overallRating
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-mono text-cyan-400 font-semibold block">
                {overallRating === 5
                  ? 'Outstanding (5/5) — Exceeded Expectations'
                  : overallRating === 4
                  ? 'Very Good (4/5) — Highly Effective'
                  : overallRating === 3
                  ? 'Satisfactory (3/5) — Meets Requirements'
                  : 'Needs Improvement'}
              </span>
            </div>

            {/* Criteria Breakdown */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                Detailed Evaluation Breakdown
              </label>

              <div className="space-y-2">
                {[
                  { label: 'Masterplan Spatial Layout & 15-Min Distance', val: spatialRating, set: setSpatialRating },
                  { label: 'Visual Quality & 100+ Realistic Imagery', val: visualsRating, set: setVisualsRating },
                  { label: 'Speed & Custom City Customizer Flexibility', val: speedRating, set: setSpeedRating },
                ].map((crit, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800"
                  >
                    <span className="text-[11px] text-slate-300">{crit.label}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => crit.set(s)}
                          className="p-0.5 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              s <= crit.val ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Role Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Your Professional Background / Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Urban Planner',
                  'Architect / Civil Eng.',
                  'Municipal Official',
                  'University Student',
                  'Real Estate Developer',
                  'Citizen Advocate',
                ].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-1.5 px-2 rounded-lg border text-left text-[11px] transition-all ${
                      role === r
                        ? 'bg-slate-800 border-cyan-400 text-white font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Experience Highlights */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                What did you like most? (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {selectedTags.includes(tag) ? '✓ ' : '+ '}
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Written Comments */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Suggestions, Feature Requests or Comments
              </label>
              <textarea
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share any suggestions on additional facilities, metrics, or municipal simulations you'd like to see..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-white px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl shadow-md transition-colors text-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Client Review</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
