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
import { RoutineCreateDto } from './RoutineCreateDto';

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
  @Delete('delete/:id')
  async deleteRoutine(@Param('id') id: string) {
    const dRoutine = await this.routineService.deleteServiceRoutine(id);
    return dRoutine;
  }
  @Post('createRoutine/:id')
  async createRoutine(@Body() nameDTO: RoutineDto, @Param('id') id: string) {
    const { name, description } = nameDTO;
    const routine = await this.routineService.createServiceRoutine(
      name,
      description,
      id,
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

  @Get('routineTrainerById/:id')
  async getRoutineById(@Param('id') id: string) {
    return await this.routineService.getTrainerWithRoutine(id);
  }

  @Get('getAllRoutine/:id')
  async getAllRoutine(
    @Query('type') type: string,
    @Query('muscle') muscle: string,
    @Query('level') level: string,
    @Param('id') id: string,
  ) {
    console.log(id);
    return await this.routineService.getAllRoutine(id, type, muscle, level);
  }

  @Post('createRutuine/:id')
  async createRutine(
    @Body() rutineDto: RoutineCreateDto,
    @Param('id') id: string,
  ) {
    await this.routineService.createRoutine(rutineDto, id);
  }

  @Get('bringAllRoutine/:id')
  async bringRoutine(@Param('id') id: string) {
    console.log(id);
    return await this.routineService.bringRoutine(id);
  }
}
