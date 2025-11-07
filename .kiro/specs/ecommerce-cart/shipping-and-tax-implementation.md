# Shipping and Tax Implementation

## Overview
Added paid shipping and tax functionality for heavy/specific products. Only certain products have shipping costs and taxes applied, not all products.

## Implementation Details

### Backend Changes

#### 1. Product Model (`server/models/Product.js`)
Added two new fields to the product schema:
- `shippingCost`: Number (in cents) - Default 0, represents shipping cost per item
- `taxRate`: Number (percentage) - Default 0, represents tax rate (e.g., 10 = 10%)

#### 2. Seed Data (`server/seed.js`)
Updated products with shipping and tax information:

**Products with Shipping & Tax:**
- **Mechanical Keyboard**: $4.99 shipping + 8% tax (heavy item)
- **Bluetooth Speaker**: $5.99 shipping + 10% tax (heavy item)
- **Desk Lamp**: $3.99 shipping + 5% tax (heavy item)
- **USB Microphone**: $6.99 shipping + 12% tax (heavy item)

**Products without Shipping & Tax:**
- All other products (11 items) have free shipping and no tax

#### 3. Checkout Controller (`server/controllers/checkoutController.js`)
Enhanced checkout processing to calculate:
- **Subtotal**: Sum of all product prices × quantities
- **Shipping**: Sum of shipping costs × quantities for applicable products
- **Tax**: Calculated on item subtotal using product's tax rate
- **Total**: Subtotal + Shipping + Tax

The receipt now includes breakdown of:
```javascript
{
  subtotal: number,
  shipping: number,
  tax: number,
  total: number,
  timestamp: string,
  items: array,
  customerInfo: object
}
```

### Frontend Changes

#### 1. ProductCard Component (`client/src/components/ProductCard.jsx`)
Added visual badges to show:
- Orange badge: "+ $X.XX shipping" for products with shipping costs
- Blue badge: "X% tax" for products with tax rates
- Badges appear below product name, above price

#### 2. Checkout Component (`client/src/components/Checkout.jsx`)
Enhanced with multiple calculation functions:
- `calculateSubtotal()`: Product prices only
- `calculateShipping()`: Total shipping costs
- `calculateTax()`: Total tax amount
- `calculateTotal()`: Grand total

**Order Summary Section:**
- Shows shipping and tax info for each item
- Displays breakdown: Subtotal, Shipping, Tax, Total
- Only shows shipping/tax lines if amounts > 0

**Receipt Display:**
- Added cost breakdown section with gray background
- Shows subtotal, shipping (if > 0), and tax (if > 0)
- Clear visual separation of costs

## User Experience

### Product Browsing
- Users can immediately see which products have additional costs
- Clear badges indicate shipping fees and tax rates
- No surprises at checkout

### Cart View
- Items show shipping and tax information
- Users know total costs before proceeding to checkout

### Checkout Process
1. Order summary shows per-item costs with shipping/tax notes
2. Breakdown section shows:
   - Subtotal (products only)
   - Shipping (if applicable)
   - Tax (if applicable)
   - Total (final amount)
3. Receipt displays same breakdown after order completion

## Calculation Logic

### Shipping
- Applied per item quantity
- Example: 2 keyboards with $4.99 shipping = $9.98 total shipping

### Tax
- Calculated on item subtotal (price × quantity)
- Example: Keyboard $45.99 × 2 = $91.98, with 8% tax = $7.36 tax

### Total Formula
```
Total = Subtotal + (Σ ShippingCost × Qty) + (Σ ItemSubtotal × TaxRate / 100)
```

## Testing

### Products with Shipping & Tax
1. ✅ Mechanical Keyboard - $4.99 shipping, 8% tax
2. ✅ Bluetooth Speaker - $5.99 shipping, 10% tax
3. ✅ Desk Lamp - $3.99 shipping, 5% tax
4. ✅ USB Microphone - $6.99 shipping, 12% tax

### Products without Shipping & Tax
- ✅ All other 11 products show no additional costs
- ✅ No badges displayed on product cards
- ✅ Checkout shows only subtotal = total

### Checkout Flow
- ✅ Subtotal calculated correctly
- ✅ Shipping costs added per quantity
- ✅ Tax calculated on item subtotals
- ✅ Total matches subtotal + shipping + tax
- ✅ Receipt displays all cost breakdowns
- ✅ Mixed cart (with and without shipping/tax) calculates correctly

## Database Changes

The database was reseeded with updated product data including shipping and tax information. All existing products now have these fields (with 0 values for products without additional costs).

## Notes

- Shipping costs are stored in cents (e.g., 499 = $4.99)
- Tax rates are stored as percentages (e.g., 8 = 8%)
- All calculations maintain cent precision
- Display uses formatPrice utility for consistent formatting
- Only heavy/specific products have additional costs
- Most products (11 out of 15) remain free shipping with no tax
