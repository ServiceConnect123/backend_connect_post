#!/usr/bin/env ts-node

/**
 * Script de prueba para verificar que la creación automática de configuraciones
 * funciona correctamente durante el registro de usuarios
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAutoConfigCreation() {
  console.log('🧪 Iniciando prueba de creación automática de configuraciones...\n');

  try {
    // 1. Contar usuarios y configuraciones actuales
    const totalUsers = await prisma.user.count();
    const totalConfigs = await prisma.userConfiguration.count();
    
    console.log(`📊 Estado inicial:`);
    console.log(`   - Usuarios totales: ${totalUsers}`);
    console.log(`   - Configuraciones totales: ${totalConfigs}`);
    
    // 2. Verificar usuarios sin configuración
    const usersWithoutConfig = await prisma.user.count({
      where: {
        configuration: null
      }
    });
    
    console.log(`   - Usuarios sin configuración: ${usersWithoutConfig}`);
    
    // 3. Verificar que todas las configuraciones tienen valores por defecto correctos
    const configsWithDefaults = await prisma.userConfiguration.findMany({
      select: {
        id: true,
        userId: true,
        dateFormat: true,
        timeFormat: true,
        language: true,
        currency: true,
        decimalSeparator: true,
        itemsPerPage: true,
        theme: true,
        primaryColor: true,
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });
    
    console.log(`\n🔍 Verificando configuraciones por defecto:`);
    
    let correctDefaults = 0;
    let incorrectDefaults = 0;
    
    for (const config of configsWithDefaults) {
      const isCorrect = 
        config.dateFormat === 'DD/MM/YYYY' &&
        config.timeFormat === '24h' &&
        config.language === 'es' &&
        config.currency === 'COP' &&
        config.decimalSeparator === ',' &&
        config.itemsPerPage >= 10 &&
        ['light', 'dark'].includes(config.theme) &&
        config.primaryColor.startsWith('#');
      
      if (isCorrect) {
        correctDefaults++;
        console.log(`   ✅ ${config.user.firstName} ${config.user.lastName} (${config.user.email})`);
      } else {
        incorrectDefaults++;
        console.log(`   ❌ ${config.user.firstName} ${config.user.lastName} (${config.user.email}) - Valores incorrectos`);
        console.log(`      - dateFormat: ${config.dateFormat} (esperado: DD/MM/YYYY)`);
        console.log(`      - timeFormat: ${config.timeFormat} (esperado: 24h)`);
        console.log(`      - language: ${config.language} (esperado: es)`);
        console.log(`      - currency: ${config.currency} (esperado: COP)`);
      }
    }
    
    // 4. Resumen final
    console.log(`\n📈 RESUMEN DE PRUEBAS:`);
    console.log(`✅ Usuarios totales: ${totalUsers}`);
    console.log(`✅ Configuraciones totales: ${totalConfigs}`);
    console.log(`${usersWithoutConfig === 0 ? '✅' : '❌'} Usuarios sin configuración: ${usersWithoutConfig}`);
    console.log(`✅ Configuraciones con valores correctos: ${correctDefaults}`);
    console.log(`${incorrectDefaults === 0 ? '✅' : '❌'} Configuraciones con valores incorrectos: ${incorrectDefaults}`);
    
    const allTestsPassed = usersWithoutConfig === 0 && incorrectDefaults === 0;
    
    if (allTestsPassed) {
      console.log(`\n🎉 ¡TODAS LAS PRUEBAS PASARON! El sistema de configuraciones automáticas está funcionando correctamente.`);
    } else {
      console.log(`\n⚠️  ALGUNAS PRUEBAS FALLARON. Revisa los problemas reportados arriba.`);
    }
    
    return allTestsPassed;
    
  } catch (error) {
    console.error('💥 Error ejecutando las pruebas:', error);
    return false;
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión a la base de datos cerrada.');
  }
}

// Ejecutar las pruebas
if (require.main === module) {
  testAutoConfigCreation()
    .then((success) => {
      console.log(`\n✨ Pruebas completadas ${success ? 'exitosamente' : 'con errores'}.`);
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

export { testAutoConfigCreation };
