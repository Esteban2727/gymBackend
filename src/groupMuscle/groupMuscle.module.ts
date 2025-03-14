import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MuscleGroup } from "./Entity/muscleGroup.entity";
import { GroupuMuscleController } from "./Controller/groupMuscle.controller";
import { GroupMuscleServices } from "./services/gropuMuscle.Service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports:[
        PassportModule,
        JwtModule.register({
            secret: "hola", 
        signOptions: { expiresIn: '2h' },
        }),
        TypeOrmModule.forFeature([MuscleGroup])
    ],
    controllers:[GroupuMuscleController],
    providers:[GroupMuscleServices]
}
)
export class groupMuscleModule{}