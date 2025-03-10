import { Controller, Get, Param, Post, HttpException, HttpStatus, BadRequestException } from "@nestjs/common";
import { ScheduleServices } from "../services/schedule.service";

@Controller('schedule') 
export class ScheduleController {
    constructor(private readonly scheduleServices: ScheduleServices) {}

    @Post(':id')
    async saveSchedule(@Param('id') id: string) {
        
            const savedSchedule = await this.scheduleServices.saveDate(id);
            return { message: "Asistencia registrada con éxito", data: savedSchedule };

    }

    @Get(':id')
    async getSchedule(@Param('id') id: string) {
        console.log(id)
     
            const scheduleData = await this.scheduleServices.getScheduleByUserId(id);
            console.log(scheduleData)
            return { message: "Historial de asistencias", data: scheduleData };
      
    }
}
