import { Injectable } from '@nestjs/common';
import cloudinary from '../cloudinary';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    const filename = `${uuid()}.webp`;
    const uploadsDir = path.join(__dirname, '../../../uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const outputPath = path.join(uploadsDir, filename);

    await sharp(file.buffer)
      .resize({
        width: 1024,
        height: 600,
        fit: 'contain',
        position: 'center',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    const result = await cloudinary.uploader.upload(outputPath, {
      folder: 'profile_pics',
    });

    fs.unlinkSync(outputPath);

    return result.secure_url;
  }

  async uploadImageBase64(base64String: string): Promise<string> {
    const filename = `${uuid()}.webp`;
    const uploadsDir = path.join(__dirname, '../../../uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const outputPath = path.join(uploadsDir, filename);

    // Quitar el prefijo de base64 si existe: data:image/png;base64,...
    const matches = base64String.match(/^data:image\/\w+;base64,(.+)$/);
    const base64Data = matches ? matches[1] : base64String;

    // Convertir base64 a buffer
    const imgBuffer = Buffer.from(base64Data, 'base64');

    // Procesar con sharp y guardar
    await sharp(imgBuffer)
      .resize({
        width: 1024,
        height: 600,
       fit: 'contain',
        position: 'center',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    const result = await cloudinary.uploader.upload(outputPath, {
      folder: 'profile_pics',
    });

    fs.unlinkSync(outputPath);

    return result.secure_url;
  }
}
