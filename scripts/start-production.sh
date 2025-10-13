#!/bin/sh

# Script de inicio para producción
# Asegura que Prisma Client esté correctamente generado antes de iniciar la aplicación

echo "🚀 Iniciando aplicación en producción..."

# Verificar variables de entorno críticas
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL no está configurada"
    exit 1
fi

if [ -z "$PORT" ]; then
    echo "⚠️  WARNING: PORT no está configurada, usando 3000 por defecto"
    export PORT=3000
fi

# Configurar NODE_ENV si no está configurado
if [ -z "$NODE_ENV" ]; then
    export NODE_ENV=production
fi

echo "🔍 Verificando cliente de Prisma..."
if [ ! -d "node_modules/.prisma/client" ]; then
    echo "📦 Cliente de Prisma no encontrado, generando para el entorno actual..."
    npx prisma generate --schema=./prisma/schema.prisma
    
    if [ ! -d "node_modules/.prisma/client" ]; then
        echo "❌ ERROR: No se pudo generar el cliente de Prisma"
        echo "Información del sistema:"
        uname -a
        node --version
        npm --version
        ls -la node_modules/@prisma/ || echo "No @prisma directory found"
        exit 1
    fi
else
    echo "✅ Cliente de Prisma encontrado"
    # Verificar que los binarios estén disponibles
    if [ ! -f "node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node" ] && [ ! -f "node_modules/.prisma/client/libquery_engine-linux-musl.so.node" ]; then
        echo "⚠️  Binarios de Prisma no encontrados para esta plataforma, regenerando..."
        npx prisma generate --schema=./prisma/schema.prisma
    fi
fi

echo "✅ Cliente de Prisma verificado y listo"
echo "🌟 Iniciando aplicación NestJS..."

# Iniciar la aplicación
exec node dist/main.js
