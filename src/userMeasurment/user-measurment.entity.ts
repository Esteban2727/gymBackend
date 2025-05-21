import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Customer } from '../customer/customer.entity';

@Entity()
export class UserMeasurement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (c) => c.measurements, { onDelete: 'CASCADE' })
  customer: Customer;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  height: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  waist: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  hip: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  chest: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  arm: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  leg: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  bodyFatPercentage: number;

  @Column('text', { nullable: true })
  notes: string;
}
