import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { globalValidationPipe } from './shared/infrastructure/config/validation.config';
import { GlobalExceptionFilter } from './shared/infrastructure/filters/global-exception.filter';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(globalValidationPipe);
  
  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Additional CORS middleware for production edge cases
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS,HEAD');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,Origin,X-Requested-With,Access-Control-Allow-Origin,Access-Control-Allow-Headers,Access-Control-Allow-Methods,X-HTTP-Method-Override,Cache-Control,Pragma');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    next();
  });
  
  // CORS configuration - Allow all origins
  app.enableCors({
    origin: true, // Permite cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    credentials: true,
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Accept', 
      'Origin', 
      'X-Requested-With',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
      'X-HTTP-Method-Override',
      'Cache-Control',
      'Pragma'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
    maxAge: 86400, // 24 hours
  });

  // Swagger configuration
  const isProduction = process.env.NODE_ENV === 'production';
  const port = process.env.PORT || 3001;
  
  const configBuilder = new DocumentBuilder()
    .setTitle('BackConnectPost API')
    .setDescription(`
# BackConnectPost API - Sistema de Gestión Empresarial

## 🎯 Descripción General
API RESTful robusta y escalable construida con **NestJS** y **Arquitectura Hexagonal** para la gestión integral de contenido empresarial y administración multiempresa.

## 🏗️ Arquitectura
- **Patrón Hexagonal**: Separación clara entre dominio, aplicación e infraestructura
- **SOLID Principles**: Código mantenible y extensible
- **Domain Driven Design**: Modelado centrado en el dominio de negocio
- **Dependency Injection**: Gestión automática de dependencias con NestJS

## 📋 Funcionalidades Principales

### 🔐 **Sistema de Autenticación**
- Registro y login con **Supabase Auth**
- JWT tokens para autenticación stateless
- Gestión de perfiles de usuario completos
- Recuperación de contraseñas y verificación de email

### 🏢 **Gestión Multiempresa**
- Usuarios pueden pertenecer a múltiples empresas
- Sistema de roles por empresa (ADMIN, USER, MODERATOR)
- Selección de empresa activa por sesión
- Gestión de permisos granulares

### 📝 **Sistema de Posts y Contenido**
- CRUD completo de posts con estados (borrador/publicado)
- Sistema de categorías y etiquetas
- Gestión de medios y archivos adjuntos
- Control de visibilidad y permisos

### ⚙️ **Configuraciones de Usuario**
- Preferencias personalizables (idioma, moneda, tema)
- Configuraciones de interfaz adaptables
- Formatos de fecha y hora localizados
- Configuraciones automáticas por defecto

### 🌍 **Utilidades del Sistema**
- Catálogo de países y ciudades
- Gestión de monedas internacionales
- Soporte multiidioma dinámico
- Formatos de tiempo configurables

### 📊 **Sistema de Navegación**
- Menús dinámicos basados en permisos
- Navegación contextual por empresa
- Sidebar adaptativo según rol de usuario

## 🔧 **Tecnologías Utilizadas**
- **Backend**: NestJS, TypeScript, Prisma ORM
- **Base de Datos**: PostgreSQL con Neon
- **Autenticación**: Supabase Auth
- **Validación**: class-validator, class-transformer
- **Documentación**: Swagger/OpenAPI 3.0
- **Deployment**: Docker, Render Cloud Platform

## 🚀 **Características Técnicas**
- **Validación robusta** de datos de entrada
- **Manejo de errores** centralizado y consistente
- **Logging** estructurado para debugging
- **CORS** configurado para desarrollo y producción
- **Rate limiting** y seguridad implementada
- **Health checks** para monitoreo

## 📚 **Casos de Uso**
- Gestión de blogs corporativos
- Plataformas de contenido multiempresa
- Sistemas de gestión documental
- Portales de empleados y colaboradores
- Aplicaciones SaaS con multi-tenancy

## 🔄 **Versionado y Compatibilidad**
- API versionada y retrocompatible
- Migraciones de base de datos automatizadas
- Documentación actualizada automáticamente
- Testing automatizado de endpoints
    `)
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'Endpoints para autenticación de usuarios con Supabase')
    .addTag('Posts', 'Gestión completa de posts del blog con estados y permisos')
    .addTag('Configurations', 'Configuraciones personalizables de usuario')
    .addTag('Utils', 'Utilidades del sistema (monedas, idiomas, formatos)')
    .addTag('Locations', 'Gestión de países y ciudades')
    .addTag('Navigation', 'Sistema de navegación dinámico');

  // Add servers based on environment
  if (isProduction) {
    configBuilder.addServer('https://backconnectpost-latest.onrender.com', 'Producción');
  } else {
    configBuilder.addServer(`http://localhost:${port}`, 'Desarrollo');
  }

  const config = configBuilder.build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'BackConnectPost API Documentation',
    customfavIcon: '/favicon.ico',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
  });

  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Application is running on port: ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📚 Swagger documentation available at: http://localhost:${port}/api/docs`);
}
bootstrap();
