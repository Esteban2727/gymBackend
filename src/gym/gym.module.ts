import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from '../mail/mail.module';
import { Gym } from './gym.entity';
import { GymController } from './controller/gym.controller';
import { gymServices } from './services/gym.service';
import { GymUserController } from './controller/gymUser.controller';
import { GymUserServices } from './services/gymUser.service';
import { GymUser } from './gymUser.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
         ConfigModule.forRoot(), // Carga las variables de entorno
         PassportModule,
         JwtModule.registerAsync({
           imports: [ConfigModule],
           inject: [ConfigService],
           useFactory: async (configService: ConfigService) => ({
             secret: configService.get<string>('JWT_SECRET'),
             signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '2h' },
           }),
         }),
    TypeOrmModule.forFeature([Gym,GymUser]),
    MailModule,  
  ],
  controllers: [
      GymController,
      GymUserController
  ],
  providers: [
gymServices,
GymUserServices
  ],
})
export class GymModule {}