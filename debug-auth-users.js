const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugUserAuth() {
  console.log('🔍 DEBUGGING USER AUTHENTICATION ISSUE\n');

  try {
    // 1. Verificar todos los usuarios en la base de datos
    const users = await prisma.user.findMany({
      select: {
        id: true,
        supabaseUuid: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 Usuarios encontrados: ${users.length}`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Supabase UUID: ${user.supabaseUuid}`);
      console.log(`   Creado: ${user.createdAt.toLocaleString()}`);
      console.log('');
    });

    // 2. Verificar el usuario específico que aparece en la respuesta
    const problematicUserId = "cmh1ag4660003f7010sawwz7r";
    const problematicUser = await prisma.user.findUnique({
      where: { id: problematicUserId },
      include: {
        companies: {
          include: {
            company: true,
          }
        }
      }
    });

    console.log(`🔍 Usuario problemático (ID: ${problematicUserId}):`);
    if (problematicUser) {
      console.log(`   Email: ${problematicUser.email}`);
      console.log(`   Nombre: ${problematicUser.firstName} ${problematicUser.lastName}`);
      console.log(`   Supabase UUID: ${problematicUser.supabaseUuid}`);
      console.log(`   Compañías asociadas: ${problematicUser.companies.length}`);
      
      problematicUser.companies.forEach((userCompany, index) => {
        console.log(`   ${index + 1}. ${userCompany.company.name} (${userCompany.role}) - Selected: ${userCompany.isSelected}`);
      });
    } else {
      console.log('   ❌ Usuario no encontrado');
    }

    // 3. Verificar si este usuario tiene compañías seleccionadas
    const selectedCompanies = await prisma.userCompany.findMany({
      where: {
        isSelected: true,
      },
      include: {
        user: true,
        company: true,
      }
    });

    console.log(`\n🎯 Compañías seleccionadas en el sistema: ${selectedCompanies.length}`);
    selectedCompanies.forEach((userCompany, index) => {
      console.log(`${index + 1}. Usuario: ${userCompany.user.firstName} ${userCompany.user.lastName} (${userCompany.user.email})`);
      console.log(`   Compañía: ${userCompany.company.name}`);
      console.log(`   Supabase UUID: ${userCompany.user.supabaseUuid}`);
      console.log('');
    });

    // 4. Buscar por el email del usuario que debería estar autenticado
    console.log('🔍 Si tienes el email del usuario que debería estar autenticado, búscalo aquí:');
    
  } catch (error) {
    console.error('❌ Error en debug:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugUserAuth();
