#!/usr/bin/env ts-node

/**
 * Script para diagnosticar problemas de autenticación con tokens
 * Verifica qué usuario se está obteniendo del token JWT
 */

import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugTokenAuthentication() {
  console.log('🔍 DIAGNÓSTICO DE AUTENTICACIÓN CON TOKEN\n');

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Variables de entorno SUPABASE_URL o SUPABASE_ANON_KEY no configuradas');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  console.log('📋 INSTRUCCIONES:');
  console.log('1. Haz login en tu frontend o Postman');
  console.log('2. Copia el token JWT del header Authorization');
  console.log('3. Pégalo aquí (sin el "Bearer " prefix)\n');

  // Simular un token de ejemplo (deberás reemplazar esto con el token real)
  const exampleToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjk5OTk5OTk5LCJpYXQiOjE2OTk5OTk5OTksImlzcyI6Imh0dHBzOi8veW91ci1wcm9qZWN0LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJhYmMxMjM0NTYtZjc4OS00NTY3LWE4OWItY2RlZjEyMzQ1Njc4IiwiZW1haWwiOiJhZG1pbkBuZXRzb2x1dGlvbmxhYnMuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE2OTk5OTk5OTl9XSwic2Vzc2lvbl9pZCI6ImFiYzEyMzQ1Ni1mNzg5LTQ1NjctYTg5Yi1jZGVmMTIzNDU2NzgifQ.example-signature";

  console.log('🔧 MÉTODOS DE PRUEBA DISPONIBLES:\n');

  // Método 1: Verificar token directamente con Supabase
  async function testSupabaseToken(token: string) {
    console.log('1️⃣ PROBANDO TOKEN CON SUPABASE API...');
    
    try {
      const { data, error } = await supabase.auth.getUser(token);
      
      if (error) {
        console.log(`❌ Error Supabase: ${error.message}`);
        return null;
      }
      
      if (data?.user) {
        console.log(`✅ Usuario encontrado en Supabase:`);
        console.log(`   ID: ${data.user.id}`);
        console.log(`   Email: ${data.user.email}`);
        console.log(`   Created: ${data.user.created_at}`);
        console.log(`   Metadata:`, JSON.stringify(data.user.user_metadata, null, 2));
        return data.user;
      }
      
      console.log('❌ No se encontró usuario');
      return null;
    } catch (error) {
      console.log(`❌ Error ejecutando getUser: ${error.message}`);
      return null;
    }
  }

  // Método 2: Buscar usuario en base de datos local
  async function findUserInDatabase(supabaseUuid: string) {
    console.log(`\n2️⃣ BUSCANDO USUARIO EN BASE DE DATOS LOCAL...`);
    console.log(`   Supabase UUID: ${supabaseUuid}`);
    
    try {
      const user = await prisma.user.findUnique({
        where: { supabaseUuid },
        include: {
          companies: {
            include: {
              company: true,
            }
          }
        }
      });

      if (user) {
        console.log(`✅ Usuario encontrado en BD local:`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Nombre: ${user.firstName} ${user.lastName}`);
        console.log(`   Compañías: ${user.companies.length}`);
        
        user.companies.forEach((userCompany, index) => {
          console.log(`   ${index + 1}. ${userCompany.company.name} (${userCompany.role}) - Selected: ${userCompany.isSelected}`);
        });
        
        return user;
      } else {
        console.log(`❌ Usuario NO encontrado en BD local`);
        return null;
      }
    } catch (error) {
      console.log(`❌ Error buscando en BD: ${error.message}`);
      return null;
    }
  }

  // Método 3: Verificar compañías seleccionadas
  async function checkSelectedCompanies() {
    console.log(`\n3️⃣ VERIFICANDO COMPAÑÍAS SELECCIONADAS GLOBALMENTE...`);
    
    try {
      const selectedCompanies = await prisma.userCompany.findMany({
        where: { isSelected: true },
        include: {
          user: true,
          company: true,
        }
      });

      console.log(`📊 Compañías seleccionadas: ${selectedCompanies.length}`);
      
      selectedCompanies.forEach((userCompany, index) => {
        console.log(`${index + 1}. Usuario: ${userCompany.user.firstName} ${userCompany.user.lastName}`);
        console.log(`   Email: ${userCompany.user.email}`);
        console.log(`   Supabase UUID: ${userCompany.user.supabaseUuid}`);
        console.log(`   Compañía: ${userCompany.company.name}`);
        console.log('');
      });
    } catch (error) {
      console.log(`❌ Error verificando compañías: ${error.message}`);
    }
  }

  // Ejecutar diagnósticos
  console.log('🚀 EJECUTANDO DIAGNÓSTICOS...\n');

  // Para testing, usa un token falso o uno real que tengas
  console.log('⚠️  NOTA: Para una prueba real, reemplaza el token de ejemplo con uno real');
  console.log('📝 Token de ejemplo (no funcionará):');
  console.log(`   ${exampleToken.substring(0, 50)}...`);
  
  // Uncomment y usa un token real aquí:
  // await testSupabaseToken('tu-token-real-aqui');
  
  // Mientras tanto, verificar estado de la base de datos
  await checkSelectedCompanies();

  console.log('\n💡 PARA USAR ESTE SCRIPT CON UN TOKEN REAL:');
  console.log('1. Obtén un token real haciendo login');
  console.log('2. Descomenta la línea testSupabaseToken');
  console.log('3. Reemplaza "tu-token-real-aqui" con el token');
  console.log('4. Ejecuta el script de nuevo');
}

// Ejecutar diagnóstico
if (require.main === module) {
  debugTokenAuthentication()
    .then(() => {
      console.log('\n✅ Diagnóstico completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en diagnóstico:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export { debugTokenAuthentication };
