import React, { useState } from 'react';
import { Bell, Check, Clock, Sparkles, ShieldCheck, Zap, X } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
  type: 'ai' | 'milestone' | 'resilience' | 'energy';
}

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      title: 'Gemini completed 15-Minute accessibility diagnostic with 98% confidence.',
      time: '10 mins ago',
      read: false,
      type: 'ai',
    },
    {
      id: 'n-2',
      title: 'Sponge Basin retention vault foundation passed 100-year storm flood stress.',
      time: '1 hour ago',
      read: false,
      type: 'resilience',
    },
    {
      id: 'n-3',
      title: 'Hydrogen microgrid battery array achieved +118% net-positive generation.',
      time: '3 hours ago',
      read: true,
      type: 'energy',
    },
    {
      id: 'n-4',
      title: 'Autonomous multi-modal skyloop pylon test passed safety standard ISO-37120.',
      time: 'Yesterday',
      read: true,
      type: 'milestone',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        title="Municipal Activity Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400" />
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <span className="font-semibold text-white">Municipal Activity Logs</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-teal-400 hover:text-teal-300 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 space-y-1 transition-colors ${
                  n.read ? 'bg-transparent' : 'bg-slate-800/30'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 text-teal-400">
                    {n.type === 'ai' ? <Sparkles className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  </div>
                  <p className="text-xs text-slate-300 leading-snug flex-1">
                    {n.title}
                  </p>
                </div>
                <div className="text-[10px] font-mono text-slate-500 pl-5.5">
                  {n.time}
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-slate-950/60 border-t border-slate-800 text-center">
            <button
              onClick={() => setIsOpen(false)}
              className="text-[11px] text-slate-400 hover:text-white"
            >
              Close Activity Center
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
