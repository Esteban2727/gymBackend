import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { Routine } from './rutine.entity';
import { Trainer } from '../Trainer/trainer.entity';

@Entity()
export class RoutineTrainer {
  @PrimaryGeneratedColumn()
  id: number;
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Routine, (routine) => routine.routineTrainers)
  routine: Routine;

  @ManyToOne(() => Trainer, (trainer) => trainer.routineTrainers)
  trainer: Trainer;
}
