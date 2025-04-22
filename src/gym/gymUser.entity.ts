import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, DeleteDateColumn } from 'typeorm';
import { User } from '../auth/entity/user.entity';
import { Gym } from './gym.entity';

@Entity()
export class GymUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.gymUsers, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Gym, (gym) => gym.gymUsers, { onDelete: 'CASCADE' })
  gym: Gym;


  @Column({ default: true })
  isActive: boolean;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
