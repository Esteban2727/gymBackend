import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Trainer } from "./trainer.entity";
import { TrainerController } from "./trainer.controller";
import { TrainerServices } from "./trainer.service";
import { GymUser } from "src/gym/gymUser.entity";
import { User } from "src/auth/entity/user.entity";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";


@Module({
    imports:[
        PassportModule,
        JwtModule.register({
              secret: "hola",
              signOptions: { expiresIn: "2h" },

        }),
        TypeOrmModule.forFeature([Trainer,GymUser,User])
    ],
    controllers:[TrainerController],
    providers:[TrainerServices]
})
export class TrainerModule{}