import { Injectable } from '@nestjs/common';
import { InformationDto } from '../DTO/information.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InformationEmail } from '../entity/emailInformation.entity';
import { Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class InformationEmailServices {
  constructor(
    @InjectRepository(InformationEmail)
    private readonly informationEmailRepository: Repository<InformationEmail>,
    private readonly mailservices: MailService,
  ) {}

  async createInformation(
    informationDto: InformationDto,
  ): Promise<{ message: string }> {
    await this.informationEmailRepository
      .createQueryBuilder()
      .insert()
      .into(InformationEmail)
      .values({
        email: informationDto.email,
        message: informationDto.message,
        name: informationDto.name,
      })
      .execute();
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Nuevo mensaje de contacto</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f4f6f8;
            margin: 0;
            padding: 0;
          }
          .container {
            background: white;
            padding: 30px;
            max-width: 600px;
            margin: 40px auto;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }
          h2 {
            color: #2c3e50;
          }
          p {
            color: #34495e;
            line-height: 1.6;
          }
          .highlight {
            font-weight: bold;
            color: #2980b9;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #7f8c8d;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>📬 Nuevo mensaje desde el formulario de contacto</h2>
          <p><span class="highlight">Nombre:</span> ${informationDto.name}</p>
          <p><span class="highlight">Correo electrónico:</span> ${informationDto.email}</p>
          <p><span class="highlight">Mensaje:</span></p>
          <p>${informationDto.message}</p>
          <div class="footer">
            Este mensaje fue enviado desde la plataforma web del gimnasio.
          </div>
        </div>
      </body>
      </html>
    `;
    try {
      await this.mailservices.sendEmail(
        'escastr@gmail.com',
        htmlContent,
        'Qieren contactarse Contigo Gym',
      );
    } catch (e) {
      console.log(e);
      return { message: 'error al enviar el correo' };
    }

    return { message: 'correo enviado' };
  }
}
