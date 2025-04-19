import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { GymUser } from './gymUser.entity';

@Entity()
export class Gym {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ default: '#ff5733' })
  primary: string;

  @Column({ default: '#333' })
  secondary: string;

  @Column({ default: 'Arial' })
  font: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  fourth: string;

  @Column({ nullable: true })
  third: string;

  @Column({ nullable: true })
  fontFamily: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => GymUser, (gymUser) => gymUser.gym)
  gymUsers: GymUser[];
}
