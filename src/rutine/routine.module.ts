import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Routine } from "./rutine.entity";
import { RoutineExercise } from "./routineExcersise.entity";
import { RoutineTrainer } from "./routineTrainer";
import { RoutineController } from "./rutine.controller";
import { RoutineService } from "./rutine.service";

@Module({
   imports:[
    TypeOrmModule.forFeature([Routine,RoutineExercise,RoutineTrainer])
   ], 
   controllers:[RoutineController],
   providers:[RoutineService]

})
export class routineMOdule{}