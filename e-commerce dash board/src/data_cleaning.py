"""
Data Cleaning & Transformation Pipeline.
Handles raw dataset formatting, missing dates, category normalization, and line-item financial calculations.
"""

def clean_and_transform_data(records):
    """
    Cleans raw uploaded records and computes calculated columns:
    gross_sales, net_sales, cogs, profit, profit_margin_pct.
    """
    cleaned = []
    for r in records:
        cat = str(r.get("category", "General")).strip()
        if cat.lower() in ["elec", "electronics", "gadgets"]:
            cat = "Electronics"
        elif cat.lower() in ["groc", "groceries", "food"]:
            cat = "Groceries"
        elif cat.lower() in ["toy", "toys", "gaming"]:
            cat = "Toys"

        qty = int(r.get("quantity", 1))
        cost = float(r.get("unit_cost_price", 0))
        price = float(r.get("unit_selling_price", 0))
        discount = float(r.get("discount_amount", 0))

        gross_sales = round(qty * price, 2)
        net_sales = round(gross_sales - discount, 2)
        cogs = round(qty * cost, 2)
        profit = round(net_sales - cogs, 2)
        margin_pct = round((profit / net_sales * 100), 2) if net_sales > 0 else 0.0

        cleaned_record = {
            "order_id": str(r.get("order_id")),
            "customer_id": str(r.get("customer_id", "CUST-000")),
            "order_date": str(r.get("order_date")),
            "product_id": str(r.get("product_id")),
            "product_name": str(r.get("product_name")),
            "category": cat,
            "quantity": qty,
            "unit_cost_price": cost,
            "unit_selling_price": price,
            "discount_amount": discount,
            "gross_sales": gross_sales,
            "net_sales": net_sales,
            "cogs": cogs,
            "profit": profit,
            "profit_margin_pct": margin_pct,
            "payment_method": str(r.get("payment_method", "UPI")),
            "shipping_city": str(r.get("shipping_city", "Mumbai")),
            "shipping_state": str(r.get("shipping_state", "Maharashtra")),
            "is_returned": bool(r.get("is_returned", False)),
            "return_reason": r.get("return_reason"),
            "refund_amount": float(r.get("refund_amount", 0.0)),
            "order_status": str(r.get("order_status", "Delivered"))
        }
        cleaned.append(cleaned_record)

    return cleaned
