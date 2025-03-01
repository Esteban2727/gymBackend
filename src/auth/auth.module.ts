import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity'
import { JwtStrategy } from '../jwt/jwt.strategy';
import { RegisterController } from './controller/register.controller';
import { RegisterService } from './services/register.service';
import { loginController } from './controller/login.controller';
import { loginServices } from './services/login.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [RegisterController,loginController],
  providers: [RegisterService,loginServices, JwtStrategy],
})
export class AuthModule {}
