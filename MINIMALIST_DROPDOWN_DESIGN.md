# Minimalist Dropdown Design Implementation

## Changes Made

### 1. Clean, Minimalist Dropdown Design
Replaced the styled HTML select with a custom minimalist dropdown that shows only:
- Selected category text
- Simple down arrow (↓)
- Clean dropdown options on click

### 2. Card Layout Optimization
- **Screens ≤400px**: Maximum 3 cards per row
- **Screens ≤370px**: Flexible layout maintained
- Better spacing and visual balance

## Implementation Details

### SellerCards.tsx
```typescript
// Added dropdown state management
const [isDropdownOpen, setIsDropdownOpen] = useState(false)

// Custom dropdown component
<div className={styles.customDropdown}>
  <button className={styles.dropdownTrigger} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
    <span>{activeCategory}</span>
    <span className={styles.dropdownArrow}>↓</span>
  </button>
  {isDropdownOpen && (
    <div className={styles.dropdownOptions}>
      {/* Options */}
    </div>
  )}
</div>

// Click outside to close
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false)
    }
  }
  document.addEventListener('click', handleClickOutside)
  return () => document.removeEventListener('click', handleClickOutside)
}, [isDropdownOpen])
```

### SellerCards.module.css
```css
/* Minimalist dropdown trigger */
.dropdownTrigger {
  background: none;
  border: none;
  padding: 0;
  font-size: var(--font-size-16);
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Clean dropdown options */
.dropdownOptions {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 10;
  min-width: 100px;
  margin-top: 4px;
}

/* 3 cards per row on small screens */
@media (max-width: 400px) {
  .cardsGrid > * {
    max-width: calc(33.333% - 6px);
    flex: 0 0 calc(33.333% - 6px);
  }
}
```

## Design Principles Applied

✅ **Minimalism**: No unnecessary borders, backgrounds, or decorations
✅ **Clean Typography**: Uses existing font weights and colors
✅ **Subtle Interactions**: Simple hover states without heavy styling
✅ **Space Efficiency**: Maximum 3 cards per row on small screens
✅ **Accessibility**: Proper button elements and keyboard navigation
✅ **Responsive**: Adapts cleanly to different screen sizes

## Visual Result
- **Large screens**: Traditional button layout
- **Small screens (≤400px)**: Clean dropdown with just "категория ↓"
- **Card layout**: Better balanced 3-card rows on mobile
- **Interactions**: Subtle hover effects, smooth dropdown behavior

The design now follows a minimalist approach with no unnecessary visual elements, focusing on clean typography and efficient use of space.