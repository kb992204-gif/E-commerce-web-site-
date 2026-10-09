# RetailPulse: Multi-Category Sales & Profit (P&L) Analytics Dashboard

A real-world e-commerce sales and profit & loss analytics web application built with **React**, **Vite**, **Tailwind CSS**, **Chart.js**, and **Python / SQLite**.

## Features

- **Multi-Category Retail Organization**: Grouped into **Electronics ⚡**, **Groceries 🛒**, and **Toys & Gaming 🎮**.
- **Product P&L Inspector**: Click any product to view line-item financial metrics (Gross Sales, Discounts, Net Sales, COGS, Net Profit, Unit Margin %, Payment channels, and Returns).
- **Time Horizon Comparison Engine**: Toggle between **Weekly**, **Monthly**, **Past Year (YoY)**, and **Custom Range** date filters with automated variance growth badges.
- **Dynamic Best-Fit Visualizations**: Interactive Line, Doughnut, and Bar charts powered by Chart.js.
- **Executive P&L Income Statement**: Printable financial breakdown.
- **Data Import & Validation System**: Upload CSV/Excel transaction datasets with automated schema validation and duplicate checking.
- **Commercial Benchmark Dataset**: Pre-populated with 1,200 commercial transaction logs across 2025–2026.

---

## Tech Stack

- **Frontend**: React 19, Vite 6, Tailwind CSS v4, Lucide Icons, Chart.js 4
- **Data Processing & Backend**: Python 3.14, Pandas, SQLite
- **Database Schema**: SQL DDL & Aggregation Queries (`sql/schema.sql`, `sales_queries.sql`, `profit_queries.sql`, `customer_queries.sql`)

---

## Project Structure

```text
ecommerce-dashboard/
├── data/
│   ├── raw/
│   └── processed/
│       ├── benchmark_sales_data.json
│       └── ecommerce_analytics.db
├── sql/
│   ├── schema.sql
│   ├── sales_queries.sql
│   ├── profit_queries.sql
│   └── customer_queries.sql
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── TimeHorizonSelector.jsx
│   │   ├── KPICards.jsx
│   │   ├── CategoryTabs.jsx
│   │   ├── VisualizationSection.jsx
│   │   ├── ProductMatrix.jsx
│   │   ├── ProductDetailModal.jsx
│   │   ├── PLStatement.jsx
│   │   └── DataUploadModal.jsx
│   ├── data/
│   │   └── benchmarkData.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── src_backend/
│   ├── data_generator.py
│   ├── database.py
│   ├── calculations.py
│   ├── validation.py
│   └── data_cleaning.py
├── package.json
├── vite.config.js
├── requirements.txt
└── README.md
```

---

## Getting Started

### 1. Frontend Web Dashboard
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Python Benchmark Data Generator & Database Sync
```bash
python src/data_generator.py
python src/database.py
```

---

## License
MIT License
