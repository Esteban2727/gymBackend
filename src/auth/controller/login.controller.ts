import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { Request } from 'express';
import { loginServices } from '../services/login.service';
import { LoginDto } from '../DTO/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('login')
export class LoginController {
  constructor(private readonly loginServices: loginServices) {}
  @ApiTags('lOGIN - POST')
  @Post()
  @ApiOperation({
    summary: 'Authenticate user',
    description:
      'Compares email and password to authenticate a user and returns an access token and refresh token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    schema: {
      example: {
        message: 'Login successful',
        user: {
          id: '123456',
          email: 'user@example.com',
          rol: 'admin',
        },
        access_token: 'eyJhbGciOiJI...',
        refresh_token: 'eyJhbGciOiJI...',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid email or password' })
  @ApiOperation({ summary: 'compare Email and password of a User' })
  async compareEmail(@Body() loginDto: LoginDto, @Req() req: Request) {
    const { email, password } = loginDto;

    console.log(req.cookies, 111);
    console.log(email, password);
    const user = await this.loginServices.sign_In(email, password);

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const { access_token, refresh_token } =
      await this.loginServices.generateToken(user);

    req.session.user = {
      username: user.username,
      id: user.identification,
      email: user.email,
      accessToken: access_token,
      refreshToken: refresh_token,
      rol: user.rol,
    };

    return {
      message: 'Login successful',
      user: {
        id: user.identification,
        email: user.email,
        rol: user.rol,
      },
      access_token,
      refresh_token,
    };
  }

  @Get()
  async probandoGet() {
    console.log('funcionando');
    return 'si funcion';
  }
}
