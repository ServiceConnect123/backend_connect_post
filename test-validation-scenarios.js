const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

// Test data
const testUser1 = {
  email: 'testuser1@validation.com',
  password: 'password123',
  first_name: 'Test',
  last_name: 'User1',
  role: 'ADMIN'
};

const testUser2 = {
  email: 'testuser2@validation.com', 
  password: 'password123',
  first_name: 'Test',
  last_name: 'User2',
  role: 'USER'
};

const testCompany1 = {
  name: 'ValidationTest Company',
  nit: '900123456-7',
  email: 'contact@validationtest.com',
  phone: '+57 3001234567',
  address: 'Test Address 123',
  countryId: '1',
  cityId: '1'
};

const testCompany2 = {
  name: 'Second Test Company',
  nit: '900987654-3',
  email: 'contact@secondtest.com',
  phone: '+57 3007654321',
  address: 'Test Address 456',
  countryId: '1',
  cityId: '1'
};

async function scenario1_NewUserNewCompany() {
  console.log('\n🧪 SCENARIO 1: NEW_USER_NEW_COMPANY');
  console.log('Testing registration with completely new user and new company...');
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      ...testUser1,
      company: testCompany1
    });
    
    console.log('✅ SUCCESS - New user with new company registered');
    console.log('Scenario:', response.data.summary?.scenario);
    console.log('Message:', response.data.message);
    console.log('User ID:', response.data.user?.id);
    console.log('Company ID:', response.data.company?.id);
    console.log('Is New User:', response.data.user?.isNewUser);
    console.log('Is New Company:', response.data.company?.isNewCompany);
    
    return {
      userId: response.data.user?.id,
      companyId: response.data.company?.id,
      scenario: response.data.summary?.scenario
    };
    
  } catch (error) {
    console.log('❌ FAILED');
    console.log('Error:', error.response?.data?.message || error.message);
    return null;
  }
}

async function scenario2_NewUserExistingCompany(existingCompanyId) {
  console.log('\n🧪 SCENARIO 2: NEW_USER_EXISTING_COMPANY');
  console.log('Testing registration with new user but existing company...');
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      ...testUser2,
      company_id: existingCompanyId
    });
    
    console.log('✅ SUCCESS - New user with existing company registered');
    console.log('Scenario:', response.data.summary?.scenario);
    console.log('Message:', response.data.message);
    console.log('User ID:', response.data.user?.id);
    console.log('Company ID:', response.data.company?.id);
    console.log('Is New User:', response.data.user?.isNewUser);
    console.log('Is New Company:', response.data.company?.isNewCompany);
    
    return {
      userId: response.data.user?.id,
      companyId: response.data.company?.id,
      scenario: response.data.summary?.scenario
    };
    
  } catch (error) {
    console.log('❌ FAILED');
    console.log('Error:', error.response?.data?.message || error.message);
    return null;
  }
}

async function scenario3_ExistingUserNewCompany() {
  console.log('\n🧪 SCENARIO 3: EXISTING_USER_NEW_COMPANY');
  console.log('Testing registration with existing user but new company...');
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      ...testUser1, // Same user as scenario 1
      company: testCompany2 // But different company
    });
    
    console.log('✅ SUCCESS - Existing user with new company registered');
    console.log('Scenario:', response.data.summary?.scenario);
    console.log('Message:', response.data.message);
    console.log('User ID:', response.data.user?.id);
    console.log('Company ID:', response.data.company?.id);
    console.log('Is New User:', response.data.user?.isNewUser);
    console.log('Is New Company:', response.data.company?.isNewCompany);
    console.log('Total Companies:', response.data.summary?.totalCompanies);
    
    return {
      userId: response.data.user?.id,
      companyId: response.data.company?.id,
      scenario: response.data.summary?.scenario
    };
    
  } catch (error) {
    console.log('❌ FAILED');
    console.log('Error:', error.response?.data?.message || error.message);
    return null;
  }
}

