import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MuscleGroup } from "./Entity/muscleGroup.entity";
import { GroupuMuscleController } from "./Controller/groupMuscle.controller";
import { GroupMuscleServices } from "./services/gropuMuscle.Service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
      imports: [
        ConfigModule.forRoot(), // Carga las variables de entorno
        PassportModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '2h' },
          }),
        }),
        TypeOrmModule.forFeature([MuscleGroup])
    ],
    controllers:[GroupuMuscleController],
    providers:[GroupMuscleServices]
}
)
export class groupMuscleModule{}