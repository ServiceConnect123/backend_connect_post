const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:3000';

async function testProfileWithNewUser() {
  console.log('\n🧪 === TESTING PROFILE WITH NEW USER CREATION ===\n');

  try {
    // Step 1: Register a new user
    console.log('👤 Step 1: Creating new user for profile testing...');
    
    const registerData = {
      email: 'profile.test@gmail.com',
      password: '123456',
      first_name: 'Profile',
      last_name: 'Tester',
      role: 'ADMIN',
      company: {
        name: 'Profile Test Company',
        nit: '987654321-0',
        email: 'contact@profiletest.com',
        phone: '+57 300 123 4567',
        address: 'Test Address 123',
        countryId: 'clzd9o5eo0000nt9jj43o2hfj', // Colombia
        cityId: 'clzd9o5hl0001nt9j5sxjm7la'   // Barranquilla
      }
    };

    let registerResponse;
    try {
      registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, registerData);
      console.log('✅ User registered successfully!');
      console.log('📋 Registration response:', {
        scenario: registerResponse.data.summary?.scenario,
        totalCompanies: registerResponse.data.summary?.totalCompanies,
        userEmail: registerResponse.data.user?.email,
        companyName: registerResponse.data.company?.name
      });
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('⚠️ User already exists, proceeding with profile test...');
      } else {
        console.log('❌ Registration failed:', error.response?.data || error.message);
        return;
      }
    }

    // Step 2: Login to get access token
    console.log('\n🔐 Step 2: Logging in to get access token...');
    
    const loginData = {
      email: 'profile.test@gmail.com',
      password: '123456'
    };

    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
    
    if (!loginResponse.data.session?.accessToken) {
      console.log('❌ Login failed: No access token received');
      return;
    }

    console.log('✅ Login successful!');
    console.log('📋 User details:', {
      email: loginResponse.data.user?.email,
      fullName: loginResponse.data.user?.fullName
    });

    const accessToken = loginResponse.data.session.accessToken;

    // Step 3: Test profile retrieval
    console.log('\n🎯 Step 3: Testing profile retrieval...');
    
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
    console.log('   - Role:', profileResponse.data.user.role);
    console.log('   - Email Confirmed:', profileResponse.data.user.emailConfirmed);
    
    if (profileResponse.data.user.company) {
      console.log('🏢 Primary Company:');
      console.log('   - Name:', profileResponse.data.user.company.name);
      console.log('   - NIT:', profileResponse.data.user.company.nit);
      console.log('   - Email:', profileResponse.data.user.company.email);
    }

    if (profileResponse.data.user.companies) {
      console.log('🏢 All Companies Associated:', profileResponse.data.user.totalCompanies);
      profileResponse.data.user.companies.forEach((company, index) => {
        console.log(`   ${index + 1}. ${company.name} (${company.nit}) - Role: ${company.role}`);
      });
      console.log('   - Is Multi-Company:', profileResponse.data.user.isMultiCompany);
    }

    // Step 4: Register user to a second company to test multi-company
    console.log('\n🏢 Step 4: Adding user to second company...');
    
    const secondCompanyData = {
      email: 'profile.test@gmail.com',
      password: '123456',
      first_name: 'Profile',
      last_name: 'Tester',
      role: 'USER',
      company: {
        name: 'Second Profile Test Company',
        nit: '111222333-4',
        email: 'contact@secondprofiletest.com',
        phone: '+57 300 987 6543',
        address: 'Second Test Address 456',
        countryId: 'clzd9o5eo0000nt9jj43o2hfj', // Colombia
        cityId: 'clzd9o5hl0001nt9j5sxjm7la'   // Barranquilla
      }
    };

    try {
      const secondRegisterResponse = await axios.post(`${API_BASE_URL}/auth/register`, secondCompanyData);
      console.log('✅ User added to second company successfully!');
      console.log('📋 Second registration:', {
        scenario: secondRegisterResponse.data.summary?.scenario,
        totalCompanies: secondRegisterResponse.data.summary?.totalCompanies,
        companyName: secondRegisterResponse.data.company?.name
      });

      // Step 5: Test profile with multiple companies
      console.log('\n🎯 Step 5: Testing profile with multiple companies...');
      
      const multiCompanyProfileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Multi-company profile retrieved successfully!');
      console.log('📊 Multi-Company Profile Data:');
      console.log('   - Total Companies:', multiCompanyProfileResponse.data.user.totalCompanies);
      console.log('   - Is Multi-Company:', multiCompanyProfileResponse.data.user.isMultiCompany);
      
      if (multiCompanyProfileResponse.data.user.companies) {
        console.log('🏢 All Companies:');
        multiCompanyProfileResponse.data.user.companies.forEach((company, index) => {
          console.log(`   ${index + 1}. ${company.name} (${company.nit}) - Role: ${company.role}`);
        });
      }

      // Step 6: Test company-specific profile
      if (multiCompanyProfileResponse.data.user.companies.length > 1) {
        const secondCompanyId = multiCompanyProfileResponse.data.user.companies[1].id;
        
        console.log(`\n🎯 Step 6: Testing company-specific profile (${secondCompanyId})...`);
        
        const specificProfileResponse = await axios.get(`${API_BASE_URL}/auth/profile?companyId=${secondCompanyId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('✅ Company-specific profile retrieved successfully!');
        console.log('📊 Company-Specific Data:');
        console.log('   - Primary Company:', specificProfileResponse.data.user.company.name);
        console.log('   - Primary Company NIT:', specificProfileResponse.data.user.company.nit);
        console.log('   - User Role:', specificProfileResponse.data.user.role);
      }

    } catch (error) {
      if (error.response?.status === 409) {
        console.log('⚠️ User already exists in second company, that\'s fine for testing');
        
        // Still test the multi-company profile
        console.log('\n🎯 Step 5: Testing existing multi-company profile...');
        
        const existingProfileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📊 Existing Profile Data:');
        console.log('   - Total Companies:', existingProfileResponse.data.user.totalCompanies);
        console.log('   - Is Multi-Company:', existingProfileResponse.data.user.isMultiCompany);
      } else {
        console.log('⚠️ Could not add to second company:', error.response?.data?.message || error.message);
      }
    }

  } catch (error) {
    console.log('❌ Test failed:', error.response?.data || error.message);
  }

  console.log('\n🏁 === PROFILE TEST COMPLETE ===\n');
}

// Run the test
testProfileWithNewUser().catch(console.error);
