const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Helper function to make requests
async function makeRequest(endpoint, data) {
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message,
      status: error.response?.status
    };
  }
}

// Helper function to wait
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runFocusedValidationTests() {
  console.log('🚀 STARTING FOCUSED VALIDATION TESTS');
  console.log('============================================================\n');

  // Use a unique timestamp to avoid conflicts
  const timestamp = Date.now();
  const testEmail = `test.user.${timestamp}@validation.test`;
  const testNIT = `TEST-NIT-${timestamp}`;

  // First, let's get some existing company data to test with
  console.log('📋 Getting existing companies for reference...');
  
  // Test data for the scenarios
  const newCompanyData = {
    name: `Test Company ${timestamp}`,
    nit: testNIT,
    email: `company.${timestamp}@test.com`,
    phone: `+57300${timestamp.toString().slice(-7)}`,
    address: `Test Address ${timestamp}`,
    countryId: 'co',
    cityId: 'bogota'
  };

  console.log(`\n🧪 TEST 1: NEW_USER_NEW_COMPANY`);
  console.log(`Testing with email: ${testEmail}`);
  console.log(`Testing with NIT: ${testNIT}`);
  
  const result1 = await makeRequest('/auth/register', {
    email: testEmail,
    password: 'TestPassword123!',
    first_name: 'Test',
    last_name: 'User',
    role: 'ADMIN',
    company: newCompanyData
  });

  if (result1.success) {
    console.log('✅ SUCCESS - New user with new company registered');
    console.log(`   Scenario: ${result1.data.summary?.scenario}`);
    console.log(`   Message: ${result1.data.message}`);
    console.log(`   User ID: ${result1.data.user?.id}`);
    console.log(`   Company ID: ${result1.data.company?.id}`);
    console.log(`   Is New User: ${result1.data.user?.isNewUser}`);
    console.log(`   Is New Company: ${result1.data.company?.isNewCompany}\n`);

    // Save the company ID for the next test
    const createdCompanyId = result1.data.company?.id;

    // Wait a moment to avoid rate limiting
    console.log('⏳ Waiting to avoid rate limiting...');
    await sleep(3000);

    console.log(`🧪 TEST 2: NEW_USER_EXISTING_COMPANY`);
    const testEmail2 = `test.user2.${timestamp}@validation.test`;
    console.log(`Testing with email: ${testEmail2}`);
    console.log(`Testing with existing company ID: ${createdCompanyId}`);

    const result2 = await makeRequest('/auth/register', {
      email: testEmail2,
      password: 'TestPassword123!',
      first_name: 'Test2',
      last_name: 'User2',
      role: 'USER',
      company_id: createdCompanyId
    });

    if (result2.success) {
      console.log('✅ SUCCESS - New user with existing company registered');
      console.log(`   Scenario: ${result2.data.summary?.scenario}`);
      console.log(`   Message: ${result2.data.message}`);
      console.log(`   User ID: ${result2.data.user?.id}`);
      console.log(`   Company ID: ${result2.data.company?.id}`);
      console.log(`   Is New User: ${result2.data.user?.isNewUser}`);
      console.log(`   Is New Company: ${result2.data.company?.isNewCompany}\n`);
    } else {
      console.log('❌ FAILED');
      console.log(`   Error: ${result2.error}`);
      console.log(`   Status: ${result2.status}\n`);
    }

    // Wait again
    await sleep(3000);

    console.log(`🧪 TEST 3: EXISTING_USER_NEW_COMPANY`);
    const newCompanyData2 = {
      name: `Test Company 2 ${timestamp}`,
      nit: `TEST-NIT-2-${timestamp}`,
      email: `company2.${timestamp}@test.com`,
      phone: `+57301${timestamp.toString().slice(-7)}`,
      address: `Test Address 2 ${timestamp}`,
      countryId: 'co',
      cityId: 'medellin'
    };

    console.log(`Testing with existing email: ${testEmail}`);
    console.log(`Testing with new NIT: ${newCompanyData2.nit}`);

    const result3 = await makeRequest('/auth/register', {
      email: testEmail,
      password: 'TestPassword123!',
      first_name: 'Test',
      last_name: 'User',
      role: 'ADMIN',
      company: newCompanyData2
    });

    if (result3.success) {
      console.log('✅ SUCCESS - Existing user with new company registered');
      console.log(`   Scenario: ${result3.data.summary?.scenario}`);
      console.log(`   Message: ${result3.data.message}`);
      console.log(`   User ID: ${result3.data.user?.id}`);
      console.log(`   Company ID: ${result3.data.company?.id}`);
      console.log(`   Is New User: ${result3.data.user?.isNewUser}`);
      console.log(`   Is New Company: ${result3.data.company?.isNewCompany}\n`);
    } else {
      console.log('❌ FAILED');
      console.log(`   Error: ${result3.error}`);
      console.log(`   Status: ${result3.status}\n`);
    }

    // Wait again
    await sleep(3000);

    console.log(`🧪 TEST 4: CONFLICT TEST - Should prevent duplicate registration`);
    console.log(`Testing duplicate registration with same user and company...`);

    const result4 = await makeRequest('/auth/register', {
      email: testEmail,
      password: 'TestPassword123!',
      first_name: 'Test',
      last_name: 'User',
      role: 'ADMIN',
      company_id: createdCompanyId
    });

    if (result4.success) {
      console.log('❌ UNEXPECTED SUCCESS - This should have failed!');
      console.log(`   Result: ${JSON.stringify(result4.data, null, 2)}\n`);
    } else {
      if (result4.status === 409) {
        console.log('✅ SUCCESS - Conflict properly detected');
        console.log(`   Error: ${result4.error}\n`);
      } else {
        console.log('❌ FAILED with unexpected error');
        console.log(`   Error: ${result4.error}`);
        console.log(`   Status: ${result4.status}\n`);
      }
    }

  } else {
    console.log('❌ FAILED - Could not complete first test');
    console.log(`   Error: ${result1.error}`);
    console.log(`   Status: ${result1.status}`);
  }

  console.log('============================================================');
  console.log('✨ FOCUSED VALIDATION TESTS COMPLETED');
}

// Run the tests
runFocusedValidationTests().catch(console.error);
