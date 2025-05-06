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
}
