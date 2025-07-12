import { createConnection } from '../lib/index.js';

/**
 * Demonstrates snapshot digestion with goal-based optimization
 */
async function runDemo() {
  console.log('🚀 Starting Snapshot Digest Demo\n');
  
  // Create connection
  const connection = await createConnection();
  await connection.initialize();
  
  try {
    // Example 1: E-commerce site with specific shopping goal
    console.log('📍 Example 1: Shopping for a blue t-shirt\n');
    
    await connection.request('browser_navigate', {
      url: 'https://www.uniqlo.com',
      goal: 'Find and purchase a blue t-shirt in size M'
    });
    
    const snapshot1 = await connection.request('browser_snapshot', {
      goal: 'Locate product search or category navigation'
    });
    
    console.log('Snapshot captured. With goal-based digestion, you should see:');
    console.log('- Only navigation elements related to finding t-shirts');
    console.log('- Search inputs highlighted');
    console.log('- Category links for clothing\n');
    
    // Example 2: Documentation site with research goal
    console.log('📍 Example 2: Finding API documentation\n');
    
    await connection.request('browser_navigate', {
      url: 'https://playwright.dev',
      goal: 'Find documentation about page.click() method'
    });
    
    const snapshot2 = await connection.request('browser_snapshot', {
      goal: 'Locate API reference section for click methods'
    });
    
    console.log('Snapshot captured. The digest should focus on:');
    console.log('- Documentation navigation links');
    console.log('- API reference sections');
    console.log('- Search functionality\n');
    
    // Example 3: Form submission workflow
    console.log('📍 Example 3: Contact form submission\n');
    
    await connection.request('browser_navigate', {
      url: 'https://www.w3.org/WAI/demos/bad/after/survey.html',
      goal: 'Complete and submit the contact form'
    });
    
    const snapshot3 = await connection.request('browser_snapshot', {
      goal: 'Identify all form fields that need to be filled'
    });
    
    console.log('Snapshot captured. The digest will highlight:');
    console.log('- All form input fields');
    console.log('- Required field indicators');
    console.log('- Submit button');
    console.log('- Form validation messages\n');
    
    // Example 4: Japanese site navigation
    console.log('📍 Example 4: Japanese site with specific goal\n');
    
    await connection.request('browser_navigate', {
      url: 'https://www.piano.or.jp',
      goal: 'ピアノ教室の情報と連絡先を探す'
    });
    
    const snapshot4 = await connection.request('browser_snapshot', {
      goal: 'ピアノ教室のリストと詳細情報を見つける'
    });
    
    console.log('Snapshot captured. ゴールに基づいて以下が強調されます:');
    console.log('- ピアノ教室関連のリンク');
    console.log('- 連絡先情報');
    console.log('- 教室検索機能\n');
    
  } catch (error) {
    console.error('Error during demo:', error);
  } finally {
    await connection.close();
    console.log('✅ Demo complete!');
  }
}

// Run the demo
runDemo().catch(console.error);