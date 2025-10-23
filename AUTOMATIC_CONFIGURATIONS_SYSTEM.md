# Sistema de Configuraciones Automáticas - Documentación Completa

## 📋 Resumen

Se ha implementado un sistema completo de configuraciones por defecto para usuarios que incluye:

1. **Creación automática de configuraciones** para usuarios nuevos durante el registro
2. **Script para usuarios existentes** que no tienen configuración
3. **API completa de preferencias de usuario** con validación y documentación Swagger
4. **Sistema multi-empresa** con selección de empresa activa

## 🗄️ Estructura de Base de Datos

### Tabla `users_configuration`

```sql
CREATE TABLE users_configuration (
  id VARCHAR(30) PRIMARY KEY DEFAULT (cuid()),
  user_id VARCHAR(30) UNIQUE NOT NULL,
  date_format VARCHAR DEFAULT 'DD/MM/YYYY',
  time_format VARCHAR DEFAULT '24h',
  language VARCHAR DEFAULT 'es',
  currency VARCHAR DEFAULT 'COP',
  decimal_separator VARCHAR DEFAULT ',',
  items_per_page INTEGER DEFAULT 20,
  theme VARCHAR DEFAULT 'light',
  primary_color VARCHAR DEFAULT '#1976d2',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Relación con Users

- **Uno a Uno**: Un usuario tiene una configuración
- **Cascada**: Si se elimina el usuario, se elimina su configuración

## 🔧 Funcionalidades Implementadas

### 1. Creación Automática en Registro

**Archivo**: `src/modules/auth/application/use-cases/register.use-case.ts`

- Se modificó el `RegisterUseCase` para crear automáticamente configuraciones por defecto
- Se inyectó el `UserConfigurationRepository` en el módulo de autenticación
- La creación se hace de forma no-bloqueante (no interrumpe el registro si falla)

```typescript
// Ejemplo de creación automática
try {
  await this.userConfigurationRepository.createDefaultConfiguration(user.id);
  console.log(`⚙️ Configuración por defecto creada para usuario ${user.id}`);
} catch (error) {
  console.error(`❌ Error creando configuración por defecto para usuario ${user.id}:`, error);
  // No lanzamos error para no interrumpir el registro
}
```

### 2. Script para Usuarios Existentes

**Archivo**: `scripts/create-default-configurations.ts`

**Uso**:
```bash
npm run script:default-configs
```

**Funcionalidades**:
- Identifica usuarios sin configuración
- Crea configuraciones por defecto en lote
- Manejo de errores robusto
- Reporte detallado de resultados
- Verificación final del estado

### 3. API de Preferencias de Usuario

#### Endpoints Disponibles

**GET** `/configurations/userpreferences`
- Obtiene las preferencias del usuario autenticado
- Crea configuración por defecto si no existe
- Respuesta con valores por defecto garantizada

**PUT** `/configurations/userpreferences` 
- Actualiza las preferencias del usuario
- Validación completa de todos los campos
- Documentación Swagger integrada

#### Ejemplo de Respuesta

```json
{
  "id": "cm2qr7s8t0000abcd1234567",
  "userId": "cm2qr7s8t0001abcd1234567",
  "dateFormat": "DD/MM/YYYY",
  "timeFormat": "24h",
  "language": "es",
  "currency": "COP",
  "decimalSeparator": ",",
  "itemsPerPage": 20,
  "theme": "light",
  "primaryColor": "#1976d2",
  "createdAt": "2024-10-23T15:30:00.000Z",
  "updatedAt": "2024-10-23T15:30:00.000Z"
}
```

### 4. Valores por Defecto

```typescript
const defaultConfiguration = {
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  language: 'es',
  currency: 'COP',
  decimalSeparator: ',',
  itemsPerPage: 20,
  theme: 'light',
  primaryColor: '#1976d2'
}
```

## 🏗️ Arquitectura Implementada

### Módulos

#### ConfigurationsModule
- **Controlador**: `ConfigurationsController`
- **Casos de Uso**: 
  - `GetUserPreferencesUseCase`
  - `UpdateUserPreferencesUseCase`
- **Repositorio**: `UserConfigurationRepositoryImpl`
- **Entidad**: `UserConfiguration`

#### AuthModule (Modificado)
- **Inyección** de `UserConfigurationRepository`
- **Creación automática** en `RegisterUseCase`

### Patrón Repository

```typescript
interface UserConfigurationRepository {
  findByUserId(userId: string): Promise<UserConfiguration | null>;
  findBySupabaseUuid(supabaseUuid: string): Promise<UserConfiguration | null>;
  create(configuration: UserConfiguration): Promise<UserConfiguration>;
  update(configuration: UserConfiguration): Promise<UserConfiguration>;
  delete(id: string): Promise<void>;
  createDefaultConfiguration(userId: string): Promise<UserConfiguration>;
}
```

## 🔍 Validaciones

### DTO de Actualización

```typescript
export class UpdateUserPreferencesDto {
  @IsOptional()
  @IsIn(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'])
  dateFormat?: string;

  @IsOptional()
  @IsIn(['12h', '24h'])
  timeFormat?: string;

  @IsOptional()
  @IsIn(['es', 'en', 'fr'])
  language?: string;

  @IsOptional()
  @IsIn(['USD', 'EUR', 'COP'])
  currency?: string;

  @IsOptional()
  @IsIn([',', '.'])
  decimalSeparator?: string;

  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(100)
  itemsPerPage?: number;

  @IsOptional()
  @IsIn(['light', 'dark'])
  theme?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  primaryColor?: string;
}
```

## 📝 Scripts Disponibles

### 1. Crear Configuraciones por Defecto
```bash
npm run script:default-configs
```

### 2. Probar Sistema de Configuraciones
```bash
npm run script:test-auto-configs
```

## 🧪 Pruebas y Validación

### Script de Pruebas Automáticas

**Archivo**: `scripts/test-auto-config-creation.ts`

**Verifica**:
- Usuarios sin configuración
- Valores por defecto correctos
- Integridad de datos
- Relaciones de base de datos

### Flujo de Registro Completo

1. **Usuario se registra** → `RegisterUseCase`
2. **Se crea el usuario** → Base de datos
3. **Se crea configuración automáticamente** → `createDefaultConfiguration`
4. **Usuario puede usar la aplicación** → Con configuración por defecto
5. **Usuario puede actualizar preferencias** → API de configuraciones

## 🚀 Próximos Pasos Sugeridos

### Funcionalidades Adicionales

1. **Cache de configuraciones** para mejor rendimiento
2. **Configuraciones por empresa** (configuraciones específicas por compañía)
3. **Importar/exportar configuraciones** para migración de usuarios
4. **Histórico de cambios** en configuraciones
5. **Configuraciones avanzadas** (notificaciones, permisos, etc.)

### Mejoras de Rendimiento

1. **Lazy loading** de configuraciones
2. **Cache en Redis** para configuraciones frecuentemente accedidas
3. **Bulk operations** para creación masiva de configuraciones

## 📚 Documentación de APIs

### Swagger Integration

La API está completamente documentada en Swagger:
- Schemas de request/response
- Ejemplos de uso
- Códigos de estado HTTP
- Descripción de parámetros

**URL**: `http://localhost:3000/api/docs`

### Postman Collection

Se puede generar una colección de Postman desde la documentación Swagger para pruebas manuales.

## 🔧 Configuración y Despliegue

### Variables de Entorno Necesarias

```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."
```

### Migraciones

```bash
# Aplicar migraciones
npx prisma migrate deploy

# Generar cliente Prisma
npx prisma generate

# Crear configuraciones para usuarios existentes
npm run script:default-configs
```

## ✅ Estado del Proyecto

### ✅ Completado

- [x] Tabla de configuraciones de usuario
- [x] Migración de base de datos
- [x] Entidad de dominio UserConfiguration
- [x] Repositorio con patrón Repository
- [x] Casos de uso para obtener y actualizar
- [x] API REST completa
- [x] Validaciones con class-validator
- [x] Documentación Swagger
- [x] Creación automática en registro
- [x] Script para usuarios existentes
- [x] Sistema de pruebas automatizadas
- [x] Manejo de errores robusto
- [x] Integración con sistema multi-empresa

### 🎯 Resultado Final

**Sistema completamente funcional** que garantiza que todos los usuarios (nuevos y existentes) tengan configuraciones por defecto, con una API robusta para gestionar las preferencias y un sistema de scripts para mantenimiento.

El sistema es **extensible**, **mantenible** y sigue las **mejores prácticas** de arquitectura limpia, con manejo de errores adecuado y documentación completa.
