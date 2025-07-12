import { createConnection } from './lib/index.js';

async function testSnapshotDigest() {
  console.log('Starting snapshot digest test...');
  
  // Create connection with the config
  const connection = await createConnection();
  
  // Initialize the connection
  await connection.initialize();
  
  console.log('Connection initialized. Testing navigation and snapshot...');
  
  // Navigate to a page with a specific goal
  const navResult = await connection.request('browser_navigate', {
    url: 'https://www.piano.or.jp',
    goal: 'ピアノ教室の情報を探す'
  });
  
  console.log('Navigation complete. Taking snapshot...');
  
  // Take a snapshot with a specific goal
  const snapshotResult = await connection.request('browser_snapshot', {
    goal: 'ピアノ教室の連絡先情報を見つける'
  });
  
  console.log('Snapshot result:', snapshotResult);
  
  // Try clicking on an element
  console.log('Attempting to click on a relevant element...');
  
  // Note: You'll need to update the ref based on the actual snapshot
  // This is just an example
  try {
    const clickResult = await connection.request('browser_click', {
      element: 'ピアノ教室 link',
      ref: '10', // Update this based on actual snapshot
      goal: 'ピアノ教室の詳細ページにアクセスする'
    });
    console.log('Click result:', clickResult);
  } catch (error) {
    console.log('Click failed (expected if ref doesn\'t exist):', error.message);
  }
  
  // Close the connection
  await connection.close();
  console.log('Test complete!');
}

// Run the test
testSnapshotDigest().catch(console.error);