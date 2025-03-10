import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as express from 'express';
import { CONFIG_SESSION } from './configNest/config';
import * as cookieParser from 'cookie-parser';
import { existsSync, mkdirSync } from 'fs';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import serverless from 'serverless-http';

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
  if (!existsSync('./uploads')) {
    mkdirSync('./uploads');
  }

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Documentación')
    .setDescription('Documentación de la API con Swagger')
    .setVersion('1.0')
    .addTag('Ejemplo')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 3001;
  app.enableCors();
  app.use(express.json());
  app.use(cookieParser());
  app.use(session(CONFIG_SESSION));

  await app.listen(PORT);
  console.log(`Server running on http://localhost:${PORT}`);

  return app;
}

const appPromise = bootstrap();

// 🔥 **ESTO ES CLAVE PARA QUE FUNCIONE EN VERCEL**
export const handler = serverless(async (req, res) => {
  const app = await appPromise;
  app.getHttpAdapter().getInstance()(req, res);
});
