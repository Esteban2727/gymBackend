// payment.service.ts
import { Injectable } from '@nestjs/common';
import { CreatePaymentIntentDto } from '../payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/customer/customer.entity';
import { Payment } from '../payment.entity';
import { Repository } from 'typeorm';
import { Subscription } from 'src/subcription/Entity/subcription.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async createPaymentIntent(dto: CreatePaymentIntentDto, id: string) {
    const customer = await this.customerRepository.findOne({
      where: { identification: id },
    });

    if (!customer) {
      throw new Error('No existe el usuario donde deseas ejecutar el pago');
    }

    const payment = this.paymentRepository.create({
      amount: dto.amount,
      customer: { identification: id },
    });

    await this.paymentRepository.save(payment);

    let subscription = await this.subscriptionRepository.findOne({
      where: {
        customer: { identification: id },
        deletedAt: null,
      },
    });

    if (subscription) {
      subscription.remainingDays += 30;
    } else {
      subscription = this.subscriptionRepository.create({
        customer: { identification: id },
        remainingDays: 30,
      });
    }

    await this.subscriptionRepository.save(subscription);

    return {
      message: 'Pago y suscripción actualizados correctamente',
      subscription,
    };
  }

  async getPaymentById(id: string): Promise<Partial<Payment>[]> {
    return this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoin('payment.customer', 'customer')
      .where('customer.identification = :id', { id })
      .select(['payment.id', 'payment.amount', 'payment.createdAt'])
      .getMany();
  }
}
