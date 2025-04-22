import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExerciseMuscleGroup } from "../exerciseGroupMuscular.entity";
import { Repository } from "typeorm";
import { MuscleGroup } from "src/groupMuscle/Entity/muscleGroup.entity";
@Injectable()
export class ExerciseGroupMuscularServices{
    constructor(@InjectRepository(MuscleGroup)readonly groupMusculeRepository:Repository<MuscleGroup>) {
    }
async getGroupMuscularServices(){
    const getData = await this.groupMusculeRepository.find()
    return getData
}
}