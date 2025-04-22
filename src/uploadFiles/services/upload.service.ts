import { Injectable } from '@nestjs/common';
import cloudinary from '../cloudinary';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    const filename = `${uuid()}.webp`;
    const outputPath = path.join(__dirname, '../../../uploads', filename);

    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }

    // Guardar la imagen en el sistema de archivos sin compresión
    fs.writeFileSync(outputPath, file.buffer);

    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(outputPath, {
      folder: 'profile_pics',
    });

    // Eliminar la imagen local después de subirla
    fs.unlinkSync(outputPath);

    return result.secure_url;
  }
}
