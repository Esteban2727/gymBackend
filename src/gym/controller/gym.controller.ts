import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GymDto } from '../DTO/gym.dto';
import { gymServices } from '../services/gym.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateGymDto } from '../DTO/createGym.dto';

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
    const { font, logoUrl, name, primaryColor, secondaryColor } = gymDto;
    const VerifyGym = await this.gymServices.verifyDatasGym(
      font,
      logoUrl,
      name,
      primaryColor,
      secondaryColor,
    );
    if (!VerifyGym) {
      return { message: 'Gym created successfully' };
    }
    return VerifyGym;
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

  @Post("create")
  async CreateGym(@Body() createGymDto: CreateGymDto) {
    const {
      cellphone,
      email,
      gender,
      identification,
      nameAdministrador,
      password,
    } = createGymDto;

    const createUserGym = await this.gymServices.CreateUserAdministrator(
      cellphone,
      email,
      gender,
      identification,
      nameAdministrador,
      password,
    );

    return createUserGym
  }
}
