import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ExerciseTrainingType } from "../../exercise-trainingType/Entity/exercise-trainingType.entity";

@Entity()
export class TrainingType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => ExerciseTrainingType, (exerciseTrainingType) => exerciseTrainingType.trainingType)
  exerciseTrainingTypes: ExerciseTrainingType[];
}