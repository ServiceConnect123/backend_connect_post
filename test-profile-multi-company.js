const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// Configuration
const SUPABASE_URL = 'https://fhfzepxekdyblxcsuyav.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoZnplcHhla2R5Ymx4Y3N1eWF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0MDE1NjAsImV4cCI6MjA0NDk3NzU2MH0.tR8_T_Ab0UkyHoOwIzSPdbuI7tr8si-YGP6nVLmo4I4';
const API_BASE_URL = 'http://localhost:3000';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testMultiCompanyProfile() {
  console.log('\n🧪 === TESTING MULTI-COMPANY PROFILE RETRIEVAL ===\n');

  try {
    // Test with the existing user that we know has multiple companies
    const testEmail = 'multi@test.com';
    const testPassword = '123456';

    console.log('🔐 Step 1: Login to get access token...');
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (authError) {
      console.log('❌ Login failed:', authError.message);
      console.log('⚠️ User may not exist yet. This is expected if no multi-company user has been created.');
      return;
    }

    console.log('✅ Login successful!');
    console.log('📋 User UUID:', authData.user.id);

    const accessToken = authData.session.access_token;

    // Test 1: Get profile without company context (should return first company)
    console.log('\n🎯 Test 1: Get profile without company context...');
    
    try {
      const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Profile retrieved successfully!');
      console.log('📊 Profile Data:');
      console.log('   - User ID:', profileResponse.data.user.id);
      console.log('   - Email:', profileResponse.data.user.email);
      console.log('   - Full Name:', profileResponse.data.user.fullName);
      console.log('   - Primary Company:', profileResponse.data.user.company.name);
      console.log('   - Primary Company NIT:', profileResponse.data.user.company.nit);
      console.log('   - Total Companies:', profileResponse.data.user.totalCompanies);
      console.log('   - Is Multi-Company:', profileResponse.data.user.isMultiCompany);
      
      if (profileResponse.data.user.companies && profileResponse.data.user.companies.length > 0) {
        console.log('🏢 All Companies Associated:');
        profileResponse.data.user.companies.forEach((company, index) => {
          console.log(`   ${index + 1}. ${company.name} (${company.nit}) - Role: ${company.role}`);
        });
      }

      // Test 2: If user has multiple companies, test with specific company context
      if (profileResponse.data.user.totalCompanies > 1) {
        const secondCompanyId = profileResponse.data.user.companies[1].id;
        
        console.log(`\n🎯 Test 2: Get profile with specific company context (${secondCompanyId})...`);
        
        const specificProfileResponse = await axios.get(`${API_BASE_URL}/auth/profile?companyId=${secondCompanyId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('✅ Company-specific profile retrieved successfully!');
        console.log('📊 Company-Specific Profile Data:');
        console.log('   - Primary Company:', specificProfileResponse.data.user.company.name);
        console.log('   - Primary Company NIT:', specificProfileResponse.data.user.company.nit);
        console.log('   - User Role in this company:', specificProfileResponse.data.user.role);
      } else {
        console.log('ℹ️ User only has one company, skipping company-specific test.');
      }

      // Test 3: Test with invalid company ID
      console.log('\n🎯 Test 3: Test with invalid company ID...');
      
      try {
        await axios.get(`${API_BASE_URL}/auth/profile?companyId=invalid-company-id`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('❌ Expected error for invalid company ID, but request succeeded');
      } catch (error) {
        if (error.response && error.response.data) {
          console.log('✅ Correctly handled invalid company ID');
          console.log('📋 Error message:', error.response.data.message);
        } else {
          console.log('❌ Unexpected error:', error.message);
        }
      }

    } catch (error) {
      console.log('❌ Profile request failed:', error.response?.data || error.message);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }

  console.log('\n🏁 === MULTI-COMPANY PROFILE TEST COMPLETE ===\n');
}

// Run the test
testMultiCompanyProfile().catch(console.error);
