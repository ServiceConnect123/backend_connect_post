const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testSingleRegistration() {
  console.log('🧪 Testing Single User-Company Registration');
  console.log('==========================================\n');
  
  try {
    // Use a unique timestamp to avoid conflicts
    const timestamp = Date.now();
    const testEmail = `test.user.${timestamp}@newcompany.com`;
    
    console.log(`📝 Registering new user with email: ${testEmail}`);
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      email: testEmail,
      password: 'TestPass123!',
      first_name: 'Juan',
      last_name: 'Pérez',
      phone: '+57 300 123 4567',
      document_type: 'CC',
      document_number: '12345678',
      role: 'ADMIN',
      company: {
        name: `Test Company ${timestamp}`,
        nit: `900${timestamp.toString().slice(-6)}-1`,
        email: `info@testcompany${timestamp}.com`,
        phone: '+57 601 234 5678',
        address: 'Calle 123 #45-67',
        countryId: 'clxxx-country-co-xxxx',
        cityId: 'clxxx-city-bog-xxxx'
      }
    });
    
    console.log('✅ Registration successful!');
    console.log(`   User ID: ${response.data.user.id}`);
    console.log(`   Company: ${response.data.company.name}`);
    console.log(`   Scenario: ${response.data.summary.scenario}`);
    console.log(`   Total Companies: ${response.data.summary.totalCompanies}`);
    console.log(`   Is New User: ${response.data.user.isNewUser}`);
    console.log(`   Is New Company: ${response.data.company.isNewCompany}`);
    console.log(`   User-Company Association ID: ${response.data.userCompany.id}`);
    console.log(`   Role: ${response.data.userCompany.role}\n`);

    // Test getting profile
    console.log('📋 Testing profile retrieval...');
    // We need a token for this, let's try login first
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail,
      password: 'TestPass123!'
    });
    
    if (loginResponse.data.access_token) {
      const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${loginResponse.data.access_token}`
        }
      });
      
      console.log('✅ Profile retrieved successfully!');
      console.log(`   User: ${profileResponse.data.user.firstName} ${profileResponse.data.user.lastName}`);
      console.log(`   Email: ${profileResponse.data.user.email}`);
      console.log(`   Role: ${profileResponse.data.user.role}`);
      console.log(`   Company: ${profileResponse.data.company.name} (${profileResponse.data.company.nit})`);
      console.log(`   Total Companies: ${profileResponse.data.totalCompanies}`);
      console.log(`   Is Multi-Company: ${profileResponse.data.isMultiCompany}`);
      
      if (profileResponse.data.companies && profileResponse.data.companies.length > 0) {
        console.log('   Associated Companies:');
        profileResponse.data.companies.forEach((company, index) => {
          console.log(`     ${index + 1}. ${company.name} (${company.role})`);
        });
      }
    }
    
    console.log('\n🎉 All tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response) {
      console.log('\nFull error response:', JSON.stringify(error.response.data, null, 2));
    }
    
    process.exit(1);
  }
}

testSingleRegistration();
