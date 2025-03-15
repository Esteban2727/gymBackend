import { Body, Controller, Post } from "@nestjs/common";
import { AssociateGropuMusculeToExerciseService } from "../services/AssociateGropuMusculeToExercise.service";

@Controller("associateGroupMuscle")
export class AssociateGropuMusculeToExerciseController{
constructor(
    private readonly associateGropuMusculeToExerciseService:AssociateGropuMusculeToExerciseService
){


}
@Post()
async associateToExercise(
    @Body() value :string,identification:string
){
const sendDataForAssociate = await this.associateGropuMusculeToExerciseService.associate(
    value,identification
)

return sendDataForAssociate
}
}
