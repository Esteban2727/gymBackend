import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MuscleGroup } from "../Entity/muscleGroup.entity";

@Injectable()
export class GroupMuscleServices{
constructor(
    @InjectRepository(MuscleGroup)
    readonly groupMuscleRepository :Repository<MuscleGroup>
){}

async getDatasMuscle(){
    return this.groupMuscleRepository.find()
}
}