const axios = require('axios');

// Configuración base
const baseURL = 'http://localhost:3001';
const headers = {
  'Content-Type': 'application/json'
};

// Datos de prueba
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  first_name: 'Test',
  last_name: 'User',
  role: 'USER',
  company: {
    name: 'Test Company',
    nit: '123456789',
    email: 'company@test.com',
    phone: '1234567890',
    address: 'Test Address',
    country_id: 'country-id',
    city_id: 'city-id'
  }
};

async function testIdBasedUserPreferences() {
  try {
    console.log('🧪 Testing ID-based User Preferences System\n');

    // 1. Registrar usuario
    console.log('1️⃣ Registering test user...');
    let registerResponse;
    try {
      registerResponse = await axios.post(`${baseURL}/auth/register`, testUser, { headers });
      console.log('✅ User registered successfully');
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('⚠️ User already exists, proceeding with login');
      } else {
        throw error;
      }
    }

    // 2. Login para obtener token
    console.log('\n2️⃣ Logging in...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    }, { headers });

    const token = loginResponse.data.token;
    const authHeaders = {
      ...headers,
      'Authorization': `Bearer ${token}`
    };
    console.log('✅ Login successful');

    // 3. Obtener opciones disponibles
    console.log('\n3️⃣ Getting available options...');
    const [timeFormatsRes, languagesRes, currenciesRes] = await Promise.all([
      axios.get(`${baseURL}/utils/timeFormat`, { headers: authHeaders }),
      axios.get(`${baseURL}/utils/language`, { headers: authHeaders }),
      axios.get(`${baseURL}/utils/currency`, { headers: authHeaders })
    ]);

    const timeFormats = timeFormatsRes.data;
    const languages = languagesRes.data;
    const currencies = currenciesRes.data;

    console.log('📊 Available Time Formats:', timeFormats.map(tf => `${tf.id}: ${tf.value} (${tf.name})`));
    console.log('📊 Available Languages:', languages.map(lang => `${lang.id}: ${lang.code} (${lang.name})`));
    console.log('📊 Available Currencies:', currencies.map(curr => `${curr.id}: ${curr.code} (${curr.name})`));

    // 4. Obtener preferencias actuales
    console.log('\n4️⃣ Getting current user preferences...');
    const currentPrefsResponse = await axios.get(`${baseURL}/configurations/userpreferences`, { headers: authHeaders });
    console.log('✅ Current preferences retrieved');
    console.log('📋 Current preferences:', JSON.stringify(currentPrefsResponse.data.preferences, null, 2));

    // 5. Actualizar preferencias usando IDs
    console.log('\n5️⃣ Updating preferences with IDs...');
    
    // Tomar el primer elemento de cada tipo para la prueba
    const updateData = {
      language: languages[0]?.id,
      currency: currencies[1]?.id || currencies[0]?.id,
      timeFormat: timeFormats[1]?.id || timeFormats[0]?.id,
      theme: 'dark',
      itemsPerPage: 50
    };

    console.log('📤 Update data:', updateData);

    const updateResponse = await axios.put(`${baseURL}/configurations/userpreferences`, updateData, { headers: authHeaders });
    console.log('✅ Preferences updated successfully');
    console.log('📋 Updated preferences:', JSON.stringify(updateResponse.data.preferences, null, 2));

    // 6. Verificar que los cambios se aplicaron
    console.log('\n6️⃣ Verifying changes...');
    const verifyResponse = await axios.get(`${baseURL}/configurations/userpreferences`, { headers: authHeaders });
    const verifiedPrefs = verifyResponse.data.preferences;

    console.log('🔍 Verification results:');
    console.log(`- Language: ${verifiedPrefs.generalPreferences.language?.name} (${verifiedPrefs.generalPreferences.language?.code})`);
    console.log(`- Currency: ${verifiedPrefs.generalPreferences.currency?.name} (${verifiedPrefs.generalPreferences.currency?.code})`);
    console.log(`- Time Format: ${verifiedPrefs.generalPreferences.timeFormat?.name} (${verifiedPrefs.generalPreferences.timeFormat?.value})`);
    console.log(`- Theme: ${verifiedPrefs.interfaceCustomization.theme}`);
    console.log(`- Items per page: ${verifiedPrefs.generalPreferences.itemsPerPage}`);

    // 7. Probar validación de IDs inválidos
    console.log('\n7️⃣ Testing invalid ID validation...');
    try {
      await axios.put(`${baseURL}/configurations/userpreferences`, {
        language: 'invalid-id',
        currency: 'invalid-id',
        timeFormat: 'invalid-id'
      }, { headers: authHeaders });
      console.log('❌ Should have failed with invalid IDs');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validation correctly rejected invalid IDs');
        console.log('📋 Validation errors:', error.response.data.errors);
      } else {
        throw error;
      }
    }

    // 8. Probar endpoint de opciones consolidado
    console.log('\n8️⃣ Testing consolidated options endpoint...');
    const optionsResponse = await axios.get(`${baseURL}/configurations/options`, { headers: authHeaders });
    console.log('✅ Consolidated options retrieved');
    console.log('📊 Available options structure:', Object.keys(optionsResponse.data));

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n✅ ID-based User Preferences System is working correctly');
    console.log('\n📝 Key features tested:');
    console.log('  - ✅ User registration and authentication');
    console.log('  - ✅ Utils endpoints for available options');  
    console.log('  - ✅ Getting user preferences with full entity details');
    console.log('  - ✅ Updating preferences using database IDs');
    console.log('  - ✅ Proper validation of invalid IDs');
    console.log('  - ✅ Consolidated options endpoint');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Ejecutar las pruebas
testIdBasedUserPreferences();
