const axios = require('axios');

async function debugAuthenticationIssue() {
  console.log('🔍 DIAGNÓSTICO DEL PROBLEMA DE AUTENTICACIÓN\n');

  const baseUrl = 'http://localhost:3001';
  let authToken = null;

  try {
    // Paso 1: Hacer login para obtener un token real
    console.log('1️⃣ HACIENDO LOGIN PARA OBTENER TOKEN...');
    
    const loginData = {
      email: "admin@netsolutionlabs.com",
      password: "Password123!"
    };

    console.log('   Datos de login:', loginData);

    const loginResponse = await axios.post(`${baseUrl}/auth/login`, loginData, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (loginResponse.data && loginResponse.data.accessToken) {
      authToken = loginResponse.data.accessToken;
      console.log('✅ Login exitoso');
      console.log('   Token obtenido:', authToken.substring(0, 50) + '...');
      console.log('   Usuario logueado:', loginResponse.data.user.email);
      console.log('   Supabase UUID:', loginResponse.data.user.supabaseUuid);
    } else {
      console.log('❌ Login falló - no se obtuvo token');
      console.log('   Respuesta:', JSON.stringify(loginResponse.data, null, 2));
      return;
    }

    // Paso 2: Probar endpoint selected-company con token real
    console.log('\n2️⃣ PROBANDO ENDPOINT SELECTED-COMPANY...');
    
    const selectedCompanyResponse = await axios.put(
      `${baseUrl}/auth/selected-company`,
      { companyId: "db8150ff-bc99-442f-b5ec-d95878a88278" },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Respuesta selected-company:');
    console.log('   Usuario en respuesta:', selectedCompanyResponse.data.selectedCompany.user.email);
    console.log('   ID del usuario:', selectedCompanyResponse.data.selectedCompany.user.id);
    console.log('   ¿Es el usuario correcto?', 
      selectedCompanyResponse.data.selectedCompany.user.email === loginData.email ? '✅ SÍ' : '❌ NO');

    // Paso 3: Probar endpoint companies
    console.log('\n3️⃣ PROBANDO ENDPOINT COMPANIES...');
    
    const companiesResponse = await axios.get(`${baseUrl}/auth/companies`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Respuesta companies:');
    console.log('   Usuario en respuesta:', companiesResponse.data.user.email);
    console.log('   ID del usuario:', companiesResponse.data.user.id);
    console.log('   ¿Es el usuario correcto?', 
      companiesResponse.data.user.email === loginData.email ? '✅ SÍ' : '❌ NO');

    // Paso 4: Comparar tokens
    console.log('\n4️⃣ ANÁLISIS DEL PROBLEMA...');
    console.log('   Email esperado:', loginData.email);
    console.log('   Email en selected-company:', selectedCompanyResponse.data.selectedCompany.user.email);
    console.log('   Email en companies:', companiesResponse.data.user.email);

    if (selectedCompanyResponse.data.selectedCompany.user.email !== loginData.email ||
        companiesResponse.data.user.email !== loginData.email) {
      console.log('\n❌ PROBLEMA CONFIRMADO:');
      console.log('   Los endpoints están devolviendo un usuario diferente al logueado');
      console.log('   Esto indica un problema en el guard de autenticación o en los repositorios');
    } else {
      console.log('\n✅ NO HAY PROBLEMA:');
      console.log('   Los endpoints están devolviendo el usuario correcto');
    }

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

debugAuthenticationIssue();
