#!/usr/bin/env node

/**
 * Script to test the Selected Company API endpoint
 */

const https = require('http');

// Test endpoint availability
async function testEndpointAvailability() {
  console.log('🔍 Testing Selected Company API endpoint availability...\n');

  try {
    // First, let's test if the server is running
    const response = await fetch('http://localhost:3000/api-json');
    const swaggerJson = await response.json();
    
    console.log('✅ Server is running and Swagger is accessible');
    
    // Check if our endpoint is in the Swagger documentation
    const paths = swaggerJson.paths || {};
    const selectedCompanyPath = paths['/auth/selected-company'];
    
    if (selectedCompanyPath && selectedCompanyPath.put) {
      console.log('✅ PUT /auth/selected-company endpoint found in Swagger!');
      console.log('📝 Summary:', selectedCompanyPath.put.summary);
      console.log('📝 Description:', selectedCompanyPath.put.description);
      
      // Check required parameters
      if (selectedCompanyPath.put.requestBody) {
        console.log('✅ Request body schema is defined');
      }
      
      // Check responses
      if (selectedCompanyPath.put.responses) {
        const responseCodes = Object.keys(selectedCompanyPath.put.responses);
        console.log('✅ Response codes defined:', responseCodes.join(', '));
      }
      
    } else {
      console.log('❌ PUT /auth/selected-company endpoint NOT found in Swagger');
      console.log('Available auth endpoints:');
      
      Object.keys(paths).forEach(path => {
        if (path.startsWith('/auth')) {
          const methods = Object.keys(paths[path]);
          console.log(`  ${methods.map(m => m.toUpperCase()).join(', ')} ${path}`);
        }
      });
    }

    // Test the test endpoint we added
    const testEndpointPath = paths['/auth/test-endpoint'];
    if (testEndpointPath && testEndpointPath.put) {
      console.log('✅ PUT /auth/test-endpoint found (our test endpoint is working)');
    } else {
      console.log('❌ PUT /auth/test-endpoint NOT found (test endpoint failed)');
    }

  } catch (error) {
    console.error('❌ Error testing endpoint:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running with: npm run start:dev');
    }
  }
}

// Helper function for making requests (Node.js compatible)
async function fetch(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        resolve({
          json: () => Promise.resolve(JSON.parse(data)),
          status: response.statusCode
        });
      });
    });
    
    request.on('error', reject);
  });
}

// Run the test
testEndpointAvailability().catch(console.error);
