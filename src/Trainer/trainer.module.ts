import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trainer } from './trainer.entity';
import { TrainerController } from './trainer.controller';
import { TrainerServices } from './trainer.service';
import { GymUser } from 'src/gym/gymUser.entity';
import { User } from 'src/auth/entity/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Gym } from 'src/gym/gym.entity';
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
    TypeOrmModule.forFeature([Trainer, GymUser, User, Gym]),
  ],
  controllers: [TrainerController],
  providers: [TrainerServices,MailService],
})
export class TrainerModule {}
