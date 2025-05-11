// trainer-customer.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Trainer } from './trainer.entity';
import { Customer } from '../customer/customer.entity';

@Entity()
export class TrainerCustomer {
  @PrimaryGeneratedColumn()
  id: number;
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Trainer, (trainer) => trainer.customers)
  @JoinColumn({ name: 'trainerIdentification' })
  trainer: Trainer;

  @ManyToOne(() => Customer, (customer) => customer.trainers)
  @JoinColumn({ name: 'customerIdentification' })
  customer: Customer;

  @CreateDateColumn()
  assignedAt: Date;
}
