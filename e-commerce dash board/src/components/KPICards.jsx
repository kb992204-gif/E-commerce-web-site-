import React from 'react';
import { DollarSign, TrendingUp, Percent, ShoppingBag, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../data/benchmarkData';

export default function KPICards({ currentMetrics, previousMetrics, currency }) {
  function getVariance(curr, prev) {
    if (!prev || prev === 0) return { pct: '0.0', isUp: true };
    const diff = curr - prev;
    const pct = ((diff / Math.abs(prev)) * 100).toFixed(1);
    return { pct: Math.abs(pct), isUp: diff >= 0 };
  }

  const salesVar = getVariance(currentMetrics.netSales, previousMetrics.netSales);
  const profitVar = getVariance(currentMetrics.profit, previousMetrics.profit);
  const marginVar = getVariance(currentMetrics.marginPct, previousMetrics.marginPct);
  const ordersVar = getVariance(currentMetrics.totalOrders, previousMetrics.totalOrders);

  const cards = [
    {
      title: "Net Sales Revenue",
      value: formatCurrency(currentMetrics.netSales, currency),
      sub: `Gross: ${formatCurrency(currentMetrics.grossSales, currency)}`,
      variance: salesVar,
      icon: DollarSign,
      color: "indigo"
    },
    {
      title: "Gross Profit",
      value: formatCurrency(currentMetrics.profit, currency),
      sub: `COGS: ${formatCurrency(currentMetrics.cogs, currency)}`,
      variance: profitVar,
      icon: TrendingUp,
      color: "emerald"
    },
    {
      title: "Profit Margin Rate",
      value: `${currentMetrics.marginPct.toFixed(1)}%`,
      sub: "Net Margin Contribution",
      variance: marginVar,
      icon: Percent,
      color: "purple"
    },
    {
      title: "Total Orders & AOV",
      value: currentMetrics.totalOrders.toLocaleString(),
      sub: `AOV: ${formatCurrency(currentMetrics.aov, currency)}`,
      variance: ordersVar,
      icon: ShoppingBag,
      color: "cyan"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((c, i) => {
        const IconComponent = c.icon;
        return (
          <div 
            key={i} 
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{c.title}</span>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400">
                  <IconComponent className="h-4 w-4" />
                </div>
              </div>

              <div className="text-2xl font-bold text-white tracking-tight mb-1">
                {c.value}
              </div>

              <div className="text-xs text-slate-400 font-medium">
                {c.sub}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500">vs previous period</span>
              <div className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold ${
                c.variance.isUp 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {c.variance.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                <span>{c.variance.pct}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
