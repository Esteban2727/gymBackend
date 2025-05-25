import { Controller, Post, Body, Res, Param, Get } from '@nestjs/common';
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
    const payload = await this.dashboardService.emitFullDashboardUpdate();

    return this.generatePdfServices.createPdf(title, payload, res);
  }

  @Get('dataPdf/:id')
  async getDataPdf(@Param('id') id: string, @Res() res: Response) {
    await this.generatePdfServices.createPdfFromGymUsers(id, res);
  }
}
