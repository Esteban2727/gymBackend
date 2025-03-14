import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Routine } from "./rutine.entity";
import { RoutineExercise } from "./routineExcersise.entity";
import { RoutineTrainer } from "./routineTrainer";

@Module({
   imports:[
    TypeOrmModule.forFeature([Routine,RoutineExercise,RoutineTrainer])
   ], 
   controllers:[],
   providers:[]

})
export class routineMOdule{}