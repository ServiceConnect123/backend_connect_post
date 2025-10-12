# 🔑 Guía para Configurar Supabase Real

## 📋 Pasos para Obtener las Claves de Supabase

### 1. **Crear Proyecto en Supabase**
- Ve a [supabase.com](https://supabase.com)
- Crea una cuenta o inicia sesión
- Crea un nuevo proyecto
- Espera a que se complete la configuración (2-3 minutos)

### 2. **Obtener las Claves de API**
- Ve a tu proyecto en Supabase
- Navega a **Settings** > **API**
- Copia las siguientes claves:
  - **Project URL** (algo como: `https://abc123xyz.supabase.co`)
  - **anon public** key (clave larga que empieza con `eyJ...`)
  - **service_role** key (clave larga que empieza con `eyJ...`)

### 3. **Actualizar el archivo .env**
```env
# Reemplaza con tus claves reales
SUPABASE_URL=https://TU-PROYECTO-ID.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...TU-CLAVE-ANON
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...TU-CLAVE-SERVICE
```

### 4. **Configurar Autenticación en Supabase**
- En tu proyecto Supabase, ve a **Authentication** > **Settings**
- Habilita **Email confirmations** si quieres verificación por email
- Configura **Site URL** como `http://localhost:3000`

### 5. **Reiniciar el Servidor**
```bash
# Reinicia el servidor para aplicar los cambios
npm run start:dev
```

## 🎯 **¿Cómo Saber si Está Funcionando?**

Cuando tengas las claves correctas, verás en la consola:
```
🔐 Auth Service: Using REAL Supabase mode
```

En lugar de:
```
🔄 Auth Service: Using MOCK mode (invalid Supabase keys detected)
```

## 📊 **Diferencias Entre Modo Mock y Real**

| Característica | Modo Mock | Modo Real Supabase |
|----------------|-----------|-------------------|
| **Almacenamiento** | Memoria (se pierde al reiniciar) | Base de datos persistente |
| **Verificación Email** | Automática (simulada) | Real (envía emails) |
| **Tokens JWT** | Mock tokens | Tokens JWT reales de Supabase |
| **Persistencia** | No | Sí |
| **Seguridad** | Básica | Completa (Supabase Auth) |
| **Reset Password** | Simulado | Email real enviado |

## 🚨 **Importante**
- Con **modo mock**: Los usuarios solo existen mientras el servidor esté ejecutándose
- Con **modo real**: Los usuarios se guardan permanentemente en Supabase
- El cambio es **automático** - solo actualiza las claves y reinicia
