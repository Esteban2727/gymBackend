import { Controller, Get, Param, Patch, Body, Delete } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Get()
  async allUser() {
    return await this.userService.getAllUser();
  }

  @Patch(':id/profile-picture')
  async updateProfilePicture(
    @Param('id') id: string,
    @Body('imageUrl') imageUrl: string,
  ) {
    return await this.userService.updateProfilePicture(id, imageUrl);
  }

  @Get(':id')
  async activateUser(@Param('id') id: string) {
    return await this.userService.activateUser(id);
  }
}
