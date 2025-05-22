import { Routine } from 'src/rutine/rutine.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Trainer } from 'src/Trainer/trainer.entity';

@Entity()
export class RoutineAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Routine, { eager: true })
  routine: Routine;

  @ManyToOne(() => Trainer, (trainer) => trainer.customers)
  @JoinColumn({ name: 'trainerIdentification' })
  trainer: Trainer;

  @ManyToOne(() => Customer, (customer) => customer.trainers)
  @JoinColumn({ name: 'customerIdentification' })
  customer: Customer;

  @CreateDateColumn()
  assignedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
