import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Security Middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      xFrameOptions: { action: 'deny' },
    }),
  );
  app.use(cookieParser());

  // CORS configuration
  const configuredOrigins = process.env.CORS_ALLOWED_ORIGINS
    ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
    : [];

  const defaultAllowedOrigins = [
    'http://localhost:3000',
    'http://localhost:4000',
    'https://ausbildung-preparation-portal-app.onrender.com',
    'https://ausbildung-preparation-portal.onrender.com',
    'https://ausbildung-web.onrender.com',
  ];

  const allowedOriginsSet = new Set(
    [...defaultAllowedOrigins, ...configuredOrigins].map((o) => o.replace(/\/+$/, '')),
  );

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      const cleanOrigin = origin.replace(/\/+$/, '');

      // Check explicit allowed origins list
      if (allowedOriginsSet.has(cleanOrigin) || allowedOriginsSet.has(origin)) {
        return callback(null, true);
      }

      // Allow any onrender origin belonging to this project (e.g., custom frontend deployment names)
      if (/^https:\/\/ausbildung[a-z0-9-]*\.onrender\.com$/i.test(cleanOrigin)) {
        return callback(null, true);
      }

      logger.warn(`CORS blocked request from origin: ${origin}`);
      return callback(new Error(`CORS policy does not allow access from origin ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Correlation-ID',
      'X-Refresh-Token',
      'Accept',
    ],
    exposedHeaders: ['X-Correlation-ID'],
  });

  // Global Versioned Prefix (exclude root '/' so Render health/status checks succeed)
  app.setGlobalPrefix('api/v1', {
    exclude: ['/'],
  });

  // Global DTO Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger / OpenAPI Specification
  const config = new DocumentBuilder()
    .setTitle('Ausbildung Preparation Portal — API')
    .setDescription(
      'Enterprise-grade REST API backend supporting Next.js web application and future mobile clients (Flutter/React Native).',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your access token issued upon registration or login.',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 Ausbildung Preparation API running on: http://localhost:${port}/api/v1`);
  logger.log(`📚 OpenAPI / Swagger documentation active at: http://localhost:${port}/api/v1/docs`);
}

void bootstrap();
