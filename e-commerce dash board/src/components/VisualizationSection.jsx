import React, { useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { formatCurrency } from '../data/benchmarkData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function VisualizationSection({ records, selectedCategory, currency }) {
  const [activeTab, setActiveTab] = useState('trend'); // 'trend', 'share', 'margin'

  const dateAggMap = {};
  const catShareMap = { "Electronics": 0, "Groceries": 0, "Toys": 0 };
  const prodMarginList = [];

  records.forEach(r => {
    const dateKey = r.order_date.substring(0, 7);
    if (!dateAggMap[dateKey]) {
      dateAggMap[dateKey] = { sales: 0, profit: 0, cogs: 0 };
    }
    dateAggMap[dateKey].sales += r.net_sales || 0;
    dateAggMap[dateKey].profit += r.profit || 0;
    dateAggMap[dateKey].cogs += r.cogs || 0;

    if (catShareMap[r.category] !== undefined) {
      catShareMap[r.category] += r.net_sales || 0;
    }

    const existing = prodMarginList.find(p => p.name === r.product_name);
    if (existing) {
      existing.sales += r.net_sales || 0;
      existing.profit += r.profit || 0;
    } else {
      prodMarginList.push({
        name: r.product_name,
        sales: r.net_sales || 0,
        profit: r.profit || 0
      });
    }
  });

  const sortedDates = Object.keys(dateAggMap).sort();
  const dateLabels = sortedDates.map(d => {
    const [year, month] = d.split('-');
    return new Date(year, month - 1).toLocaleString('en-US', { month: 'short', year: '2-digit' });
  });

  const timelineSales = sortedDates.map(d => dateAggMap[d].sales);
  const timelineProfit = sortedDates.map(d => dateAggMap[d].profit);

  const topProducts = prodMarginList
    .map(p => ({
      name: p.name.length > 18 ? p.name.substring(0, 18) + '...' : p.name,
      marginPct: p.sales > 0 ? (p.profit / p.sales) * 100 : 0
    }))
    .sort((a, b) => b.marginPct - a.marginPct)
    .slice(0, 8);

  // Line Chart Data
  const lineData = {
    labels: dateLabels,
    datasets: [
      {
        label: 'Net Revenue',
        data: timelineSales,
        borderColor: '#818cf8',
        backgroundColor: 'rgba(129, 140, 248, 0.1)',
        fill: true,
        tension: 0.3,
        borderWidth: 3
      },
      {
        label: 'Gross Profit',
        data: timelineProfit,
        borderColor: '#34d399',
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        fill: true,
        tension: 0.3,
        borderWidth: 2.5
      }
    ]
  };

  // Doughnut Data
  const doughnutData = {
    labels: ['Electronics ⚡', 'Groceries 🛒', 'Toys 🎮'],
    datasets: [
      {
        data: [catShareMap["Electronics"], catShareMap["Groceries"], catShareMap["Toys"]],
        backgroundColor: ['#06b6d4', '#10b981', '#a855f7'],
        borderWidth: 2,
        borderColor: '#0f172a'
      }
    ]
  };

  // Bar Data
  const barData = {
    labels: topProducts.map(p => p.name),
    datasets: [
      {
        label: 'Profit Margin (%)',
        data: topProducts.map(p => p.marginPct.toFixed(1)),
        backgroundColor: '#6366f1',
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94a3b8', font: { size: 12, weight: '600' } }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => activeTab === 'margin' ? ` Margin: ${ctx.raw}%` : ` ${ctx.dataset.label}: ${formatCurrency(ctx.raw, currency)}`
        }
      }
    },
    scales: activeTab === 'share' ? {} : {
      x: { grid: { color: 'rgba(51, 65, 85, 0.2)' }, ticks: { color: '#64748b' } },
      y: { grid: { color: 'rgba(51, 65, 85, 0.2)' }, ticks: { color: '#64748b' } }
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100">Visual Performance Analytics</h3>
          <p className="text-xs text-slate-400">Simplified dynamic charts for timeline, revenue split, and margins</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('trend')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'trend' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sales & Profit Trend
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'share' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Revenue Share
          </button>
          <button
            onClick={() => setActiveTab('margin')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'margin' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Margin Ranking
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[320px] w-full">
        {activeTab === 'trend' && <Line data={lineData} options={chartOptions} />}
        {activeTab === 'share' && (
          <div className="h-full flex items-center justify-center">
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
        )}
        {activeTab === 'margin' && <Bar data={barData} options={chartOptions} />}
      </div>
    </div>
  );
}
