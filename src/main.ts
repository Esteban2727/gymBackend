import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { existsSync, mkdirSync } from 'fs';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CONFIG_SESSION } from './configNest/config';
import * as crypto from 'crypto';

// Asegurar que crypto está disponible globalmente
if (!global.crypto) {
  global.crypto = crypto as any;
}
declare module 'express-session' {
  interface SessionData {
    user: {
      username: string;
      id: string;
      email: string;
      accessToken: string;
      refreshToken: string;
      rol: string;
      gym:string
    };
  }
}

async function bootstrap() {
  try {
    const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

    const uploadDir = './uploads';
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const expressApp = express();

    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    app.enableCors();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(session(CONFIG_SESSION));

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    // Configuración de Swagger
    const config = new DocumentBuilder()
      .setTitle('API Documentación')
      .setDescription('Documentación de la API con Swagger')
      .setVersion('1.0')
      .addTag('Ejemplo')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();

    // Escuchar en el puerto definido
    await app.listen(PORT, '0.0.0.0');
    console.log(` Servidor corriendo en http://localhost:${PORT}`);

    return expressApp;
  } catch (error) {
    console.error(' Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

bootstrap();
