import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import TimeHorizonSelector from './components/TimeHorizonSelector';
import KPICards from './components/KPICards';
import CategoryTabs from './components/CategoryTabs';
import VisualizationSection from './components/VisualizationSection';
import ProductMatrix from './components/ProductMatrix';
import ProductDetailModal from './components/ProductDetailModal';
import PLStatement from './components/PLStatement';
import DataUploadModal from './components/DataUploadModal';

import { 
  RAW_DATA, 
  filterDataByPeriod, 
  calculateMetrics 
} from './data/benchmarkData';

export default function App() {
  const [records, setRecords] = useState(RAW_DATA);
  const [currency, setCurrency] = useState('INR');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [horizon, setHorizon] = useState('yoy'); // Default YoY / Past Year for rich benchmark perspective
  const [customStart, setCustomStart] = useState('2026-01-01');
  const [customEnd, setCustomEnd] = useState('2026-10-09');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPLStatementOpen, setIsPLStatementOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Filter records by time horizon
  const { 
    currentRecords, 
    previousRecords, 
    startDate, 
    endDate 
  } = useMemo(() => {
    return filterDataByPeriod(records, horizon, customStart, customEnd);
  }, [records, horizon, customStart, customEnd]);

  // Filter current records by category & search
  const filteredCurrentRecords = useMemo(() => {
    let list = currentRecords;
    if (selectedCategory !== 'All') {
      list = list.filter(r => r.category === selectedCategory);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(r => 
        r.product_name.toLowerCase().includes(q) || 
        r.product_id.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [currentRecords, selectedCategory, searchQuery]);

  const filteredPreviousRecords = useMemo(() => {
    let list = previousRecords;
    if (selectedCategory !== 'All') {
      list = list.filter(r => r.category === selectedCategory);
    }
    return list;
  }, [previousRecords, selectedCategory]);

  // Calculate current & previous metrics
  const currentMetrics = useMemo(() => calculateMetrics(filteredCurrentRecords), [filteredCurrentRecords]);
  const previousMetrics = useMemo(() => calculateMetrics(filteredPreviousRecords), [filteredPreviousRecords]);

  // Calculate stats for Category Pills
  const categoryStats = useMemo(() => {
    const categories = ['All', 'Electronics', 'Groceries', 'Toys'];
    const stats = {};

    categories.forEach(cat => {
      const catRecords = cat === 'All' 
        ? currentRecords 
        : currentRecords.filter(r => r.category === cat);
      
      const m = calculateMetrics(catRecords);
      const uniqueProducts = new Set(catRecords.map(r => r.product_id)).size;

      stats[cat] = {
        netSales: m.netSales,
        profit: m.profit,
        marginPct: m.marginPct,
        count: uniqueProducts
      };
    });

    return stats;
  }, [currentRecords]);

  // Date range formatted label
  const dateRangeText = useMemo(() => {
    if (startDate && endDate) {
      const startStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const endStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `${startStr} - ${endStr}`;
    }
    return 'Benchmark Historical Window';
  }, [startDate, endDate]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header Bar */}
      <Header 
        currency={currency}
        setCurrency={setCurrency}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenPLStatement={() => setIsPLStatementOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        totalRecordsCount={records.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        
        {/* Time Horizon Selector (Weekly, Monthly, YoY, Custom) */}
        <TimeHorizonSelector 
          horizon={horizon}
          setHorizon={setHorizon}
          customStart={customStart}
          setCustomStart={setCustomStart}
          customEnd={customEnd}
          setCustomEnd={setCustomEnd}
          dateRangeText={dateRangeText}
        />

        {/* Executive KPI Cards */}
        <KPICards 
          currentMetrics={currentMetrics}
          previousMetrics={previousMetrics}
          currency={currency}
        />

        {/* Category Filters (All, Electronics, Groceries, Toys) */}
        <CategoryTabs 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categoryStats={categoryStats}
          currency={currency}
        />

        {/* Dynamic Visualization Engine (Line, Pie/Doughnut, Bar Chart Switcher) */}
        <VisualizationSection 
          records={filteredCurrentRecords}
          selectedCategory={selectedCategory}
          currency={currency}
        />

        {/* Product P&L Matrix */}
        <ProductMatrix 
          records={filteredCurrentRecords}
          selectedCategory={selectedCategory}
          currency={currency}
          onSelectProduct={(product) => setSelectedProduct(product)}
        />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        <p>RetailPulse Sales & Profit Analytics System • Multi-Category Commercial Benchmark Engine</p>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          currency={currency}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Executive P&L Financial Statement Modal */}
      {isPLStatementOpen && (
        <PLStatement 
          currentMetrics={currentMetrics}
          selectedCategory={selectedCategory}
          timeHorizon={horizon}
          currency={currency}
          onClose={() => setIsPLStatementOpen(false)}
        />
      )}

      {/* Data Upload & Validation Simulator Modal */}
      {isUploadModalOpen && (
        <DataUploadModal 
          onClose={() => setIsUploadModalOpen(false)}
          onUploadSuccess={() => {
            // Re-trigger refresh notification
            alert("New dataset validated and imported into SQLite database successfully!");
          }}
        />
      )}

    </div>
  );
}
