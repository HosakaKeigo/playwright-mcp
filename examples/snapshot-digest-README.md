# Snapshot Digest Setup Guide

This guide helps you set up and test the snapshot digestion feature with Azure AI.

## Quick Start

### 1. Set up Azure Credentials

Update the `.env` file with your Azure credentials:

```bash
AZURE_API_KEY=your-actual-azure-api-key
AZURE_RESOURCE_NAME=your-azure-resource-name
```

### 2. Test Azure Connection

First, verify your Azure setup is working:

```bash
node test-azure-setup.js
```

You should see:
```
✅ Environment variables found
✅ Azure AI connection successful!
```

### 3. Run the Demo

```bash
node examples/snapshot-digest-demo.js
```

## Configuration

The snapshot digest feature is configured in `playwright-mcp-config.json`:

```json
{
  "snapshotDigest": {
    "enabled": true,
    "deploymentName": "gpt-4o-mini",
    "maxTokens": 2000,
    "temperature": 0.3
  }
}
```

## How Goals Work

Every tool now requires a `goal` parameter:

```javascript
// Navigate with a goal
await connection.request('browser_navigate', {
  url: 'https://example.com',
  goal: 'Find product pricing information'
});

// Take a snapshot with a goal
await connection.request('browser_snapshot', {
  goal: 'Locate the checkout button'
});

// Click with a goal
await connection.request('browser_click', {
  element: 'Add to Cart button',
  ref: '42',
  goal: 'Add item to shopping cart'
});
```

## Benefits

1. **Focused Output** - Only relevant elements are included
2. **Reduced Tokens** - 50-80% smaller snapshots
3. **Better Guidance** - AI suggests next steps based on your goal
4. **Clearer Automation** - Each action has documented intent

## Troubleshooting

### Azure Connection Issues

If you see connection errors:
1. Verify your API key is correct
2. Check your resource name matches your Azure portal
3. Ensure "gpt-4o-mini" deployment exists in your Azure AI Studio

### Snapshot Digest Not Working

If snapshots aren't being digested:
1. Check `snapshotDigest.enabled` is `true` in config
2. Verify Azure credentials are set correctly
3. Look for errors in the console output

### Goal Parameters Missing

All interaction tools now require goals. If you see errors about missing goals:
1. Add a `goal` parameter to every tool call
2. Make the goal specific and action-oriented
3. Use the examples in `examples/required-goals.md` as reference

## Examples

### E-commerce Automation
```javascript
await connection.request('browser_navigate', {
  url: 'https://shop.example.com',
  goal: 'Purchase a blue t-shirt in size medium'
});
```

### Form Submission
```javascript
await connection.request('browser_type', {
  element: 'Email input',
  ref: '15',
  text: 'user@example.com',
  goal: 'Enter email for newsletter subscription'
});
```

### Japanese Sites
```javascript
await connection.request('browser_navigate', {
  url: 'https://www.piano.or.jp',
  goal: 'ピアノ教室の連絡先を探す'
});
```

## Next Steps

1. Run `node test-snapshot-digest.js` for a basic test
2. Try `node examples/snapshot-digest-demo.js` for comprehensive examples
3. Experiment with different goals to see how digests adapt
4. Adjust temperature and maxTokens for different use cases