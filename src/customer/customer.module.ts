import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entity/user.entity'
import { JwtStrategy } from '../jwt/jwt.strategy';
import { CustomerController } from './controller/customer.controller';
import { CustomerService } from './services/customer.service';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: "hola",
      signOptions: { expiresIn: "2h" },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
