import {validateDatasMessages} from "../messages/messages"
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, isString, IsString } from 'class-validator';

export class GroupMuscularDTO{
@IsNotEmpty({ message: 'el campo del nombre no puede estar vacio' })

 @IsString({message:'este nombre no es un strim'})
 readonly name:string


}