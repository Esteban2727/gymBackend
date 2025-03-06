import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// Módulos del proyecto
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { UploadsModule } from './uploadFiles/uploads.module'; 

import { User } from './auth/entity/user.entity';
import { GeneratePdfModule } from './pdf/pdf.module';
import { UserModule } from './user/user.module';
import { Gym } from './gym/gym.entity';
import { GymUser } from './gym/gymUser.entity';
import { GymModule } from './gym/gym.module';
import { SocketGateway } from './gateways/socket.gateway';
import { DashboardModule } from './dashboard/dashboard.module';
import { DashboardServices } from './dashboard/services/dashboard.service';

@Module({
  imports: [
   
    ConfigModule.forRoot({ isGlobal: true }),

    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true, 
      }),
    }),

    
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),

    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', 
    }),

    
    TypeOrmModule.forFeature([User,Gym,GymUser]),
    AuthModule,
    CustomerModule,
    UploadsModule,
    GeneratePdfModule,
    UserModule,
    GymModule,
    DashboardModule
   
  ],
  providers: []
})
export class AppModule {}
