import React from 'react';
import { 
  TrendingUp, 
  Search, 
  UploadCloud, 
  FileText 
} from 'lucide-react';

export default function Header({ 
  currency, 
  setCurrency, 
  searchQuery, 
  setSearchQuery, 
  onOpenPLStatement, 
  onOpenUploadModal 
}) {
  return (
    <header className="bg-slate-900/90 border-b border-slate-800 px-6 py-4 sticky top-0 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Sales & P&L Dashboard</h1>
              <p className="text-xs text-slate-400">Retail Profitability & Category Metrics</p>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="w-full md:w-96 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search products or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Currency Switcher */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                currency === 'INR' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                currency === 'USD' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              $ USD
            </button>
          </div>

          {/* P&L Statement Button */}
          <button
            onClick={onOpenPLStatement}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            <FileText className="h-4 w-4 text-indigo-400" />
            <span>P&L Summary</span>
          </button>

          {/* Upload Button */}
          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Import Data</span>
          </button>

        </div>

      </div>
    </header>
  );
}
