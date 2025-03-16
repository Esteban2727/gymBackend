import { Controller, Get, Post } from "@nestjs/common";
import { ExerciseGroupMuscularServices } from "../services/exerciseGroupMuscular.service";

@Controller("groupMuscle")
export class ExerciseGroupMuscularController {
constructor(
    private readonly ExerciseGroupMuscularServices:ExerciseGroupMuscularServices
){}

@Get()
async getGroupMuscular(){
    const getDataGroupMuscular= await this.ExerciseGroupMuscularServices.getAllDatasGroupMuscular()
    console.log(getDataGroupMuscular)
    return getDataGroupMuscular
}


}