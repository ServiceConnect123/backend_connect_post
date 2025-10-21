const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkLocationIds() {
  console.log('🔍 Checking location IDs in database...\n');
  
  try {
    console.log('Connecting to database...');
    
    // Get countries
    const countries = await prisma.country.findMany({
      orderBy: { value: 'asc' }
    });
    
    console.log(`Found ${countries.length} countries`);
    console.log('📍 Countries:');
    countries.forEach(country => {
      console.log(`  ID: ${country.id} | Key: ${country.key} | Value: ${country.value}`);
    });
    
    console.log('\n🏙️ Cities (showing Colombia cities):');
    const colombiaCountry = countries.find(c => c.key === 'CO');
    if (colombiaCountry) {
      console.log(`Found Colombia with ID: ${colombiaCountry.id}`);
      const cities = await prisma.city.findMany({
        where: { countryId: colombiaCountry.id },
        orderBy: { value: 'asc' }
      });
      
      console.log(`Found ${cities.length} cities in Colombia`);
      cities.slice(0, 10).forEach(city => {
        console.log(`  ID: ${city.id} | Key: ${city.key} | Value: ${city.value}`);
      });
      
      if (cities.length > 10) {
        console.log(`  ... and ${cities.length - 10} more cities`);
      }
    } else {
      console.log('Colombia not found!');
    }
    
  } catch (error) {
    console.error('Error:', error);
    console.error(error.stack);
  } finally {
    console.log('Disconnecting...');
    await prisma.$disconnect();
    console.log('Done!');
  }
}

console.log('Starting location check...');
checkLocationIds().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
