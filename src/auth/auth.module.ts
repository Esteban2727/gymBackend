import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User } from './entity/user.entity';
import { RegisterService } from './services/register.service';
import { loginServices } from './services/login.service';
import { RecoverPasswordServices } from './services/recoverPassword.service';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { RegisterController } from './controller/register.controller';
import { LoginController } from './controller/login.controller';
import { RecoverPasswordController } from './controller/recoverPassword.controller';
import { MailModule } from '../mail/mail.module';
import { Subscription } from 'src/subcription/Entity/subcription.entity';
import { MailService } from 'src/mail/mail.service';
import { InformationEmailController } from './controller/information.controller';
import { InformationEmailServices } from './services/information.service';
import { InformationEmail } from './entity/emailInformation.entity';

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
    TypeOrmModule.forFeature([User, Subscription, InformationEmail]),
    MailModule,
  ],
  controllers: [
    RegisterController,
    LoginController,
    RecoverPasswordController,
    InformationEmailController,
  ],
  providers: [
    RegisterService,
    loginServices,
    RecoverPasswordServices,
    JwtStrategy,
    MailService,
    InformationEmailServices,
  ],
  exports: [JwtStrategy],
})
export class AuthModule {}
