const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testNewArchitecture() {
  console.log('🧪 Testing New User-Company Architecture');
  console.log('=====================================\n');
  
  try {
    // Test 1: Registrar nuevo usuario con nueva empresa
    console.log('📝 Test 1: Registering new user with new company...');
    const newUserNewCompany = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'test.user@newcompany.com',
      password: 'TestPass123!',
      first_name: 'Juan',
      last_name: 'Pérez',
      phone: '+57 300 123 4567',
      document_type: 'CC',
      document_number: '12345678',
      role: 'ADMIN',
      company: {
        name: 'Nueva Empresa Test',
        nit: '900123456-1',
        email: 'info@nuevaempresa.com',
        phone: '+57 601 234 5678',
        address: 'Calle 123 #45-67',
        countryId: 'clxxx-country-co-xxxx',
        cityId: 'clxxx-city-bog-xxxx'
      }
    });
    
    console.log('✅ Registration successful!');
    console.log(`   User ID: ${newUserNewCompany.data.user.id}`);
    console.log(`   Company: ${newUserNewCompany.data.company.name}`);
    console.log(`   Scenario: ${newUserNewCompany.data.summary.scenario}`);
    console.log(`   Total Companies: ${newUserNewCompany.data.summary.totalCompanies}\n`);

    // Test 2: Asociar usuario existente a empresa existente
    console.log('📝 Test 2: Associating existing user with existing company...');
    const existingUserExistingCompany = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'test.user@newcompany.com',
      password: 'TestPass123!',
      first_name: 'Juan',
      last_name: 'Pérez',
      role: 'USER',
      company_id: newUserNewCompany.data.company.id
    });
    
    console.log('❌ This should have failed (duplicate registration)');
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('✅ Correctly prevented duplicate registration!');
      console.log(`   Error: ${error.response.data.message}\n`);
    } else {
      console.log('❌ Unexpected error:', error.response?.data || error.message);
    }
  }

  try {
    // Test 3: Asociar usuario existente a nueva empresa
    console.log('📝 Test 3: Associating existing user with new company...');
    const existingUserNewCompany = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'test.user@newcompany.com',
      password: 'TestPass123!',
      first_name: 'Juan',
      last_name: 'Pérez',
      role: 'MODERATOR',
      company: {
        name: 'Segunda Empresa Test',
        nit: '900654321-2',
        email: 'info@segundaempresa.com',
        phone: '+57 602 765 4321',
        address: 'Carrera 45 #67-89',
        countryId: 'clxxx-country-co-xxxx',
        cityId: 'clxxx-city-med-xxxx'
      }
    });
    
    console.log('✅ Association successful!');
    console.log(`   User ID: ${existingUserNewCompany.data.user.id}`);
    console.log(`   Company: ${existingUserNewCompany.data.company.name}`);
    console.log(`   Role: ${existingUserNewCompany.data.userCompany.role}`);
    console.log(`   Scenario: ${existingUserNewCompany.data.summary.scenario}`);
    console.log(`   Total Companies: ${existingUserNewCompany.data.summary.totalCompanies}\n`);

    // Test 4: Login y obtener perfil con múltiples empresas
    console.log('📝 Test 4: Login and get multi-company profile...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test.user@newcompany.com',
      password: 'TestPass123!'
    });

    const token = loginResponse.data.access_token;
    console.log('✅ Login successful!');

    // Get profile without specific company (should show primary)
    console.log('📋 Getting profile without specific company...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Profile retrieved!');
    console.log(`   User: ${profileResponse.data.user.firstName} ${profileResponse.data.user.lastName}`);
    console.log(`   Primary Company: ${profileResponse.data.company.name}`);
    console.log(`   Role in Primary: ${profileResponse.data.user.role}`);
    console.log(`   Is Multi-Company: ${profileResponse.data.isMultiCompany}`);
    console.log(`   Total Companies: ${profileResponse.data.totalCompanies}`);
    console.log('   Companies:');
    profileResponse.data.companies.forEach((company, index) => {
      console.log(`     ${index + 1}. ${company.name} (${company.role})`);
    });

    console.log('\n🎉 All tests completed successfully!');
    console.log('✅ New User-Company architecture is working correctly!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Full error response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Wait for server to be ready and run tests
setTimeout(() => {
  testNewArchitecture();
}, 5000);
