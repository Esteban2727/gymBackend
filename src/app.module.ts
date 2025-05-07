import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { UploadsModule } from './uploadFiles/uploads.module';

import { User } from './auth/entity/user.entity';
import { GeneratePdfModule } from './pdf/pdf.module';
import { UserModule } from './user/user.module';
import { Gym } from './gym/gym.entity';
import { GymUser } from './gym/gymUser.entity';
import { GymModule } from './gym/gym.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { Subscription } from './subcription/Entity/subcription.entity';
import { subcriptionModule } from './subcription/subcription.module';
import { GateWayModule } from './gateways/gateway.module';

import { MuscleGroup } from './groupMuscle/Entity/muscleGroup.entity';
import { Exercise } from './exercises/Entity/exercise.entity';
import { ExerciseTrainingType } from './exercise-trainingType/Entity/exercise-trainingType.entity';
import { TrainingType } from './trainingType/entity/trainingType.entity';
import { ExerciseMuscleGroup } from './exerciseGroupMuscular/exerciseGroupMuscular.entity';
import { Customer } from './customer/customer.entity';
import { Trainer } from './Trainer/trainer.entity';
import { TrainerModule } from './Trainer/trainer.module';
import { Routine } from './rutine/rutine.entity';
import { RoutineExercise } from './rutine/routineExcersise.entity';
import { RoutineTrainer } from './rutine/routineTrainer';
import { RoutineMOdule } from './rutine/routine.module';
import { groupMuscleModule } from './groupMuscle/groupMuscle.module';
import { exerciseGroupMuscularModule } from './exerciseGroupMuscular/exerciseGroupMuscular.module';
import { administrator } from './gym/entity/userAdministrador.entity';
import { exerciseModules } from './exercises/exercise.module';

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

        ssl: {
          rejectUnauthorized: false,
        },
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

    ScheduleModule.forRoot(),

    TypeOrmModule.forFeature([
      User,
      Gym,
      GymUser,
      Subscription,
      MuscleGroup,
      Exercise,
      ExerciseTrainingType,
      TrainingType,
      ExerciseMuscleGroup,
      Customer,
      Trainer,
      Routine,
      RoutineExercise,
      RoutineTrainer,
      administrator
    ]),
    AuthModule,
    CustomerModule,
    UploadsModule,
    GeneratePdfModule,
    UserModule,
    GymModule,
    DashboardModule,
    subcriptionModule,
    GateWayModule,
    RoutineMOdule,
    TrainerModule,
    groupMuscleModule,
    exerciseGroupMuscularModule,
    exerciseModules
  ],
  providers: [],
})
export class AppModule {}
