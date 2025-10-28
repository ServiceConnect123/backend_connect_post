#!/usr/bin/env node

console.log('🧪 Testing Utils Endpoints...\n');

// Test all three endpoints
const endpoints = [
  'http://localhost:3001/utils/timeFormat',
  'http://localhost:3001/utils/language',
  'http://localhost:3001/utils/currency'
];

async function testEndpoint(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return { success: true, status: response.status, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function runTests() {
  for (const [index, endpoint] of endpoints.entries()) {
    console.log(`${index + 1}. Testing ${endpoint}...`);
    const result = await testEndpoint(endpoint);
    
    if (result.success) {
      console.log(`   ✅ Status: ${result.status}`);
      console.log(`   📊 Items: ${result.data.total || 0}`);
      if (result.data.currencies) {
        const cop = result.data.currencies.find(c => c.code === 'COP');
        console.log(`   💰 COP: ${JSON.stringify(cop)}`);
      }
    } else {
      console.log(`   ❌ Error: ${result.error}`);
    }
    console.log('');
  }
  
  console.log('✅ Utils endpoints testing complete!');
}

runTests().catch(console.error);
