import React from 'react';
import { 
  X, 
  Package, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CreditCard, 
  RotateCcw,
  CheckCircle,
  FileSpreadsheet,
  PieChart
} from 'lucide-react';
import { formatCurrency } from '../data/benchmarkData';

export default function ProductDetailModal({ product, currency, onClose }) {
  if (!product) return null;

  const unitProfit = product.sellingPrice - product.costPrice;
  const unitMarginPct = product.sellingPrice > 0 ? (unitProfit / product.sellingPrice) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl">
              {product.category === 'Electronics' ? '⚡' : product.category === 'Groceries' ? '🛒' : '🎮'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-400">
                  {product.category}
                </span>
                <span className="text-xs text-slate-500 font-mono">SKU: {product.id}</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">{product.name}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Product Unit Economics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-2xl">
            <span className="text-[11px] text-slate-400 block font-medium">Selling Price / Unit</span>
            <span className="text-base font-bold text-white">{formatCurrency(product.sellingPrice, currency)}</span>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-2xl">
            <span className="text-[11px] text-slate-400 block font-medium">Cost Price / Unit</span>
            <span className="text-base font-bold text-slate-300">{formatCurrency(product.costPrice, currency)}</span>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-2xl">
            <span className="text-[11px] text-slate-400 block font-medium">Unit Profit Contribution</span>
            <span className="text-base font-bold text-emerald-400">{formatCurrency(unitProfit, currency)}</span>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-2xl">
            <span className="text-[11px] text-slate-400 block font-medium">Target Unit Margin</span>
            <span className="text-base font-bold text-indigo-400">{unitMarginPct.toFixed(1)}%</span>
          </div>
        </div>

        {/* Detailed P&L Financial Statement Breakdown */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-6">
          <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-indigo-400" />
            Product Line Item P&L Financial Statement
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800/60 text-slate-300">
              <span>Gross Sales Revenue ({product.unitsSold} units)</span>
              <span className="font-mono font-semibold">{formatCurrency(product.grossSales, currency)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60 text-slate-400">
              <span>Less Promotional Discounts & Coupons</span>
              <span className="font-mono font-semibold text-rose-400">-{formatCurrency(product.discounts, currency)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700 text-slate-100 font-bold bg-slate-900/50 px-2 rounded-lg">
              <span>Net Sales Revenue</span>
              <span className="font-mono text-indigo-300">{formatCurrency(product.netSales, currency)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60 text-slate-400">
              <span>Less Cost of Goods Sold (COGS)</span>
              <span className="font-mono font-semibold text-slate-400">-{formatCurrency(product.cogs, currency)}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-indigo-500/30 text-emerald-400 font-extrabold text-sm bg-emerald-500/5 px-2 rounded-lg">
              <span>Total Product Net Profit</span>
              <span className="font-mono">{formatCurrency(product.profit, currency)}</span>
            </div>
          </div>
        </div>

        {/* Return Logs & Payment Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Returns Analysis */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-amber-400" />
              Return Log & Refunds
            </h4>
            <div className="text-xs space-y-1.5 text-slate-400">
              <div className="flex justify-between">
                <span>Returned Units:</span>
                <span className="font-mono text-white font-semibold">{product.returnedUnits} units</span>
              </div>
              <div className="flex justify-between">
                <span>Return Rate (%):</span>
                <span className="font-mono text-amber-400 font-semibold">{product.returnRatePct.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Refunded Amount:</span>
                <span className="font-mono text-rose-400 font-semibold">{formatCurrency(product.refunds, currency)}</span>
              </div>
            </div>
          </div>

          {/* Payment Distribution */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-cyan-400" />
              Payment Channels Split
            </h4>
            <div className="space-y-1 text-xs">
              {Object.entries(product.paymentMethods).map(([method, count]) => (
                <div key={method} className="flex items-center justify-between text-slate-400">
                  <span>{method}:</span>
                  <span className="font-mono font-semibold text-slate-200">{count} orders</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Action Close Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            Close Product Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
