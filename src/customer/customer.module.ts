import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entity/user.entity'
import { JwtStrategy } from '../jwt/jwt.strategy';
import { CustomerController } from './controller/customer.controller';
import { CustomerService } from './services/customer.service';
import { Gym } from 'src/gym/gym.entity';
import { Subscription } from 'src/subcription/Entity/subcription.entity';
import { Customer } from './customer.entity';
import { GymUser } from 'src/gym/gymUser.entity';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: "hola",
      signOptions: { expiresIn: "2h" },
    }),
    TypeOrmModule.forFeature([User,Subscription,Customer,GymUser]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
