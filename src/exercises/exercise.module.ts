import { Module } from '@nestjs/common';
import { ExerciseController } from './controller/exercise.controller';
import { ExerciseGroupService } from './services/exercise.service';
import { Exercise } from './Entity/exercise.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise])],
  controllers: [ExerciseController],
  providers: [ExerciseGroupService],
})
export class exerciseModules {}
