import {
  Controller,
  Get,
  Param,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { SubscriptionService } from '../services/subcription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  async getCheckOfSubccription() {
    console.log('entro');
    const returnDaySubcription =
      await this.subscriptionService.checkSubscriptionAlert();
    console.log(returnDaySubcription);
    return returnDaySubcription;
  }

  @Get(':userId')
  async getSubscription(@Param('userId') userId: string) {
    const subscription =
      await this.subscriptionService.getUserSubscription(userId);
    if (!subscription) {
      throw new BadRequestException('Suscripción no encontrada');
    }
    return subscription;
  }
  @Patch(':userId/reset')
  async reset(@Param('userId') userId: string) {
    return await this.subscriptionService.reset(userId);
  }
  @Get(':userId/status')
  async isSubscriptionActive(@Param('userId') userId: string) {
    return await this.subscriptionService.isSubscriptionActive(userId);
  }
}
