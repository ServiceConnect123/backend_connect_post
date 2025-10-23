const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCompany() {
  try {
    const company = await prisma.company.findUnique({
      where: { id: 'fc7b0a32-d48c-4e0d-98b1-1e4d6b8efb79' }
    });
    
    if (company) {
      console.log('✅ Empresa encontrada:');
      console.log(JSON.stringify(company, null, 2));
    } else {
      console.log('❌ Empresa NO encontrada con ID: fc7b0a32-d48c-4e0d-98b1-1e4d6b8efb79');
      
      // Mostrar empresas disponibles
      const companies = await prisma.company.findMany({
        select: { id: true, name: true, nit: true }
      });
      console.log('\n📋 Empresas disponibles:');
      companies.forEach((comp, index) => {
        console.log(`${index + 1}. ${comp.name} (NIT: ${comp.nit}) - ID: ${comp.id}`);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkCompany();
