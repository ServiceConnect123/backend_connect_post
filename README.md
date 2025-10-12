# BackConnectPost API

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

<p align="center">
  Una API de blog robusta construida con arquitectura hexagonal, NestJS y TypeScript.
</p>

<p align="center">
  <strong>🚀 Servidor de Producción:</strong> <a href="https://backconnectpost-latest.onrender.com" target="_blank">https://backconnectpost-latest.onrender.com</a><br>
  <strong>📚 Documentación API:</strong> <a href="https://backconnectpost-latest.onrender.com/api/docs" target="_blank">Swagger UI</a>
</p>

## Descripción

BackConnectPost es una API RESTful moderna para un sistema de blog, implementada siguiendo los principios de arquitectura hexagonal (Ports & Adapters). Está construida con NestJS, TypeScript, Prisma ORM y utiliza Supabase para autenticación y base de datos.</p>

## Características

- 🏗️ **Arquitectura Hexagonal**: Separación clara de capas y responsabilidades
- 🔐 **Autenticación JWT**: Sistema completo de autenticación con Supabase
- 📝 **Gestión de Posts**: CRUD completo para posts del blog
- 📊 **Swagger UI**: Documentación interactiva de la API
- 🐳 **Docker**: Containerización completa con Docker
- 🚀 **Producción**: Desplegado en Render.com
- ✅ **Testing**: Pruebas unitarias y e2e configuradas
- 🔍 **Validación**: Validación de datos con class-validator

## Arquitectura

El proyecto sigue el patrón de **Arquitectura Hexagonal** (Ports & Adapters):

```
src/
├── modules/
│   ├── auth/                 # Módulo de autenticación
│   │   ├── application/      # Casos de uso y DTOs
│   │   ├── domain/          # Entidades y repositorios
│   │   └── infrastructure/  # Controladores e implementaciones
│   └── posts/               # Módulo de posts
│       ├── application/
│       ├── domain/
│       └── infrastructure/
└── shared/                  # Módulos compartidos
    ├── application/
    ├── domain/
    └── infrastructure/
```

## Configuración del Proyecto

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Docker (opcional)
- Cuenta de Supabase

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd backconnectpost

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase
```

### Variables de Entorno

```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/backconnectpost"

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"

# Aplicación
NODE_ENV="development"
PORT="3001"
```

## Ejecutar la Aplicación

### Desarrollo Local

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run start:prod

# Solo compilar
npm run build
```

### Con Docker

```bash
# Construir imagen Docker
docker build -t backconnectpost .

# Ejecutar contenedor
docker run -p 3001:3001 --env-file .env backconnectpost

# O usar docker-compose (si está disponible)
docker-compose up -d
```

## 🐳 Documentación de Docker

### Construcción de la Imagen

```bash
# Construir imagen para desarrollo
docker build -t backconnectpost:dev .

# Construir imagen para producción
docker build -t backconnectpost:latest .

# Construir imagen con tag específico
docker build -t williams2022/backconnectpost:latest .
```

### Ejecutar Contenedor

```bash
# Ejecutar en modo desarrollo
docker run -p 3001:3001 \
  --env-file .env \
  --name backconnectpost-dev \
  backconnectpost:dev

# Ejecutar en modo producción
docker run -p 3001:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  -e DATABASE_URL="your-database-url" \
  -e SUPABASE_URL="your-supabase-url" \
  -e SUPABASE_ANON_KEY="your-anon-key" \
  -e JWT_SECRET="your-jwt-secret" \
  --name backconnectpost-prod \
  williams2022/backconnectpost:latest
```

### Docker Hub

```bash
# Subir imagen a Docker Hub
docker push williams2022/backconnectpost:latest

# Descargar imagen desde Docker Hub
docker pull williams2022/backconnectpost:latest
```

### Comandos Útiles

```bash
# Ver contenedores ejecutándose
docker ps

# Ver logs del contenedor
docker logs backconnectpost-prod

# Acceder al contenedor
docker exec -it backconnectpost-prod /bin/bash

# Detener contenedor
docker stop backconnectpost-prod

# Eliminar contenedor
docker rm backconnectpost-prod

# Eliminar imagen
docker rmi williams2022/backconnectpost:latest
```

## 🚀 Despliegue en Producción

### Render.com

