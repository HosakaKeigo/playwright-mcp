# Required Goal Parameters

As of this version, all browser interaction tools require a `goal` parameter. This ensures that every action has a clear purpose and enables optimal snapshot digestion.

## Tools That Require Goals

### Navigation
```javascript
await browser_navigate({
  url: "https://example.com",
  goal: "Find contact information"  // Required
});
```

### Snapshot
```javascript
await browser_snapshot({
  goal: "Verify form was submitted successfully"  // Required
});
```

### Click Actions
```javascript
await browser_click({
  element: "Submit button",
  ref: "42",
  goal: "Submit the contact form"  // Required
});
```

### Text Input
```javascript
await browser_type({
  element: "Search input",
  ref: "15",
  text: "blue t-shirt",
  goal: "Search for blue t-shirts"  // Required
});
```

### Select Options
```javascript
await browser_select_option({
  element: "Country dropdown",
  ref: "23",
  values: ["United States"],
  goal: "Select shipping country"  // Required
});
```

### Hover Actions
```javascript
await browser_hover({
  element: "Menu item",
  ref: "8",
  goal: "Open dropdown menu"  // Required
});
```

### Drag and Drop
```javascript
await browser_drag({
  startElement: "Item to drag",
  startRef: "10",
  endElement: "Drop zone",
  endRef: "20",
  goal: "Reorder items in the list"  // Required
});
```

## Why Goals Are Required

1. **Better Automation** - Clear intent helps the AI make better decisions
2. **Focused Output** - Snapshots only include elements relevant to your goal
3. **Reduced Tokens** - Smaller, more focused snapshots save API costs
4. **Clearer Code** - Generated code includes goal comments for better readability

## Migration Guide

If you have existing automation scripts without goals, update them by adding meaningful goal descriptions:

### Before:
```javascript
await browser_navigate({ url: "https://shop.com" });
await browser_click({ element: "Products", ref: "5" });
```

### After:
```javascript
await browser_navigate({ 
  url: "https://shop.com",
  goal: "Browse available products"
});
await browser_click({ 
  element: "Products", 
  ref: "5",
  goal: "View product catalog"
});
```

## Best Practices for Goals

1. **Be Specific** - "Find blue t-shirt" is better than "Shop"
2. **Include Context** - "Submit support ticket about login issue"
3. **Mention Expected Outcome** - "Complete checkout to receive order confirmation"
4. **Use Action Verbs** - "Filter", "Submit", "Download", "Register"

## Example: Multi-Step Process with Goals

```javascript
// Step 1: Go to login page
await browser_navigate({
  url: "https://app.example.com/login",
  goal: "Access login page to sign into account"
});

// Step 2: Enter credentials
await browser_type({
  element: "Email input",
  ref: "10",
  text: "user@example.com",
  goal: "Enter email address for authentication"
});

await browser_type({
  element: "Password input",
  ref: "11",
  text: "password123",
  goal: "Enter password to complete login credentials"
});

// Step 3: Submit login
await browser_click({
  element: "Login button",
  ref: "12",
  goal: "Submit login form to access dashboard"
});

// Step 4: Verify success
await browser_snapshot({
  goal: "Confirm successful login and dashboard access"
});
```

Each goal provides context for the action, making the automation more reliable and the output more focused.