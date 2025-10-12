# BackConnectPost - Guía de Uso

## Configuración Inicial

1. **Instalar dependencias:**
```bash
npm install
```

2. **Crear archivo de variables de entorno:**
```bash
cp .env.example .env
```

3. **Ejecutar la aplicación:**
```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run start:prod
```

## Endpoints Disponibles

### Autenticación

#### POST `/auth/login`
Autenticar usuario y obtener token JWT.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "admin@example.com",
    "name": "Admin User"
  }
}
```

#### GET `/auth/profile`
Obtener perfil del usuario autenticado (requiere token).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "sub": "1",
    "email": "admin@example.com",
    "name": "Admin User"
  }
}
```

## Credenciales de Prueba

- **Email:** admin@example.com
- **Password:** password123

## Cómo Probar la API

### Usando curl:

1. **Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

2. **Obtener perfil (usar el token del login):**
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <tu-token-aqui>"
```

### Usando Postman o Thunder Client:

1. Crear una request POST a `http://localhost:3000/auth/login`
2. En el body (JSON) agregar las credenciales
3. Copiar el token de la respuesta
4. Crear una nueva request GET a `http://localhost:3000/auth/profile`
5. En Headers agregar: `Authorization: Bearer <token>`

## Estructura del Proyecto

Ver `ARCHITECTURE.md` para una explicación detallada de la arquitectura implementada.

## Próximos Pasos

Para extender el proyecto, considera agregar:

1. **Módulo de Posts:**
   - Crear, leer, actualizar, eliminar posts
   - Asociar posts con usuarios

2. **Base de Datos:**
   - Integrar PostgreSQL o MongoDB
   - Configurar TypeORM o Mongoose

3. **Validaciones Avanzadas:**
   - Rate limiting
   - Sanitización de datos
   - Validaciones de negocio más complejas

4. **Testing:**
   - Unit tests para servicios
   - Integration tests para controladores
   - E2E tests para flujos completos
