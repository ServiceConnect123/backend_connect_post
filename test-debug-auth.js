#!/usr/bin/env node

/**
 * Script para probar la API de debug de autenticación
 * Requiere que la aplicación esté corriendo
 */

const axios = require('axios');

async function testDebugAuth() {
  console.log('🔍 PROBANDO ENDPOINTS DE DEBUG DE AUTENTICACIÓN\n');

  const baseUrl = 'http://localhost:3000';
  
  // Token de ejemplo - reemplaza con uno real
  const testToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';

  try {
    // Test 1: Endpoint sin autenticación
    console.log('1️⃣ PROBANDO ENDPOINT SIN AUTENTICACIÓN...');
    
    const noAuthResponse = await axios.get(`${baseUrl}/debug-auth/no-auth`, {
      headers: {
        'Authorization': testToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Respuesta:', JSON.stringify(noAuthResponse.data, null, 2));

    // Test 2: Headers raw
    console.log('\n2️⃣ PROBANDO HEADERS RAW...');
    const headersResponse = await axios.get(`${baseUrl}/debug-auth/raw-headers`, {
      headers: {
        'Authorization': testToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Respuesta:', JSON.stringify(headersResponse.data, null, 2));

    // Test 3: Endpoint con autenticación (probablemente fallará con token falso)
    console.log('\n3️⃣ PROBANDO ENDPOINT CON AUTENTICACIÓN...');
    
    try {
      const authResponse = await axios.get(`${baseUrl}/debug-auth/test-token`, {
        headers: {
          'Authorization': testToken,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Respuesta:', JSON.stringify(authResponse.data, null, 2));
    } catch (authError) {
      console.log('❌ Error esperado con token falso:', authError.response?.status);
      console.log('   Mensaje:', authError.response?.data?.message);
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 La aplicación no está corriendo. Ejecuta:');
      console.log('   npm run start:dev');
      console.log('   o');
      console.log('   npm run start');
    }
  }
}

console.log('📝 NOTA: Para una prueba completa, necesitas:');
console.log('1. La aplicación corriendo (npm run start:dev)');
console.log('2. Un token JWT real del login');
console.log('3. Reemplazar testToken con el token real\n');

testDebugAuth();
