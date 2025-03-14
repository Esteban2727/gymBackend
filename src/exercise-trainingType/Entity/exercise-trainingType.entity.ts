import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
  } from "typeorm";
  import { Exercise } from "../../exercises/Entity/exercise.entity";
  import { TrainingType } from "../../trainingType/entity/trainingType.entity";
  
  @Entity()
export class ExerciseTrainingType {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Exercise, (exercise) => exercise.exerciseTrainingTypes)
  exercise: Exercise;

  @ManyToOne(() => TrainingType, (trainingType) => trainingType.exerciseTrainingTypes)
  trainingType: TrainingType;
}