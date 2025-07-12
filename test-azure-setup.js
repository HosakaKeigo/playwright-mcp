import { config } from 'dotenv';
import { azure } from '@ai-sdk/azure';
import { generateObject } from 'ai';
import { z } from 'zod';

// Load environment variables
config();

async function testAzureSetup() {
  console.log('Testing Azure AI setup...\n');
  
  // Check environment variables
  const apiKey = process.env.AZURE_API_KEY;
  const resourceName = process.env.AZURE_RESOURCE_NAME;
  
  if (!apiKey || apiKey === 'your-azure-api-key-here') {
    console.error('❌ AZURE_API_KEY not set in .env file');
    console.log('Please update the .env file with your actual Azure API key');
    return;
  }
  
  if (!resourceName || resourceName === 'your-azure-resource-name-here') {
    console.error('❌ AZURE_RESOURCE_NAME not set in .env file');
    console.log('Please update the .env file with your actual Azure resource name');
    return;
  }
  
  console.log('✅ Environment variables found');
  console.log(`Resource: ${resourceName}`);
  console.log(`API Key: ${apiKey.substring(0, 8)}...`);
  
  // Test Azure connection
  try {
    console.log('\nTesting Azure AI connection...');
    
    const model = azure('gpt-4o-mini', {
      apiKey,
      resourceName,
    });
    
    const testSchema = z.object({
      greeting: z.string(),
      status: z.string(),
    });
    
    const result = await generateObject({
      model,
      schema: testSchema,
      prompt: 'Say hello and confirm the connection is working',
    });
    
    console.log('✅ Azure AI connection successful!');
    console.log('Response:', result.object);
    
  } catch (error) {
    console.error('❌ Azure AI connection failed:', error.message);
    console.log('\nPlease check:');
    console.log('1. Your Azure API key is correct');
    console.log('2. Your Azure resource name is correct');
    console.log('3. The deployment name "gpt-4o-mini" exists in your Azure AI Studio');
  }
}

testAzureSetup().catch(console.error);