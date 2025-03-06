import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, PrimaryColumn, OneToMany } from 'typeorm';
import { GymUser } from '../../gym/gymUser.entity';


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


   // Relación muchos a muchos con Gym a través de GymUser
   @OneToMany(() => GymUser, (gymUser) => gymUser.user)
   gymUsers: GymUser[];
}




