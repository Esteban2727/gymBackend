import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  async sendPasswordReset(email: string, token: string) {
    console.log("llego aca")
    const resetUrl = `${process.env.HOST}/recover-password/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: '"Soporte" <soporte@example.com>',
      to: email,
      subject: 'Recuperación de contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
             <a href="${resetUrl}">${resetUrl}</a>`,
    });
    return(resetUrl)
  }

  async sendEmail (email:string, html:string, subject:string){
    await this.transporter.sendMail({
      from: '"Administración " <soporte@example.com>',
      to: email,
      subject: subject,
      html: html
    });
  }
}
