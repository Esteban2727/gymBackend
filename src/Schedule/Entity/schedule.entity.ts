import { User } from "src/auth/entity/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Schedule{

    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, (user) => user.schedules)
    user: User;
  
    @CreateDateColumn()
    date: Date; 
  
    @Column({ default: true }) 
    attended: boolean;
}