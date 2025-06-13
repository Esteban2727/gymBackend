import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import * as puppeteer from 'puppeteer';
import { User } from 'src/auth/entity/user.entity';
import { Gym } from 'src/gym/gym.entity';
import { GymUser } from 'src/gym/gymUser.entity';
import { Repository } from 'typeorm';

export class GeneratePdfServices {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async createPdf(title: string, data: any, res: Response) {
    try {
      const formattedTitle = title.split('-').join(' ');
      const html = this.generateHtml(formattedTitle, data);

      const browser = await puppeteer.launch({
        executablePath:
          '/opt/render/.cache/puppeteer/chrome/linux-136.0.7103.94/chrome',
        headless: true,
      });

      const page = await browser.newPage();

      await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.waitForFunction('window.chartRendered === true');

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '1.5cm',
          bottom: '1.5cm',
          left: '1cm',
          right: '1cm',
        },
      });

      await browser.close();

      const filename = `dashboard-${Date.now()}.pdf`;
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.setHeader('Content-Type', 'application/pdf');
      res.end(pdfBuffer);
    } catch (error) {
      console.error('Error al generar el PDF con Puppeteer:', error);
      throw new Error('Error al generar el PDF');
    }
  }

  private generateHtml(title: string, data: any): string {
    const fecha = new Date().toLocaleString();
    const { genderMale, gyms, usersByMonth } = data;

    const genderMale1 = parseFloat(genderMale.replace('%', ''));

    const genderFemale = 100 - genderMale1;

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            padding: 20px;
            color: #333;
            background-color: #f9f9f9;
          }
          h1 {
            text-align: center;
            color: #2c3e50;
            font-size: 30px;
            margin-bottom: 20px;
          }
          .intro {
            text-align: center;
            font-size: 18px;
            margin-bottom: 20px;
            color: #7f8c8d;
          }
          .summary {
            font-size: 16px;
            margin: 20px 0;
            line-height: 1.6;
          }
          .summary strong {
            color: #3498db;
            font-weight: bold;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #888;
          }
          canvas {
            margin: 30px auto;
            display: block;
            max-width: 700px;
            max-height: 450px;
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p class="intro">Reporte de actividad y usuarios del gimnasio, con datos actualizados y gráficos claros.</p>

        <h2>Resumen de Usuarios y Actividad</h2>

        <div class="summary">
          <p><strong>Género:</strong> ${genderMale}% Hombres, ${genderFemale}% Mujeres.</p>
        
          <p><strong>Gimnasios:</strong> ${gyms.active} Gimnasios Activos ,
            ${gyms.inactive} Inactivos .</p>
        </div>

        <h2>Gráfico de Usuarios por Mes</h2>
        <canvas id="usersByMonthChart"></canvas>

        <div class="footer">Generado el ${fecha}</div>

        <script>
          const usersByMonthCtx = document.getElementById('usersByMonthChart').getContext('2d');

          const promises = [];

          // Gráfico de usuarios por mes
          promises.push(new Chart(usersByMonthCtx, {
            type: 'line',
            data: {
              labels: ${JSON.stringify(usersByMonth.map((u) => u.month))},
              datasets: [{
                label: 'Usuarios registrados',
                data: ${JSON.stringify(usersByMonth.map((u) => u.count))},
                borderColor: '#9b59b6',
                fill: false,
                lineTension: 0.1
              }]
            },
            options: {
              responsive: true,
              scales: {
                x: {
                  beginAtZero: true
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }
          }));

          Promise.all(promises).then(() => {
            window.chartRendered = true;
          });
        </script>
      </body>
      </html>
    `;
  }

  async createPdfFromGymUsers(gymId: string, res: Response): Promise<void> {
    try {
      const users = await this.getCustomerByGym(gymId);
      const formattedTitle = 'Usuarios activos del gimnasio';
      const html = this.generateUserTableHtml(formattedTitle, users);

      const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome', // Ajusta la ruta según tu instalación
        headless: true,
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '1.5cm',
          bottom: '1.5cm',
          left: '1cm',
          right: '1cm',
        },
      });

      await browser.close();

      const filename = `usuarios-gym-${Date.now()}.pdf`;
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );
      res.setHeader('Content-Type', 'application/pdf');
      res.end(pdfBuffer);
    } catch (error) {
      console.error('Error al generar el PDF de usuarios del gimnasio:', error);
      res.status(500).send('Error al generar el PDF');
    }
  }

  private async getCustomerByGym(id: string): Promise<any[]> {
    return await this.userRepository
      .createQueryBuilder('u')
      .select([
        'u.username AS u_username',
        'u.email AS u_email',
        'u.createdAt AS u_createdAt',
        'u.membershipType AS u_membershipType',
      ])
      .innerJoin(GymUser, 'gs', 'gs.userIdentification = u.identification')
      .innerJoin(Gym, 'g', 'g.id = gs.gymId')
      .where('u.rol = :value1 AND g.id = :id', { value1: 'customer', id })
      .getRawMany();
  }

  private generateUserTableHtml(title: string, users: any[]): string {
    const fecha = new Date().toLocaleString('es-ES');

    const rows = users
      .map(
        (u, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${u.u_username}</td>
          <td>${u.u_email}</td>
          <td>${new Date(u.u_createdat).toLocaleDateString('es-ES')}</td>
          <td>${u.u_membershiptype}</td>
        </tr>`,
      )
      .join('');

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          padding: 20px;
          color: #333;
          background-color: #fff;
        }
        h1 {
          text-align: center;
          color: #2c3e50;
        }
        .intro {
          text-align: center;
          margin-bottom: 20px;
          font-size: 18px;
          color: #7f8c8d;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 8px 12px;
          text-align: left;
        }
        th {
          background-color: #3498db;
          color: white;
        }
        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p class="intro">Lista de usuarios activos registrados en este gimnasio.</p>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre de Usuario</th>
            <th>Email</th>
            <th>Fecha de Registro</th>
            <th>Tipo de Membresía</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <div class="footer">Generado el ${fecha}</div>
    </body>
    </html>
    `;
  }
}
