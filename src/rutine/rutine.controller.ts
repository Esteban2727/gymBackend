import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RoutineService } from './rutine.service';
import { RoutineDto } from './DTO/routine.dto';
import { UpdateRoutineDto } from './DTO/update-routine.dto';

@Controller('routine')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}
  @Get('routines')
  async getRoutines() {
    const getAllRoutines = await this.routineService.getServiceRoutines();
    return getAllRoutines;
  }
  @Get('routineByName')
  async getRoutineByName(@Query('name') name: string) {
    const routine = await this.routineService.getServiceRoutineByName(name);
    return routine;
  }
  @Delete('delete')
  async deleteRoutine(@Query('name') name: string) {
    const dRoutine = await this.routineService.deleteServiceRoutine(name);
    return dRoutine;
  }
  @Post('createRoutine')
  async createRoutine(@Body() nameDTO: RoutineDto) {
    const { name, description } = nameDTO;
    const routine = await this.routineService.createServiceRoutine(
      name,
      description,
    );
    return routine;
  }
  @Patch('updateRoutine/:id')
  async updateRoutine(
    @Param('id') id: number,
    @Body() updateDto: UpdateRoutineDto,
  ) {
    return this.routineService.updateServiceRoutine(id, updateDto);
  }
  @Get('recover/:id')
  async verificate(@Param('id') id: number) {
    return this.routineService.serviceRecoverRoutine(id);
  }
  @Get('routinesTrainers/:id')
  async getRoutinesTraiers(@Param('id') id: string) {
    const storage = await this.routineService.serviceRoutinesTrainers(id);
    return storage;
  }
}
