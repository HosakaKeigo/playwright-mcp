# Goal-Based Navigation Example

This example demonstrates how to use the `goal` parameter to optimize snapshot digestion for specific tasks.

## E-Commerce Shopping Example

When shopping for a specific product, you can provide goals at each step:

```javascript
// Step 1: Navigate to the store with a shopping goal
await browser_navigate({
  url: "https://store.example.com",
  goal: "Find blue t-shirts in size medium under $30"
});

// The digest will highlight:
// - Product category navigation
// - Search functionality
// - Filter options for color, size, and price

// Step 2: After reaching product listings
await browser_snapshot({
  goal: "Compare available blue t-shirts and select the best option"
});

// The digest will focus on:
// - Product details (price, material, reviews)
// - Size availability
// - Add to cart buttons

// Step 3: In the cart
await browser_navigate({
  url: "https://store.example.com/cart",
  goal: "Complete checkout with standard shipping"
});

// The digest will prioritize:
// - Checkout button
// - Shipping options
// - Promo code field
// - Order summary
```

## Form Submission Example

For complex forms, goals help focus on the right fields:

```javascript
// Navigate to contact form
await browser_navigate({
  url: "https://company.example.com/contact",
  goal: "Submit a technical support request about login issues"
});

// The digest will highlight:
// - Support category dropdown (to select "Technical")
// - Subject field
// - Description textarea
// - Urgency level options
// - Submit button
```

## Documentation Search Example

When looking for specific documentation:

```javascript
// Navigate to docs
await browser_navigate({
  url: "https://docs.example.com",
  goal: "Find API documentation for user authentication endpoints"
});

// The digest will focus on:
// - API reference links
// - Authentication section
// - Search functionality
// - Code examples related to auth
```

## Benefits of Goal-Based Navigation

1. **Reduced Noise** - Irrelevant page elements are de-emphasized
2. **Faster Automation** - Clear guidance on which elements to interact with
3. **Better Context** - The AI understands why each element matters
4. **Dynamic Adaptation** - Different goals on the same page yield different insights

## Best Practices

1. **Be Specific** - "Buy shoes" vs "Buy black running shoes size 10 under $100"
2. **Include Constraints** - Mention price limits, sizes, colors, deadlines
3. **State the Outcome** - What should be accomplished by the end
4. **Update Goals** - Change goals as you progress through multi-step processes

## Example Output

When navigating with a goal, the digested snapshot includes a special section:

```yaml
## 🎯 Goal Relevance
**Goal**: Find blue t-shirts in size medium under $30

### Relevant Elements
- **select** "Color Filter" [aria-ref="42"]
  → Use this to filter for blue items
- **select** "Size Filter" [aria-ref="43"]
  → Select "Medium" from this dropdown
- **input** "Max Price" [aria-ref="56"]
  → Enter "30" to set price limit
- **button** "Apply Filters" [aria-ref="57"]
  → Click after setting all filters

### Suggested Actions
1. Select "Blue" from the color filter dropdown
2. Select "Medium" from the size filter dropdown
3. Enter "30" in the max price field
4. Click the "Apply Filters" button
5. Review the filtered results
```

This focused output makes automation much more efficient!