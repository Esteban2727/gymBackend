import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { validateDatasMessages } from "src/messages/messages"

export class RoutineDto{

      @IsNotEmpty({ message: validateDatasMessages.name.isNotEmpty })
       
         @IsString({message:validateDatasMessages.name.isString})
         readonly name:string
        
         @IsNotEmpty({ message: validateDatasMessages.description.isNotEmpty })
         @IsString({message:validateDatasMessages.description.isString})
         readonly description:string
        
        @IsOptional()
         @IsNotEmpty({ message: validateDatasMessages.is_active.isNotEmpty })
         @IsBoolean({message:validateDatasMessages.is_active.isBoolean})
         readonly is_active:boolean
        
        

        
       
}