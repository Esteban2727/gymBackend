import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Delete,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/uploadFiles/services/upload.service';
import * as multer from 'multer';
import { AdminDto } from '../adminDto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
  ) {}

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Get()
  async allUser() {
    return await this.userService.getAllUser();
  }

  @Patch(':id/profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Formato inválido'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async updateProfilePicture(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('imageBase64') imageBase64: string,
  ) {
    let imageUrl: string;

    if (file) {
      // Caso archivo subido vía multipart/form-data
      imageUrl = await this.uploadService.uploadImage(file);
    } else if (imageBase64) {
      // Caso imagen enviada como Base64 en el body JSON
      imageUrl = await this.uploadService.uploadImageBase64(imageBase64);
    } else {
      throw new BadRequestException(
        'Debes enviar la imagen como archivo o Base64 en el body',
      );
    }

    // Actualizar la imagen de perfil en BD
    return await this.userService.updateProfilePicture(id, imageUrl);
  }

  @Patch('activate/:id')
  async activate(@Param('id') id: string) {
    return await this.userService.activateCustomerAndTrainer(id);
  }

  @Delete('deleteAll/:id')
  async delete(@Param('id') id: string) {
    return await this.userService.softRemoveCustomerAndTrainer(id);
  }

  @Get('userProfile/:id')
  async getDataByUser(@Param('id') id: string) {
    return await this.userService.getAllUserByGym(id);
  }

  @Patch('update/:id/:idGym')
  async UpdateDataUser(
    @Param('id') id: string,
    @Param('idGym') idGym: string,
    @Body() adminDto: AdminDto,
  ) {
    return await this.userService.UpdateuserGym(id, adminDto, idGym);
  }
}
