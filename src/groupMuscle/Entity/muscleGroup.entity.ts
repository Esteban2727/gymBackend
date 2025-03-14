import { ExerciseMuscleGroup } from "src/exerciseGroupMuscular/exerciseGroupMuscular.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";



@Entity()
export class MuscleGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => ExerciseMuscleGroup, (exerciseMuscleGroup) => exerciseMuscleGroup.muscleGroup)
  exerciseMuscleGroups: ExerciseMuscleGroup[];
}