import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../Entity/subcription.entity';
import { Cron } from '@nestjs/schedule';
import { Customer } from 'src/customer/customer.entity';
import { MailService } from 'src/mail/mail.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { User } from 'src/auth/entity/user.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly mailServices: MailService,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  async getUserSubscription(userId: string) {
    return await this.subscriptionRepository.findOne({
      where: { customer: { identification: userId } },
      relations: ['customer'],
    });
  }

  async reset(userId: string) {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription) throw new Error('Suscripción no encontrada11');

    subscription.remainingDays = 30;
    return await this.subscriptionRepository.save(subscription);
  }

  async isSubscriptionActive(userId: string): Promise<{ isActive: boolean }> {
    const subscription = await this.getUserSubscription(userId);
    return { isActive: subscription?.remainingDays > 0 };
  }

  @Cron('0 0 * * *')
  async decreaseRemainingDays() {
    console.log('Disminuyendo días restantes de suscripciones...');

    const subscriptions = await this.subscriptionRepository.find();

    for (const sub of subscriptions) {
      if (sub.remainingDays > 0) {
        sub.remainingDays -= 1;
      }
    }

    await this.subscriptionRepository.save(subscriptions);
    console.log('Días restantes actualizados');
  }

  @Cron('0 0 * * *')
  async checkSubscriptionAlertCron() {
    console.log('Revisando suscripciones con pocos días restantes...');

    const subcription = await this.subscriptionRepository
      .createQueryBuilder('s')
      .select([
        'us.identification',
        'us.username',
        'us.email',
        's.remainingDays',
      ])
      .innerJoin(User, 'us', 'us.identification =s.customerIdentification ')
      .where('s.remainingDays < :value', { value: 6 })
      .getRawMany();

    console.log('Subs encontrados:', subcription);

    for (const sub of subcription) {
      console.log(
        `Procesando suscripción de: ${sub.us_email}, días restantes: ${sub.s_remainingDays}`,
      );

      if (sub.s_remainingDays <= 5) {
        const customerEmail = sub.us_email;
        const subject = 'Recordatorio: Tu suscripción está por expirar';
        const body = `Hola ${sub.us_username},<br><br>Tu suscripción está por expirar en ${sub.s_remainingDays} días.`;

        try {
          await this.emailQueue.add('send-email', {
            to: customerEmail,
            subject,
            body,
          });
          console.log(`✅ Correo encolado a ${customerEmail}`);
        } catch (error) {
          console.error(`❌ Error encolando email a ${customerEmail}`, error);
        }
      }
    }

    return {
      message: `Procesadas ${subcription.length} suscripciones por expirar.`,
    };
  }

  async checkSubscriptionAlert() {
    console.log('dias restantes');
    const arreglo = [];
    //const subscriptions = await this.subscriptionRepository.find();
    const subscription = await this.subscriptionRepository
      .createQueryBuilder()

      .from(Subscription, 'sub')
      .select('sub', 'cs')
      .leftJoinAndSelect(
        Customer,
        'cs',
        'cs.identification = sub.customerIdentification',
      )
      .where('sub.remainingDays < :value', { value: 5 })
      .getMany();
    console.log(subscription);
    // for (const sub of subscriptions) {
    //   if (sub.remainingDays <= 30) {
    //     arreglo.push(sub)
    //   }

    // }
    // if (arreglo.length == 0){
    //   return "no hay personas que les falten menos de 5 dias"
    // }

    return subscription;
  }

  async checkSubscriptionAlertOneUser(id: string) {
    console.log('Revisando suscripción del usuario con ID:', id);

    const subscription = await this.subscriptionRepository.findOne({
      where: { customer: { identification: id } },
      relations: ['customer'],
    });

    if (!subscription) {
      console.log(`No se encontró suscripción para el usuario con ID: ${id}`);
      return;
    }

    if (subscription.remainingDays <= 5) {
      return `te quedan ${subscription.remainingDays}`;
    }
  }
}
