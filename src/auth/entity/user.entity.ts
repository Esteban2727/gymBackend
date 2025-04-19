import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  TableInheritance,
} from 'typeorm';
import { GymUser } from '../../gym/gymUser.entity';

@Entity()
@TableInheritance({
  column: { type: 'varchar', name: 'type', default: 'Administrator' },
})
export class User {
  @PrimaryColumn({ name: 'identification' })
  identification: string;

  @Column()
  username: string;
  @Column({ default: null })
  gender: string;
  @Column()
  password: string;
  @Column()
  cellphone: string;
  @Column()
  email: string;
  @Column({ default: 'Administrator' })
  rol: string;
  @Column({ nullable: true })
  profilePicture: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => GymUser, (gymUser) => gymUser.user)
  gymUsers: GymUser[];
}
