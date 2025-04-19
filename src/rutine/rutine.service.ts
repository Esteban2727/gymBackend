import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Routine } from "./rutine.entity";

@Injectable()
export class RoutineService{
constructor(
    @InjectRepository(Routine)
    readonly  routineRepository : Repository<Routine>
){}

async getRoutineOfDatabase(){

const bringDataRoutine=await this.routineRepository.find()
return bringDataRoutine
}

async createRoutine(
    description:string,
   
    name:string
){

    const searchRoutine= await this.routineRepository.findOne({
        where:{
            description:description,
            name:name
        }
    })
    if(searchRoutine){
        return "exist that routine already"
    }
    const createRoutineInDatabase= await this.routineRepository.create({
        description:description,
        is_active:true,
        name:name
    })

    await this.routineRepository.save(createRoutineInDatabase)

    return "creatd succefully"
}
}