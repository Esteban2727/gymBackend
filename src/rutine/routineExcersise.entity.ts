import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Routine } from './rutine.entity';
import { Exercise } from '../exercises/Entity/exercise.entity';

@Entity()
export class RoutineExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Routine, (routine) => routine.routineExercises, {
    onDelete: 'CASCADE',
  })
  routine: Routine;

  @ManyToOne(() => Exercise, (exercise) => exercise.routineExercises, {
    onDelete: 'CASCADE',
  })
  exercise: Exercise;

  @Column({ nullable: true })
  order: number;

  @Column({ nullable: true })
  repetitions: number;

  @Column({ nullable: true })
  rest_time: number; // segundos
}
