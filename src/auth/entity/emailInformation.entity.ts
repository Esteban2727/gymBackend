import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InformationEmail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  message: string;
}
