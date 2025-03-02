import {validateDatasMessages} from "../../messages/messages"
import { IsEmail, IsNotEmpty, IsNumber, isString, IsString } from 'class-validator';

export class registerDTO{
@IsNotEmpty({ message: validateDatasMessages.email.isNotEmpty })
 @IsEmail({},{message:validateDatasMessages.email.isEmail})
 @IsString({message:validateDatasMessages.email.isString})
 readonly email:string

 @IsNotEmpty({ message: validateDatasMessages.password.isNotEmpty })
 @IsString({message:validateDatasMessages.password.isString})
 @IsString({message:validateDatasMessages.password.isPasswordlength})
 readonly password:string


 @IsNotEmpty({ message: validateDatasMessages.cellphone.isNotEmpty })
 @IsString({message:validateDatasMessages.cellphone.isCellphone})
 readonly cellphone:string


 @IsNotEmpty({ message: validateDatasMessages.email.isNotEmpty })
 @IsString({message:validateDatasMessages.username.isUsername})
 @IsString({message:validateDatasMessages.email.isString})
 readonly username:string

 @IsNotEmpty({ message: validateDatasMessages.rol.isNotEmpty })
 @IsString({message:validateDatasMessages.rol.typeRol})
 readonly rol:string

 @IsNotEmpty({ message: validateDatasMessages.identification.isNotEmpty })
 @IsString({message:validateDatasMessages.identification.isString})
 readonly identification:string
}