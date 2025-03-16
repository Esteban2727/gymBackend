import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ExerciseServices } from "../services/exercise.service";
import { ExerciseDto } from "../exerciseDto";

@Controller("")
export class ExcerciseController{
constructor(
    private readonly exerciseServices:ExerciseServices
){}

@Get()
async getExcercises(){
    const exercisesDataGym= await this.exerciseServices.getExercises()
    return exercisesDataGym
}

@Post()
async createExercise(
    @Body()exerciseDto:ExerciseDto
   
){
    const {description,difficulty_level,equipment,name}= exerciseDto
    const createDatasExercise= await this.exerciseServices.CreateExercise(description,difficulty_level,equipment,name)
 return createDatasExercise
}

@Delete("delete")

async deleteExercise(){
    const deleteAllExercise= await this.exerciseServices.deleteAll()
    return deleteAllExercise
}

@Delete("delete/:id")

async deleteExerciseAssigned (
@Param("id") id : string
){
    const deleteOneExercise = await this.exerciseServices.deleteOneExcercise(id)
console.log(deleteOneExercise)
    return deleteOneExercise
}
}