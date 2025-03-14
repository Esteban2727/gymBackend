import {validateDatasMessages} from "../messages/messages"
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, isString, IsString } from 'class-validator';

export class ExerciseDto{
@IsNotEmpty({ message: validateDatasMessages.name.isNotEmpty })

 @IsString({message:validateDatasMessages.name.isString})
 readonly name:string

 @IsNotEmpty({ message: validateDatasMessages.description.isNotEmpty })
 @IsString({message:validateDatasMessages.description.isString})

 readonly description:string


 @IsNotEmpty({ message: validateDatasMessages.difficulty_level.isNotEmpty })
 @IsString({message:validateDatasMessages.difficulty_level.isString})
 readonly difficulty_level:string


 @IsNotEmpty({ message: validateDatasMessages.equipment.isNotEmpty })
 @IsString({message:validateDatasMessages.equipment.isString})

 readonly equipment:string

}