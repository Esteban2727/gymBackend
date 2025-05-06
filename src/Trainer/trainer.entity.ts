import { ChildEntity, Column, ManyToMany, OneToMany } from 'typeorm';
import { User } from '../auth/entity/user.entity';
import { Routine } from 'src/rutine/rutine.entity';
import { RoutineTrainer } from 'src/rutine/routineTrainer';
import { TrainerCustomer } from './trainerCustomer.entity';

@ChildEntity()
export class Trainer extends User {
  @Column({ nullable: true })
  yearExperience: string;

  @Column({ type: 'text', array: true, nullable: true })
  certifications: string | string[];

  @OneToMany(() => RoutineTrainer, (routineTrainer) => routineTrainer.trainer)
  routineTrainers: RoutineTrainer[];

  @OneToMany(() => TrainerCustomer, (tc) => tc.trainer)
  customers: TrainerCustomer[];
}
