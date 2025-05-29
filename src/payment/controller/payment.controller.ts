import { Controller, Post, Body, Param, Get } from '@nestjs/common';

import { PaymentService } from '../services/payment.service';
import { CreatePaymentIntentDto } from '../payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-intent/:id')
  async createIntent(
    @Body() dto: CreatePaymentIntentDto,
    @Param('id') id: string,
  ) {
    return this.paymentService.createPaymentIntent(dto, id);
  }

  @Get(':id')
  async getPayments(@Param('id') id: string) {
    return await this.paymentService.getPaymentById(id);
  }
}
