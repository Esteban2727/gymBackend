import { 
    Controller, 
    Post, 
    UseInterceptors, 
    UploadedFile, 
    BadRequestException, 
    Param 
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  import { UserService } from '../../user/services/user.service'; 
  
  @Controller('upload')
  export class UploadController {
    constructor(private readonly userService: UserService) {} 
  
    @Post('single/:userId') 
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads', 
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
          },
        }),
        fileFilter: (req, file, cb) => {
          if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
            return cb(new BadRequestException(' Solo imágenes JPG, PNG, GIF o WEBP son permitidas'), false);
          }
          cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 }, 
      }),
    )
    async uploadSingle(@UploadedFile() file: Express.Multer.File, @Param('userId') userId: string) {
      if (!file) {
        throw new BadRequestException('❌ No se recibió ningún archivo');
      }
  
      
      const imageUrl = `http://localhost:3001/uploads/${file.filename}`;
      await this.userService.updateProfilePicture(userId, imageUrl);
  
      return { 
        message: ' Imagen de perfil actualizada',
        imageUrl
      };
    }
  }
  