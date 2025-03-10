import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Schedule } from "./Entity/schedule.entity";
import { ScheduleController } from "./controller/schedule.controller";
import { ScheduleServices } from "./services/schedule.service";
import { User } from "src/auth/entity/user.entity";


@Module({
    imports:[
        PassportModule,
        JwtModule.register({
            secret: "hola",
            signOptions: { expiresIn: "2h" },
        }),
        TypeOrmModule.forFeature([Schedule,User])
    ],
    controllers:[ScheduleController],
    providers:[ScheduleServices]
})

export class ScheduleModuleAttended{}