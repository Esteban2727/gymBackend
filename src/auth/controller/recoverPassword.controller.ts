import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { RecoverPasswordServices } from '../services/recoverPassword.service';
import { LoginDto } from '../DTO/login.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@Controller('recover-password')
@ApiTags('Recover Password') // Define una categoría en Swagger
export class RecoverPasswordController {
  constructor(
    private readonly recoverPasswordServices: RecoverPasswordServices,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Request password recovery',
    description: 'Sends a password recovery email to the user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Recovery email sent',
    schema: {
      example: { message: 'Recovery email sent successfully' },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid email' })
  async recoverPass(@Body() loginDto: LoginDto) {
    console.log('paso por el controller');
    const { email } = loginDto;
    return this.recoverPasswordServices.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset user password',
    description: 'Resets user password using a valid token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
    schema: {
      example: { message: 'Password has been reset successfully' },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid or missing token' })
  async resetPassword(
    @Query('token') token: string,
    @Body() password: LoginDto,
  ) {
    if (!token) {
      throw new BadRequestException('Token es requerido');
    }
    const datas = await this.recoverPasswordServices.resetPassword(
      token,
      password.password,
    );
    return datas;
  }
}
