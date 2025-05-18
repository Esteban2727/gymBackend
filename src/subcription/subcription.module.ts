import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entity/user.entity';
import { JwtStrategy } from '../jwt/jwt.strategy';

import { Gym } from 'src/gym/gym.entity';
import { Subscription } from './Entity/subcription.entity';
import { SubscriptionController } from './controller/subcription.controller';
import { SubscriptionService } from './services/subcription.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MailModule } from 'src/mail/mail.module';
/* import { EmailQueueModule } from 'src/emailQueue/email-Queue.module'; */
/* import { BullModule } from '@nestjs/bullmq'; */

@Module({
  imports: [
    ConfigModule, 
    PassportModule,
    MailModule,
/*     EmailQueueModule, */
  /*   BullModule.registerQueue({ name: 'email' }),  */
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
    TypeOrmModule.forFeature([Subscription]),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class subcriptionModule {}
