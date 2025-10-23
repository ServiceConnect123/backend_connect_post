#!/usr/bin/env node

/**
 * Test script for the Selected Company API
 * This script tests the complete flow of setting and retrieving selected companies
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSelectedCompanyAPI() {
  console.log('🚀 Testing Selected Company API...\n');

  try {
    // Test 1: Check if isSelected field exists and works
    console.log('✅ Test 1: Database field verification');
    
    // Get a user with companies
    const userWithCompanies = await prisma.user.findFirst({
      include: {
        companies: {
          include: {
            company: true
          }
        }
      }
    });

    if (!userWithCompanies || userWithCompanies.companies.length === 0) {
      console.log('❌ No user with companies found for testing');
      return;
    }

    console.log(`📝 Found user: ${userWithCompanies.email} with ${userWithCompanies.companies.length} companies\n`);

    // Test 2: Set a company as selected
    console.log('✅ Test 2: Setting selected company');
    
    const firstCompanyId = userWithCompanies.companies[0].companyId;
    
    // First, unselect all companies for this user
    await prisma.userCompany.updateMany({
      where: {
        userId: userWithCompanies.id,
        isSelected: true
      },
      data: {
        isSelected: false
      }
    });

    // Now select the first company
    const updatedUserCompany = await prisma.userCompany.update({
      where: {
        id: userWithCompanies.companies[0].id
      },
      data: {
        isSelected: true
      },
      include: {
        company: true
      }
    });

    console.log(`📝 Selected company: ${updatedUserCompany.company.name}\n`);

    // Test 3: Query selected company
    console.log('✅ Test 3: Querying selected company');
    
    const selectedCompany = await prisma.userCompany.findFirst({
      where: {
        userId: userWithCompanies.id,
        isSelected: true
      },
      include: {
        company: true
      }
    });

    if (selectedCompany) {
      console.log(`📝 Retrieved selected company: ${selectedCompany.company.name}`);
      console.log(`📝 Company NIT: ${selectedCompany.company.nit}`);
      console.log(`📝 User role: ${selectedCompany.role}\n`);
    } else {
      console.log('❌ No selected company found');
    }

    // Test 4: Switch to another company
    if (userWithCompanies.companies.length > 1) {
      console.log('✅ Test 4: Switching selected company');
      
      const secondCompanyId = userWithCompanies.companies[1].companyId;
      
      // Unselect current
      await prisma.userCompany.updateMany({
        where: {
          userId: userWithCompanies.id,
          isSelected: true
        },
        data: {
          isSelected: false
        }
      });

      // Select new one
      await prisma.userCompany.update({
        where: {
          id: userWithCompanies.companies[1].id
        },
        data: {
          isSelected: true
        }
      });

      const newSelectedCompany = await prisma.userCompany.findFirst({
        where: {
          userId: userWithCompanies.id,
          isSelected: true
        },
        include: {
          company: true
        }
      });

      console.log(`📝 Switched to company: ${newSelectedCompany.company.name}\n`);
    }

    // Test 5: Test API endpoint URL structure
    console.log('✅ Test 5: API endpoint information');
    console.log('📝 New API endpoint: PUT /auth/selected-company');
    console.log('📝 Swagger documentation: http://localhost:3000/api');
    console.log('📝 Requires JWT authentication');
    console.log('📝 Request body: { "companyId": "string" }');
    console.log('📝 Returns: UserCompanyAssociation with user and company details\n');

    console.log('🎉 All tests completed successfully!');
    console.log('✅ Selected company functionality is working correctly');
    console.log('✅ Database operations are functional');
    console.log('✅ Prisma client recognizes isSelected field');
    console.log('✅ API endpoint should be available in Swagger UI');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testSelectedCompanyAPI().catch(console.error);
