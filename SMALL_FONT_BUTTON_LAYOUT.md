# Small Font Button Layout Implementation

## Changes Made

### 1. Smaller Font Buttons for ≤400px Screens
- Reduced button font size to 14px
- Decreased padding to 4px 8px
- Added `white-space: nowrap` to prevent text wrapping
- Reduced gap between buttons to `var(--spacing-xs)`
- Set `flex-wrap: nowrap` to keep buttons in one row

### 2. Fixed Card Count Logic
- **≤400px screens**: 3 cards initially (not 4)
- **>400px screens**: 4 cards initially
- This prevents the awkward 4th card wrapping issue you mentioned

### 3. Disabled Dropdown Temporarily
- Set `shouldUseDropdown = false` to test small button approach
- Minimalist dropdown design saved in project memory for future use

## Code Changes

### SellerCards.tsx
```typescript
// Fixed card count logic
setInitialCardsCount(window.innerWidth <= 400 ? 3 : 4)

// Temporarily disabled dropdown to try small buttons
const shouldUseDropdown = false
```

### SellerCards.module.css
```css
@media (max-width: 400px) {
  .categories {
    gap: var(--spacing-xs);        /* Smaller gap */
    flex-wrap: nowrap;             /* Force single row */
  }
  
  .categoryButton {
    font-size: 14px;               /* Smaller font */
    padding: 4px 8px;              /* Compact padding */
    white-space: nowrap;           /* Prevent wrapping */
  }
}
```

## Current Behavior
✅ **≤400px screens**: 3 cards initially, compact buttons in one row
✅ **>400px screens**: 4 cards initially, normal button layout
✅ **Button Layout**: Smaller fonts should fit "полная", "артикул", "категория" in one row
✅ **Card Layout**: No more 4th card wrapping issues

## Fallback Plan
If the small buttons still don't fit properly, we can easily switch back to the minimalist dropdown by setting `shouldUseDropdown = window.innerWidth <= 400` - the dropdown implementation is saved in project memory and ready to use.