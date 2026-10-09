import React from 'react';
import { Layers, Zap, ShoppingCart, Gamepad2 } from 'lucide-react';
import { formatCurrency } from '../data/benchmarkData';

export default function CategoryTabs({ 
  selectedCategory, 
  setSelectedCategory, 
  categoryStats, 
  currency 
}) {
  const categories = [
    { id: 'All', label: 'All Categories', icon: Layers },
    { id: 'Electronics', label: 'Electronics ⚡', icon: Zap },
    { id: 'Groceries', label: 'Groceries 🛒', icon: ShoppingCart },
    { id: 'Toys', label: 'Toys 🎮', icon: Gamepad2 }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Category Performance Filter</h2>
        <span className="text-xs text-slate-400">Select a category to filter products</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const stats = categoryStats[cat.id] || { netSales: 0, profit: 0, marginPct: 0, count: 0 };

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold">{cat.label}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-950 text-slate-400'
                }`}>
                  {stats.count} Products
                </span>
              </div>

              <div className="text-xs space-y-0.5 opacity-90">
                <div>Sales: <span className="font-semibold">{formatCurrency(stats.netSales, currency)}</span></div>
                <div>Margin: <span className="font-semibold">{stats.marginPct.toFixed(1)}%</span></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
