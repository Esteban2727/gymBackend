import { Controller, Post } from '@nestjs/common';
import { DashboardServices } from '../services/dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardServices: DashboardServices) {}

  @Post('emit')
  async emitDashboardUpdate() {
    const data = await this.dashboardServices.getDatasInformation('male');
    await this.dashboardServices.updateDatasInformation();
    return { percentageMale: data }; // Esto es lo que verás en Insomnia
  }
}
