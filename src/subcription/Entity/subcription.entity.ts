import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Customer } from 'src/customer/customer.entity';

@Entity('user_subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.subscriptions)
  customer: Customer;

  @Column({ default: 30 })
  remainingDays: number;

  @CreateDateColumn()
  startDate: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
