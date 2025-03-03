import { Body, Controller, Post } from '@nestjs/common';
import { registerDTO } from '../DTO/register.dto';
import { RegisterService } from '../services/register.service';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}
  @Post('')
  async register(@Body() registerDto: registerDTO) {
    
    const { identification ,email, cellphone, password, username, rol } = registerDto;
    const saveDatas = await this.registerService.register(
      identification,
      username,
      email,
      password,
      cellphone,
      rol
    );
   
    return saveDatas;
  }
}
