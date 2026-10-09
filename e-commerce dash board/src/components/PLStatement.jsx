import React from 'react';
import { X, FileText, Download, Printer, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../data/benchmarkData';

export default function PLStatement({ currentMetrics, selectedCategory, timeHorizon, currency, onClose }) {
  if (!currentMetrics) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Official Financial Summary
              </span>
              <span className="text-xs text-slate-400 font-mono capitalize">
                Period: {timeHorizon} • Scope: {selectedCategory}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Executive Profit & Loss Statement (P&L)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Financial Table */}
        <div className="my-6 space-y-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-2">Line Item Account</th>
                <th className="py-2.5 px-2 text-right">Amount ({currency})</th>
                <th className="py-2.5 px-2 text-right">% of Net Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              
              {/* Gross Sales */}
              <tr>
                <td className="py-2.5 px-2 font-semibold text-slate-200">Gross Sales Revenue</td>
                <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-100">
                  {formatCurrency(currentMetrics.grossSales, currency)}
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-slate-400">
                  {currentMetrics.netSales > 0 ? ((currentMetrics.grossSales / currentMetrics.netSales) * 100).toFixed(1) : 0}%
                </td>
              </tr>

              {/* Discounts */}
              <tr className="text-rose-400">
                <td className="py-2.5 px-2 pl-6">Less: Customer Discounts & Promo Codes</td>
                <td className="py-2.5 px-2 text-right font-mono font-semibold">
                  -{formatCurrency(currentMetrics.discounts, currency)}
                </td>
                <td className="py-2.5 px-2 text-right font-mono">
                  {currentMetrics.netSales > 0 ? ((currentMetrics.discounts / currentMetrics.netSales) * 100).toFixed(1) : 0}%
                </td>
              </tr>

              {/* Net Sales */}
              <tr className="bg-slate-800/40 text-slate-100 font-bold">
                <td className="py-3 px-2">NET REVENUE</td>
                <td className="py-3 px-2 text-right font-mono text-indigo-400">
                  {formatCurrency(currentMetrics.netSales, currency)}
                </td>
                <td className="py-3 px-2 text-right font-mono text-indigo-300">100.0%</td>
              </tr>

              {/* COGS */}
              <tr className="text-slate-400">
                <td className="py-2.5 px-2 pl-6">Less: Cost of Goods Sold (COGS)</td>
                <td className="py-2.5 px-2 text-right font-mono font-semibold text-slate-400">
                  -{formatCurrency(currentMetrics.cogs, currency)}
                </td>
                <td className="py-2.5 px-2 text-right font-mono">
                  {currentMetrics.netSales > 0 ? ((currentMetrics.cogs / currentMetrics.netSales) * 100).toFixed(1) : 0}%
                </td>
              </tr>

              {/* Gross Margin */}
              <tr className="bg-slate-800/60 text-slate-200 font-bold">
                <td className="py-2.5 px-2">GROSS MARGIN</td>
                <td className="py-2.5 px-2 text-right font-mono text-emerald-400">
                  {formatCurrency(currentMetrics.grossSales - currentMetrics.discounts - currentMetrics.cogs, currency)}
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-emerald-300">
                  {currentMetrics.marginPct.toFixed(1)}%
                </td>
              </tr>

              {/* Returns Refunds */}
              <tr className="text-amber-400">
                <td className="py-2.5 px-2 pl-6">Less: Product Return Refunds ({currentMetrics.returnedOrders} orders)</td>
                <td className="py-2.5 px-2 text-right font-mono font-semibold">
                  -{formatCurrency(currentMetrics.totalRefunds, currency)}
                </td>
                <td className="py-2.5 px-2 text-right font-mono">
                  {currentMetrics.netSales > 0 ? ((currentMetrics.totalRefunds / currentMetrics.netSales) * 100).toFixed(1) : 0}%
                </td>
              </tr>

              {/* Final Net Profit */}
              <tr className="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 text-white font-extrabold text-sm border-t-2 border-emerald-500/40">
                <td className="py-3 px-2 text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  NET OPERATING PROFIT
                </td>
                <td className="py-3 px-2 text-right font-mono text-emerald-400 text-base">
                  {formatCurrency(currentMetrics.profit, currency)}
                </td>
                <td className="py-3 px-2 text-right font-mono text-emerald-300">
                  {currentMetrics.marginPct.toFixed(1)}%
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Audited & Compiled deterministically from benchmark records
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all cursor-pointer"
          >
            Close Statement
          </button>
        </div>

      </div>
    </div>
  );
}