La aplicación está desplegada en Render.com usando Docker:

- **URL de Producción**: https://backconnectpost-latest.onrender.com
- **Documentación API**: https://backconnectpost-latest.onrender.com/api/docs
- **Imagen Docker**: `williams2022/backconnectpost:latest`

### Proceso de Despliegue

1. **Construir imagen Docker localmente**:
   ```bash
   docker build -t williams2022/backconnectpost:latest .
   ```

2. **Subir imagen a Docker Hub**:
   ```bash
   docker push williams2022/backconnectpost:latest
   ```

3. **Desplegar en Render**:
   - La aplicación se redespliega automáticamente al detectar una nueva imagen
   - O hacer deploy manual desde el dashboard de Render

### Variables de Entorno en Producción

**IMPORTANTE**: Configurar correctamente en Render.com:

```bash
# Supabase Configuration
SUPABASE_URL=https://uxuuaothhltxzifsnnlm.supabase.co
SUPABASE_ANON_KEY=[tu-supabase-anon-key-real]
SUPABASE_SERVICE_ROLE_KEY=[tu-supabase-service-role-key-real]

# Database Configuration
DATABASE_URL=postgresql://postgres.uxuuaothhltxzifsnnlm:nJmwmXANCquPaNS8@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Application Configuration
NODE_ENV=production
PORT=3001
JWT_SECRET=[tu-jwt-secret-seguro]
JWT_EXPIRES_IN=24h
```

⚠️ **Error Común**: Si ves `getaddrinfo ENOTFOUND your-project.supabase.co`, significa que las variables de entorno tienen valores placeholder. Actualízalas en Render con los valores reales de tu proyecto Supabase.

## 🧪 Pruebas

```bash
# Pruebas unitarias
npm run test

# Pruebas e2e
npm run test:e2e

# Cobertura de pruebas
npm run test:cov

# Ejecutar pruebas en modo watch
npm run test:watch
```

## 📚 API Endpoints

### Autenticación

- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `POST /auth/forgot-password` - Solicitar recuperación de contraseña
- `POST /auth/reset-password` - Resetear contraseña

### Posts

- `GET /posts` - Obtener lista de posts (con paginación)
- `GET /posts/:id` - Obtener post por ID
- `POST /posts` - Crear nuevo post (requiere autenticación)
- `PUT /posts/:id` - Actualizar post (requiere autenticación)
- `DELETE /posts/:id` - Eliminar post (requiere autenticación)

### Ejemplo de Uso

```bash
# Registrar usuario
curl -X POST https://backconnectpost-latest.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123",
    "name": "Usuario Test"
  }'

# Iniciar sesión
curl -X POST https://backconnectpost-latest.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'

# Obtener posts
curl -X GET https://backconnectpost-latest.onrender.com/posts

# Crear post (requiere token JWT)
curl -X POST https://backconnectpost-latest.onrender.com/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Mi Nuevo Post",
    "content": "Contenido del post...",
    "tags": ["tecnología", "nestjs"]
  }'
```

## 🛠️ Tecnologías

- **Framework**: NestJS 10+
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Autenticación**: JWT + Supabase Auth
- **Documentación**: Swagger/OpenAPI
- **Containerización**: Docker
- **Despliegue**: Render.com
- **Testing**: Jest

## 📁 Estructura del Proyecto

```
backconnectpost/
├── src/
│   ├── modules/
│   │   ├── auth/           # Módulo de autenticación
│   │   └── posts/          # Módulo de posts
│   ├── shared/             # Código compartido
│   │   ├── application/    # DTOs e interfaces compartidas
│   │   ├── domain/         # Entidades base y value objects
│   │   └── infrastructure/ # Servicios de infraestructura
│   └── main.ts            # Punto de entrada de la aplicación
├── test/                  # Pruebas e2e
├── prisma/               # Esquema de base de datos
├── Dockerfile            # Configuración Docker
└── README.md            # Documentación
```

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🔗 Enlaces Útiles

- **Producción**: https://backconnectpost-latest.onrender.com
- **Swagger UI**: https://backconnectpost-latest.onrender.com/api/docs
- **NestJS**: https://nestjs.com/
- **Supabase**: https://supabase.com/
- **Docker Hub**: https://hub.docker.com/r/williams2022/backconnectpost
