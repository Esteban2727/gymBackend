import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { GeneratePdfServices } from '../services/pdf.service';
import { DashboardServices } from '../../dashboard/services/dashboard.service';

@Controller('pdf')
export class GeneratePdfController {
  constructor(
    private readonly generatePdfServices: GeneratePdfServices,
    private readonly dashboardService: DashboardServices,
  ) {}

  @Post()
  async generatePdf(@Body('title') title: string, @Res() res: Response) {
    // ✅ Obtenemos el payload con todos los datos del dashboard
    const payload = await this.dashboardService.emitFullDashboardUpdate();

    // ✅ Generamos el PDF usando el título y los datos
    return this.generatePdfServices.createPdf(title, payload, res);
  }
}
