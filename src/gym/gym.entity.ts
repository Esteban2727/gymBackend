import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { GymUser } from './gymUser.entity';

@Entity()
export class Gym {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ default: '#ff5733' })
  primaryColor: string;

  @Column({ default: '#333' })
  secondaryColor: string;

  @Column({ default: 'Arial' })
  font: string;

  @OneToMany(() => GymUser, (gymUser) => gymUser.gym)
  gymUsers: GymUser[];
}
