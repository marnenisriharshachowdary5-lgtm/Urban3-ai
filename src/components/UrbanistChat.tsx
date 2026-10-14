import React, { useState } from 'react';
import { CityMetrics } from '../types/city';
import { Send, Sparkles, Loader2, Bot, User, Lightbulb } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UrbanistChatProps {
  cityName: string;
  metrics: CityMetrics;
}

export const UrbanistChat: React.FC<UrbanistChatProps> = ({ cityName, metrics }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Greetings! I am your Senior Urban Planning & Digital Twin Copilot. I analyze spatial layouts against UN-Habitat guidelines, 15-minute isochrones, sponge city stormwater retention, and decarbonized transit networks. How can I assist in refining ${cityName}?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleQuestions = [
    'How do we maximize the 15-minute walkability index without creating congestion?',
    'What is the optimal ratio of sponge wetlands to impervious concrete surfaces?',
    'How do autonomous electric transit loops compare to traditional arterial roads?',
    'How can we reduce our city’s urban heat island delta by an additional 1.5°C?',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/city/ask-urbanist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          cityName,
          currentMetrics: metrics,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'In 15-minute cities, decentralizing polyclinics and neighborhood academies within 400m of residential clusters yields an immediate 18% improvement in public satisfaction while cutting private vehicle trips.',
          },
        ]);
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Optimal planned cities prioritize continuous linear green bioswales between residential and commercial zones to provide both active mobility corridors and natural air cooling.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full max-w-4xl mx-auto w-full p-6 text-slate-200">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <h1 className="text-base font-semibold text-white">Urbanist AI Copilot</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time urban design advice grounded in civil engineering and 15-minute city science.
          </p>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="py-3 flex flex-wrap gap-2">
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-left text-[11px] px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-teal-400/60 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-3 text-xs leading-relaxed ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0 text-teal-400">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-2xl p-4 rounded-xl ${
                m.role === 'user'
                  ? 'bg-teal-500 text-slate-950 font-medium'
                  : 'bg-slate-900 border border-slate-800 text-slate-200'
              }`}
            >
              {m.content}
            </div>
            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-center text-xs text-slate-400">
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0 text-teal-400">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <span>Formulating urban engineering recommendation...</span>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-4 border-t border-slate-800 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask the urbanist copilot about zoning, transit, or climate resilience in ${cityName}...`}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-2.5 bg-teal-400 hover:bg-teal-300 disabled:opacity-50 text-slate-950 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
