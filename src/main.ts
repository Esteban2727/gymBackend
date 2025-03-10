import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { existsSync, mkdirSync } from 'fs';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import serverless from 'serverless-http';
import { CONFIG_SESSION } from './configNest/config';

declare module 'express-session' {
  interface SessionData {
    user: {
      username: string;
      id: string;
      email: string;
      accessToken: string;
      refreshToken: string;
      rol: string;
    };
  }
}

async function bootstrap() {
  // Crear carpeta de uploads si no existe
  if (!existsSync('./uploads')) {
    mkdirSync('./uploads');
  }

  // Crear instancia de Express
  const expressApp = express();

  // Usar ExpressAdapter para integrarlo con NestJS
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  // Middlewares
  app.enableCors();
  app.use(express.json());
  app.use(cookieParser());
  app.use(session(CONFIG_SESSION));

  // Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentación')
    .setDescription('Documentación de la API con Swagger')
    .setVersion('1.0')
    .addTag('Ejemplo')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Iniciar la app sin `listen()`
  await app.init();

  return expressApp;
}

// Crear la app y exportar `handler` para Vercel
const appPromise = bootstrap();
export const handler = serverless(async (req, res) => {
  const app = await appPromise;
  app(req, res);
});
