import { Response } from 'express';
import * as puppeteer from 'puppeteer';

export class GeneratePdfServices {
  async createPdf(title: string, res: Response) {
    try {
      const formattedTitle = title.split('-').join(' ');
      const html = this.generateHtml(formattedTitle);

      const browser = await puppeteer.launch({ headless: true });

      const page = await browser.newPage();

      await page.setContent(html, { waitUntil: 'domcontentloaded' });

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

      const filename = `documento-${Date.now()}.pdf`;
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.setHeader('Content-Type', 'application/pdf');
      res.end(pdfBuffer);
    } catch (error) {
      console.error('Error al generar el PDF con Puppeteer:', error);
      throw new Error('Error al generar el PDF');
    }
  }

  private generateHtml(title: string): string {
    const fecha = new Date().toLocaleString();

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>PDF - ${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
          }
          h1 {
            text-align: center;
            color: #2c3e50;
          }
          p {
            font-size: 14px;
            line-height: 1.6;
          }
          .footer {
            position: fixed;
            bottom: 20px;
            width: 100%;
            text-align: center;
            font-size: 12px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>Este es un informe generado para la gestión de gimnasios.</p>
        <p>Puede incluir aquí información de usuarios, asistencia, estadísticas, etc.</p>
        <p><strong>Fecha de generación:</strong> ${fecha}</p>

        <div class="footer">
          © ${new Date().getFullYear()} Sistema de Gestión de Gimnasios
        </div>
      </body>
      </html>
    `;
  }
}
