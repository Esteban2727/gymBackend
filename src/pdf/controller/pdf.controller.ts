import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { GeneratePdfServices } from '../services/pdf.service';

@Controller('pdf')
export class GeneratePdfController {
  constructor(private readonly generatePdfServices: GeneratePdfServices) {}

  @Post('')
  async generatePdf(@Body('title') title: string, @Res() res: Response) {
    return this.generatePdfServices.createPdf(title, res);
  }
}
