import { Body, Controller, Delete, Get, Post } from "@nestjs/common";
import { RoutineService } from "./rutine.service";
import { RoutineDto } from "./DTO/routine.dto";

@Controller("routine")
export class RoutineController{
constructor(
    private readonly  routineService:RoutineService
){}

@Get()
async getRoutine(){

    const getRoutine= await this.routineService.getRoutineOfDatabase()
    return getRoutine
}

@Post("create")
async CreateRoutine(
    @Body() rotineDto:RoutineDto
){

    const {description,name}= rotineDto
    const sendRoutine= await this.routineService.createRoutine(name,description)
    console.log(sendRoutine)
    return sendRoutine
}
@Delete()
async deleteRoutine(){

}
}