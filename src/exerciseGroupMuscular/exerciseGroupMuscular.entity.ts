import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exercise } from '../exercises/Entity/exercise.entity';
import { MuscleGroup } from '../groupMuscle/Entity/muscleGroup.entity';

@Entity()
export class ExerciseMuscleGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Exercise, (exercise) => exercise.exerciseMuscleGroups)
  exercise: Exercise;

  @ManyToOne(
    () => MuscleGroup,
    (muscleGroup) => muscleGroup.exerciseMuscleGroups,
  )
  muscleGroup: MuscleGroup;
}
