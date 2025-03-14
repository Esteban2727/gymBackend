import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Routine } from "./rutine.entity";
import { Trainer } from "../Trainer/trainer.entity";

@Entity()
export class RoutineTrainer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Routine, (routine) => routine.routineTrainers)
  routine: Routine;

  @ManyToOne(() => Trainer, (trainer) => trainer.routineTrainers)
  trainer: Trainer;
}
