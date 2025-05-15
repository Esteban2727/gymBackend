import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/JwtAutentication.guard';
import { CustomerService } from '../services/customer.service';
import { SessionUser } from 'src/decorator/session-user.decorator';
import { Roles } from 'src/decorator/roles.decorator';
import { rolEnum } from 'src/enum/rol.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { registerDTO } from 'src/auth/DTO/register.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { updateDto } from '../update.dto';
import { GymGuard } from 'src/guards/gym.guard';

@Controller('customer')
@ApiTags('Customer')
export class CustomerController {
  constructor(private readonly CustomerService: CustomerService) {}

  @Post('create')
  @Roles(rolEnum.administrador)
  @UseGuards(AuthGuard, RolesGuard, GymGuard)
  async CreateCustomer(@Body() userdto: registerDTO) {
    const {
      cellphone,
      email,
      gender,
      identification,
      password,
      username,
      idgym,
    } = userdto;
    const sendDataToService = await this.CustomerService.createCustomer(
      cellphone,
      email,
      gender,
      identification,
      password,
      username,
      idgym,
    );
    console.log(sendDataToService);
    return sendDataToService;
  }
  @Get(':id')
  @Roles(rolEnum.customer)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get customer by ID',
    description: 'Retrieve customer details by their identification number.',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer found',
    schema: {
      example: {
        id: '123456',
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '123-456-7890',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async GetCustomer(@Param('id') id: string) {
    return await this.CustomerService.GetCustomerById(id);
  }

  @Get()
  @Roles(rolEnum.administrador)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get user session data',
    description: 'Retrieve session data of the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User session data',
    schema: {
      example: {
        id: '123456',
        name: 'John Doe',
        role: 'cliente',
      },
    },
  })
  async GetDatasProfile(@SessionUser() user: any) {
    return user;
  }

  @Delete('delete/:id')
  @Roles(rolEnum.administrador)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteCustomer(@Param('id') id: string) {
    console.log(id);
    const deleteCustomer = await this.CustomerService.deleteCustomer(id);
    console.log(deleteCustomer);

    return deleteCustomer;
  }

  @Patch('updateData/:id')
  @Roles(rolEnum.administrador)
  @UseGuards(AuthGuard, RolesGuard)
  async updateDataCustomer(
    @Param('id') id: string,
    @Body() updateDto: updateDto,
  ) {
    const { cel, username } = updateDto;
    return await this.CustomerService.updateData(id, cel, username);
  }
}
