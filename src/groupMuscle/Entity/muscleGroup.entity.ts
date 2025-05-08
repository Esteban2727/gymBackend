import { ExerciseMuscleGroup } from "src/exerciseGroupMuscular/exerciseGroupMuscular.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, DeleteDateColumn } from "typeorm";



@Entity()
export class MuscleGroup {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date; //  Para que funcione soft delete

  @OneToMany(() => ExerciseMuscleGroup, (exerciseMuscleGroup) => exerciseMuscleGroup.muscleGroup)
  exerciseMuscleGroups: ExerciseMuscleGroup[];
}