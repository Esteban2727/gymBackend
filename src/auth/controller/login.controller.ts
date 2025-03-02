import { Body, Controller, Post, Req, UseGuards, BadRequestException } from "@nestjs/common";
import { Request } from "express";
import { loginServices } from "../services/login.service";
import { LoginDto } from "../DTO/login.dto";

@Controller('login')
export class LoginController {
  constructor(
    private readonly loginServices: loginServices
  ) {}

  @Post()
  async compareEmail(@Body() loginDto: LoginDto, @Req() req: Request) {
    const { email, password } = loginDto;

    // Verificar usuario
    const user = await this.loginServices.sign_In(email, password);
    
    if (!user) {
      throw new BadRequestException("Invalid email or password");
    }

   
    const { access_token, refresh_token } = await this.loginServices.generateToken(user)
   
    req.session.user = {
      username:user.username,
      id:user.identification,
      email: user.email,
      accessToken: access_token,
      refreshToken: refresh_token,
      rol: user.rol
    };

    return {
      message: "Login successful",
      user: {
        id: user.identification,
        email: user.email,
        rol: user.rol
      },
      access_token,
      refresh_token
    };
  }
}
