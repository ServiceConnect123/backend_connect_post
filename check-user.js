const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'admin@netsolutionlabs.com' },
      include: {
        companies: {
          include: {
            company: true
          }
        },
        configuration: true
      }
    });
    
    if (user) {
      console.log('✅ Usuario encontrado:');
      console.log(`ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Nombre: ${user.firstName} ${user.lastName}`);
      console.log(`Supabase UUID: ${user.supabaseUuid}`);
      console.log(`Empresas asociadas: ${user.companies.length}`);
      
      if (user.companies.length > 0) {
        console.log('\n🏢 Empresas del usuario:');
        user.companies.forEach((uc, index) => {
          console.log(`${index + 1}. ${uc.company.name} (${uc.role}) - Selected: ${uc.isSelected}`);
        });
      }
      
      console.log(`\n⚙️ Configuración: ${user.configuration ? 'SÍ tiene' : 'NO tiene'}`);
    } else {
      console.log('❌ Usuario NO encontrado con email: admin@netsolutionlabs.com');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
