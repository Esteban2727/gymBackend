import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { Repository } from "typeorm";
import {comparePasswords} from '../bycript/bycript'

export class loginServices{
 constructor(
    @InjectRepository(User)
    readonly userRepository:Repository<User>
 ){}

 async sign_In(email:string,password:string){

const verifyEmail= await this.userRepository.findOne({
    where:[{email:email}],
    select:['password']
 })
const compare=await comparePasswords(password,verifyEmail.password)
return compare

 } 

 
}