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

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: "hola", 
      signOptions: { expiresIn: '2h' },
    }),
    TypeOrmModule.forFeature([User,GymUser]),
    MailModule,  
  ],
  controllers: [
 DashboardController
  ],
  providers: [
DashboardServices,
SocketGateway
  ],
})
export class DashboardModule {}