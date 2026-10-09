// Import benchmark dataset from JSON
import rawBenchmarkData from '../../data/processed/benchmark_sales_data.json';

export const RAW_DATA = rawBenchmarkData;

// Product metadata with images / icons
export const PRODUCT_CATALOG = {
  "Electronics": [
    { id: "ELE-001", name: "Wireless Noise-Canceling Headphones", price: 7999, cost: 4200, icon: "🎧", brand: "Sony Tech" },
    { id: "ELE-002", name: "Smart Fitness Watch Ultra", price: 5499, cost: 3100, icon: "⌚", brand: "FitPulse" },
    { id: "ELE-003", name: "4K Ultra HD Smart TV 55-inch", price: 42999, cost: 28000, icon: "📺", brand: "VisionX" },
    { id: "ELE-004", name: "Ergonomic Mechanical Keyboard", price: 3299, cost: 1800, icon: "⌨️", brand: "KeyMaster" },
    { id: "ELE-005", name: "Portable Bluetooth Speaker Max", price: 2499, cost: 1200, icon: "🔊", brand: "SoundWave" },
    { id: "ELE-006", name: "High-Speed USB-C Multiport Dock", price: 1899, cost: 950, icon: "🔌", brand: "OmniHub" },
    { id: "ELE-007", name: "1080p Web Camera with Mic", price: 1499, cost: 850, icon: "📷", brand: "StreamCam" }
  ],
  "Groceries": [
    { id: "GRO-001", name: "Organic Cold-Pressed Olive Oil 1L", price: 899, cost: 520, icon: "🫒", brand: "TerraPure" },
    { id: "GRO-002", name: "Artisanal Dark Chocolate 85% Pack of 4", price: 499, cost: 280, icon: "🍫", brand: "CacaoLux" },
    { id: "GRO-003", name: "Premium Whole Bean Arabica Coffee 500g", price: 749, cost: 410, icon: "☕", brand: "RoastCraft" },
    { id: "GRO-004", name: "Organic Honey Wildflower 500g", price: 399, cost: 210, icon: "🍯", brand: "BeeGold" },
    { id: "GRO-005", name: "Whole Grain Nutritious Granola 1kg", price: 599, cost: 320, icon: "🥣", brand: "NutriFlakes" },
    { id: "GRO-006", name: "Himalayan Pink Salt Fine 1kg", price: 199, cost: 90, icon: "🧂", brand: "PureEarth" },
    { id: "GRO-007", name: "Matcha Green Tea Powder Ceremonial 100g", price: 1199, cost: 650, icon: "🍵", brand: "ZenLeaf" }
  ],
  "Toys": [
    { id: "TOY-001", name: "STEM Robotic Building Kit", price: 3499, cost: 1900, icon: "🤖", brand: "RoboMind" },
    { id: "TOY-002", name: "LEGO Architecture Landmark Series", price: 5299, cost: 3200, icon: "🧱", brand: "BrickArt" },
    { id: "TOY-003", name: "Remote-Control Quadcopter Drone", price: 3999, cost: 2400, icon: "🛸", brand: "SkyFlyer" },
    { id: "TOY-004", name: "Wooden Classic Railway Train Set", price: 1999, cost: 1100, icon: "🚂", brand: "WoodCraft" },
    { id: "TOY-005", name: "Plush Jumbo Teddy Bear 3ft", price: 1499, cost: 650, icon: "🧸", brand: "SoftHug" },
    { id: "TOY-006", name: "Interactive Talking Learning Tablet", price: 1599, cost: 890, icon: "📱", brand: "KidGenius" },
    { id: "TOY-007", name: "Magnetic 3D Building Blocks 100-pc", price: 2299, cost: 1250, icon: "🧲", brand: "MagnaForm" }
  ]
};

