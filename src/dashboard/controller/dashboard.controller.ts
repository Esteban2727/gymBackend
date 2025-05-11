import { Controller, Get, Param, Post } from '@nestjs/common';
import { DashboardServices } from '../services/dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardServices: DashboardServices) {}

  @Post('emit')
  async emitSuperadminDashboard() {
    const genderMale = await this.dashboardServices.getDatasInformation('male');
    const people = await this.dashboardServices.PersonasByGym();
    const activeUsers =
      await this.dashboardServices.getDatasinformationActive();
    const colors = await this.dashboardServices.getBrandColorStats();
    const gyms = await this.dashboardServices.getGymsActiveInactivePercentage();
    const usersByMonth =
      await this.dashboardServices.getUsersRegisteredByMonth();

    const payload = {
      genderMale,
      people,
      activeUsers,
      colors,
      gyms,
      usersByMonth,
    };

    this.dashboardServices.socketGateway.emitDashboardUpdate(payload);

    return payload;
  }

  @Post('emitAdmin/:id')
  async emitDashboardAdmin(@Param('id') id: string) {
    return await this.dashboardServices.getDatasInformationGenderByGym(
      'male',
      id,
    );
  }
}
