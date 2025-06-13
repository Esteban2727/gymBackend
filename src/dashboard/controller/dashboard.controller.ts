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
    const data1 =
      await this.dashboardServices.getDatasInformationGenderByTrainer(
        'male',
        id,
      );
    const data2 = await this.dashboardServices.getDatasInformationByTrainer(id);

    const payload = {
      data1,
      data2,
    };

    this.dashboardServices.socketGateway.emitDashboardUpdate(payload);
    return payload;
  }

  @Post('emitTrainer/:id')
  async emitDashboardTrainer(@Param('id') id: string) {
    return await this.dashboardServices.getDatasInformationGenderByTrainer(
      'male',
      id,
    );
  }

  @Post('emitTotal/:id')
  async emitDashboardTrainerInGym(@Param('id') id: string) {
    return await this.dashboardServices.getDatasInformationByTrainer(id);
  }

  @Post('adminAll/:id')
  async emitDashboardAdminAll(@Param('id') id: string) {
    return await this.dashboardServices.getSubscriptionActivityByGymId(id);
  }
}
