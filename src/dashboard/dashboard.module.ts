import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from '../mail/mail.module';
import { User } from 'src/auth/entity/user.entity';
import { DashboardController } from './controller/dashboard.controller';
import { DashboardServices } from './services/dashboard.service';
import { SocketGateway } from 'src/gateways/socket.gateway';
import { GymUser } from 'src/gym/gymUser.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, // Carga las variables de entorno
    PassportModule,
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
    TypeOrmModule.forFeature([User, GymUser]),
    MailModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardServices, SocketGateway],
  exports: [SocketGateway, DashboardServices],
})
export class DashboardModule {}
