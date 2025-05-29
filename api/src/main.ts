import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

// Configuración optimizada para deployment en producción
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Configuración de CORS para frontend separado
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'https://your-app.vercel.app'
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Configuración del puerto
  const port = process.env.PORT || 3001;
  
  await app.listen(port, '0.0.0.0');
  
  logger.log(`🚀 Backend API running on port ${port}`);
  logger.log(`📊 Environment: ${process.env.NODE_ENV}`);
  logger.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
}

void bootstrap();
