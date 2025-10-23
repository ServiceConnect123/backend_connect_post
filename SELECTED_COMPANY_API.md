# API de Compañía Seleccionada

## 📋 **Funcionalidad Implementada**

Se ha implementado un sistema para gestionar la **compañía seleccionada** por usuario, que permite:

1. **Persistir la selección** de compañía en la base de datos
2. **Cambiar la compañía seleccionada** mediante API
3. **Obtener la compañía seleccionada** en el perfil del usuario
4. **Selección automática** de la primera compañía si no hay una seleccionada

## 🔧 **Cambios Realizados**

### **Base de Datos**
- ✅ Agregado campo `isSelected` a la tabla `user_companies`
- ✅ Índice optimizado: `user_id + is_selected`
- ✅ Migración: `20251022010000_add_selected_company`

### **Entidades**
- ✅ Actualizada `UserCompany` entity con campo `isSelected`

### **Repository**
- ✅ Nuevos métodos:
  - `findSelectedCompany(supabaseUuid: string)`
  - `setSelectedCompany(supabaseUuid: string, companyId: string)`

### **Use Cases**
- ✅ `SetSelectedCompanyUseCase` - Cambiar compañía seleccionada
- ✅ `GetProfileUseCase` - Actualizado para usar compañía seleccionada

### **API Endpoints**
- ✅ `PUT /auth/selected-company` - Cambiar compañía seleccionada
- ✅ `GET /auth/profile` - Incluye compañía seleccionada

## 🚀 **Uso del API**

### **1. Cambiar Compañía Seleccionada**

```bash
curl -X PUT http://localhost:3001/auth/selected-company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "companyId": "4525935d-0cb3-423f-8c1a-a74bb7a095bb"
  }'
```

**Respuesta:**
```json
{
  "message": "Compañía seleccionada actualizada exitosamente",
  "selectedCompany": {
    "user": {
      "id": "cmh16xuoy00002mle6ktu29lb",
      "email": "user@example.com",
      "firstName": "Usuario",
      "lastName": "Ejemplo",
      "fullName": "Usuario Ejemplo"
    },
    "company": {
      "id": "4525935d-0cb3-423f-8c1a-a74bb7a095bb",
      "name": "NetSolutionLabs",
      "nit": "900123456-7",
      "email": "contact@netsolutionlabs.com",
      "phone": "+57 3001234567",
      "address": "Cra 10 # 45-23",
      "countryId": "clxxx-country-co-xxxx",
      "cityId": "clxxx-city-baq-xxxx"
    },
    "role": "ADMIN"
  }
}
```

### **2. Obtener Perfil con Compañía Seleccionada**

```bash
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Respuesta:**
```json
{
  "user": {
    "id": "cmh16xuoy00002mle6ktu29lb",
    "supabaseUuid": "uuid-here",
    "email": "user@example.com",
    "firstName": "Usuario",
    "lastName": "Ejemplo",
    "fullName": "Usuario Ejemplo",
    "role": "ADMIN"
  },
  "company": {
    "id": "4525935d-0cb3-423f-8c1a-a74bb7a095bb",
    "name": "NetSolutionLabs",
    "nit": "900123456-7",
    "email": "contact@netsolutionlabs.com",
    "phone": "+57 3001234567",
    "address": "Cra 10 # 45-23",
    "countryId": "clxxx-country-co-xxxx",
    "cityId": "clxxx-city-baq-xxxx"
  },
  "companies": [
    {
      "id": "4525935d-0cb3-423f-8c1a-a74bb7a095bb",
      "name": "NetSolutionLabs",
      "nit": "900123456-7",
      "role": "ADMIN",
      "userCompanyId": "uc-id-here"
    }
  ],
  "isMultiCompany": false,
  "totalCompanies": 1
}
```

## 🔄 **Flujo de Trabajo**

### **En el Frontend:**

1. **Al hacer login:** El usuario recibe su JWT token
2. **Obtener perfil:** `GET /auth/profile` para obtener datos y compañía seleccionada
3. **Cambiar compañía:** `PUT /auth/selected-company` cuando el usuario selecciona otra compañía
4. **Actualizar contexto:** Refrescar datos del perfil para trabajar con la nueva compañía

### **Lógica del Sistema:**

1. **Primera vez:** Si el usuario no tiene compañía seleccionada, se selecciona automáticamente la primera
2. **Persistencia:** La selección se guarda en la base de datos
3. **Seguridad:** Solo se puede seleccionar compañías a las que el usuario tiene acceso
4. **Consistencia:** Solo UNA compañía puede estar seleccionada a la vez por usuario

## 📊 **Aplicar los Cambios**

### **1. Aplicar Migración**
```bash
./scripts/apply-selected-company-migration.sh
```

### **2. Verificar en Base de Datos**
```sql
-- Ver compañías seleccionadas por usuario
SELECT u.email, c.name, uc.role, uc.is_selected 
FROM users u
JOIN user_companies uc ON u.id = uc.user_id
JOIN companies c ON uc.company_id = c.id
WHERE uc.is_selected = true;
```

## ✅ **Validaciones**

- ✅ Solo usuarios autenticados pueden cambiar compañía
- ✅ Solo se puede seleccionar compañías del usuario
- ✅ Validación de UUID del companyId
- ✅ Manejo de errores 404/403 apropiados
- ✅ Selección automática si no hay ninguna seleccionada

## 🔧 **Integración Frontend**

```typescript
// Servicio de autenticación
class AuthService {
  // Cambiar compañía seleccionada
  async setSelectedCompany(companyId: string) {
    const response = await fetch('/auth/selected-company', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      },
      body: JSON.stringify({ companyId })
    });
    
    if (response.ok) {
      // Actualizar contexto de usuario
      await this.refreshProfile();
    }
    
    return response.json();
  }
  
  // Obtener perfil actual
  async getProfile() {
    const response = await fetch('/auth/profile', {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    });
    
    return response.json();
  }
}
```

El sistema está listo para usar! 🚀
