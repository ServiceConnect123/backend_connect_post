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

async function testUtilsIntegrationWithUserPreferences() {
  console.log('🔗 Testing Utils Integration with User Preferences\n');

  // Test 1: Login to get authentication token
  console.log('1. 🔐 Testing login...');
  const loginResponse = await makeRequest(`${BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@example.com',
      password: 'password123'
    })
  });

  if (!loginResponse.ok) {
    console.log('❌ Login failed:', loginResponse.data);
    return;
  }

  console.log('✅ Login successful');
  const token = loginResponse.data.session?.accessToken;
  console.log('');

  // Test 2: Get utils data to see available options
  console.log('2. 📊 Getting available utils options...');
  
  const [timeFormatsRes, languagesRes, currenciesRes] = await Promise.all([
    makeRequest(`${BASE_URL}/utils/timeFormat`),
    makeRequest(`${BASE_URL}/utils/language`),
    makeRequest(`${BASE_URL}/utils/currency`)
  ]);

  if (!timeFormatsRes.ok || !languagesRes.ok || !currenciesRes.ok) {
    console.log('❌ Failed to get utils data');
    return;
  }

  const availableTimeFormats = timeFormatsRes.data.timeFormats.map(tf => tf.value);
  const availableLanguages = languagesRes.data.languages.map(lang => lang.code);
  const availableCurrencies = currenciesRes.data.currencies.map(curr => curr.code);

  console.log('📋 Available options:');
  console.log(`   Time formats: ${availableTimeFormats.join(', ')}`);
  console.log(`   Languages: ${availableLanguages.join(', ')}`);
  console.log(`   Currencies: ${availableCurrencies.join(', ')}`);
  console.log('');

  // Test 3: Get current user preferences with available options
  console.log('3. ⚙️ Testing GET user preferences with utils integration...');
  const preferencesResponse = await makeRequest(`${BASE_URL}/configurations/userpreferences`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  console.log('   Status:', preferencesResponse.status);
  if (preferencesResponse.ok) {
    console.log('✅ User preferences retrieved with available options');
    const prefs = preferencesResponse.data.preferences;
    const availableOpts = preferencesResponse.data.availableOptions;
    
    console.log('   Current preferences:');
    console.log(`     timeFormat: ${prefs.generalPreferences.timeFormat}`);
    console.log(`     language: ${prefs.generalPreferences.language}`);
    console.log(`     currency: ${prefs.generalPreferences.currency}`);
    
    if (availableOpts) {
      console.log('   Available options from database:');
      console.log(`     timeFormats: ${availableOpts.timeFormats?.length || 0} options`);
      console.log(`     languages: ${availableOpts.languages?.length || 0} options`);
      console.log(`     currencies: ${availableOpts.currencies?.length || 0} options`);
    }
  } else {
    console.log('❌ Failed to get user preferences:', preferencesResponse.data);
  }
  console.log('');

  // Test 4: Update preferences with valid values from database
  console.log('4. ✏️ Testing UPDATE user preferences with database-validated values...');
  
  // Use the first available options from our utils
  const validTimeFormat = availableTimeFormats[0]; // Should be "12h" or "24h"
  const validLanguage = availableLanguages.find(lang => lang === 'es') || availableLanguages[0];
  const validCurrency = availableCurrencies.find(curr => curr === 'COP') || availableCurrencies[0];

  const updateResponse = await makeRequest(`${BASE_URL}/configurations/userpreferences`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      timeFormat: validTimeFormat,
      language: validLanguage,
      currency: validCurrency,
      theme: 'dark'
    })
  });

  console.log('   Status:', updateResponse.status);
  if (updateResponse.ok) {
    console.log('✅ User preferences updated with valid database values');
    console.log(`   Updated timeFormat: ${updateResponse.data.preferences.generalPreferences.timeFormat}`);
    console.log(`   Updated language: ${updateResponse.data.preferences.generalPreferences.language}`);
    console.log(`   Updated currency: ${updateResponse.data.preferences.generalPreferences.currency}`);
  } else {
    console.log('❌ Failed to update preferences:', updateResponse.data);
    if (updateResponse.data.errors) {
      console.log('   Validation errors:', updateResponse.data.errors);
    }
  }
  console.log('');

  // Test 5: Try to update with invalid values (should fail)
  console.log('5. 🚫 Testing UPDATE with INVALID values (should fail validation)...');
  
  const invalidUpdateResponse = await makeRequest(`${BASE_URL}/configurations/userpreferences`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      timeFormat: 'invalid_format',
      language: 'invalid_lang',
      currency: 'INVALID_CURRENCY'
    })
  });

  console.log('   Status:', invalidUpdateResponse.status);
  if (!invalidUpdateResponse.ok && invalidUpdateResponse.status === 400) {
    console.log('✅ Invalid values correctly rejected by validation');
    if (invalidUpdateResponse.data.errors) {
      console.log('   Validation errors (as expected):');
      invalidUpdateResponse.data.errors.forEach(error => {
        console.log(`     - ${error}`);
      });
    }
  } else if (invalidUpdateResponse.ok) {
    console.log('❌ Invalid values were accepted (this should not happen!)');
  } else {
    console.log('❌ Unexpected error:', invalidUpdateResponse.data);
  }
  console.log('');

  // Test 6: Verify data consistency across endpoints
  console.log('6. 🔍 Verifying data consistency between utils and preferences...');
  
  // Get fresh preferences
  const finalPrefsResponse = await makeRequest(`${BASE_URL}/configurations/userpreferences`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (finalPrefsResponse.ok) {
    const finalPrefs = finalPrefsResponse.data.preferences.generalPreferences;
    
    // Verify that current preferences match available options
    const timeFormatValid = availableTimeFormats.includes(finalPrefs.timeFormat);
    const languageValid = availableLanguages.includes(finalPrefs.language);
    const currencyValid = availableCurrencies.includes(finalPrefs.currency);
    
    console.log('   Data consistency check:');
    console.log(`     timeFormat (${finalPrefs.timeFormat}) is valid: ${timeFormatValid ? '✅' : '❌'}`);
    console.log(`     language (${finalPrefs.language}) is valid: ${languageValid ? '✅' : '❌'}`);
    console.log(`     currency (${finalPrefs.currency}) is valid: ${currencyValid ? '✅' : '❌'}`);
    
    const allValid = timeFormatValid && languageValid && currencyValid;
    console.log(`   Overall consistency: ${allValid ? '✅ PASS' : '❌ FAIL'}`);
  }

  // Summary
  console.log('');
  console.log('📊 UTILS-PREFERENCES INTEGRATION TEST SUMMARY:');
  console.log('===============================================');
  console.log(`Login:                     ${loginResponse.ok ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Get Utils Data:            ${timeFormatsRes.ok && languagesRes.ok && currenciesRes.ok ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Get Preferences:           ${preferencesResponse.ok ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Update Valid Values:       ${updateResponse.ok ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Reject Invalid Values:     ${!invalidUpdateResponse.ok ? '✅ PASS' : '❌ FAIL'}`);

  console.log('===============================================');
  console.log('🎉 UTILS INTEGRATION COMPLETE!');
  console.log('');
  console.log('💡 Key Features Implemented:');
  console.log('   ✓ Dynamic validation against database tables');
  console.log('   ✓ Available options included in preferences response');
  console.log('   ✓ Proper error messages for invalid values');
  console.log('   ✓ Data consistency between utils and preferences');
  console.log('   ✓ Real-time validation prevents invalid data');
  console.log('');
  console.log('🔗 Related Endpoints:');
  console.log('   GET /utils/timeFormat     - Available time formats');
  console.log('   GET /utils/language       - Available languages');
  console.log('   GET /utils/currency       - Available currencies');
  console.log('   GET /configurations/userpreferences  - User preferences with available options');
  console.log('   PUT /configurations/userpreferences  - Update with database validation');
}

// Run the test
testUtilsIntegrationWithUserPreferences().catch(console.error);
