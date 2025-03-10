import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Schedule } from "../Entity/schedule.entity";
import { Repository } from "typeorm";
import { User } from "src/auth/entity/user.entity";

@Injectable()
export class ScheduleServices {
    constructor(
        @InjectRepository(Schedule)
        private readonly scheduleRepository: Repository<Schedule>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async saveDate(userId: string) {
        const user = await this.userRepository.findOne({ where: { identification: userId } });

        if (!user) {
            throw new NotFoundException("Usuario no encontrado.");
        }

        const newSchedule = this.scheduleRepository.create({
            date: new Date(),
            user: user,
        });

        return await this.scheduleRepository.save(newSchedule);
    }

    async getScheduleByUserId(userId: string) {
        console.log("entro")
        const schedules = await this.scheduleRepository.find({
            where: { user: { identification: userId } },
            relations: ['user'],
            select: ["date", "attended"]
        });
        console.log(schedules)

        if (!schedules.length) {
            throw new NotFoundException("No hay asistencias registradas para este usuario.");
        }

        return schedules;
    }
}
