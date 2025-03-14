import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Routine } from "./rutine.entity";
import { Exercise } from "../exercises/Entity/exercise.entity";

@Entity()
export class RoutineExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Routine, (routine) => routine.routineExercises)
  routine: Routine;

  @ManyToOne(() => Exercise, (exercise) => exercise.routineExercises)
  exercise: Exercise;
}
