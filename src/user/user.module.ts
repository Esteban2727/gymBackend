import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entity/user.entity';
import { UserService } from './services/user.service';
import { UserController } from './controller/user.controller';
import { TrainerCustomer } from 'src/Trainer/trainerCustomer.entity';
import { GymUser } from 'src/gym/gymUser.entity';
import { RoutineTrainer } from 'src/rutine/routineTrainer';
import { Subscription } from 'src/subcription/Entity/subcription.entity';
import { UploadsModule } from 'src/uploadFiles/uploads.module';

@Module({
  imports: [
    UploadsModule,
    TypeOrmModule.forFeature([
      User,
      TrainerCustomer,
      GymUser,
      RoutineTrainer,
      Subscription,
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule], 
})
export class UserModule {}
