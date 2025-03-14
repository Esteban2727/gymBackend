import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExerciseTrainingType } from "./Entity/exercise-trainingType.entity";

@Module({
    imports:[
        TypeOrmModule.forFeature([ExerciseTrainingType])
    ],
    controllers:[],
    providers:[]
})
export class ExercisesTrainingTypeModule{}