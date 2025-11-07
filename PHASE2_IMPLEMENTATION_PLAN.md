# Phase 2 Implementation Plan

## Overview
Phase 2 focuses on core e-commerce features that enhance user engagement and provide a complete shopping experience.

---

## 🎯 Priority Order

### High Priority (Implement First)
1. **Product Details Page** - Essential for any e-commerce site
2. **Wishlist Feature** - Increases user engagement
3. **Dark Mode Toggle** - Modern UX enhancement

### Medium Priority (Implement After)
4. **Product Ratings & Reviews** - Builds trust
5. **Recommended Products** - Increases sales
6. **Customer Feedback Modal** - Collects insights

### Low Priority (Optional)
7. **Persistent Cart Refinement** - Cart already works well

---

## 📦 Feature 1: Product Details Page

### Status: 🚧 IN PROGRESS

### What's Needed:

**Backend:**
- ✅ Add `description` field to Product model
- ⏳ Add descriptions to seed data
- ⏳ Create endpoint: `GET /api/products/:id`

**Frontend:**
- ⏳ Create `ProductDetail.jsx` component
- ⏳ Add route `/product/:id`
- ⏳ Update ProductCard to link to detail page
- ⏳ Implement "Buy Now" button (add to cart + go to checkout)

**Features:**
- Product image (large)
- Product name and category
- Full description
- Price with shipping/tax info
- Stock availability
- Add to Cart button
- Buy Now button (quick checkout)
- Back to Shop button

**Estimated Time:** 2-3 hours

---

## ❤️ Feature 2: Wishlist

### Status: ⏳ PENDING

### What's Needed:

**Backend:**
- Create `Wishlist` model or add to User model
- API endpoints:
  - `POST /api/wishlist` - Add item
  - `DELETE /api/wishlist/:itemId` - Remove item
  - `GET /api/wishlist/:userId` - Get wishlist

**Frontend:**
- Add heart icon to ProductCard
- Create `Wishlist.jsx` page
- Add route `/wishlist`
- Toggle heart state (filled/outline)
- Use localStorage for guests
- Sync with backend for logged-in users

**Features:**
- Heart icon on all product cards
- Click to add/remove from wishlist
- Wishlist page showing saved items
- Move to cart from wishlist
- Wishlist count in navigation

**Estimated Time:** 3-4 hours

---

## 🌙 Feature 3: Dark Mode

### Status: ⏳ PENDING

### What's Needed:

**Frontend Only:**
- Add dark mode CSS classes to `index.css`
- Create `ThemeToggle.jsx` component
- Add toggle to navigation
- Store preference in localStorage
- Apply theme on app load
- Update components for dark mode support

**Components to Update:**
- All pages (Landing, Shop, Cart, Checkout, Orders)
- All components (ProductCard, Toast, etc.)
- Navigation headers

**Features:**
- Sun/Moon toggle icon
- Smooth transitions
- Persistent preference
- System preference detection (optional)

**Estimated Time:** 3-4 hours

---

## ⭐ Feature 4: Product Ratings & Reviews

### Status: ⏳ PENDING

### What's Needed:

**Backend:**
- Create `Review` model
- API endpoints:
  - `POST /api/reviews` - Submit review
  - `GET /api/reviews/product/:productId` - Get reviews
  - `PUT /api/products/:id/rating` - Update average rating

**Frontend:**
- Create `StarRating.jsx` component
- Create `ReviewForm.jsx` component
- Create `ReviewList.jsx` component
- Add to ProductDetail page
- Show average rating on ProductCard

**Features:**
- 5-star rating system
- Review text (optional)
- Display average rating
- Show review count
- Sort reviews (newest, highest rated)
- Only allow reviews from purchasers (optional)

**Estimated Time:** 4-6 hours

---

## 💡 Feature 5: Recommended Products

### Status: ⏳ PENDING

### What's Needed:

**Backend:**
- Create `ViewHistory` model
- Track product views
- Recommendation algorithm:
  - Recently viewed
  - Same category
  - Similar price range
- API endpoint: `GET /api/products/recommended/:userId`

**Frontend:**
- Create "Recommended for You" section
- Add to homepage
- Add to ProductDetail page
- Use localStorage for guests

**Features:**
- Show 4-6 recommended products
- Based on browsing history
- Category-based recommendations
- Price-based recommendations

**Estimated Time:** 3-4 hours

---

## 💬 Feature 6: Customer Feedback Modal

### Status: ⏳ PENDING

### What's Needed:

**Backend:**
- Create `Feedback` model
- API endpoint: `POST /api/feedback`

**Frontend:**
- Create `FeedbackModal.jsx` component
- Show after successful checkout
- Star rating for experience
- Optional comment field
- Skip and Submit buttons
- Store in localStorage to avoid repeats

**Features:**
- Appears after order completion
- 5-star rating
- Optional feedback text
- Thank you message
- Only shows once per session

**Estimated Time:** 2 hours

---

## 🛒 Feature 7: Persistent Cart Refinement

### Status: ⏳ PENDING (Low Priority)

### What's Needed:

**Backend:**
- Already implemented! Cart is in MongoDB

**Frontend:**
- Update cart to use real user IDs
- Sync cart on login
- Merge guest cart with user cart
- Clear cart after checkout

**Features:**
- Cart persists across sessions
- Guest cart merges on login
- Cart clears after order

**Estimated Time:** 2 hours

---

## 📊 Implementation Strategy

### Recommended Approach:

**Week 1:**
1. Complete Product Details Page (Day 1-2)
2. Implement Wishlist Feature (Day 3-4)
3. Add Dark Mode Toggle (Day 5)

**Week 2:**
4. Add Product Ratings & Reviews (Day 1-3)
5. Implement Recommended Products (Day 4-5)
6. Add Customer Feedback Modal (Day 6)
7. Refine Persistent Cart (Day 7)

---

## 🎯 Current Focus

**Let's start with Product Details Page** as it's the most essential feature for an e-commerce site.

### Next Steps:
1. ✅ Add description field to Product model
2. Add descriptions to seed data
3. Create ProductDetail component
4. Add API endpoint for single product
5. Update ProductCard to link to details
6. Test functionality

**Ready to continue?**
