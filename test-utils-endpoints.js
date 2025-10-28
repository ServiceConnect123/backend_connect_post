const BASE_URL = 'http://localhost:3001';

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { raw: text };
    }
    
    return {
      status: response.status,
      ok: response.ok,
      data,
      headers: response.headers
    };
  } catch (error) {
    console.error(`❌ Request failed:`, error.message);
    return {
      status: 0,
      ok: false,
      data: { error: error.message },
      headers: new Map()
    };
  }
}

async function testUtilsEndpoints() {
  console.log('🧪 Testing Utils Configuration Endpoints\n');

  // Test 1: Get Time Formats
  console.log('1. ⏰ Testing GET /utils/timeFormat...');
  const timeFormatsResponse = await makeRequest(`${BASE_URL}/utils/timeFormat`);
  
  console.log('   Status:', timeFormatsResponse.status);
  if (timeFormatsResponse.ok) {
    console.log('✅ Time formats endpoint working correctly');
    console.log('   Total formats:', timeFormatsResponse.data.total);
    console.log('   Available formats:');
    timeFormatsResponse.data.timeFormats?.forEach(tf => {
      console.log(`     - ${tf.value}: ${tf.name} (${tf.description})`);
    });
  } else {
    console.log('❌ Time formats endpoint failed:', timeFormatsResponse.data);
  }
  console.log('');

  // Test 2: Get Languages
  console.log('2. 🌐 Testing GET /utils/language...');
  const languagesResponse = await makeRequest(`${BASE_URL}/utils/language`);
  
  console.log('   Status:', languagesResponse.status);
  if (languagesResponse.ok) {
    console.log('✅ Languages endpoint working correctly');
    console.log('   Total languages:', languagesResponse.data.total);
    console.log('   Available languages:');
    languagesResponse.data.languages?.forEach(lang => {
      console.log(`     - ${lang.code}: ${lang.name} (${lang.nativeName}) - ${lang.country}`);
    });
  } else {
    console.log('❌ Languages endpoint failed:', languagesResponse.data);
  }
  console.log('');

  // Test 3: Get Currencies
  console.log('3. 💰 Testing GET /utils/currency...');
  const currenciesResponse = await makeRequest(`${BASE_URL}/utils/currency`);
  
  console.log('   Status:', currenciesResponse.status);
  if (currenciesResponse.ok) {
    console.log('✅ Currencies endpoint working correctly');
    console.log('   Total currencies:', currenciesResponse.data.total);
    console.log('   Available currencies:');
    currenciesResponse.data.currencies?.forEach(curr => {
      console.log(`     - ${curr.code}: ${curr.name} (${curr.symbol}) - ${curr.country} (${curr.type})`);
    });
    console.log('');
    console.log('📋 Example COP Currency Object:');
    const copCurrency = currenciesResponse.data.currencies?.find(c => c.code === 'COP');
    if (copCurrency) {
      console.log('   ', JSON.stringify(copCurrency, null, 2));
    }
  } else {
    console.log('❌ Currencies endpoint failed:', currenciesResponse.data);
  }
  console.log('');

  // Summary
  console.log('📊 UTILS ENDPOINTS TEST SUMMARY:');
  console.log('===========================================');
  console.log(`Time Formats:             ${timeFormatsResponse.ok ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Languages:                ${languagesResponse.ok ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Currencies:               ${currenciesResponse.ok ? '✅ PASS' : '❌ FAIL'}`);

  const allPassed = timeFormatsResponse.ok && languagesResponse.ok && currenciesResponse.ok;

  console.log('===========================================');
  if (allPassed) {
    console.log('🎉 ALL UTILS TESTS PASSED!');
    console.log('');
    console.log('📚 Available Endpoints:');
    console.log('   GET /utils/timeFormat  - Get available time formats');
    console.log('   GET /utils/language    - Get available languages');
    console.log('   GET /utils/currency    - Get available currencies');
    console.log('');
    console.log('💡 Usage Example for User Preferences:');
    console.log('   Now you can use these endpoints to populate dropdowns');
    console.log('   in your frontend for user configuration selection.');
    console.log('');
    console.log('   Example response structure:');
    console.log('   Currency: { "code": "COP", "name": "Colombian Peso", "type": "Pesos" }');
    console.log('   Language: { "code": "es", "name": "Spanish", "country": "Colombia" }');
    console.log('   TimeFormat: { "value": "24h", "name": "24 Hours" }');
  } else {
    console.log('⚠️  Some tests failed - check server logs for details.');
  }
}

// Run the test
testUtilsEndpoints().catch(console.error);
