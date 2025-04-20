import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entity/user.entity';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { CustomerController } from './controller/customer.controller';
import { CustomerService } from './services/customer.service';
import { Gym } from 'src/gym/gym.entity';
import { Subscription } from 'src/subcription/Entity/subcription.entity';
import { Customer } from './customer.entity';
import { GymUser } from 'src/gym/gymUser.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';

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
    TypeOrmModule.forFeature([User, Subscription, Customer, GymUser, Gym]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService,MailService],
})
export class CustomerModule {}
