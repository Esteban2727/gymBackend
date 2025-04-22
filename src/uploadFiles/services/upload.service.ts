import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import cloudinary from '../cloudinary';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  async compressAndUpload(file: Express.Multer.File): Promise<string> {
    const filename = `${uuid()}.webp`;
    const outputPath = path.join(__dirname, '../../../uploads', filename);

    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }

    // Comprimir imagen
    await sharp(file.buffer)
      .resize(800)
      .webp({ quality: 70 })
      .toFile(outputPath);

    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(outputPath, {
      folder: 'profile_pics',
    });

    fs.unlinkSync(outputPath);
  
    return result.secure_url;
  }
}
