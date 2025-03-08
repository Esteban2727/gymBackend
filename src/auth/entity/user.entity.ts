import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, PrimaryColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { GymUser } from '../../gym/gymUser.entity';
import {Subscription}from "../../subcription/Entity/subcription.entity"

@Entity()
export class User {

  @PrimaryColumn({name:"identification"})
  identification:string

  @Column({ unique: true })
  username: string;
 @Column({default:null})
  gender:string
  @Column()
  password: string;
  @Column()
  cellphone: string;
  @Column()
  email: string;
  @Column({default:"customer"})
  rol: string;


  @Column({ nullable: true }) 
  profilePicture: string;

  @CreateDateColumn() 
  createdAt: Date; 

  @DeleteDateColumn({ nullable: true }) 
  deletedAt: Date | null;


  
   @OneToMany(() => GymUser, (gymUser) => gymUser.user)
   gymUsers: GymUser[];


   @OneToMany(() => Subscription, (subscription) => subscription.user)
   subscriptions: Subscription[];
   ;
}




