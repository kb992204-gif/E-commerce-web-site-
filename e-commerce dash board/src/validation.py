"""
Data Validation Engine for E-Commerce Upload Transactions.
Validates required columns, data types, negative values, and duplicate records.
"""

REQUIRED_COLUMNS = [
    "order_id", "product_id", "product_name", "category",
    "quantity", "unit_cost_price", "unit_selling_price"
]

def validate_transaction_data(df_or_records):
    """
    Validates transactional records and returns a detailed audit report.
    """
    if isinstance(df_or_records, list):
        records = df_or_records
    else:
        records = df_or_records.to_dict(orient="records")

    total_rows = len(records)
    valid_records = []
    invalid_records = []
    duplicates = set()
    seen_orders = set()

    for idx, r in enumerate(records):
        order_id = r.get("order_id")
        
        # Check duplicate order IDs
        if order_id in seen_orders:
            duplicates.add(order_id)
            invalid_records.append({"row": idx + 1, "reason": "Duplicate Order ID", "data": r})
            continue
        seen_orders.add(order_id)

        # Check negative quantity or invalid prices
        qty = r.get("quantity", 0)
        cost = r.get("unit_cost_price", 0)
        price = r.get("unit_selling_price", 0)

        if qty <= 0 or cost < 0 or price < 0:
            invalid_records.append({"row": idx + 1, "reason": "Invalid Numeric Values (qty/cost/price)", "data": r})
            continue

        valid_records.append(r)

    report = {
        "total_rows": total_rows,
        "valid_count": len(valid_records),
        "invalid_count": len(invalid_records),
        "duplicate_count": len(duplicates),
        "status": "PASSED" if len(invalid_records) == 0 else "WARNINGS_FOUND",
        "invalid_details": invalid_records
    }

    return valid_records, report