async function scenario4_ExistingUserExistingCompany(existingCompanyId) {
  console.log('\n🧪 SCENARIO 4: EXISTING_USER_EXISTING_COMPANY');
  console.log('Testing registration with existing user and existing company (should work)...');
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      ...testUser2, // User from scenario 2
      company_id: existingCompanyId // Company from scenario 3
    });
    
    console.log('✅ SUCCESS - Existing user with existing company registered');
    console.log('Scenario:', response.data.summary?.scenario);
    console.log('Message:', response.data.message);
    console.log('User ID:', response.data.user?.id);
    console.log('Company ID:', response.data.company?.id);
    console.log('Is New User:', response.data.user?.isNewUser);
    console.log('Is New Company:', response.data.company?.isNewCompany);
    console.log('Total Companies:', response.data.summary?.totalCompanies);
    
    return {
      userId: response.data.user?.id,
      companyId: response.data.company?.id,
      scenario: response.data.summary?.scenario
    };
    
  } catch (error) {
    console.log('❌ FAILED');
    console.log('Error:', error.response?.data?.message || error.message);
    return null;
  }
}

async function scenario5_ConflictTest(existingCompanyId) {
  console.log('\n🧪 SCENARIO 5: CONFLICT TEST');
  console.log('Testing duplicate registration (should fail with ConflictException)...');
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      ...testUser1, // Same user
      company_id: existingCompanyId // Same company as scenario 1
    });
    
    console.log('❌ UNEXPECTED SUCCESS - This should have failed!');
    console.log('Response:', response.data);
    
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('✅ SUCCESS - Correctly rejected duplicate registration');
      console.log('Error message:', error.response.data.message);
    } else {
      console.log('❌ FAILED with unexpected error');
      console.log('Error:', error.response?.data?.message || error.message);
    }
  }
}

async function runAllValidationTests() {
  console.log('🚀 STARTING COMPREHENSIVE VALIDATION TESTS');
  console.log('='.repeat(60));
  
  // Clean up potential existing test data first
  console.log('\n🧹 Note: Make sure test users don\'t exist in Supabase or clean them up first');
  
  let result1, result2, result3, result4;
  
  // Scenario 1: New User + New Company
  result1 = await scenario1_NewUserNewCompany();
  if (!result1) {
    console.log('\n❌ Scenario 1 failed, stopping tests');
    return;
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
  
  // Scenario 2: New User + Existing Company  
  result2 = await scenario2_NewUserExistingCompany(result1.companyId);
  if (!result2) {
    console.log('\n❌ Scenario 2 failed, but continuing...');
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
  
  // Scenario 3: Existing User + New Company
  result3 = await scenario3_ExistingUserNewCompany();
  if (!result3) {
    console.log('\n❌ Scenario 3 failed, but continuing...');
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
  
  // Scenario 4: Existing User + Existing Company
  if (result3) {
    result4 = await scenario4_ExistingUserExistingCompany(result3.companyId);
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
  
  // Scenario 5: Conflict Test
  if (result1) {
    await scenario5_ConflictTest(result1.companyId);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✨ VALIDATION TESTS COMPLETED');
  
  // Summary
  console.log('\n📊 SUMMARY:');
  console.log(`Scenario 1 (NEW_USER_NEW_COMPANY): ${result1 ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Scenario 2 (NEW_USER_EXISTING_COMPANY): ${result2 ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Scenario 3 (EXISTING_USER_NEW_COMPANY): ${result3 ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Scenario 4 (EXISTING_USER_EXISTING_COMPANY): ${result4 ? '✅ PASSED' : '❌ FAILED'}`);
  console.log('Scenario 5 (CONFLICT_TEST): Check output above');
}

// Error handling for connection issues
process.on('unhandledRejection', (error) => {
  if (error.code === 'ECONNREFUSED') {
    console.log('\n❌ CONNECTION REFUSED');
    console.log('Make sure the API server is running on http://localhost:3001');
    console.log('Run: npm run start:dev');
    process.exit(1);
  }
});

runAllValidationTests().catch(console.error);
