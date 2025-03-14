import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RoutineTrainer } from "./routineTrainer";
import { RoutineExercise } from "./routineExcersise.entity";

@Entity()
export class Routine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => RoutineTrainer, (routineTrainer) => routineTrainer.routine)
  routineTrainers: RoutineTrainer[];

  @OneToMany(() => RoutineExercise, (routineExercise) => routineExercise.routine)
  routineExercises: RoutineExercise[];
}
