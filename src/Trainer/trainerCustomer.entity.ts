// trainer-customer.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Trainer } from './trainer.entity';
import { Customer } from '../customer/customer.entity';

@Entity()
export class TrainerCustomer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Trainer, (trainer) => trainer.customers)
  @JoinColumn({ name: 'trainerIdentification' })
  trainer: Trainer;

  @ManyToOne(() => Customer, (customer) => customer.trainers)
  @JoinColumn({ name: 'customerIdentification' })
  customer: Customer;

  @CreateDateColumn()
  assignedAt: Date;
}
