import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GeneratePdfServices } from '../services/pdf.service';

@Controller('pdf')
export class GeneratePdfController {
  constructor(private readonly generatePdfServices: GeneratePdfServices) {}

  @Get('dataPdf/:gymId')
  async getPdf(@Param('gymId') gymId: string, @Res() res: Response) {
    return this.generatePdfServices.createPdfFromGymUsers(gymId, res);
  }
}
