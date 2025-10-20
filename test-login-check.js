const axios = require('axios');

async function testLogin() {
  console.log('🔐 TESTING LOGIN FOR EXISTING USER');
  console.log('===================================\n');

  const loginData = {
    email: "wilmerhernandz0@gmail.com",
    password: "Password123!"
  };

  console.log(`📧 Trying to login with: ${loginData.email}`);
  
  try {
    const response = await axios.post('http://localhost:3000/auth/login', loginData);
    
    console.log('✅ LOGIN SUCCESSFUL');
    console.log('User data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    if (error.response) {
      console.log('❌ LOGIN FAILED');
      console.log(`Status: ${error.response.status}`);
      console.log(`Message: ${error.response.data.message || error.response.data}`);
      
      if (error.response.status === 401) {
        console.log('\n💡 This suggests the user may not exist in Supabase Auth');
      }
    } else {
      console.log('❌ NETWORK ERROR:', error.message);
    }
  }

  console.log('\n===================================');
}

testLogin().catch(console.error);
