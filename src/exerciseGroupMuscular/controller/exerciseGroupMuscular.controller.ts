import { Controller, Get, Post } from "@nestjs/common";
import { ExerciseGroupMuscularServices } from "../services/exerciseGroupMuscular.service";

@Controller("groupMuscle")
export class ExerciseGroupMuscularController {
    constructor(private readonly exerciseGroupMuscularService: ExerciseGroupMuscularServices) {
        
    }
@Get('getGroupMuscle')
async getGrouoMuscle() {
    const ExerciseGroupMuscularServices = await this.exerciseGroupMuscularService.getGroupMuscularServices();
    return ExerciseGroupMuscularServices



}
}