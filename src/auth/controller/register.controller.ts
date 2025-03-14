import { Body, Controller, Post } from '@nestjs/common';
import { registerDTO } from '../DTO/register.dto';
import { RegisterService } from '../services/register.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('register')
@ApiTags('Register') 
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new user', description: 'Creates a new user account with the provided details.' })
  @ApiResponse({ status: 201, description: 'User registered successfully', schema: {
    example: {
      id: "123456",
      username: "JohnDoe",
      email: "johndoe@example.com",
      role: "cliente"
    }
  }})
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async register(@Body() registerDto: registerDTO) {
    const { identification, email, cellphone, password, username, rol ,gender} = registerDto;
    const saveDatas = await this.registerService.register(
      identification,
      username,
      email,
      password,
      cellphone,
      rol,
      gender
    );
    console.log("entro");
    return saveDatas;
  }
}
