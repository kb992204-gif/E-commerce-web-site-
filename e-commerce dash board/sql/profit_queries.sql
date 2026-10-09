-- Profit & Loss (P&L) Analytics SQL Queries

-- 1. Full Product P&L Matrix grouped by Product and Category
SELECT 
    p.product_id,
    p.product_name,
    p.category,
    SUM(oi.quantity) AS units_sold,
    SUM(oi.quantity * oi.unit_selling_price) AS gross_revenue,
    SUM(oi.discount_amount) AS total_discounts,
    SUM((oi.quantity * oi.unit_selling_price) - oi.discount_amount) AS net_revenue,
    SUM(oi.quantity * oi.unit_cost_price) AS total_cogs,
    SUM(((oi.quantity * oi.unit_selling_price) - oi.discount_amount) - (oi.quantity * oi.unit_cost_price)) AS net_profit,
    ROUND(
        (SUM(((oi.quantity * oi.unit_selling_price) - oi.discount_amount) - (oi.quantity * oi.unit_cost_price)) / 
        NULLIF(SUM((oi.quantity * oi.unit_selling_price) - oi.discount_amount), 0)) * 100, 2
    ) AS profit_margin_percentage,
    CASE 
        WHEN SUM(((oi.quantity * oi.unit_selling_price) - oi.discount_amount) - (oi.quantity * oi.unit_cost_price)) < 0 THEN 'Loss-Making'
        WHEN ROUND((SUM(((oi.quantity * oi.unit_selling_price) - oi.discount_amount) - (oi.quantity * oi.unit_cost_price)) / NULLIF(SUM((oi.quantity * oi.unit_selling_price) - oi.discount_amount), 0)) * 100, 2) >= 30 THEN 'High Margin'
        ELSE 'Moderate Margin'
    END AS profitability_status
FROM products p
LEFT JOIN order_items oi ON p.product_id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.order_id AND o.order_status != 'Cancelled'
GROUP BY p.product_id, p.product_name, p.category
ORDER BY net_profit DESC;

-- 2. Category P&L Benchmark Comparison (Toys vs Groceries vs Electronics)
SELECT 
    p.category,
    SUM((oi.quantity * oi.unit_selling_price) - oi.discount_amount) AS net_revenue,
    SUM(oi.quantity * oi.unit_cost_price) AS cogs,
    SUM(((oi.quantity * oi.unit_selling_price) - oi.discount_amount) - (oi.quantity * oi.unit_cost_price)) AS profit,
    ROUND(
        (SUM(((oi.quantity * oi.unit_selling_price) - oi.discount_amount) - (oi.quantity * oi.unit_cost_price)) / 
        NULLIF(SUM((oi.quantity * oi.unit_selling_price) - oi.discount_amount), 0)) * 100, 2
    ) AS category_profit_margin_pct
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_status != 'Cancelled'
GROUP BY p.category;

-- 3. Historical Period YoY Comparison (Current Year vs Previous Year P&L)
WITH MonthlyPL AS (
    SELECT 
        STRFTIME('%Y-%m', o.order_date) AS year_month,
        SUM((oi.quantity * oi.unit_selling_price) - oi.discount_amount) AS net_revenue,
        SUM(((oi.quantity * oi.unit_selling_price) - oi.discount_amount) - (oi.quantity * oi.unit_cost_price)) AS profit
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    WHERE o.order_status != 'Cancelled'
    GROUP BY STRFTIME('%Y-%m', o.order_date)
)
SELECT 
    year_month,
    net_revenue,
    profit,
    ROUND((profit / NULLIF(net_revenue, 0)) * 100, 2) AS margin_pct
FROM MonthlyPL
ORDER BY year_month ASC;
