# Sistema de Configuraciones de Usuario Integrado con Utilidades

## 📋 Resumen de Implementación

Este documento describe el sistema completo de configuraciones de usuario que integra las preferencias del usuario con las tablas de utilidades de la base de datos para `timeFormat`, `language` y `currency`.

## 🏗️ Arquitectura del Sistema

### Base de Datos

#### Tablas de Utilidades
```sql
-- Formatos de Tiempo
CREATE TABLE "time_formats" (
    "id" TEXT PRIMARY KEY,
    "value" TEXT UNIQUE,          -- "12h", "24h"
    "name" TEXT,                  -- "12 Hours", "24 Hours"
    "description" TEXT,
    "isActive" BOOLEAN DEFAULT true
);

-- Idiomas
CREATE TABLE "languages" (
    "id" TEXT PRIMARY KEY,
    "code" TEXT UNIQUE,           -- "es", "en", "pt", "fr"
    "name" TEXT,                  -- "Spanish", "English"
    "nativeName" TEXT,            -- "Español", "English"
    "country" TEXT,               -- "Colombia", "United States"
    "isActive" BOOLEAN DEFAULT true
);

-- Monedas
CREATE TABLE "currencies" (
    "id" TEXT PRIMARY KEY,
    "code" TEXT UNIQUE,           -- "COP", "USD", "EUR"
    "name" TEXT,                  -- "Colombian Peso", "US Dollar"
    "symbol" TEXT,                -- "$", "€"
    "country" TEXT,               -- "Colombia", "United States"
    "type" TEXT,                  -- "Pesos", "Dollars", "Euros"
    "decimalPlaces" INTEGER DEFAULT 2,
    "isActive" BOOLEAN DEFAULT true
);
```

#### Tabla de Configuraciones de Usuario
```sql
CREATE TABLE "users_configuration" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT UNIQUE,
    "dateFormat" TEXT,
    "timeFormat" TEXT,            -- Referencias time_formats.value
    "language" TEXT,              -- Referencias languages.code
    "currency" TEXT,              -- Referencias currencies.code
    "decimalSeparator" TEXT,
    "itemsPerPage" INTEGER,
    "theme" TEXT,
    "primaryColor" TEXT,
    FOREIGN KEY ("userId") REFERENCES "users"("id")
);
```

## 🔗 Endpoints de la API

### 1. Utilidades Base (Utils)

#### GET /utils/timeFormat
Obtiene todos los formatos de tiempo disponibles.
```json
{
  "message": "Formatos de tiempo obtenidos exitosamente",
  "timeFormats": [
    {
      "id": "tf1",
      "value": "12h",
      "name": "12 Hours",
      "description": "12-hour format with AM/PM"
    },
    {
      "id": "tf2", 
      "value": "24h",
      "name": "24 Hours",
      "description": "24-hour format"
    }
  ],
  "total": 2
}
```

#### GET /utils/language
Obtiene todos los idiomas disponibles.
```json
{
  "message": "Idiomas obtenidos exitosamente",
  "languages": [
    {
      "id": "lang1",
      "code": "es",
      "name": "Spanish", 
      "nativeName": "Español",
      "country": "Colombia"
    },
    {
      "id": "lang2",
      "code": "en",
      "name": "English",
      "nativeName": "English", 
      "country": "United States"
    }
  ],
  "total": 4
}
```

#### GET /utils/currency
Obtiene todas las monedas disponibles.
```json
{
  "message": "Monedas obtenidas exitosamente",
  "currencies": [
    {
      "id": "curr1",
      "code": "COP",
      "name": "Colombian Peso",
      "symbol": "$",
      "country": "Colombia",
      "type": "Pesos",
      "decimalPlaces": 0
    },
    {
      "id": "curr2",
      "code": "USD", 
      "name": "US Dollar",
      "symbol": "$",
      "country": "United States",
      "type": "Dollars",
      "decimalPlaces": 2
    }
  ],
  "total": 5
}
```

### 2. Configuraciones de Usuario

