import React, { useState } from 'react';
import { 
  X, Phone, Mail, MapPin, Clock, ShieldCheck, 
  Copy, Check, Send, Sparkles, Building2, MessageSquare, Headphones
} from 'lucide-react';

interface SupportHelplineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportHelplineModal: React.FC<SupportHelplineModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryEmail.trim() || !inquiryMessage.trim()) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMessage('');
      setIsSubmitted(false);
    }, 4000);
  };

  const helplines = [
    {
      region: 'North America & Global (Toll-Free 24/7)',
      number: '+1 (800) 555-8722',
      formatted: '+1 (800) 555-URBAN',
      desc: 'Toll-free urban planning consultations, digital twin assistance & technical helpline.',
    },
    {
      region: 'Emergency Municipal Infrastructure Response',
      number: '+1 (888) 724-4357',
      formatted: '+1 (888) 724-HELP',
      desc: 'Priority hotline for municipal disaster simulation, flood modeling, and grid failure triage.',
    },
    {
      region: 'Europe & UK Regional Desk (London & Copenhagen)',
      number: '+44 20 7946 0991',
      formatted: '+44 20 7946 0991',
      desc: 'EU 15-minute city compliance, sponge city architecture & carbon neutral zoning specialists.',
    },
    {
      region: 'Asia-Pacific Regional Hub (Singapore)',
      number: '+65 6789 0123',
      formatted: '+65 6789 0123',
      desc: 'High-density biophilic skyscrapers, autonomous transit grids, and aerotropolis design.',
    },
  ];

  const emails = [
    {
      label: 'Urban Planning & Architecture Help',
      email: 'planning@urbanmind.ai',
      desc: 'Direct consultation with licensed senior urban planners and architects.',
    },
    {
      label: '24/7 Client Support Desk',
      email: 'support@urbanmind.ai',
      desc: 'App troubleshooting, digital twin export issues, and customer assistance.',
    },
    {
      label: 'Civic & Government Partnerships',
      email: 'civic-partners@urbanmind.ai',
      desc: 'Mayoral offices, municipal transit authorities, and UN-Habitat integration.',
    },
    {
      label: 'Emergency Response Operations',
      email: 'emergency-ops@urbanmind.ai',
      desc: 'Climate adaptation modeling and resilience stress-test inquiries.',
    },
  ];

  const addresses = [
    {
      title: 'Global Headquarters & Urban AI Innovation Lab',
      address: '100 Innovation Promenade, Suite 4000',
      city: 'San Francisco, CA 94105, United States',
      desc: 'Digital twin supercomputing hub, core engineering & AI research studio.',
    },
    {
      title: 'European Biophilic & Sponge City Design Center',
      address: 'Vester Voldgade 104, 3rd Floor',
      city: 'DK-1552 Copenhagen V, Denmark',
      desc: 'Zero-carbon district design, biofiltration wetlands & cycling mobility lab.',
    },
    {
      title: 'Asia-Pacific Aerotropolis & High-Density Hub',
      address: '1 Marina Boulevard, Level 28',
      city: 'Marina Bay, Singapore 018989',
      desc: 'Vertical biophilic arcologies, rapid maglev transit & automated logistics.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-xs text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Customer Helpline & Client Support Center
                </h2>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live 24/7 Available
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Direct phone helplines, support emails, and global municipal offices. We are here to assist with every aspect of your planned city.
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Helplines Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 text-cyan-400">
              <Phone className="w-3.5 h-3.5" />
              <span>24/7 Global Customer Helpline Numbers</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {helplines.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {item.region}
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-bold text-white font-mono text-cyan-300">
                        {item.formatted}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.number, `phone-${idx}`)}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 transition-colors"
                        title="Copy phone number"
                      >
                        {copiedKey === `phone-${idx}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Official Support Emails */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 text-cyan-400">
              <Mail className="w-3.5 h-3.5" />
              <span>Direct Support & Planning Emails</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {emails.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {item.label}
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <a
                        href={`mailto:${item.email}`}
                        className="text-xs font-bold text-white font-mono text-cyan-300 hover:underline"
                      >
                        {item.email}
                      </a>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.email, `mail-${idx}`)}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 transition-colors"
                        title="Copy email address"
                      >
                        {copiedKey === `mail-${idx}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Physical Headquarters & Addresses */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 text-cyan-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>Global Physical Headquarters & Offices</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {addresses.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-semibold text-white text-xs mb-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-300 font-mono leading-snug">
                      {item.address}
                    </p>
                    <p className="text-[10px] text-cyan-400 font-medium mt-0.5">
                      {item.city}
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 border-t border-slate-900 pt-2">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Instant Client Help Ticket Form */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Send Direct Inquiry to our Urban Architecture Team</span>
              </h3>
              <span className="text-[10px] text-slate-400">Response guaranteed in &lt; 2 hrs</span>
            </div>

            {isSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-center animate-in fade-in">
                <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <h4 className="font-bold text-xs text-white">Inquiry Dispatched Successfully!</h4>
                <p className="text-[11px] text-emerald-200 mt-1">
                  A senior urban architect has received your message and will contact you via email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Your Name</label>
                    <input
                      type="text"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="e.g. Architect Sarah Chen"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Your Contact Email *</label>
                    <input
                      type="email"
                      required
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      placeholder="sarah@cityplan.gov"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">Your Question or Planned City Requirements *</label>
                  <textarea
                    required
                    rows={2}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Describe what assistance you need with your masterplan, facility placement, or population density..."
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg transition-colors text-xs shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Support Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Average Telephone Wait Time: &lt; 45 seconds</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Helplines
          </button>
        </div>
      </div>
    </div>
  );
};
