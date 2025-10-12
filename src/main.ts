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
  const port = process.env.PORT ?? 3001;
  
  const configBuilder = new DocumentBuilder()
    .setTitle('BackConnectPost API')
    .setDescription('Una API de blog construida con arquitectura hexagonal y NestJS')
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
    .addTag('Authentication', 'Endpoints para autenticación de usuarios')
    .addTag('Posts', 'Endpoints para gestión de posts del blog');

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

  await app.listen(process.env.PORT ?? 3001);
  const url = await app.getUrl();
  console.log(`Application is running on: ${url}`);
  console.log(`📚 Swagger documentation available at: ${url}/api/docs`);
}
bootstrap();
