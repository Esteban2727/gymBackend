import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GymDto } from '../DTO/gym.dto';
import { gymServices } from '../services/gym.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateGymDto } from '../DTO/createGym.dto';
import path from 'path';

@Controller('gym')
@ApiTags('Gym')
export class GymController {
  constructor(private readonly gymServices: gymServices) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new gym',
    description: 'Saves a new gym with the provided details.',
  })
  @ApiResponse({
    status: 201,
    description: 'Gym created successfully',
    schema: {
      example: { message: 'Gym created successfully' },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid gym data' })
  async SaveGYM(@Body() gymDto: GymDto) {
    const { logo, name, primary, secondary } = gymDto;
    const VerifyGym = await this.gymServices.verifyDatasGym(
      logo,
      name,
      primary,
      secondary,
    );
    if (!VerifyGym) {
      return { message: 'Gym created successfully' };
    }
    return VerifyGym;
  }

  @Patch(':id')
  async changeValuesGym(@Param('id') id: string, @Body() gymDto: GymDto) {
    const { logo, primary, secondary, third, fourth, fontFamily } = gymDto;
    const changeValuesOfGym = await this.gymServices.changeGym(
      id,
      logo,
      primary,
      secondary,
      third,
      fourth,
      fontFamily,
    );
    return changeValuesOfGym;
  }

  @Delete('delete/:id')
  async deleteGym(@Param('id') id: string) {
    const deleteGym = await this.gymServices.deleteGymServices(id);
    return deleteGym;
  }

  @Get('lookDeleted')
  async lookDeleted() {
    const lookDeletedGym = await this.gymServices.getDeletedGym();
    return lookDeletedGym;
  }

  @Get('getGym')
  async getGym() {
    const getActiveGym = await this.gymServices.getActiveGym();
    return getActiveGym;
  }

  @Get('getGym/:id')
  async getGymById(@Param('id') id: string) {
    const getActiveGymByid = await this.gymServices.getActiveGymByid(id);
    return getActiveGymByid;
  }

  @Post('create')
  async CreateGym(@Body() createGymDto: CreateGymDto) {
    const {
      cellphone,
      email,
      gender,
      identification,
      nameAdministrador,
      password,
      nombreGym,
    } = createGymDto;

    const createUserGym = await this.gymServices.CreateUserAdministrator(
      cellphone,
      email,
      gender,
      identification,
      nameAdministrador,
      password,
      nombreGym,
    );

    return createUserGym;
  }
}
