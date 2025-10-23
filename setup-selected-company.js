const { PrismaClient } = require('@prisma/client');

async function setDefaultSelectedCompany() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Buscando usuarios sin compañía seleccionada...');
    
    const users = await prisma.user.findMany({
      select: { id: true, email: true }
    });
    
    console.log(`📊 Encontrados ${users.length} usuarios`);
    
    for (const user of users) {
      const selectedCompany = await prisma.userCompany.findFirst({
        where: { userId: user.id, isSelected: true }
      });
      
      if (!selectedCompany) {
        const firstCompany = await prisma.userCompany.findFirst({
          where: { userId: user.id },
          orderBy: { createdAt: 'asc' }
        });
        
        if (firstCompany) {
          await prisma.userCompany.update({
            where: { id: firstCompany.id },
            data: { isSelected: true }
          });
          console.log(`✅ Usuario ${user.email}: Primera compañía marcada como seleccionada`);
        } else {
          console.log(`⚠️  Usuario ${user.email}: No tiene compañías asociadas`);
        }
      } else {
        console.log(`✅ Usuario ${user.email}: Ya tiene compañía seleccionada`);
      }
    }
    
    console.log('🎉 Configuración completada exitosamente!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setDefaultSelectedCompany();
