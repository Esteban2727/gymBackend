import { Body, Controller, Get, Post } from "@nestjs/common";
import { GroupMuscleServices } from "../services/gropuMuscle.Service";

@Controller("group")
export class GroupuMuscleController{
constructor(
    private readonly gropuMuscleServices: GroupMuscleServices

){}

@Get()
async getGroupMuscle(){
const getDataMuscle= await this.gropuMuscleServices.getDatasMuscle()
return getDataMuscle
}


@Post()
async createGroupMuscle(
  @Body() name:string
){

 const createGroupMuscle= await this.gropuMuscleServices.createGroupMuscle( name)
 console.log(createGroupMuscle)
 return "create succefully"
}


}