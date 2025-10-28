#!/usr/bin/env ts-node

/**
 * Script para crear configuraciones por defecto para usuarios existentes
 * que no tienen configuración creada
 * 
 * Uso: npm run script:default-configs
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createDefaultConfigurations() {
  console.log('🚀 Iniciando script para crear configuraciones por defecto...\n');

  try {
    // 1. Buscar todos los usuarios que no tienen configuración
    const usersWithoutConfig = await prisma.user.findMany({
      where: {
        configuration: null
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      }
    });

    console.log(`📊 Usuarios sin configuración encontrados: ${usersWithoutConfig.length}`);

    if (usersWithoutConfig.length === 0) {
      console.log('✅ Todos los usuarios ya tienen configuración creada.');
      return;
    }

    console.log('\n📋 Lista de usuarios sin configuración:');
    usersWithoutConfig.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - Creado: ${user.createdAt.toLocaleDateString()}`);
    });

    console.log('\n⚙️ Creando configuraciones por defecto...\n');

    // 2. Crear configuraciones por defecto para cada usuario
    interface CreatedConfig {
      userId: string;
      userName: string;
      email: string;
      configId: string;
    }
    
    const createdConfigs: CreatedConfig[] = [];
    let successCount = 0;
    let errorCount = 0;

    for (const user of usersWithoutConfig) {
      try {
        const config = await prisma.userConfiguration.create({
          data: {
            userId: user.id,
            dateFormat: 'DD/MM/YYYY',
            timeFormatId: (await prisma.timeFormat.findFirst({ where: { value: '24h' } }))?.id,
            languageId: (await prisma.language.findFirst({ where: { code: 'es' } }))?.id,
            currencyId: (await prisma.currency.findFirst({ where: { code: 'COP' } }))?.id,
            decimalSeparator: ',',
            itemsPerPage: 10,
            theme: 'light',
            primaryColor: '#3b82f6',
          }
        });

        createdConfigs.push({
          userId: user.id,
          userName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          configId: config.id,
        });

        successCount++;
        console.log(`✅ Configuración creada para ${user.firstName} ${user.lastName} (${user.email})`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error creando configuración para ${user.firstName} ${user.lastName} (${user.email}):`, error);
      }
    }

    // 3. Resumen final
    console.log('\n📈 RESUMEN DE EJECUCIÓN:');
    console.log(`✅ Configuraciones creadas exitosamente: ${successCount}`);
    console.log(`❌ Errores encontrados: ${errorCount}`);
    console.log(`📊 Total de usuarios procesados: ${usersWithoutConfig.length}`);

    if (createdConfigs.length > 0) {
      console.log('\n🎯 CONFIGURACIONES CREADAS:');
      createdConfigs.forEach((config, index) => {
        console.log(`${index + 1}. ${config.userName} (${config.email}) - Config ID: ${config.configId}`);
      });
    }

    // 4. Verificación final
    console.log('\n🔍 Verificando resultado...');
    const remainingUsersWithoutConfig = await prisma.user.count({
      where: {
        configuration: null
      }
    });

    const totalUsers = await prisma.user.count();
    const usersWithConfig = totalUsers - remainingUsersWithoutConfig;

    console.log(`📊 Usuarios totales: ${totalUsers}`);
    console.log(`✅ Usuarios con configuración: ${usersWithConfig}`);
    console.log(`❓ Usuarios sin configuración: ${remainingUsersWithoutConfig}`);

    if (remainingUsersWithoutConfig === 0) {
      console.log('\n🎉 ¡ÉXITO! Todos los usuarios ahora tienen configuración por defecto.');
    } else {
      console.log(`\n⚠️  Aún quedan ${remainingUsersWithoutConfig} usuarios sin configuración.`);
    }

  } catch (error) {
    console.error('💥 Error ejecutando el script:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión a la base de datos cerrada.');
  }
}

// Ejecutar el script
if (require.main === module) {
  createDefaultConfigurations()
    .then(() => {
      console.log('\n✨ Script ejecutado completamente.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

export { createDefaultConfigurations };
