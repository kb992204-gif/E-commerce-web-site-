import React, { useState } from 'react';
import { Package, ArrowUpDown, ChevronRight, Search } from 'lucide-react';
import { formatCurrency } from '../data/benchmarkData';

export default function ProductMatrix({ 
  records, 
  selectedCategory, 
  currency, 
  onSelectProduct 
}) {
  const [sortField, setSortField] = useState('profit');
  const [sortOrder, setSortOrder] = useState('desc');
  const [matrixSearch, setMatrixSearch] = useState('');

  const productMap = {};

  records.forEach(r => {
    if (!productMap[r.product_id]) {
      productMap[r.product_id] = {
        id: r.product_id,
        name: r.product_name,
        category: r.category,
        costPrice: r.unit_cost_price,
        sellingPrice: r.unit_selling_price,
        unitsSold: 0,
        grossSales: 0,
        discounts: 0,
        netSales: 0,
        cogs: 0,
        profit: 0,
        returnedUnits: 0,
        refunds: 0,
        paymentMethods: {}
      };
    }

    const p = productMap[r.product_id];
    p.unitsSold += r.quantity || 0;
    p.grossSales += r.gross_sales || 0;
    p.discounts += r.discount_amount || 0;
    p.netSales += r.net_sales || 0;
    p.cogs += r.cogs || 0;
    p.profit += r.profit || 0;

    if (r.is_returned || r.order_status === "Returned") {
      p.returnedUnits += 1;
      p.refunds += r.refund_amount || r.net_sales || 0;
    }

    p.paymentMethods[r.payment_method] = (p.paymentMethods[r.payment_method] || 0) + 1;
  });

  let productList = Object.values(productMap);

  if (selectedCategory !== 'All') {
    productList = productList.filter(p => p.category === selectedCategory);
  }

  if (matrixSearch.trim() !== '') {
    const q = matrixSearch.toLowerCase();
    productList = productList.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.id.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  productList = productList.map(p => {
    const marginPct = p.netSales > 0 ? (p.profit / p.netSales) * 100 : 0;
    const returnRatePct = p.unitsSold > 0 ? (p.returnedUnits / p.unitsSold) * 100 : 0;
    return { ...p, marginPct, returnRatePct };
  });

  productList.sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (sortField === 'units') { valA = a.unitsSold; valB = b.unitsSold; }
    if (sortField === 'sales') { valA = a.netSales; valB = b.netSales; }
    if (sortField === 'margin') { valA = a.marginPct; valB = b.marginPct; }

    return sortOrder === 'desc' ? valB - valA : valA - valB;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Package className="h-5 w-5 text-indigo-400" />
            Product Profit & Loss Table
          </h3>
          <p className="text-xs text-slate-400">Click any product row to view line-item details & unit economics</p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search items..."
            value={matrixSearch}
            onChange={(e) => setMatrixSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase bg-slate-950/60">
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('units')}>
                Units Sold
              </th>
              <th className="py-3 px-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('sales')}>
                Net Revenue
              </th>
              <th className="py-3 px-4 text-right">COGS</th>
              <th className="py-3 px-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('profit')}>
                Net Profit
              </th>
              <th className="py-3 px-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('margin')}>
                Margin %
              </th>
              <th className="py-3 px-4 text-center">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {productList.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  No matching products found.
                </td>
              </tr>
            ) : (
              productList.map((prod) => (
                <tr 
                  key={prod.id}
                  onClick={() => onSelectProduct(prod)}
                  className="hover:bg-slate-800/70 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-100 group-hover:text-indigo-400">
                    {prod.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950 text-slate-300">
                      {prod.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-300 font-mono">
                    {prod.unitsSold}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-100 font-bold font-mono">
                    {formatCurrency(prod.netSales, currency)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-400 font-mono">
                    {formatCurrency(prod.cogs, currency)}
                  </td>
                  <td className={`py-3.5 px-4 text-right font-bold font-mono ${
                    prod.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {formatCurrency(prod.profit, currency)}
                  </td>
                  <td className={`py-3.5 px-4 text-right font-bold font-mono ${
                    prod.marginPct >= 40 ? 'text-emerald-400' : prod.marginPct >= 20 ? 'text-indigo-400' : 'text-rose-400'
                  }`}>
                    {prod.marginPct.toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all text-[11px] font-semibold">
                      View P&L
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
