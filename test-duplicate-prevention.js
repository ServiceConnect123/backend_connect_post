const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testExistingUserExistingCompany() {
  console.log('🧪 TESTING EXISTING_USER_EXISTING_COMPANY SCENARIO');
  console.log('=================================================\n');

  const testData = {
    "email": "wilmerhernandz0@gmail.com",
    "password": "Password123!",
    "first_name": "Wilmer",
    "last_name": "Hernandez",
    "role": "ADMIN",
    "company": {
      "name": "NetSolutionLabs",
      "nit": "900123456-7",
      "email": "contact@netsolutionlabs.com",
      "phone": "+57 3001234567",
      "address": "Cra 10 # 45-23",
      "countryId": "clxxx-country-co-xxxx",
      "cityId": "clxxx-city-baq-xxxx"
    }
  };

  console.log('📋 Test Data:');
  console.log(`   Email: ${testData.email}`);
  console.log(`   Company NIT: ${testData.company.nit}`);
  console.log(`   Expected: ConflictException (409) - User already registered in this company\n`);

  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, testData);
    
    console.log('❌ UNEXPECTED SUCCESS - This should have failed!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data.message;
      
      if (status === 409) {
        console.log('✅ SUCCESS - Conflict properly detected');
        console.log(`   Status: ${status}`);
        console.log(`   Message: ${message}`);
        console.log('   ✓ The system correctly prevented duplicate user-company registration');
      } else {
        console.log(`❌ FAILED with unexpected status: ${status}`);
        console.log(`   Message: ${message}`);
      }
    } else {
      console.log('❌ FAILED with network error:', error.message);
    }
  }

  console.log('\n=================================================');
  console.log('✨ TEST COMPLETED');
}

// Run the test
testExistingUserExistingCompany().catch(console.error);
