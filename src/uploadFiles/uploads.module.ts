import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './controller/upload.controller';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserModule } from '../user/user.module';
import { UploadService } from './services/upload.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
    UserModule,
  ],
  controllers: [UploadController],
  providers:[UploadService]
})
export class UploadsModule {}
