import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Exercise } from '../../exercises/Entity/exercise.entity';
import { TrainingType } from '../../trainingType/entity/trainingType.entity';

@Entity()
export class ExerciseTrainingType {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Exercise, (exercise) => exercise.exerciseTrainingTypes)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;

  @ManyToOne(
    () => TrainingType,
    (trainingType) => trainingType.exerciseTrainingTypes,
  )
  @JoinColumn({ name: 'training_type_id' })
  trainingType: TrainingType;
}
