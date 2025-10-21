const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:3000';

async function testDuplicateRegistration() {
  console.log('\n🧪 === TESTING DUPLICATE REGISTRATION DETECTION ===\n');

  const userData = {
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

  try {
    console.log('🔄 Intentando registrar usuario que YA EXISTE...');
    console.log('📋 Email:', userData.email);
    console.log('🏢 Empresa NIT:', userData.company.nit);
    
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    
    console.log('❌ ERROR: El registro debería haber fallado pero fue exitoso');
    console.log('📊 Respuesta:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    if (error.response) {
      const statusCode = error.response.status;
      const errorData = error.response.data;
      
      if (statusCode === 409) {
        console.log('✅ CORRECTO: Se detectó correctamente el conflicto');
        console.log('📋 Código de estado:', statusCode);
        console.log('📋 Mensaje:', errorData.message);
      } else if (statusCode === 400) {
        console.log('⚠️ POSIBLE PROBLEMA: Error 400 en lugar de 409');
        console.log('📋 Código de estado:', statusCode);
        console.log('📋 Mensaje:', errorData.message);
      } else {
        console.log('❌ ERROR INESPERADO:');
        console.log('📋 Código de estado:', statusCode);
        console.log('📋 Respuesta:', JSON.stringify(errorData, null, 2));
      }
    } else {
      console.log('❌ Error de conexión:', error.message);
    }
  }

  console.log('\n🏁 === TEST COMPLETE ===\n');
}

// Run the test
testDuplicateRegistration().catch(console.error);
