import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TrainerServices } from './trainer.service';
import { TrainerDto } from './trainer.dto';
import { AuthGuard } from 'src/guards/JwtAutentication.guard';
import { Request } from 'express';
import { updateDto } from 'src/customer/update.dto';

@Controller('trainer')
export class TrainerController {
  constructor(private readonly trainerServices: TrainerServices) {}

  @Get()
  @UseGuards(AuthGuard)
  async getDataTrainer() {
    const bringData = await this.trainerServices.getDataTrainer();
    console.log(bringData);
    return bringData;
  }

  @Post('create')
  @UseGuards(AuthGuard)
  async createTrainer(@Body() trainerDto: TrainerDto, @Req() req: Request) {
    const {
      cellphone,
      email,
      gender,
      identification,
      password,
      username,
      certifications,
      yearExperience,
      idGym,
    } = trainerDto;
    const saveTrainer = await this.trainerServices.createTrainer(
      cellphone,
      email,
      gender,
      identification,
      password,
      username,
      certifications,
      yearExperience,
      idGym,
    );
    return saveTrainer;
  }
  @Patch(':identification')
  async updateTrainer(
    @Param('identification') identification: string,
    @Body() updateData: TrainerDto,
  ) {
    return await this.trainerServices.updateInformationTrainer(
      identification,
      updateData,
    );
  }

  @Get('get/:id')
  @UseGuards(AuthGuard)
  async getDataTrainerByGym(@Param('id') id: string) {
    const bringData = await this.trainerServices.getDataTrainerByGym(id);
    console.log(bringData);
    return bringData;
  }

  @Get('assign/:idCustomer/:idTrainer')
  async assignUserToTrainer(@Param() id: string[]) {
    return await this.trainerServices.assignTrainer(id);
  }
  @Get('info/:id')
  async getInformationTrainer(@Param('id') id: string) {
    return await this.trainerServices.getTrainerById(id);
  }

  @Get('customerAssigned/:id')
  async customerAssignedToTrainer(@Param('id') id: string) {
    return await this.trainerServices.getCustomersAssigned(id);
  }

  @Patch('updateData/:id')
  async updateDataTrainer(
    @Param('id') id: string,
    @Body() updateDto: updateDto,
  ) {
    const { cel, username } = updateDto;
    return await this.trainerServices.updateData(id, cel, username);
  }

  

}
