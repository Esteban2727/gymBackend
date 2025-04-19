import { Entity, PrimaryGeneratedColumn, Column, OneToMany, DeleteDateColumn, CreateDateColumn } from 'typeorm';
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

  @CreateDateColumn() 
    createdAt: Date; 
  
  @DeleteDateColumn({ nullable: true }) 
    deletedAt: Date | null

  @OneToMany(() => GymUser, (gymUser) => gymUser.gym)
  gymUsers: GymUser[];
}
