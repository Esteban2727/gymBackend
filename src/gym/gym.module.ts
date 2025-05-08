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

import { administrator } from './entity/userAdministrador.entity';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/auth/entity/user.entity';
import { UploadService } from 'src/uploadFiles/services/upload.service';
import { DashboardServices } from 'src/dashboard/services/dashboard.service';
import { DashboardModule } from 'src/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    DashboardModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '2h',
        },
      }),
    }),
    TypeOrmModule.forFeature([Gym, GymUser, administrator, User]),
    MailModule,
  ],
  controllers: [GymController, GymUserController],
  providers: [gymServices, GymUserServices, MailService, UploadService],
})
export class GymModule {}
