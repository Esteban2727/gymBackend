import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('user') 
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  
  @Patch(':id/profile-picture')
  async updateProfilePicture(@Param('id') id: string, @Body('imageUrl') imageUrl: string) {
    return await this.userService.updateProfilePicture(id, imageUrl);
  }
}