#### GET /configurations/userpreferences
Obtiene las preferencias del usuario con opciones disponibles incluidas.
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
  },
  "availableOptions": {
    "timeFormats": [/* datos de time_formats */],
    "languages": [/* datos de languages */],
    "currencies": [/* datos de currencies */],
    "themes": ["light", "dark", "system"],
    "decimalSeparators": [",", "."]
  }
}
```

#### PUT /configurations/userpreferences
Actualiza las preferencias del usuario con validación contra base de datos.
```json
{
  "timeFormat": "24h",      // Debe existir en time_formats.value
  "language": "es",         // Debe existir en languages.code  
  "currency": "COP",        // Debe existir en currencies.code
  "theme": "dark"
}
```

**Validaciones Automáticas:**
- `timeFormat`: Verificado contra tabla `time_formats`
- `language`: Verificado contra tabla `languages`
- `currency`: Verificado contra tabla `currencies`
- `decimalSeparator`: Solo permite `,` o `.`
- `itemsPerPage`: Rango 1-1000
- `theme`: Solo permite `light`, `dark`, `system`

#### GET /configurations/options
Obtiene todas las opciones de configuración disponibles en un solo endpoint.
```json
{
  "message": "Opciones de configuración obtenidas exitosamente",
  "options": {
    "general": {
      "timeFormats": [/* formatos de tiempo */],
      "languages": [/* idiomas */], 
      "currencies": [/* monedas */],
      "dateFormats": [
        { "value": "DD/MM/YYYY", "name": "DD/MM/YYYY", "example": "25/12/2024" }
      ],
      "decimalSeparators": [
        { "value": ",", "name": "Coma (,)", "example": "1.234,56" }
      ],
      "itemsPerPageOptions": [10, 20, 50, 100, 200]
    },
    "interface": {
      "themes": [
        { "value": "light", "name": "Claro", "icon": "☀️" }
      ],
      "primaryColors": [
        { "value": "#1976d2", "name": "Azul Material", "color": "#1976d2" }
      ]
    }
  },
  "meta": {
    "totalTimeFormats": 2,
    "totalLanguages": 4,
    "totalCurrencies": 5,
    "lastUpdated": "2024-10-26T12:00:00.000Z"
  }
}
```

## 🔧 Implementación Técnica

### Validación de Datos

El sistema implementa validaciones en múltiples capas:

1. **Validación de DTO**: Estructura básica y tipos
2. **Validación de Negocio**: Verificación contra base de datos
3. **Consistencia de Datos**: Integridad referencial

```typescript
// Ejemplo de validación en UpdateUserPreferencesUseCase
private async validateUpdateData(updateData: UpdateUserPreferencesDto): Promise<void> {
  const errors: string[] = [];

  if (updateData.timeFormat) {
    const timeFormat = await this.timeFormatRepository.findByValue(updateData.timeFormat);
    if (!timeFormat) {
      errors.push(`Formato de tiempo inválido: ${updateData.timeFormat}`);
    }
  }

  if (updateData.language) {
    const language = await this.languageRepository.findByCode(updateData.language);
    if (!language) {
      errors.push(`Código de idioma inválido: ${updateData.language}`);
    }
  }

  if (updateData.currency) {
    const currency = await this.currencyRepository.findByCode(updateData.currency);
    if (!currency) {
      errors.push(`Código de moneda inválido: ${updateData.currency}`);
    }
  }

  if (errors.length > 0) {
    throw new BadRequestException({
      message: 'Datos de configuración inválidos',
      errors,
      hint: 'Use los endpoints /utils/* para obtener valores válidos'
    });
  }
}
```

### Gestión de Dependencias

```typescript
// ConfigurationsModule
@Module({
  imports: [SharedModule, AuthModule, UtilsModule], // Importa UtilsModule
  providers: [
    GetUserPreferencesUseCase,
    UpdateUserPreferencesUseCase, 
    GetUserConfigurationOptionsUseCase,
    // ... repositorios
  ]
})
export class ConfigurationsModule {}
```

## 📊 Flujo de Datos

### 1. Obtención de Preferencias
```
Usuario → GET /configurations/userpreferences 
       → UserPreferencesUseCase
       → UserConfigurationRepository + UtilsRepositories
       → Respuesta con preferencias + opciones disponibles
```

### 2. Actualización de Preferencias
```
Usuario → PUT /configurations/userpreferences + datos
       → Validación DTO
       → UpdateUserPreferencesUseCase
       → Validación contra base de datos (utils)
       → UserConfigurationRepository.update()
       → Respuesta con preferencias actualizadas
```

### 3. Obtención de Opciones
```
Frontend → GET /configurations/options
        → GetUserConfigurationOptionsUseCase
        → UtilsRepositories (paralelo)
        → Respuesta consolidada con todas las opciones
```

## 🎯 Casos de Uso

### Frontend Development
```javascript
// 1. Obtener opciones disponibles para formularios
const options = await fetch('/configurations/options');
const { timeFormats, languages, currencies } = options.data.options.general;

// 2. Poblar dropdowns dinámicamente  
timeFormats.forEach(format => {
  addOption(timeFormatSelect, format.value, format.name);
});

// 3. Actualizar preferencias con validación automática
const updateResponse = await fetch('/configurations/userpreferences', {
  method: 'PUT',
  body: JSON.stringify({
    timeFormat: '24h',  // Validado contra base de datos
    language: 'es',     // Validado contra base de datos  
    currency: 'COP'     // Validado contra base de datos
  })
});
```

### Administración de Sistema
```javascript
// Agregar nuevo idioma
await prisma.language.create({
  data: {
    code: 'pt',
    name: 'Portuguese', 
    nativeName: 'Português',
    country: 'Brazil'
  }
});
// Automáticamente disponible en /utils/language y validaciones
```

## ✅ Beneficios del Sistema

1. **Consistencia de Datos**: Validación automática contra base de datos
2. **Escalabilidad**: Fácil agregar nuevas opciones sin cambio de código
3. **Mantenibilidad**: Separación clara entre utilidades y preferencias
4. **Experiencia de Usuario**: Opciones dinámicas y validación en tiempo real
5. **Internacionalización**: Soporte nativo para múltiples idiomas y monedas
6. **Administración Simple**: Gestión centralizada de opciones de configuración

## 🧪 Testing

El sistema incluye test automatizado que verifica:
- Integración entre endpoints de utils y preferencias
- Validación correcta de valores válidos e inválidos
- Consistencia de datos entre diferentes endpoints
- Respuestas de error apropiadas para datos inválidos

```bash
# Ejecutar test de integración
node test-utils-preferences-integration.js
```

## 📈 Próximos Pasos

1. **Cache de Utilidades**: Implementar cache para opciones que cambian poco
2. **Audit Trail**: Registrar cambios de configuraciones de usuario
3. **Configuraciones por Empresa**: Extender para configuraciones específicas por empresa
4. **Configuraciones Avanzadas**: Agregar más opciones de personalización
5. **API de Administración**: Endpoints para gestionar las tablas de utilidades
