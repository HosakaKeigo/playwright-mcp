# Playwright MCP Examples

This directory contains example configurations and usage guides for the Playwright MCP tool.

## Configuration Examples

### Snapshot Digestion with Azure AI

- `config-snapshot-digest.js` - Example ES module configuration showing all available options
- `configs/azure-digest.json` - JSON configuration for use with Claude Desktop

To use snapshot digestion:

1. Set up Azure AI credentials:
   ```bash
   export AZURE_API_KEY="your-api-key"
   export AZURE_RESOURCE_NAME="your-resource-name"
   ```

2. Use the configuration:
   ```bash
   node cli.js --config examples/configs/azure-digest.json
   ```

3. Or in Claude Desktop config:
   ```json
   {
     "mcpServers": {
       "playwright-digest": {
         "command": "node",
         "args": [
           "/path/to/playwright-mcp/cli.js",
           "--config",
           "/path/to/playwright-mcp/examples/configs/azure-digest.json"
         ],
         "env": {
           "AZURE_API_KEY": "your-key",
           "AZURE_RESOURCE_NAME": "your-resource"
         }
       }
     }
   }
   ```

## Other Examples

- `goal-based-navigation.md` - Using goal parameters to optimize snapshot digestion
- `generate-test.md` - Example of generating automated tests

## Using Goal-Based Navigation

You can provide goals directly in tool calls:

```javascript
// Navigate with a specific goal
await browser_navigate({
  url: "https://example.com",
  goal: "Find contact information"
});

// Take a snapshot with a goal
await browser_snapshot({
  goal: "Identify form fields for registration"
});
```

This helps the AI focus on relevant elements for your specific task.