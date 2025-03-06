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

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: "hola", 
      signOptions: { expiresIn: '2h' },
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