const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

const testRegistrationData = {
  "email": "admin@netsolutionlabs.com",
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

async function testRegistration() {
  try {
    console.log('🚀 Testing registration with new structure...');
    
    const response = await axios.post(`${API_BASE_URL}/auth/register`, testRegistrationData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Registration successful!');
    console.log('📋 Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Registration failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function testLocationEndpoints() {
  try {
    console.log('🌍 Testing countries endpoint...');
    const countriesResponse = await axios.get(`${API_BASE_URL}/locations/countries`);
    console.log('✅ Countries retrieved successfully!');
    console.log('📋 Countries:', JSON.stringify(countriesResponse.data, null, 2));

    console.log('🏙️ Testing cities endpoint...');
    const citiesResponse = await axios.get(`${API_BASE_URL}/locations/countries/clxxx-country-co-xxxx/cities`);
    console.log('✅ Cities retrieved successfully!');
    console.log('📋 Cities:', JSON.stringify(citiesResponse.data, null, 2));
  } catch (error) {
    console.error('❌ Location endpoints test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function runTests() {
  console.log('🧪 Starting API tests...\n');
  
  await testLocationEndpoints();
  console.log('\n');
  await testRegistration();
  
  console.log('\n🎉 Tests completed!');
}

if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testRegistration, testLocationEndpoints };