// Helper: Date filtering logic
export function filterDataByPeriod(data, horizon, customStart, customEnd) {
  const refDate = new Date("2026-10-09T23:59:59"); // Benchmark Anchor Date (Matches current system time context)

  let startDate = new Date(refDate);
  let endDate = new Date(refDate);
  let prevStartDate = new Date(refDate);
  let prevEndDate = new Date(refDate);

  if (horizon === "weekly") {
    // Current Week (Last 7 Days)
    startDate.setDate(refDate.getDate() - 7);
    // Prior Week (7 to 14 days ago)
    prevEndDate.setDate(refDate.getDate() - 7);
    prevStartDate.setDate(refDate.getDate() - 14);
  } else if (horizon === "monthly") {
    // Current Month (Last 30 Days)
    startDate.setDate(refDate.getDate() - 30);
    // Prior Month (30 to 60 days ago)
    prevEndDate.setDate(refDate.getDate() - 30);
    prevStartDate.setDate(refDate.getDate() - 60);
  } else if (horizon === "yoy") {
    // Past Year / YoY (Last 365 Days)
    startDate.setDate(refDate.getDate() - 365);
    // Prior Year (365 to 730 days ago)
    prevEndDate.setDate(refDate.getDate() - 365);
    prevStartDate.setDate(refDate.getDate() - 730);
  } else if (horizon === "custom" && customStart && customEnd) {
    startDate = new Date(customStart);
    endDate = new Date(customEnd + "T23:59:59");
    const durationDays = Math.max(1, Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)));
    prevEndDate = new Date(startDate);
    prevStartDate = new Date(startDate);
    prevStartDate.setDate(startDate.getDate() - durationDays);
  }

  const currentRecords = data.filter(item => {
    const itemDate = new Date(item.order_date);
    return itemDate >= startDate && itemDate <= endDate;
  });

  const previousRecords = data.filter(item => {
    const itemDate = new Date(item.order_date);
    return itemDate >= prevStartDate && itemDate <= prevEndDate;
  });

  return { currentRecords, previousRecords, startDate, endDate, prevStartDate, prevEndDate };
}

// Helper: Calculate complete P&L metrics
export function calculateMetrics(records) {
  if (!records || records.length === 0) {
    return {
      grossSales: 0,
      discounts: 0,
      netSales: 0,
      cogs: 0,
      profit: 0,
      marginPct: 0,
      totalOrders: 0,
      totalQuantity: 0,
      aov: 0,
      returnedOrders: 0,
      returnRatePct: 0,
      totalRefunds: 0
    };
  }

  let grossSales = 0;
  let discounts = 0;
  let netSales = 0;
  let cogs = 0;
  let profit = 0;
  let totalQuantity = 0;
  let returnedOrders = 0;
  let totalRefunds = 0;

  records.forEach(r => {
    grossSales += r.gross_sales || 0;
    discounts += r.discount_amount || 0;
    netSales += r.net_sales || 0;
    cogs += r.cogs || 0;
    profit += r.profit || 0;
    totalQuantity += r.quantity || 0;

    if (r.is_returned || r.order_status === "Returned") {
      returnedOrders += 1;
      totalRefunds += r.refund_amount || r.net_sales || 0;
    }
  });

  const totalOrders = records.length;
  const marginPct = netSales > 0 ? (profit / netSales) * 100 : 0;
  const aov = totalOrders > 0 ? netSales / totalOrders : 0;
  const returnRatePct = totalOrders > 0 ? (returnedOrders / totalOrders) * 100 : 0;

  return {
    grossSales,
    discounts,
    netSales,
    cogs,
    profit,
    marginPct,
    totalOrders,
    totalQuantity,
    aov,
    returnedOrders,
    returnRatePct,
    totalRefunds
  };
}

// Format Currency Utility
export function formatCurrency(amount, currency = "INR") {
  const symbol = currency === "INR" ? "₹" : "$";
  const factor = currency === "INR" ? 1 : 0.012; // INR to USD conversion approx
  const val = Math.abs(amount * factor);

  let formattedVal = val.toLocaleString("en-IN", {
    maximumFractionDigits: 0
  });

  return `${amount < 0 ? "-" : ""}${symbol}${formattedVal}`;
}
