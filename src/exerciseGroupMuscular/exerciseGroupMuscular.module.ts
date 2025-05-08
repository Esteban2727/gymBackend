import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseMuscleGroup } from './exerciseGroupMuscular.entity';
import { ExerciseGroupMuscularController } from './controller/exerciseGroupMuscular.controller';
import { ExerciseGroupMuscularServices } from './services/exerciseGroupMuscular.service';
import { MuscleGroup } from 'src/groupMuscle/Entity/muscleGroup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseMuscleGroup, MuscleGroup])],
  controllers: [ExerciseGroupMuscularController],
  providers: [ExerciseGroupMuscularServices],
})
export class exerciseGroupMuscularModule {}
