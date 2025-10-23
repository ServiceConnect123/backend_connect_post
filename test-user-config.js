import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testUserConfiguration() {
  try {
    console.log('Testing UserConfiguration model...');
    
    // Test findMany
    const configs = await prisma.userConfiguration.findMany({
      take: 1,
    });
    
    console.log('UserConfiguration model works! Found configs:', configs.length);
    
    // Test user with configuration
    const userWithConfig = await prisma.user.findFirst({
      include: {
        configuration: true,
      },
    });
    
    console.log('User with configuration relation works!', userWithConfig ? 'OK' : 'NO DATA');
    
  } catch (error) {
    console.error('Error testing UserConfiguration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUserConfiguration();
