# Dropdown Category Selection for Small Screens

## Problem Solved
On screens ≤400px, the category selection buttons (полная, артикул, категория) were wrapping to a new line because they couldn't fit next to the "Статистика" title in the header.

## Solution Implemented
Created a responsive UI that switches between buttons and dropdown based on screen size:

### For screens > 400px
- **Display**: Traditional button layout 
- **Layout**: Horizontal header with title + button group

### For screens ≤ 400px
- **Display**: Dropdown select element
- **Layout**: Single row header with title + dropdown
- **Benefits**: Saves space, prevents wrapping, cleaner appearance

## Code Changes

### SellerCards.tsx
```typescript
// Track whether to use dropdown mode
const [useDropdown, setUseDropdown] = useState(false)

useEffect(() => {
  const updateUIMode = () => {
    const shouldUseDropdown = window.innerWidth <= 400
    setUseDropdown(shouldUseDropdown)
    setInitialCardsCount(window.innerWidth <= 370 ? 3 : 4)
  }

  updateUIMode()
  window.addEventListener('resize', updateUIMode)
  return () => window.removeEventListener('resize', updateUIMode)
}, [])

// Conditional rendering in header
{useDropdown ? (
  <select 
    className={styles.categorySelect}
    value={activeCategory}
    onChange={(e) => setActiveCategory(e.target.value as StatCategory)}
  >
    <option value="полная">Полная</option>
    <option value="артикул">Артикул</option>
    <option value="категория">Категория</option>
  </select>
) : (
  <div className={styles.categories}>
    {/* Button layout */}
  </div>
)}
```

### SellerCards.module.css
```css
.categorySelect {
  background: #F5F9FD;
  border: 1px solid #e0e0e0;
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-16);
  font-weight: 500;
  color: var(--text-accent);
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg...>'); /* Custom dropdown arrow */
  background-repeat: no-repeat;
  background-position: right var(--spacing-xs) center;
  padding-right: calc(var(--spacing-sm) + 20px);
  min-width: 120px;
}

@media (max-width: 400px) {
  .header {
    flex-direction: row; /* Keep single row layout */
    align-items: center;
    gap: var(--spacing-md);
    justify-content: space-between;
  }
}

@media (max-width: 370px) {
  .categorySelect {
    font-size: 0.9rem;
    padding: 6px var(--spacing-xs);
    min-width: 100px;
  }
}
```

## Features
✅ **Responsive Design**: Automatically switches UI mode based on viewport width
✅ **Smooth Transitions**: Hover and focus states for better UX
✅ **Custom Styling**: Matches existing design system with accent colors
✅ **Accessibility**: Proper select element with keyboard navigation
✅ **Space Efficient**: Prevents layout issues on small screens
✅ **Auto-resize**: Responds to window resize events dynamically

## Result
- Clean, single-row header on screens ≤400px
- No more button wrapping or layout breaks
- Consistent functionality across all screen sizes
- Better mobile user experience