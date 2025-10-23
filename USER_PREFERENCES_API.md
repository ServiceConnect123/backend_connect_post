# API de Preferencias de Usuario (UserPreferences)

## 📋 **Funcionalidad Implementada**

Se ha implementado un sistema completo de **preferencias de usuario** que permite:

1. **Configurar preferencias generales** del usuario
2. **Personalizar la interfaz** de la aplicación
3. **Persistir configuraciones** en la base de datos
4. **Crear configuración por defecto** automáticamente
5. **Actualizar preferencias** de forma granular

## 🗄️ **Estructura de Base de Datos**

### **Tabla: `users_configuration`**

```sql
CREATE TABLE "users_configuration" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date_format" TEXT NOT NULL DEFAULT 'DD/MM/YYYY',
    "time_format" TEXT NOT NULL DEFAULT '24h',
    "language" TEXT NOT NULL DEFAULT 'es',
    "currency" TEXT NOT NULL DEFAULT 'COP',
    "decimal_separator" TEXT NOT NULL DEFAULT ',',
    "items_per_page" INTEGER NOT NULL DEFAULT 20,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "primary_color" TEXT NOT NULL DEFAULT '#1976d2',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_configuration_pkey" PRIMARY KEY ("id")
);
```

**Relaciones:**
- ✅ **One-to-One** con `users` table
- ✅ **Cascade Delete** - se elimina al eliminar usuario
- ✅ **Unique constraint** en `user_id`

## 🚀 **Endpoints Implementados**

### **1. GET /configurations/userpreferences**

**Descripción:** Obtiene las preferencias del usuario autenticado

**Autenticación:** ✅ JWT Bearer token requerido

**Respuesta:**
```json
{
  "message": "Preferencias obtenidas exitosamente",
  "preferences": {
    "id": "config-id",
    "userId": "user-id",
    "generalPreferences": {
      "dateFormat": "DD/MM/YYYY",
      "timeFormat": "24h",
      "language": "es",
      "currency": "COP",
      "decimalSeparator": ",",
      "itemsPerPage": 20
    },
    "interfaceCustomization": {
      "theme": "light",
      "primaryColor": "#1976d2"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Uso:**
```bash
curl -X GET http://localhost:3000/configurations/userpreferences \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **2. PUT /configurations/userpreferences**

**Descripción:** Actualiza las preferencias del usuario autenticado

**Autenticación:** ✅ JWT Bearer token requerido

**Body (todos los campos son opcionales):**
```json
{
  "dateFormat": "MM/DD/YYYY",
  "timeFormat": "12h",
  "language": "en",
  "currency": "USD",
  "decimalSeparator": ".",
  "itemsPerPage": 50,
  "theme": "dark",
  "primaryColor": "#2196f3"
}
```

**Respuesta:**
```json
{
  "message": "Preferencias actualizadas exitosamente",
  "preferences": {
    "id": "config-id",
    "userId": "user-id",
    "generalPreferences": {
      "dateFormat": "MM/DD/YYYY",
      "timeFormat": "12h",
      "language": "en",
      "currency": "USD",
      "decimalSeparator": ".",
      "itemsPerPage": 50
    },
    "interfaceCustomization": {
      "theme": "dark",
      "primaryColor": "#2196f3"
    },
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Uso:**
```bash
curl -X PUT http://localhost:3000/configurations/userpreferences \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"theme": "dark", "primaryColor": "#2196f3", "language": "en"}'
```

## ⚙️ **Opciones de Configuración**

### **🔧 Preferencias Generales**

| Campo | Opciones Válidas | Descripción | Defecto |
|-------|------------------|-------------|---------|
| `dateFormat` | `DD/MM/YYYY`, `MM/DD/YYYY`, `YYYY-MM-DD` | Formato de fecha | `DD/MM/YYYY` |
| `timeFormat` | `12h`, `24h` | Formato de hora | `24h` |
| `language` | `es`, `en` | Idioma de interfaz | `es` |
| `currency` | `COP`, `USD`, `GTQ`, `EUR` | Moneda predeterminada | `COP` |
| `decimalSeparator` | `,`, `.` | Separador decimal | `,` |
| `itemsPerPage` | `10`, `20`, `50`, `100` | Elementos por página | `20` |

### **🎨 Personalización de Interfaz**

| Campo | Opciones Válidas | Descripción | Defecto |
|-------|------------------|-------------|---------|
| `theme` | `light`, `dark`, `system` | Tema de color | `light` |
| `primaryColor` | Hex color (ej: `#1976d2`) | Color principal | `#1976d2` |

