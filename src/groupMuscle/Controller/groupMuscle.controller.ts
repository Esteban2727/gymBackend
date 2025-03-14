import { Controller, Get } from "@nestjs/common";
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
}