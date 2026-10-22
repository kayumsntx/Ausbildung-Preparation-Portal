import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { AppModule } from '../src/app.module.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function exportOpenApi() {
  console.log('🚀 Initializing NestJS application for OpenAPI schema generation...');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Ausbildung Preparation Portal — API')
    .setDescription(
      'Enterprise-grade REST API backend supporting Next.js web application and future mobile clients (Flutter / React Native).',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Access token issued upon authentication.',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const jsonContent = JSON.stringify(document, null, 2);

  // 1. Target: docs/openapi.json
  const docsDir = path.resolve(__dirname, '../../../docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  const docsPath = path.join(docsDir, 'openapi.json');
  fs.writeFileSync(docsPath, jsonContent, 'utf8');

  // 2. Target: packages/mobile-contracts/openapi.json
  const contractsDir = path.resolve(__dirname, '../../../packages/mobile-contracts');
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }
  const contractsPath = path.join(contractsDir, 'openapi.json');
  fs.writeFileSync(contractsPath, jsonContent, 'utf8');

  const endpointCount = Object.keys(document.paths || {}).length;

  console.log(`✅ Successfully exported OpenAPI schema with ${endpointCount} paths!`);
  console.log(`📄 Written to: ${docsPath}`);
  console.log(`📱 Written to: ${contractsPath}`);

  await app.close();
  process.exit(0);
}

exportOpenApi().catch((err) => {
  console.error('❌ Failed to export OpenAPI specification:', err);
  process.exit(1);
});
