#!/usr/bin/env node

/**
 * Script para verificar que las variables de entorno estén configuradas correctamente
 */

const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DATABASE_URL',
  'JWT_SECRET',
  'NODE_ENV',
  'PORT'
];

const optionalEnvVars = [
  'JWT_EXPIRES_IN',
  'CORS_ORIGINS',
  'DIRECT_URL'
];

console.log('🔍 Verificando configuración de variables de entorno...\n');

let hasErrors = false;

// Verificar variables requeridas
console.log('✅ Variables requeridas:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName}: NO CONFIGURADA`);
    hasErrors = true;
  } else if (value.includes('your-') || value.includes('change-this') || value.includes('placeholder')) {
    console.log(`⚠️  ${varName}: USAR VALOR PLACEHOLDER - ${value.substring(0, 50)}...`);
    hasErrors = true;
  } else {
    console.log(`✅ ${varName}: CONFIGURADA`);
  }
});

console.log('\n📋 Variables opcionales:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`⚪ ${varName}: no configurada (opcional)`);
  } else {
    console.log(`✅ ${varName}: CONFIGURADA`);
  }
});

// Verificar conexión a Supabase
console.log('\n🔗 Verificando URLs:');
const supabaseUrl = process.env.SUPABASE_URL;
if (supabaseUrl) {
  try {
    const url = new URL(supabaseUrl);
    if (url.hostname.includes('supabase.co')) {
      console.log(`✅ SUPABASE_URL: URL válida - ${url.hostname}`);
    } else {
      console.log(`⚠️  SUPABASE_URL: URL sospechosa - ${url.hostname}`);
    }
  } catch (error) {
    console.log(`❌ SUPABASE_URL: URL inválida - ${supabaseUrl}`);
    hasErrors = true;
  }
}

console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ CONFIGURACIÓN INCOMPLETA - Revisar variables marcadas');
  process.exit(1);
} else {
  console.log('✅ CONFIGURACIÓN COMPLETA - Todo listo para producción');
  process.exit(0);
}
