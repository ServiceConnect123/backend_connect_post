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

async function testAuthenticationFix() {
  console.log('🧪 Testing Authentication Fix - Using user.id instead of user.supabaseUuid\n');

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
  console.log('   User ID:', loginResponse.data.user?.id);
  console.log('   User email:', loginResponse.data.user?.email);
  
  const token = loginResponse.data.session?.accessToken;
  if (!token) {
    console.log('❌ No access token received');
    return;
  }

  console.log('   Token received (first 20 chars):', token.substring(0, 20) + '...');
  console.log('');

  // Test 2: Get user companies (previously failing endpoint)
  console.log('2. 🏢 Testing GET /auth/companies...');
  const companiesResponse = await makeRequest(`${BASE_URL}/auth/companies`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  console.log('   Status:', companiesResponse.status);
  if (companiesResponse.ok) {
    console.log('✅ Companies endpoint working correctly');
    console.log('   User in response:', companiesResponse.data.user?.email);
    console.log('   Total companies:', companiesResponse.data.totalCompanies);
    console.log('   Selected company:', companiesResponse.data.selectedCompany?.name || 'None');
  } else {
    console.log('❌ Companies endpoint failed:', companiesResponse.data);
  }
  console.log('');

  // Test 3: Get user profile  
  console.log('3. 👤 Testing GET /auth/profile...');
  const profileResponse = await makeRequest(`${BASE_URL}/auth/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  console.log('   Status:', profileResponse.status);
  if (profileResponse.ok) {
    console.log('✅ Profile endpoint working correctly');
    console.log('   User email:', profileResponse.data.user?.email);
    console.log('   User full name:', profileResponse.data.user?.fullName);
  } else {
    console.log('❌ Profile endpoint failed:', profileResponse.data);
  }
  console.log('');

  // Test 4: Get user preferences (configurations)
  console.log('4. ⚙️ Testing GET /configurations/userpreferences...');
  const preferencesResponse = await makeRequest(`${BASE_URL}/configurations/userpreferences`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  console.log('   Status:', preferencesResponse.status);
  if (preferencesResponse.ok) {
    console.log('✅ User preferences endpoint working correctly');
    console.log('   Preferences found:', !!preferencesResponse.data.preferences);
    console.log('   Language:', preferencesResponse.data.preferences?.generalPreferences?.language);
    console.log('   Theme:', preferencesResponse.data.preferences?.interfaceCustomization?.theme);
  } else {
    console.log('❌ User preferences endpoint failed:', preferencesResponse.data);
  }
  console.log('');

  // Test 5: Update user preferences
  console.log('5. ✏️ Testing PUT /configurations/userpreferences...');
  const updatePreferencesResponse = await makeRequest(`${BASE_URL}/configurations/userpreferences`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      generalPreferences: {
        language: 'en',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY'
      },
      interfaceCustomization: {
        theme: 'dark',
        primaryColor: '#2196f3'
      }
    })
  });

  console.log('   Status:', updatePreferencesResponse.status);
  if (updatePreferencesResponse.ok) {
    console.log('✅ Update preferences endpoint working correctly');
    console.log('   Updated language:', updatePreferencesResponse.data.preferences?.generalPreferences?.language);
    console.log('   Updated theme:', updatePreferencesResponse.data.preferences?.interfaceCustomization?.theme);
  } else {
    console.log('❌ Update preferences endpoint failed:', updatePreferencesResponse.data);
  }
  console.log('');

  // Summary
  console.log('📊 AUTHENTICATION FIX TEST SUMMARY:');
  console.log('===========================================');
  console.log(`Login:                    ${loginResponse.ok ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Get Companies:            ${companiesResponse.ok ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Get Profile:              ${profileResponse.ok ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Get Preferences:          ${preferencesResponse.ok ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Update Preferences:       ${updatePreferencesResponse.ok ? '✅ PASS' : '❌ FAIL'}`);

  const allPassed = loginResponse.ok && companiesResponse.ok && profileResponse.ok && 
                   preferencesResponse.ok && updatePreferencesResponse.ok;

  console.log('===========================================');
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED - Authentication fix successful!');
    console.log('The issue with user.supabaseUuid vs user.id has been resolved.');
  } else {
    console.log('⚠️  Some tests failed - further investigation needed.');
  }
}

// Run the test
testAuthenticationFix().catch(console.error);
