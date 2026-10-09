-- Customer & Payment Analytics SQL Queries

-- 1. Payment Method Breakdown (UPI, Cash on Delivery, Credit Card, Net Banking)
SELECT 
    o.payment_method,
    COUNT(DISTINCT o.order_id) AS total_orders,
    SUM((oi.quantity * oi.unit_selling_price) - oi.discount_amount) AS total_revenue,
    ROUND(
        COUNT(DISTINCT o.order_id) * 100.0 / (SELECT COUNT(*) FROM orders WHERE order_status != 'Cancelled'), 2
    ) AS order_percentage
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.order_status != 'Cancelled'
GROUP BY o.payment_method
ORDER BY total_revenue DESC;

-- 2. Customer Value and Repeat Purchase Frequency
SELECT 
    c.customer_id,
    c.customer_name,
    c.city,
    c.state,
    COUNT(DISTINCT o.order_id) AS order_count,
    SUM((oi.quantity * oi.unit_selling_price) - oi.discount_amount) AS lifetime_value,
    AVG((oi.quantity * oi.unit_selling_price) - oi.discount_amount) AS avg_order_value
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.order_status != 'Cancelled'
GROUP BY c.customer_id, c.customer_name, c.city, c.state
ORDER BY lifetime_value DESC
LIMIT 15;
