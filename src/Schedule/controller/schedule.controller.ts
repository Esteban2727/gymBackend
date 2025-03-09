import { Controller, Get, Param, Post } from "@nestjs/common";
import { ScheduleServices } from "../services/schedule.service";

@Controller('')
export class ScheduleController{
    constructor(
        private readonly schenduleServices:ScheduleServices
    ){}

@Get(':id')
async schenduleUser(
    @Param('id') id:string
){
    const getSchendule=await this.schenduleServices.getSchenduleServices(id)
console.log(getSchendule)
    return getSchendule
}
}