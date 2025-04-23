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

<<<<<<< HEAD
=======
}

>>>>>>> e6932aca90728ec3bfd64506d557337e1f38e5d1



}