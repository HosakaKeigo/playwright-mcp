/**
 * Example configuration for using snapshot digestion with Playwright MCP.
 * 
 * This configuration enables snapshot digestion using Azure AI to reduce
 * the size of page snapshots while preserving important interactive elements.
 */

export default {
  // Browser configuration
  browser: {
    browserName: 'chromium',
    launchOptions: {
      channel: 'chrome',
      headless: false,
    },
  },

  // Enable snapshot digestion with Azure AI
  snapshotDigest: {
    enabled: true,
    
    // Azure deployment name (your model deployment in Azure AI Studio)
    deploymentName: 'gpt-4o-mini', // or your custom deployment name
    
    // Optional: Customize the digest behavior
    maxTokens: 1500, // Maximum tokens for digested output
    temperature: 0.3, // Lower = more focused, higher = more creative
    
    // Optional: Custom system prompt
    // systemPrompt: 'Your custom instructions for digesting snapshots...',
    
    // Optional: User's goal to optimize the digest
    // goal: 'Find and purchase a specific product',
    // goal: 'Fill out a contact form',
    // goal: 'Download documentation',
  },

  // Optional: Network restrictions
  network: {
    // Only allow requests to specific origins
    // allowedOrigins: ['example.com', 'api.example.com'],
    
    // Block requests to specific origins
    // blockedOrigins: ['tracking.example.com'],
  },

  // Save trace for debugging
  saveTrace: true,
  
  // Output directory for downloads and traces
  outputDir: './output',
};

/**
 * IMPORTANT: Set these environment variables before running:
 * 
 * export AZURE_API_KEY="your-azure-api-key"
 * export AZURE_RESOURCE_NAME="your-azure-resource-name"
 * 
 * You can get these from your Azure AI Studio deployment.
 */