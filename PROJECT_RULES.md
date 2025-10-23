# Reglas del Proyecto - NO MODIFICAR SIN AUTORIZACIÓN

## 📋 Archivos Protegidos (NO MODIFICAR)
- `Dockerfile` - Configuración de Docker optimizada para Render
- `Makefile` - Scripts de Docker y despliegue
- `package.json` - Solo modificar con autorización explícita
- `.env` - Variables de entorno sensibles

## 📁 Directorios Protegidos
- `prisma/migrations/` - Solo crear nuevas migraciones, no modificar existentes
- `scripts/` - Scripts de producción, modificar con cuidado

## ✅ Archivos Que Puedo Modificar Libremente
- Archivos en `src/` (código fuente)
- Archivos de documentación (`.md`)
- Archivos de configuración de desarrollo (`tsconfig.json`, `eslint.config.mjs`)
- Archivos de prueba (`test/`, `*.spec.ts`)

## 🔧 Reglas Específicas
1. **Dockerfile**: Está optimizado para Render, no modificar sin consultar
2. **Makefile**: Contiene comandos de despliegue críticos
3. **package.json**: Los scripts están configurados para producción
4. **Prisma Schema**: Solo agregar nuevos modelos, no modificar existentes sin migración

## 🚨 Antes de Modificar Archivos Protegidos
1. Preguntar explícitamente al usuario
2. Explicar por qué es necesario el cambio
3. Mostrar exactamente qué se va a modificar
4. Esperar confirmación explícita

## 📝 Notas
- Si necesito modificar un archivo protegido, debo explicar la razón y pedir permiso
- Siempre consultar este archivo antes de hacer cambios importantes
- En caso de duda, preguntar al usuario
