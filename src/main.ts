import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as express from 'express';
import {CONFIG_SESSION} from "./configNest/config"
import * as cookieParser from 'cookie-parser';
import { existsSync, mkdirSync } from 'fs';
declare module 'express-session' {
  interface SessionData {
    user: {
      username:string,
      id:string;
      email: string;
      accessToken: string;
      refreshToken: string;
      rol: string
    };
  }
}
async function bootstrap() {
  if (!existsSync('./uploads')) {
    mkdirSync('./uploads');
  }
  const app = await NestFactory.create(AppModule);
  

  const PORT = process.env.PORT || 3001;
  app.enableCors(); 

  app.use(express.json()); 

  
  app.use(cookieParser());
  app.use(session(CONFIG_SESSION));
  
  await app.listen(PORT);
  console.log(` Server running on http://localhost:${PORT}`);
}
bootstrap();
