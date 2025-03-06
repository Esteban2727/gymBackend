import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import {  SocketGateway} from '../../gateways/socket.gateway';
import { User } from 'src/auth/entity/user.entity';
import { GymUser } from 'src/gym/gymUser.entity';

@Injectable()
export class DashboardServices {
  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
    @InjectRepository(GymUser)
    private readonly GymUserRepository:Repository<GymUser>,
    private readonly socketGateway :SocketGateway
  ) {}

  async getDatasInformation(value:string){
    console.log(value,111)
    const [user,countGender]= await this.userRepository.findAndCount({where:{gender:value}})
    const searchAllData= await this.userRepository.count()
    const divide= (countGender/searchAllData)*100
    return [`${divide}%`]
  }

  async getDatasinformationActive(id:string){
    const result = await this.GymUserRepository.createQueryBuilder("gymUser")
    .select("gym.id", "gymId")
    .addSelect("gym.name", "gymName")
    .addSelect("COUNT(gymUser.id)", "activeUserCount") 
    .addSelect("json_agg(json_build_object('identification', user.identification, 'username', user.username, 'email', user.email))", "users") // Convertimos los usuarios en JSON
    .innerJoin("gymUser.gym", "gym")
    .innerJoin("gymUser.user", "user")
    .where("gymUser.isActive = :isActive", { isActive: true })
    .groupBy("gym.id")
    .addGroupBy("gym.name") 
    .orderBy("gym.name", "DESC")
    .getRawMany();

return result;
  }

  async UpdateDatasInformation(id: number, stock: number): Promise<any> {
    this.socketGateway.emitProductUpdate();
        return "gola";
  }
}
