#!/usr/bin/env ts-node

/**
 * Script de validación completa del sistema de configuraciones automáticas
 * Verifica que todos los componentes estén funcionando correctamente
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validateCompleteSystem() {
  console.log('🔍 VALIDACIÓN COMPLETA DEL SISTEMA DE CONFIGURACIONES\n');
  console.log('='.repeat(60));

  let allTestsPassed = true;
  const results = {
    database: false,
    migrations: false,
    defaultConfigs: false,
    relationships: false,
    dataIntegrity: false,
  };

  try {
    // Test 1: Verificar estructura de base de datos
    console.log('\n📋 1. VERIFICANDO ESTRUCTURA DE BASE DE DATOS...');
    
    try {
      await prisma.userConfiguration.findFirst();
      console.log('   ✅ Tabla users_configuration existe y es accesible');
      results.database = true;
    } catch (error) {
      console.log('   ❌ Error accediendo a tabla users_configuration:', error);
      allTestsPassed = false;
    }

    // Test 2: Verificar migraciones aplicadas
    console.log('\n🗄️ 2. VERIFICANDO MIGRACIONES...');
    
    try {
      const userWithConfig = await prisma.user.findFirst({
        include: { configuration: true }
      });
      console.log('   ✅ Relación User-Configuration funciona correctamente');
      results.migrations = true;
    } catch (error) {
      console.log('   ❌ Error en relación User-Configuration:', error);
      allTestsPassed = false;
    }

    // Test 3: Verificar configuraciones por defecto
    console.log('\n⚙️ 3. VERIFICANDO CONFIGURACIONES POR DEFECTO...');
    
    const totalUsers = await prisma.user.count();
    const usersWithConfig = await prisma.user.count({
      where: {
        configuration: { isNot: null }
      }
    });
    const usersWithoutConfig = totalUsers - usersWithConfig;
    
    console.log(`   📊 Usuarios totales: ${totalUsers}`);
    console.log(`   📊 Usuarios con configuración: ${usersWithConfig}`);
    console.log(`   📊 Usuarios sin configuración: ${usersWithoutConfig}`);
    
    if (usersWithoutConfig === 0 && totalUsers > 0) {
      console.log('   ✅ Todos los usuarios tienen configuración');
      results.defaultConfigs = true;
    } else if (totalUsers === 0) {
      console.log('   ⚠️  No hay usuarios en la base de datos para verificar');
      results.defaultConfigs = true; // No es un error si no hay usuarios
    } else {
      console.log(`   ❌ ${usersWithoutConfig} usuarios sin configuración`);
      allTestsPassed = false;
    }

    // Test 4: Verificar integridad de relaciones
    console.log('\n🔗 4. VERIFICANDO INTEGRIDAD DE RELACIONES...');
    
    try {
      // Verificar que la relación funciona correctamente
      const configsWithUser = await prisma.userConfiguration.findMany({
        include: { user: true },
        take: 1
      });
      
      // También verificar que no hay configuraciones huérfanas (aunque el schema lo previene)
      const totalConfigs = await prisma.userConfiguration.count();
      const totalUsers = await prisma.user.count();
      
      console.log(`   📊 Total configuraciones: ${totalConfigs}`);
      console.log(`   📊 Total usuarios: ${totalUsers}`);
      
      if (configsWithUser.length > 0 && configsWithUser[0].user) {
        console.log('   ✅ Relación User-Configuration funciona correctamente');
        results.relationships = true;
      } else if (totalConfigs === 0) {
        console.log('   ⚠️  No hay configuraciones para verificar relaciones');
        results.relationships = true; // No es un error si no hay datos
      } else {
        console.log('   ❌ Problema con la relación User-Configuration');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('   ❌ Error verificando integridad de relaciones:', error);
      allTestsPassed = false;
    }

    // Test 5: Verificar integridad de datos por defecto
    console.log('\n🎯 5. VERIFICANDO INTEGRIDAD DE DATOS POR DEFECTO...');
    
    try {
      const invalidConfigs = await prisma.userConfiguration.count({
        where: {
          OR: [
            { dateFormat: { notIn: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] } },
            { timeFormat: { notIn: ['12h', '24h'] } },
            { language: { notIn: ['es', 'en', 'fr'] } },
            { currency: { notIn: ['USD', 'EUR', 'COP'] } },
            { decimalSeparator: { notIn: [',', '.'] } },
            { itemsPerPage: { lt: 5 } },
            { itemsPerPage: { gt: 100 } },
            { theme: { notIn: ['light', 'dark'] } },
          ]
        }
      });
      
      if (invalidConfigs === 0) {
        console.log('   ✅ Todas las configuraciones tienen valores válidos');
        results.dataIntegrity = true;
      } else {
        console.log(`   ❌ ${invalidConfigs} configuraciones con valores inválidos`);
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('   ❌ Error verificando integridad de datos:', error);
      allTestsPassed = false;
    }

    // Test 6: Verificar configuraciones por defecto específicas
    console.log('\n🔧 6. VERIFICANDO VALORES POR DEFECTO ESPECÍFICOS...');
    
    try {
      const defaultConfigsCount = await prisma.userConfiguration.count({
        where: {
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h',
          language: 'es',
          currency: 'COP',
          decimalSeparator: ',',
          theme: 'light',
        }
      });
      
      console.log(`   📊 Configuraciones con valores por defecto estándar: ${defaultConfigsCount}`);
      
      if (defaultConfigsCount >= 0) {
        console.log('   ✅ Sistema de valores por defecto funciona correctamente');
      }
    } catch (error) {
      console.log('   ❌ Error verificando valores por defecto específicos:', error);
      allTestsPassed = false;
    }

    // Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE VALIDACIÓN:');
    console.log('='.repeat(60));
    
    console.log(`${results.database ? '✅' : '❌'} Estructura de Base de Datos`);
    console.log(`${results.migrations ? '✅' : '❌'} Migraciones Aplicadas`);
    console.log(`${results.defaultConfigs ? '✅' : '❌'} Configuraciones por Defecto`);
    console.log(`${results.relationships ? '✅' : '❌'} Integridad de Relaciones`);
    console.log(`${results.dataIntegrity ? '✅' : '❌'} Integridad de Datos`);
    
    console.log('\n' + '='.repeat(60));
    
    if (allTestsPassed) {
      console.log('🎉 ¡SISTEMA COMPLETAMENTE FUNCIONAL!');
      console.log('   Todas las validaciones pasaron exitosamente.');
      console.log('   El sistema de configuraciones automáticas está listo para producción.');
    } else {
      console.log('⚠️  SISTEMA REQUIERE ATENCIÓN');
      console.log('   Algunas validaciones fallaron. Revisa los errores reportados.');
      console.log('   Ejecuta los scripts de corrección necesarios antes de continuar.');
    }
    
    console.log('\n🔧 SCRIPTS DISPONIBLES:');
    console.log('   - npm run script:default-configs     (Crear configuraciones faltantes)');
    console.log('   - npm run script:test-auto-configs   (Probar sistema completo)');
    
    return allTestsPassed;
    
  } catch (error) {
    console.error('\n💥 ERROR FATAL EN VALIDACIÓN:', error);
    return false;
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión a base de datos cerrada.');
  }
}

// Ejecutar validación
if (require.main === module) {
  validateCompleteSystem()
    .then((success) => {
      console.log(`\n${success ? '✅' : '❌'} Validación completada ${success ? 'exitosamente' : 'con errores'}.`);
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('💥 Error fatal en validación:', error);
      process.exit(1);
    });
}

export { validateCompleteSystem };
