"""
Commercial Benchmark Data Generator for E-Commerce P&L Analytics.
Generates realistic commercial transaction datasets for Electronics, Groceries, and Toys.
"""

import json
import random
import datetime
import os
import math

CATEGORIES = {
    "Electronics": [
        {"id": "ELE-001", "name": "Wireless Noise-Canceling Headphones", "cost": 4200, "price": 7999, "margin": 0.47},
        {"id": "ELE-002", "name": "Smart Fitness Watch Ultra", "cost": 3100, "price": 5499, "margin": 0.43},
        {"id": "ELE-003", "name": "4K Ultra HD Smart TV 55-inch", "cost": 28000, "price": 42999, "margin": 0.35},
        {"id": "ELE-004", "name": "Ergonomic Mechanical Keyboard", "cost": 1800, "price": 3299, "margin": 0.45},
        {"id": "ELE-005", "name": "Portable Bluetooth Speaker Max", "cost": 1200, "price": 2499, "margin": 0.52},
        {"id": "ELE-006", "name": "High-Speed USB-C Multiport Dock", "cost": 950, "price": 1899, "margin": 0.50},
        {"id": "ELE-007", "name": "1080p Web Camera with Mic", "cost": 850, "price": 1499, "margin": 0.43},
    ],
    "Groceries": [
        {"id": "GRO-001", "name": "Organic Cold-Pressed Olive Oil 1L", "cost": 520, "price": 899, "margin": 0.42},
        {"id": "GRO-002", "name": "Artisanal Dark Chocolate 85% Pack of 4", "cost": 280, "price": 499, "margin": 0.44},
        {"id": "GRO-003", "name": "Premium Whole Bean Arabica Coffee 500g", "cost": 410, "price": 749, "margin": 0.45},
        {"id": "GRO-004", "name": "Organic Honey Wildflower 500g", "cost": 210, "price": 399, "margin": 0.47},
        {"id": "GRO-005", "name": "Whole Grain Nutritious Granola 1kg", "cost": 320, "price": 599, "margin": 0.46},
        {"id": "GRO-006", "name": "Himalayan Pink Salt Fine 1kg", "cost": 90, "price": 199, "margin": 0.55},
        {"id": "GRO-007", "name": "Matcha Green Tea Powder Ceremonial 100g", "cost": 650, "price": 1199, "margin": 0.45},
    ],
    "Toys": [
        {"id": "TOY-001", "name": "STEM Robotic Building Kit", "cost": 1900, "price": 3499, "margin": 0.45},
        {"id": "TOY-002", "name": "LEGO Architecture Landmark Series", "cost": 3200, "price": 5299, "margin": 0.39},
        {"id": "TOY-003", "name": "Remote-Control Quadcopter Drone", "cost": 2400, "price": 3999, "margin": 0.40},
        {"id": "TOY-004", "name": "Wooden Classic Railway Train Set", "cost": 1100, "price": 1999, "margin": 0.45},
        {"id": "TOY-005", "name": "Plush Jumbo Teddy Bear 3ft", "cost": 650, "price": 1499, "margin": 0.56},
        {"id": "TOY-006", "name": "Interactive Talking Learning Tablet", "cost": 890, "price": 1599, "margin": 0.44},
        {"id": "TOY-007", "name": "Magnetic 3D Building Blocks 100-pc", "cost": 1250, "price": 2299, "margin": 0.45},
    ]
}

PAYMENT_METHODS = ["UPI", "Credit Card", "Cash on Delivery", "Net Banking"]
RETURN_REASONS = ["Damaged in Transit", "Wrong Size/Color", "Quality Not Expected", "Customer Changed Mind"]
CITIES = [
    ("Mumbai", "Maharashtra"),
    ("Bengaluru", "Karnataka"),
    ("Delhi", "Delhi"),
    ("Hyderabad", "Telangana"),
    ("Chennai", "Tamil Nadu"),
    ("Pune", "Maharashtra"),
    ("Ahmedabad", "Gujarat"),
    ("Kolkata", "West Bengal")
]

def generate_benchmark_dataset(num_records=1200, start_date="2025-10-01", end_date="2026-10-09"):
    random.seed(42)
    start_dt = datetime.datetime.strptime(start_date, "%Y-%m-%d")
    end_dt = datetime.datetime.strptime(end_date, "%Y-%m-%d")
    total_days = (end_dt - start_dt).days

    dataset = []

    for i in range(1, num_records + 1):
        cat_name = random.choice(list(CATEGORIES.keys()))
        prod = random.choice(CATEGORIES[cat_name])
        
        # Date distribution with seasonality (higher sales around festival oct/nov and month ends)
        random_day = random.randint(0, total_days)
        order_dt = start_dt + datetime.timedelta(days=random_day, hours=random.randint(8, 22), minutes=random.randint(0, 59))
        
        qty = random.choices([1, 2, 3, 4, 5], weights=[65, 20, 10, 3, 2])[0]
        unit_cost = prod["cost"]
        unit_price = prod["price"]
        
        # Occasional promotional discount
        discount_pct = random.choices([0, 0.05, 0.10, 0.15, 0.20], weights=[60, 20, 10, 7, 3])[0]
        discount_amount = round(qty * unit_price * discount_pct, 2)
        
        gross_sales = round(qty * unit_price, 2)
        net_sales = round(gross_sales - discount_amount, 2)
        total_cogs = round(qty * unit_cost, 2)
        profit = round(net_sales - total_cogs, 2)
        margin_pct = round((profit / net_sales * 100), 2) if net_sales > 0 else 0
        
        # Returns simulation (~4.5% overall return rate)
        is_returned = random.random() < 0.045
        return_reason = random.choice(RETURN_REASONS) if is_returned else None
        refund_amount = net_sales if is_returned else 0.0
        
        city, state = random.choice(CITIES)
        payment_method = random.choices(PAYMENT_METHODS, weights=[45, 30, 15, 10])[0]

        record = {
            "order_id": f"ORD-2026-{10000 + i}",
            "customer_id": f"CUST-{random.randint(100, 999)}",
            "order_date": order_dt.strftime("%Y-%m-%d %H:%M:%S"),
            "product_id": prod["id"],
            "product_name": prod["name"],
            "category": cat_name,
            "quantity": qty,
            "unit_cost_price": unit_cost,
            "unit_selling_price": unit_price,
            "discount_amount": discount_amount,
            "gross_sales": gross_sales,
            "net_sales": net_sales,
            "cogs": total_cogs,
            "profit": profit,
            "profit_margin_pct": margin_pct,
            "payment_method": payment_method,
            "shipping_city": city,
            "shipping_state": state,
            "is_returned": is_returned,
            "return_reason": return_reason,
            "refund_amount": refund_amount,
            "order_status": "Returned" if is_returned else "Delivered"
        }
        dataset.append(record)

    # Sort dataset chronologically
    dataset.sort(key=lambda x: x["order_date"])
    return dataset

if __name__ == "__main__":
    os.makedirs("data/processed", exist_ok=True)
    os.makedirs("data/raw", exist_ok=True)
    data = generate_benchmark_dataset()
    with open("data/processed/benchmark_sales_data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"Generated {len(data)} commercial benchmark records in data/processed/benchmark_sales_data.json")
