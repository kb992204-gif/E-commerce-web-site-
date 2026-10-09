"""
Database Handler for E-Commerce P&L Analytics.
Manages SQLite database insertion and querying.
"""

import sqlite3
import os
import json

DB_PATH = "data/processed/ecommerce_analytics.db"

def init_db(schema_path="sql/schema.sql"):
    """Initializes SQLite database using SQL schema."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Read schema
    if os.path.exists(schema_path):
        with open(schema_path, "r", encoding="utf-8") as f:
            schema_sql = f.read()
            # SQLite compatibility adjustment for GENERATED ALWAYS AS if needed
            cursor.executescript(schema_sql)
    conn.commit()
    conn.close()

def load_data_to_sqlite(data):
    """Loads cleaned benchmark data records into SQLite tables."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create simplified sqlite tables for easy querying
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS order_analytics (
        order_id TEXT PRIMARY KEY,
        customer_id TEXT,
        order_date TEXT,
        product_id TEXT,
        product_name TEXT,
        category TEXT,
        quantity INTEGER,
        unit_cost_price REAL,
        unit_selling_price REAL,
        discount_amount REAL,
        gross_sales REAL,
        net_sales REAL,
        cogs REAL,
        profit REAL,
        profit_margin_pct REAL,
        payment_method TEXT,
        shipping_city TEXT,
        shipping_state TEXT,
        is_returned INTEGER,
        return_reason TEXT,
        refund_amount REAL,
        order_status TEXT
    )
    """)

    cursor.execute("DELETE FROM order_analytics")

    for r in data:
        cursor.execute("""
        INSERT INTO order_analytics VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        """, (
            r["order_id"], r["customer_id"], r["order_date"], r["product_id"],
            r["product_name"], r["category"], r["quantity"], r["unit_cost_price"],
            r["unit_selling_price"], r["discount_amount"], r["gross_sales"], r["net_sales"],
            r["cogs"], r["profit"], r["profit_margin_pct"], r["payment_method"],
            r["shipping_city"], r["shipping_state"], 1 if r["is_returned"] else 0,
            r["return_reason"], r["refund_amount"], r["order_status"]
        ))

    conn.commit()
    conn.close()
    print(f"Loaded {len(data)} records into SQLite database at {DB_PATH}")

if __name__ == "__main__":
    init_db()
    with open("data/processed/benchmark_sales_data.json", "r", encoding="utf-8") as f:
        benchmark_data = json.load(f)
    load_data_to_sqlite(benchmark_data)
