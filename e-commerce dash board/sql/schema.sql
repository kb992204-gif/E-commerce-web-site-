-- E-Commerce Sales, Profit & Loss Database Schema
-- Standard PostgreSQL / SQLite compatible DDL schema

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    customer_id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50) DEFAULT 'India',
    registration_date DATE NOT NULL
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
    product_id VARCHAR(50) PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Toys, Groceries, Electronics
    sub_category VARCHAR(50),
    brand VARCHAR(50),
    cost_price DECIMAL(10, 2) NOT NULL,
    selling_price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    order_date TIMESTAMP NOT NULL,
    order_status VARCHAR(30) NOT NULL, -- Delivered, Shipped, Pending, Cancelled, Returned
    payment_method VARCHAR(30) NOT NULL, -- UPI, Cash on Delivery, Credit Card, Net Banking
    delivery_status VARCHAR(30),
    shipping_city VARCHAR(50),
    shipping_state VARCHAR(50)
);

-- 4. Order Items Table (Contains P&L line-item calculations)
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(order_id),
    product_id VARCHAR(50) REFERENCES products(product_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_cost_price DECIMAL(10, 2) NOT NULL,
    unit_selling_price DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    gross_sales DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_selling_price) STORED,
    net_sales DECIMAL(10, 2) GENERATED ALWAYS AS ((quantity * unit_selling_price) - discount_amount) STORED,
    total_cost DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_cost_price) STORED,
    profit DECIMAL(10, 2) GENERATED ALWAYS AS (((quantity * unit_selling_price) - discount_amount) - (quantity * unit_cost_price)) STORED
);

-- 5. Returns Table
CREATE TABLE IF NOT EXISTS returns (
    return_id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(order_id),
    product_id VARCHAR(50) REFERENCES products(product_id),
    return_date TIMESTAMP NOT NULL,
    return_reason VARCHAR(100), -- Damaged, Wrong Product, Quality Issue, Customer Changed Mind
    return_quantity INT NOT NULL,
    refund_amount DECIMAL(10, 2) NOT NULL,
    return_status VARCHAR(30) DEFAULT 'Approved'
);

-- Indexes for optimal analytics performance
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);
