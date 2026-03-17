import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );

  const config = app.get(ConfigService);
  const port = config.get<number>('app.port', 3000);
  const prefix = config.get<string>('app.prefix', 'api/v1');
  const isDev = config.get<string>('app.nodeEnv') !== 'production';

  // ─── Security headers (HIPAA: protect data in transit) ──────────────────
  app.use(
    helmet({
      contentSecurityPolicy: !isDev,
      crossOriginEmbedderPolicy: !isDev,
    }),
  );

  // ─── CORS ────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: config.get<string>('app.corsOrigin'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  // ─── Global prefix ───────────────────────────────────────────────────────
  app.setGlobalPrefix(prefix);

  // ─── Validation (HIPAA: validate all input at boundary) ─────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ─── Swagger (disabled in production) ───────────────────────────────────
  if (isDev) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Vedarogya API')
      .setDescription('Healthcare platform API — HIPAA compliant')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(port, '0.0.0.0');
  Logger.log(`Vedarogya API running on port ${port}`, 'Bootstrap');
}

bootstrap();
