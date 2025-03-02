import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class User {

  @PrimaryColumn({name:"identification"})
  identification:string

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
  @Column()
  cellphone: string;
  @Column()
  email: string;
  @Column({default:"customer"})
  rol: string;

  @Column({ default: true }) 
  isActive: boolean; 

  @CreateDateColumn() 
  createdAt: Date; 

  @DeleteDateColumn({ nullable: true }) 
  deletedAt: Date | null;
}
