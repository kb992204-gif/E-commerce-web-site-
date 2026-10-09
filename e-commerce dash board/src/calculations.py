"""
Business Calculation Engine for Sales & Profit Analytics.
Provides strict mathematical definitions for Gross Sales, Net Sales, Profit, Profit Margin, AOV, and Return Rate.
"""

def calculate_kpis(records):
    """
    Calculates executive KPIs from order records.
    """
    total_orders = len(records)
    if total_orders == 0:
        return {
            "gross_sales": 0.0,
            "discounts": 0.0,
            "net_sales": 0.0,
            "cogs": 0.0,
            "gross_profit": 0.0,
            "profit_margin_pct": 0.0,
            "total_quantity": 0,
            "total_orders": 0,
            "aov": 0.0,
            "returned_orders": 0,
            "return_rate_pct": 0.0,
            "total_refunds": 0.0
        }

    gross_sales = sum(r.get("gross_sales", 0.0) for r in records)
    discounts = sum(r.get("discount_amount", 0.0) for r in records)
    net_sales = sum(r.get("net_sales", 0.0) for r in records)
    cogs = sum(r.get("cogs", 0.0) for r in records)
    gross_profit = sum(r.get("profit", 0.0) for r in records)
    total_quantity = sum(r.get("quantity", 0) for r in records)
    
    returned_orders = sum(1 for r in records if r.get("is_returned", False))
    total_refunds = sum(r.get("refund_amount", 0.0) for r in records if r.get("is_returned", False))

    profit_margin_pct = (gross_profit / net_sales * 100) if net_sales > 0 else 0.0
    aov = (net_sales / total_orders) if total_orders > 0 else 0.0
    return_rate_pct = (returned_orders / total_orders * 100) if total_orders > 0 else 0.0

    return {
        "gross_sales": round(gross_sales, 2),
        "discounts": round(discounts, 2),
        "net_sales": round(net_sales, 2),
        "cogs": round(cogs, 2),
        "gross_profit": round(gross_profit, 2),
        "profit_margin_pct": round(profit_margin_pct, 2),
        "total_quantity": total_quantity,
        "total_orders": total_orders,
        "aov": round(aov, 2),
        "returned_orders": returned_orders,
        "return_rate_pct": round(return_rate_pct, 2),
        "total_refunds": round(total_refunds, 2)
    }

def calculate_growth(current_kpi, previous_kpi, key):
    """
    Calculates percentage growth between current and previous time horizon KPIs.
    """
    curr_val = current_kpi.get(key, 0.0)
    prev_val = previous_kpi.get(key, 0.0)
    if prev_val == 0.0:
        return 0.0
    growth = ((curr_val - prev_val) / abs(prev_val)) * 100
    return round(growth, 2)
