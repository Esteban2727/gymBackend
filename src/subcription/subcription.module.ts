import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entity/user.entity'
import { JwtStrategy } from '../jwt/jwt.strategy';

import { Gym } from 'src/gym/gym.entity';
import { Subscription } from './Entity/subcription.entity';
import { SubscriptionController } from './controller/subcription.controller';
import { SubscriptionService } from './services/subcription.service';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: "hola",
      signOptions: { expiresIn: "2h" },
    }),
    TypeOrmModule.forFeature([Subscription]),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class subcriptionModule {}