## ✅ **Validaciones Implementadas**

### **Validación de Entrada:**
- ✅ **Enum validation** para todos los campos con opciones limitadas
- ✅ **Hex color validation** para `primaryColor`
- ✅ **Integer validation** para `itemsPerPage`
- ✅ **Optional fields** - todos los campos son opcionales en PUT

### **Validación de Negocio:**
- ✅ **Usuario existente** - verifica que el usuario existe
- ✅ **Configuración por defecto** - crea automáticamente si no existe
- ✅ **Actualización parcial** - solo actualiza campos enviados

### **Manejo de Errores:**
- ✅ `401 Unauthorized` - Token inválido o faltante
- ✅ `400 Bad Request` - Datos de entrada inválidos
- ✅ `404 Not Found` - Usuario no encontrado
- ✅ `500 Internal Server Error` - Errores internos

## 🏗️ **Arquitectura Implementada**

### **Domain Layer:**
- ✅ `UserConfiguration` entity con métodos de validación
- ✅ Repository interface con operaciones CRUD
- ✅ Domain validations y business rules

### **Application Layer:**
- ✅ `GetUserPreferencesUseCase` - Obtener preferencias
- ✅ `UpdateUserPreferencesUseCase` - Actualizar preferencias
- ✅ `UpdateUserPreferencesDto` - Validación de entrada

### **Infrastructure Layer:**
- ✅ `UserConfigurationRepositoryImpl` - Implementación con Prisma
- ✅ `ConfigurationsController` - Endpoints REST
- ✅ Database migrations y schema updates

### **Module Configuration:**
- ✅ `ConfigurationsModule` - Configuración de dependencias
- ✅ Registered in `AppModule`
- ✅ Dependency injection configurada

## 🔄 **Flujo de Trabajo**

### **Primera vez (Usuario sin configuración):**
1. Usuario hace `GET /configurations/userpreferences`
2. Sistema detecta que no existe configuración
3. Sistema crea configuración por defecto automáticamente
4. Retorna la configuración por defecto

### **Actualización de preferencias:**
1. Usuario hace `PUT /configurations/userpreferences` con datos parciales
2. Sistema valida los datos de entrada
3. Sistema obtiene configuración existente
4. Sistema actualiza solo los campos enviados
5. Sistema persiste los cambios
6. Retorna la configuración actualizada

### **Integración Frontend:**
1. Al login, obtener preferencias con `GET /configurations/userpreferences`
2. Aplicar configuraciones a la interfaz (tema, idioma, etc.)
3. Permitir cambios en configuración con formularios
4. Usar `PUT /configurations/userpreferences` para guardar cambios
5. Actualizar interfaz inmediatamente después de guardar

## 📊 **Casos de Uso**

### **🌍 Internacionalización:**
```javascript
// Aplicar configuraciones de idioma y formato
const preferences = await getUserPreferences();
setLocale(preferences.language);
setDateFormat(preferences.dateFormat);
setCurrency(preferences.currency);
```

### **🎨 Temas y Colores:**
```javascript
// Aplicar tema y colores personalizados
const preferences = await getUserPreferences();
setTheme(preferences.theme);
setPrimaryColor(preferences.primaryColor);
```

### **📄 Paginación:**
```javascript
// Usar preferencias para paginación
const preferences = await getUserPreferences();
const itemsPerPage = preferences.itemsPerPage; // 10, 20, 50, 100
```

## 🎉 **Estado de Implementación**

### **✅ Completado:**
- ✅ Base de datos y migraciones
- ✅ Domain entities y business logic
- ✅ Repository pattern implementation
- ✅ Use cases con validación completa
- ✅ REST API endpoints
- ✅ Swagger documentation
- ✅ Error handling y validaciones
- ✅ Module registration
- ✅ Compilation successful

### **🚀 Listo para Uso:**
La API de preferencias de usuario está **completamente implementada** y lista para ser utilizada por el frontend. Todos los endpoints están disponibles y documentados en Swagger en `http://localhost:3000/api`.

**¡El sistema de preferencias de usuario está operativo! 🎊**
