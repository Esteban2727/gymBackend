import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { ExerciseGroupService } from "./exercise.service";
import { ExerciseDto } from "./exerciseDto";


@Controller()
export class ExerciseController {
    constructor(private readonly exerciseGroupService: ExerciseGroupService) {
        
    }
@Get('exercises')
async exerciseGroup() {
    const getExerciseGroup = await this.exerciseGroupService.getExerciseService()
    return getExerciseGroup
}
@Post('create')
async createExercise(@Body() nameDTO: ExerciseDto) {
    const {name,description,difficulty_level,equipment} = nameDTO
    
    const p = await this.exerciseGroupService.createExerciseService(name,description,difficulty_level,equipment)
    return p 
}
@Delete('delete')
async deleteExercise(@Query('name') name: string) {
    const result = await this.exerciseGroupService.deleteExerciseService(name)
    return result
}
@Get('exercisebyName')
async getExerciseByName(@Query('name') name: string) {
    const find = await this.exerciseGroupService.findByNameExersiceService(name)
    return find
}
}