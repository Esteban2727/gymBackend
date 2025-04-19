import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class  PaymentService{

    constructor(
        @InjectRepository(User)
        readonly paymentRepository:Repository<User>
    ){

    }

    async getPaymentServices(){

        const searchInDatabase= await this. paymentRepository.find()

        return searchInDatabase
    }
}