# BackConnectPost API Documentation

## 📋 Descripción General

BackConnectPost es una API REST para un sistema de blog construida con NestJS y arquitectura hexagonal. La API proporciona funcionalidades completas para autenticación de usuarios y gestión de posts de blog.

## 🚀 Características Principales

- **Autenticación JWT**: Sistema completo de autenticación con Supabase Auth
- **Gestión de Posts**: CRUD completo para posts de blog con sistema de publicación
- **Documentación Swagger**: Documentación interactiva completa
- **Arquitectura Hexagonal**: Separación clara entre dominio, aplicación e infraestructura
- **Validación de Datos**: Validación robusta usando class-validator
- **Manejo de Errores**: Sistema global de manejo de excepciones

## 🛠️ Tecnologías Utilizadas

- **Framework**: NestJS
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: Supabase Auth + JWT
- **Documentación**: Swagger/OpenAPI
- **Validación**: class-validator, class-transformer
- **Testing**: Jest

## 📖 Documentación Interactiva

La documentación completa e interactiva está disponible en:

```
http://localhost:3000/api/docs
```

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Para acceder a endpoints protegidos:

1. Obtén un token mediante login (`POST /auth/login`)
2. Incluye el token en el header Authorization: `Bearer <tu_token>`

### Endpoints de Autenticación

| Método | Endpoint | Descripción | Protegido |
|--------|----------|-------------|-----------|
| POST | `/auth/register` | Registrar nuevo usuario | ❌ |
| POST | `/auth/login` | Iniciar sesión | ❌ |
| POST | `/auth/logout` | Cerrar sesión | ✅ |
| GET | `/auth/profile` | Obtener perfil de usuario | ✅ |
| POST | `/auth/forgot-password` | Solicitar restablecimiento de contraseña | ❌ |
| POST | `/auth/reset-password` | Restablecer contraseña | ❌ |

### Ejemplo de Uso - Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "tu_contraseña"
  }'
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

## 📝 Gestión de Posts

### Endpoints de Posts

| Método | Endpoint | Descripción | Protegido |
|--------|----------|-------------|-----------|
| GET | `/posts` | Obtener lista de posts (con filtros) | ❌ |
| GET | `/posts/my-posts` | Obtener posts del usuario | ✅ |
| GET | `/posts/:id` | Obtener post específico | ❌ |
| POST | `/posts` | Crear nuevo post | ✅ |
| PUT | `/posts/:id` | Actualizar post | ✅ |
| PUT | `/posts/:id/publish` | Publicar post | ✅ |
| PUT | `/posts/:id/unpublish` | Despublicar post | ✅ |
| DELETE | `/posts/:id` | Eliminar post | ✅ |

### Ejemplo de Uso - Crear Post

```bash
curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer tu_token_jwt" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi Nuevo Post",
    "content": "Contenido completo del post...",
    "tags": ["tecnología", "programación"]
  }'
```

### Filtros y Paginación

El endpoint `GET /posts` soporta los siguientes parámetros de consulta:

- `published` (boolean): Filtrar por estado de publicación
- `limit` (number): Número de posts por página (default: 10)
- `offset` (number): Desplazamiento para paginación (default: 0)
- `search` (string): Buscar en título, contenido o tags

**Ejemplo:**
```bash
curl "http://localhost:3000/posts?published=true&limit=5&search=tecnología"
```

## 📊 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Datos de entrada inválidos |
| 401 | Unauthorized - Token no válido o faltante |
| 403 | Forbidden - Sin permisos para el recurso |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error interno del servidor |

## 🔧 Variables de Entorno

Asegúrate de configurar las siguientes variables de entorno:

```env
# Database
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/backconnectpost"

# Supabase
SUPABASE_URL="tu_supabase_url"
SUPABASE_ANON_KEY="tu_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="tu_supabase_service_role_key"

# JWT
JWT_SECRET="tu_jwt_secret"
JWT_EXPIRES_IN="1h"

# Server
PORT=3000
```

## 🚀 Instalación y Configuración

1. **Clonar repositorio:**
   ```bash
   git clone <repository-url>
   cd backconnectpost
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Ejecutar migraciones:**
   ```bash
   npx prisma migrate dev
   ```

5. **Iniciar servidor de desarrollo:**
   ```bash
   npm run start:dev
   ```

6. **Acceder a la documentación:**
   ```
   http://localhost:3000/api/docs
   ```

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Tests de integración
npm run test:e2e

# Coverage
npm run test:cov
```

### Ejemplo de Test con la API

```javascript
// Ejemplo usando fetch o axios
const response = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
});

const data = await response.json();
console.log('Token:', data.access_token);
```

## 📋 Validación de Datos

### Esquemas de Validación

#### RegisterDto
```typescript
{
  "email": "string (email válido, requerido)",
  "password": "string (mín. 6 caracteres, requerido)",
  "name": "string (mín. 2 caracteres, requerido)"
}
```

#### CreatePostDto
```typescript
{
  "title": "string (mín. 1 carácter, máx. 255, requerido)",
  "content": "string (mín. 1 carácter, requerido)",
  "tags": "string[] (opcional)"
}
```

## 🔄 Ciclo de Vida de un Post

1. **Creación**: Un post se crea como borrador (`isPublished: false`)
2. **Edición**: El autor puede editar título, contenido y tags
3. **Publicación**: El autor publica el post (`isPublished: true`)
4. **Despublicación**: El autor puede ocultar el post
5. **Eliminación**: El autor puede eliminar permanentemente el post

## 🚀 Próximas Características

- [ ] Sistema de categorías
- [ ] Comentarios en posts
- [ ] Sistema de likes/reacciones
- [ ] Upload de imágenes
- [ ] API de búsqueda avanzada
- [ ] Sistema de roles y permisos
- [ ] Notificaciones push

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte y preguntas:

- Email: support@backconnectpost.com
- Issues: [GitHub Issues](https://github.com/usuario/backconnectpost/issues)
- Documentación: http://localhost:3000/api/docs

---

**Desarrollado con ❤️ usando NestJS y arquitectura hexagonal**
