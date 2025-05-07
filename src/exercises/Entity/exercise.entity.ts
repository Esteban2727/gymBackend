import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, DeleteDateColumn } from "typeorm";
import { ExerciseTrainingType } from "../../exercise-trainingType/Entity/exercise-trainingType.entity";
import { ExerciseMuscleGroup } from "src/exerciseGroupMuscular/exerciseGroupMuscular.entity";
import { Routine } from "src/rutine/rutine.entity";
import { RoutineExercise } from "src/rutine/routineExcersise.entity";

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  equipment: string;

  @Column({ nullable: true })
  difficulty_level: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => ExerciseTrainingType, (exerciseTrainingType) => exerciseTrainingType.exercise)
  exerciseTrainingTypes: ExerciseTrainingType[];

  @OneToMany(() => ExerciseMuscleGroup, (exerciseMuscleGroup) => exerciseMuscleGroup.exercise)
  exerciseMuscleGroups: ExerciseMuscleGroup[];

  @OneToMany(() => RoutineExercise, (routineExercise) => routineExercise.exercise)
  routineExercises: RoutineExercise[]

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date; // Para que funcione soft delete
}