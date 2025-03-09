import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Schedule } from "../Entity/schedule.entity";
import { Repository } from "typeorm";

@Injectable()
export class ScheduleServices{
constructor(
@InjectRepository(Schedule)
readonly scheduleRepository:Repository<Schedule>
){}

async getSchenduleServices(id:string){
    console.log(id)
const searchDataSchendule= await this.scheduleRepository.find({
    where:{user:{identification:id}},
    relations:['user'],
    select:["date","attended"]
})

return searchDataSchendule
}

}