import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExerciseMuscleGroup } from "../exerciseGroupMuscular.entity";
import { Repository } from "typeorm";

@Injectable()
export class ExerciseGroupMuscularServices{
constructor(
    @InjectRepository(ExerciseMuscleGroup)
    readonly exerciseMuscleGroupRepository : Repository<ExerciseMuscleGroup>
){


    
}

}