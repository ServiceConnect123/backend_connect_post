const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testRegistrationWithNewCompany() {
  console.log('\n🧪 Testing registration with NEW company...');
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'john.test' + Date.now() + '@gmail.com',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
      role: 'ADMIN',
      company: {
        name: 'TestCompany Inc',
        nit: '900987654-3',
        email: 'contact@netsolutionlabs.com',
        phone: '+57 3001234567',
        address: 'Cra 10 # 45-23',
        country: 'Colombia',
        city: 'Barranquilla'
      }
    });
    
    console.log('✅ Registration successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    // Store both access token and company ID
    return {
      accessToken: response.data.session?.accessToken,
      companyId: response.data.user?.companyId
    };
    
  } catch (error) {
    console.log('❌ Registration failed!');
    console.log('Error:', error.response?.data || error.message);
    return null;
  }
}

async function testRegistrationWithExistingCompany(existingCompanyId) {
  console.log('\n🧪 Testing registration with EXISTING company...');
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'jane.test' + Date.now() + '@gmail.com',
      password: 'password123',
      first_name: 'Jane',
      last_name: 'Smith',
      role: 'USER',
      company_id: existingCompanyId
    });
    
    console.log('✅ Registration successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return {
      accessToken: response.data.session?.accessToken
    };
    
  } catch (error) {
    console.log('❌ Registration failed!');
    console.log('Error:', error.response?.data || error.message);
    return null;
  }
}

async function testProfile(accessToken) {
  console.log('\n🧪 Testing profile endpoint...');
  
  if (!accessToken) {
    console.log('❌ No access token available for profile test');
    return;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    console.log('✅ Profile retrieved successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ Profile retrieval failed!');
    console.log('Error:', error.response?.data || error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting registration and profile tests...');
  
  // Test 1: Register with new company
  const result1 = await testRegistrationWithNewCompany();
  
  if (result1) {
    // Test profile for first user
    await testProfile(result1.accessToken);
    
    // Test 2: Register with existing company
    const result2 = await testRegistrationWithExistingCompany(result1.companyId);
    
    if (result2) {
      // Test profile for second user
      await testProfile(result2.accessToken);
    }
  }
  
  console.log('\n✨ Tests completed!');
}

runTests().catch(console.error);
