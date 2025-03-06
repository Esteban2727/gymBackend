import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common';
import { DashboardServices } from '../services/dashboard.service';

@Controller('realtime')
export class DashboardController {
  constructor(private readonly dashboardServices: DashboardServices) {}

  @Get('datas')
  getAllProducts(@Query('value') value: string) {
    console.log(value);
    return this.dashboardServices.getDatasInformation(value);
  }

  @Get('activeUser/:id') // Agregamos ":id" para recibir el parámetro correctamente
  async getActiveUser(@Param('id') id: string) {
    console.log()
    const save= await this.dashboardServices.getDatasinformationActive(id);
    console.log(save)
    return save
  }


}
