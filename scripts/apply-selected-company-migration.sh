#!/bin/bash

echo "🔄 Aplicando migración para compañía seleccionada..."

echo "📊 Generando cliente de Prisma..."
npx prisma generate

echo "🗄️ Aplicando migración a la base de datos..."
npx prisma migrate deploy

echo "📝 Configurando la primera compañía como seleccionada para usuarios existentes..."
node -e "
const { PrismaClient } = require('@prisma/client');

async function setDefaultSelectedCompany() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Buscando usuarios sin compañía seleccionada...');
    
    // Obtener todos los usuarios únicos
    const users = await prisma.user.findMany({
      select: { id: true, email: true }
    });
    
    console.log(\`Encontrados \${users.length} usuarios\`);
    
    for (const user of users) {
      // Verificar si el usuario ya tiene una compañía seleccionada
      const selectedCompany = await prisma.userCompany.findFirst({
        where: { userId: user.id, isSelected: true }
      });
      
      if (!selectedCompany) {
        // Seleccionar la primera compañía del usuario
        const firstCompany = await prisma.userCompany.findFirst({
          where: { userId: user.id },
          orderBy: { createdAt: 'asc' }
        });
        
        if (firstCompany) {
          await prisma.userCompany.update({
            where: { id: firstCompany.id },
            data: { isSelected: true }
          });
          console.log(\`✅ Usuario \${user.email}: Primera compañía marcada como seleccionada\`);
        } else {
          console.log(\`⚠️  Usuario \${user.email}: No tiene compañías asociadas\`);
        }
      } else {
        console.log(\`✅ Usuario \${user.email}: Ya tiene compañía seleccionada\`);
      }
    }
    
    console.log('✅ Configuración completada');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.\$disconnect();
  }
}

setDefaultSelectedCompany();
"

echo "✅ Migración completada exitosamente!"
echo "🔍 Puedes verificar los cambios consultando la tabla user_companies"
