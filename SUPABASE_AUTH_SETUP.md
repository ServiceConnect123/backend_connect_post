# 🔑 Configuración de Supabase Auth

## Pasos para obtener las claves de API de Supabase:

### 1. Ve al Dashboard de Supabase
Visita: https://supabase.com/dashboard/project/uxuuaothhltxzifsnnlm/settings/api

### 2. Copia las siguientes claves:
- **Project URL**: `https://uxuuaothhltxzifsnnlm.supabase.co`
- **anon public key**: La clave que comienza con `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **service_role key**: La clave privada (solo para uso del servidor)

### 3. Actualiza el archivo .env:
```bash
# Supabase Configuration
SUPABASE_URL=https://uxuuaothhltxzifsnnlm.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

## 🚀 Nuevos endpoints disponibles con Supabase Auth:

### **1. Registro (POST /auth/register)**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@example.com",
    "password": "password123",
    "name": "Usuario Nuevo"
  }'
```

### **2. Login (POST /auth/login)**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com", 
    "password": "password123"
  }'
```

### **3. Perfil (GET /auth/profile)**
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI"
```

### **4. Logout (POST /auth/logout)**
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI"
```

### **5. Recuperar contraseña (POST /auth/forgot-password)**
```bash
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com"
  }'
```

### **6. Restablecer contraseña (POST /auth/reset-password)**
```bash
curl -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "accessToken": "TOKEN_DEL_EMAIL_DE_RESET",
    "newPassword": "nueva_password123"
  }'
```

## 🔄 **Para usar temporalmente el sistema anterior:**

Si quieres probar la aplicación mientras obtienes las claves, puedes usar:

```bash
# Login con el sistema anterior (Prisma + JWT)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

## 🎯 **Ventajas de Supabase Auth:**

1. **Gestión automática de usuarios** en el dashboard
2. **Verificación de email** automática
3. **Recuperación de contraseña** con email
4. **Tokens JWT** gestionados automáticamente
5. **Roles y permisos** avanzados
6. **Social login** (Google, GitHub, etc.) fácil de configurar
7. **Row Level Security (RLS)** para datos seguros

## 📊 **Ver usuarios en Supabase:**

Dashboard de usuarios: https://supabase.com/dashboard/project/uxuuaothhltxzifsnnlm/auth/users
