import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExerciseMuscleGroup } from "../exerciseGroupMuscular.entity";
import { Repository } from "typeorm";
import { MuscleGroup } from "src/groupMuscle/Entity/muscleGroup.entity";
@Injectable()
export class ExerciseGroupMuscularServices{
<<<<<<< HEAD
constructor(
    @InjectRepository(ExerciseMuscleGroup)
    readonly exerciseMuscleGroupRepository : Repository<ExerciseMuscleGroup>
){


    
}

=======
    constructor(@InjectRepository(MuscleGroup)readonly groupMusculeRepository:Repository<MuscleGroup>) {
    }
async getGroupMuscularServices(){
    const getData = await this.groupMusculeRepository.find()
    return getData
}
>>>>>>> e6932aca90728ec3bfd64506d557337e1f38e5d1
}