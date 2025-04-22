import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../services/upload.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import * as multer from 'multer';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('single/:userId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
     
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Formato inválido'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Subir imagen de perfil' })
  @ApiResponse({ status: 201, description: 'Imagen subida con éxito' })
  @ApiResponse({ status: 400, description: 'Archivo inválido o muy grande' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') userId: string,
  ) {
    if (!file) {
      throw new BadRequestException('No se recibió archivo');
    }

    const imageUrl = await this.uploadService.uploadImage(file);

    // Aquí puedes actualizar la base de datos si lo necesitas:
    // await this.userService.updateProfilePicture(userId, imageUrl);

    return {
      message: 'Imagen subida correctamente',
      imageUrl,
    };
  }
}
