import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExerciseMuscleGroup } from "src/exerciseGroupMuscular/exerciseGroupMuscular.entity";
import { Repository } from "typeorm";


@Injectable()
export class AssociateGropuMusculeToExerciseService{
constructor(
    @InjectRepository(ExerciseMuscleGroup)
    readonly associateGroupToExerciseRepository: Repository<ExerciseMuscleGroup>
){}

async associate(idExercise:string,identification:string){

    const Searchassociate = await this.associateGroupToExerciseRepository.find(
        {
            where:{
                exercise:{id:idExercise},
                muscleGroup:{id:identification}
            }
        }
    )

    if(Searchassociate){
        throw new Error("ya esta asocciado ese grupo muscular a ese ejercicio")
    }
    const associate= await this.associateGroupToExerciseRepository.create({
        exercise:{id:idExercise},
        muscleGroup:{id:identification}
    }
    )
    await this.associateGroupToExerciseRepository.save(associate)
return associate
}
}