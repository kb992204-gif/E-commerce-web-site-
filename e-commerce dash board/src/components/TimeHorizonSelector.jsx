import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

export default function TimeHorizonSelector({ 
  horizon, 
  setHorizon, 
  customStart, 
  setCustomStart, 
  customEnd, 
  setCustomEnd,
  dateRangeText 
}) {
  const options = [
    { id: 'weekly', label: 'Weekly (Last 7D)' },
    { id: 'monthly', label: 'Monthly (Last 30D)' },
    { id: 'yoy', label: 'Past Year (YoY)' },
    { id: 'custom', label: 'Custom Range' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      {/* Title & Date Label */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-200">Time Horizon Comparison</h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">{dateRangeText}</p>
        </div>
      </div>

      {/* Segmented Time Horizon Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {options.map((opt) => {
          const isActive = horizon === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setHorizon(opt.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Custom Date Pickers */}
      {horizon === 'custom' && (
        <div className="w-full md:w-auto flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
          <input 
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <ChevronRight className="h-4 w-4 text-slate-500" />
          <input 
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}

    </div>
  );
}
