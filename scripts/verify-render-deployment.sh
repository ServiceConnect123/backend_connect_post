#!/bin/bash

# Script de verificación antes del despliegue en Render
echo "🔍 VERIFICACIÓN PRE-DESPLIEGUE PARA RENDER"
echo "========================================"

# Verificar que existe el Dockerfile
if [ -f "Dockerfile" ]; then
    echo "✅ Dockerfile encontrado"
    
    # Verificar que el CMD apunta a la ruta correcta
    if grep -q "dist/src/main.js" Dockerfile; then
        echo "✅ Dockerfile tiene la ruta correcta del main.js"
    else
        echo "❌ Dockerfile NO tiene la ruta correcta del main.js"
        echo "   Debe ser: CMD [\"node\", \"dist/src/main.js\"]"
        exit 1
    fi
else
    echo "❌ Dockerfile no encontrado"
    exit 1
fi

# Verificar package.json scripts
if [ -f "package.json" ]; then
    echo "✅ package.json encontrado"
    
    # Verificar script start
    if grep -q "\"start\": \"node dist/src/main.js\"" package.json; then
        echo "✅ Script start tiene la ruta correcta"
    else
        echo "❌ Script start NO tiene la ruta correcta"
        echo "   Debe ser: \"start\": \"node dist/src/main.js\""
        exit 1
    fi
else
    echo "❌ package.json no encontrado"
    exit 1
fi

# Verificar que existe prisma/schema.prisma
if [ -f "prisma/schema.prisma" ]; then
    echo "✅ Schema de Prisma encontrado"
else
    echo "❌ Schema de Prisma no encontrado"
    exit 1
fi

# Verificar que las migraciones existen
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations)" ]; then
    echo "✅ Migraciones de Prisma encontradas"
else
    echo "❌ No se encontraron migraciones de Prisma"
    exit 1
fi

# Verificar estructura de NestJS
if [ -f "src/main.ts" ]; then
    echo "✅ Archivo main.ts de NestJS encontrado"
else
    echo "❌ Archivo main.ts de NestJS no encontrado"
    exit 1
fi

# Verificar que nest-cli.json existe
if [ -f "nest-cli.json" ]; then
    echo "✅ Configuración de NestJS encontrada"
else
    echo "❌ nest-cli.json no encontrado"
    exit 1
fi

echo ""
echo "🎉 VERIFICACIÓN COMPLETADA EXITOSAMENTE"
echo "✅ El proyecto está listo para desplegar en Render"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Construir y subir la imagen: make deploy-render"
echo "2. Verificar variables de entorno en Render:"
echo "   - DATABASE_URL"
echo "   - DIRECT_URL" 
echo "   - SUPABASE_URL"
echo "   - SUPABASE_ANON_KEY"
echo "3. Asegurar que el puerto esté configurado como PORT en Render"
echo ""
