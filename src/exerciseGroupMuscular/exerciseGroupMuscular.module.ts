import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExerciseMuscleGroup } from "./exerciseGroupMuscular.entity";
import { ExerciseGroupMuscularController } from "./controller/exerciseGroupMuscular.controller";
import { ExerciseGroupMuscularServices } from "./services/exerciseGroupMuscular.service";

 
@Module({
    imports:[
        TypeOrmModule.forFeature([ExerciseMuscleGroup])
    ],
    controllers:[ExerciseGroupMuscularController],
    providers:[ExerciseGroupMuscularServices]
}
)
export class exerciseGroupMuscularModule{

}