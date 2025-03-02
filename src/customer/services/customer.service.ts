import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/entity/user.entity";
import { Repository } from "typeorm";

export class CustomerService{
constructor(
    @InjectRepository(User)
    readonly userReposotory: Repository<User>
){}
async GetCustomerById(ident:string){

    
    const bringDatas = await this.userReposotory.find(
        {   where:{identification:'1109114799'}
    }
    )
    console.log(bringDatas,1132)
    return bringDatas
}
}