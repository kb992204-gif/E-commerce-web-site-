-- Sales Analytics SQL Queries

-- 1. Total Sales Summary by Category (Toys, Groceries, Electronics)
SELECT 
    p.category,
    COUNT(DISTINCT oi.order_id) AS total_orders,
    SUM(oi.quantity) AS total_units_sold,
    SUM(oi.quantity * oi.unit_selling_price) AS gross_sales,
    SUM(oi.discount_amount) AS total_discounts,
    SUM(oi.gross_sales - oi.discount_amount) AS net_sales,
    AVG(oi.gross_sales - oi.discount_amount) AS avg_item_sale_value
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_status != 'Cancelled'
GROUP BY p.category
ORDER BY net_sales DESC;

-- 2. Daily Sales Trend with Growth Rate Calculation
WITH DailySales AS (
    SELECT 
        DATE(o.order_date) AS sale_date,
        SUM(oi.gross_sales - oi.discount_amount) AS net_sales,
        COUNT(DISTINCT o.order_id) AS order_count
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    WHERE o.order_status != 'Cancelled'
    GROUP BY DATE(o.order_date)
)
SELECT 
    sale_date,
    net_sales,
    order_count,
    LAG(net_sales, 1) OVER (ORDER BY sale_date) AS prev_day_sales,
    ROUND(((net_sales - LAG(net_sales, 1) OVER (ORDER BY sale_date)) / NULLIF(LAG(net_sales, 1) OVER (ORDER BY sale_date), 0)) * 100, 2) AS daily_growth_pct
FROM DailySales
ORDER BY sale_date DESC;

-- 3. Top Selling Products by Net Revenue
SELECT 
    p.product_id,
    p.product_name,
    p.category,
    SUM(oi.quantity) AS units_sold,
    SUM(oi.gross_sales - oi.discount_amount) AS net_revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_status != 'Cancelled'
GROUP BY p.product_id, p.product_name, p.category
ORDER BY net_revenue DESC
LIMIT 10;
