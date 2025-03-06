import {  Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Gym } from "../gym.entity";
import { Repository } from "typeorm";

@Injectable()
export class gymServices{
constructor(
    @InjectRepository(Gym)
    readonly gymRepository:Repository<Gym>

){

}

async verifyDatasGym(font:string,logoUrl:string,name:string,primaryColor:string,secondaryColor:string){
console.log(name)
const verifyExistringGym=await this.gymRepository.findOne({
    where:[{name:name}]
}
)
if (verifyExistringGym){
    
   return("este gymnasio ya esta registrado")
  
}
console.log(verifyExistringGym,11)
const gym=await this.gymRepository.create({
    font:font,
    logoUrl:logoUrl,
    name:name,
    primaryColor:primaryColor,
    secondaryColor:secondaryColor
})
 await this.gymRepository.save(gym)
 return false
}




}