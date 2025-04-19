import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports:[
        PassportModule,
        ConfigModule,
        TypeOrmModule.forFeature([])
    ],
    controllers:[],
    providers:[]
})
export class PaymentModule{

}