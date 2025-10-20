const axios = require('axios');

async function testProperDuplicateScenario() {
  console.log('🧪 PROPER DUPLICATE SCENARIO TEST');
  console.log('===================================\n');

  const timestamp = Date.now();
  const testEmail = `test.duplicate.${timestamp}@validation.test`;
  const testData = {
    email: testEmail,
    password: "Password123!",
    first_name: "Test",
    last_name: "Duplicate",
    role: "ADMIN",
    company: {
      name: `Test Company ${timestamp}`,
      nit: `TEST-${timestamp}`,
      email: `company.${timestamp}@test.com`,
      phone: `+57300${timestamp.toString().slice(-7)}`,
      address: `Test Address ${timestamp}`,
      countryId: "clxxx-country-co-xxxx",
      cityId: "clxxx-city-baq-xxxx"
    }
  };

  console.log(`📧 Testing with fresh email: ${testEmail}`);
  console.log(`🏢 Testing with fresh company NIT: ${testData.company.nit}\n`);

  // First registration
  console.log('🔄 STEP 1: First registration (should succeed)');
  try {
    const response1 = await axios.post('http://localhost:3000/auth/register', testData);
    console.log('✅ SUCCESS - First registration completed');
    console.log(`   User ID: ${response1.data.user?.id}`);
    console.log(`   Company ID: ${response1.data.company?.id}`);
    console.log(`   Scenario: ${response1.data.summary?.scenario}`);
    console.log(`   Is New User: ${response1.data.user?.isNewUser}`);
    console.log(`   Is New Company: ${response1.data.company?.isNewCompany}\n`);

    const companyId = response1.data.company?.id;

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Second registration - same user, same company by ID
    console.log('🔄 STEP 2: Second registration with company_id (should fail with conflict)');
    const duplicateData = {
      email: testEmail,
      password: "Password123!",
      first_name: "Test",
      last_name: "Duplicate",
      role: "USER",
      company_id: companyId
    };

    try {
      const response2 = await axios.post('http://localhost:3000/auth/register', duplicateData);
      console.log('❌ UNEXPECTED SUCCESS - This should have failed!');
      console.log(`   User ID: ${response2.data.user?.id}`);
      console.log(`   Company ID: ${response2.data.company?.id}`);
      console.log(`   Scenario: ${response2.data.summary?.scenario}\n`);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('✅ SUCCESS - Conflict properly detected');
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Message: ${error.response.data.message}\n`);
      } else {
        console.log('❌ FAILED with unexpected error');
        console.log(`   Status: ${error.response?.status}`);
        console.log(`   Message: ${error.response?.data?.message || error.message}\n`);
      }
    }

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Third registration - same user, same company by NIT
    console.log('🔄 STEP 3: Third registration with same NIT (should also fail with conflict)');
    try {
      const response3 = await axios.post('http://localhost:3000/auth/register', testData);
      console.log('❌ UNEXPECTED SUCCESS - This should have failed!');
      console.log(`   User ID: ${response3.data.user?.id}`);
      console.log(`   Company ID: ${response3.data.company?.id}`);
      console.log(`   Scenario: ${response3.data.summary?.scenario}\n`);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('✅ SUCCESS - Conflict properly detected');
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Message: ${error.response.data.message}\n`);
      } else {
        console.log('❌ FAILED with unexpected error');
        console.log(`   Status: ${error.response?.status}`);
        console.log(`   Message: ${error.response?.data?.message || error.message}\n`);
      }
    }

  } catch (error) {
    console.log('❌ FAILED - First registration failed');
    console.log(`   Status: ${error.response?.status}`);
    console.log(`   Message: ${error.response?.data?.message || error.message}`);
  }

  console.log('===================================');
  console.log('✨ PROPER DUPLICATE SCENARIO TEST COMPLETED');
}

testProperDuplicateScenario().catch(console.error);
