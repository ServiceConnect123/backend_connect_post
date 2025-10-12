# Arquitectura Hexagonal con Vertical Slice

## Estructura del Proyecto

```
src/
├── shared/                           # Código compartido entre módulos
│   ├── domain/
│   │   ├── entities/                # Entidades base compartidas
│   │   ├── value-objects/           # Value Objects compartidos
│   │   └── repositories/            # Interfaces de repositorios base
│   ├── infrastructure/
│   │   ├── database/                # Configuración de base de datos
│   │   ├── config/                  # Configuraciones globales
│   │   └── exceptions/              # Excepciones personalizadas
│   └── application/
│       ├── dtos/                    # DTOs compartidos
│       └── interfaces/              # Interfaces compartidas
└── modules/                         # Módulos de dominio (Vertical Slices)
    └── auth/                        # Módulo de autenticación
        ├── domain/                  # Lógica de negocio pura
        │   ├── entities/            # Entidades del dominio
        │   ├── repositories/        # Interfaces de repositorios
        │   └── services/            # Servicios de dominio
        ├── application/             # Casos de uso y orquestación
        │   ├── use-cases/           # Casos de uso específicos
        │   ├── dtos/                # Data Transfer Objects
        │   └── interfaces/          # Interfaces de aplicación
        └── infrastructure/          # Adaptadores externos
            ├── controllers/         # Controladores HTTP
            ├── repositories/        # Implementaciones de repositorios
            └── services/            # Servicios de infraestructura
```

## Principios de la Arquitectura

### Arquitectura Hexagonal (Puertos y Adaptadores)
- **Dominio**: Centro de la aplicación, contiene la lógica de negocio pura
- **Aplicación**: Orquesta los casos de uso utilizando el dominio
- **Infraestructura**: Adaptadores que conectan con el mundo exterior

### Vertical Slice Architecture
- Cada módulo es una "rebanada vertical" completa de funcionalidad
- Cada slice contiene todas las capas necesarias para una característica específica
- Reduce el acoplamiento entre diferentes características del sistema

## Módulo de Autenticación

### Funcionalidades Implementadas
- **Login**: Endpoint `/auth/login` para autenticación de usuarios

### Endpoints Disponibles
- `POST /auth/login`
  - Body: `{ "email": "string", "password": "string" }`
  - Response: `{ "token": "string", "user": {...} }`

### Usuario de Prueba
- Email: `admin@example.com`
- Password: `password123`

## Cómo Expandir la Arquitectura

Para agregar nuevos módulos (ej: posts, users, etc.):

1. Crear la estructura de carpetas del módulo:
```bash
mkdir -p src/modules/{module-name}/{domain,application,infrastructure}/{entities,repositories,services,use-cases,dtos,controllers}
```

2. Implementar las capas siguiendo el patrón:
   - **Domain**: Entidades, repositorios (interfaces), servicios de dominio
   - **Application**: Casos de uso, DTOs, interfaces
   - **Infrastructure**: Controladores, implementaciones de repositorios

3. Crear el módulo NestJS correspondiente
4. Importar el módulo en `AppModule`

## Beneficios de esta Arquitectura

1. **Mantenibilidad**: Cada slice es independiente y fácil de mantener
2. **Testabilidad**: Las dependencias están invertidas, facilitando el testing
3. **Escalabilidad**: Fácil agregar nuevas características sin afectar las existentes
4. **Independencia de Framework**: La lógica de negocio no depende de NestJS
5. **Separación de Responsabilidades**: Cada capa tiene una responsabilidad específica
