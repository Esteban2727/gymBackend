// src/pdf/services/pdf.service.ts
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as PdfPrinter from 'pdfmake';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entity/user.entity';
import { GymUser } from 'src/gym/gymUser.entity';
import { Gym } from 'src/gym/gym.entity';

@Injectable()
export class GeneratePdfServices {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createPdfFromGymUsers(gymId: string, res: Response): Promise<void> {
    try {
      const users = await this.getCustomerByGym(gymId);
      const fecha = new Date().toLocaleString('es-ES');

      // Definimos la fuente
      const fonts = {
        Roboto: {
          normal: path.join(__dirname, '../../../fonts/Roboto-Regular.ttf'),
          bold: path.join(__dirname, '../../../fonts/Roboto-Bold.ttf'),
          italics: path.join(__dirname, '../../../fonts/Roboto-Italic.ttf'),
          bolditalics: path.join(
            __dirname,
            '../../../fonts/Roboto-BoldItalic.ttf',
          ),
        },
      };

      const printer = new PdfPrinter(fonts);

      const body = [
        [
          { text: '#', style: 'tableHeader' },
          { text: 'Nombre de Usuario', style: 'tableHeader' },
          { text: 'Email', style: 'tableHeader' },
          { text: 'Fecha de Registro', style: 'tableHeader' },
          { text: 'Tipo de Membresía', style: 'tableHeader' },
        ],
        ...users.map((u, i) => [
          `${i + 1}`,
          u.u_username,
          u.u_email,
          new Date(u.u_createdat).toLocaleDateString('es-ES'),
          u.u_membershiptype,
        ]),
      ];

      const docDefinition = {
        content: [
          { text: 'Usuarios Activos del Gimnasio', style: 'header' },
          { text: 'Lista de usuarios registrados', margin: [0, 0, 0, 10] },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', '*', '*', '*'],
              body,
            },
          },
          { text: `Generado el ${fecha}`, style: 'footer' },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 10],
          },
          tableHeader: {
            bold: true,
            fillColor: '#3498db',
            color: 'white',
          },
          footer: {
            margin: [0, 20, 0, 0],
            fontSize: 10,
            alignment: 'center',
            color: '#666',
          },
        },
      };

      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const chunks: Buffer[] = [];

      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="usuarios-gym-${Date.now()}.pdf"`,
        );
        res.setHeader('Content-Type', 'application/pdf');
        res.end(pdfBuffer);
      });

      pdfDoc.end();
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      res.status(500).send('Error al generar el PDF');
    }
  }

  private async getCustomerByGym(id: string): Promise<any[]> {
    return await this.userRepository
      .createQueryBuilder('u')
      .select([
        'u.username AS u_username',
        'u.email AS u_email',
        'u.createdAt AS u_createdat',
        'u.membershipType AS u_membershiptype',
      ])
      .innerJoin(GymUser, 'gs', 'gs.userIdentification = u.identification')
      .innerJoin(Gym, 'g', 'g.id = gs.gymId')
      .where('u.rol = :value1 AND g.id = :id', { value1: 'customer', id })
      .getRawMany();
  }
}
