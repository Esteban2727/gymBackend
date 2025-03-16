import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Exercise } from "../Entity/exercise.entity";
import { Repository } from "typeorm";

@Injectable()
export class ExerciseServices{
constructor(
    @InjectRepository(Exercise)
    readonly exerciseRepository:Repository<Exercise>
){}

async getExercises(){

    return this.exerciseRepository.find()
    
}
async CreateExercise(description:string,difficulty_level:string,equipment:string,nameExercise:string){
 const createExerciseInDatabase= await this.exerciseRepository.create({
    description:description,
    difficulty_level:difficulty_level,
    equipment:equipment,
    is_active:true,
    name:nameExercise,
 })
await this.exerciseRepository.save(createExerciseInDatabase)
 return "created succefully"
}

async deleteAll(){

    const deleteExercise= await this.exerciseRepository.find()

    if(deleteExercise){
         await this.exerciseRepository.softRemove(deleteExercise)
    }

}

async deleteOneExcercise(idExercise:string){
    
const deleteOneExerciseDatabase= await this.exerciseRepository.findOne(
    {
        where:{id:idExercise}
    }
)
if(deleteOneExerciseDatabase){
    const deletes = await this.exerciseRepository.findOne(
        {
            where:{id:idExercise}
        }
    )
    await this.exerciseRepository.softRemove(deletes)
    return "deleted"
}
return "dont exist that exercise "

}


}