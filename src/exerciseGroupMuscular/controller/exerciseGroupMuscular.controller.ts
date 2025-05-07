import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { ExerciseGroupMuscularServices } from "../services/exerciseGroupMuscular.service";
import { GroupMuscularDTO } from "../groupMuscularDTO";
import { DeleteDateColumn } from "typeorm";

@Controller("groupMuscle")
export class ExerciseGroupMuscularController {
    constructor(private readonly exerciseGroupMuscularService: ExerciseGroupMuscularServices) {
        
    }
@Get('getGroupMuscle')
async getGrouoMuscle() {
    const ExerciseGroupMuscularServices = await this.exerciseGroupMuscularService.getGroupMuscularServices();
    return ExerciseGroupMuscularServices

}
@Get('groupMuscleByName')
async getGroupByName(
    @Query('name') name: string
) {
    if (!name) {
        // Si no se proporciona el parámetro 'name', devolver todos los grupos musculares
        return await this.exerciseGroupMuscularService.getGroupMuscularServices();
    }
    // Si se proporciona 'name', buscar el grupo muscular por nombre
    return await this.exerciseGroupMuscularService.findByName(name);
}
@Post('create')
async createGroup(@Body() nameDTO: GroupMuscularDTO) {
    const {name} = nameDTO
    console.log(name)
    const p = await this.exerciseGroupMuscularService.createGroup(name)
    console.log(p)
    return p
}
@Delete('deleteByName')                 //endpoint para soft delete
async deleteByName(@Query('name') name: string) {
    const result = await this.exerciseGroupMuscularService.softDeleteBtName(name)   
    return result
} 

}