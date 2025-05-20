import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, Repository } from 'typeorm';
import { Subscription } from '../Entity/subcription.entity';
import { Cron } from '@nestjs/schedule';
import { Customer } from 'src/customer/customer.entity';
import { MailService } from 'src/mail/mail.service';
/* import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq'; */
import { User } from 'src/auth/entity/user.entity';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly mailServices: MailService,
    private readonly userServices: UserService,
    /*   @InjectQueue('email') private readonly emailQueue: Queue, */
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

  /* @Cron('0 0 * * *') */
  @Cron('20 * * * * *')
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

  /* @Cron('0 0 * * *') */
  @Cron('20 * * * * *')
  async checkSubscriptionAlertCron() {
    console.log('🔔 Revisando suscripciones con pocos días restantes...');

    const subcriptions = await this.subscriptionRepository
      .createQueryBuilder('s')
      .select([
        'us.identification',
        'us.username',
        'us.email',
        's.remainingDays',
      ])
      .innerJoin(User, 'us', 'us.identification = s.customerIdentification')
      .where('s.remainingDays < :value', { value: 6 })
      .getRawMany();

    console.log(`📦 Subscripciones encontradas: ${subcriptions.length}`);

    for (const sub of subcriptions) {
      const customerEmail = sub.us_email;
      const remainingDays = sub.s_remainingDays;
      const username = sub.us_username;
      const identification = sub.us_identification;

      let subject = '';
      let body = '';

      if (remainingDays > 0) {
        subject = '🏋️ ¡Tu suscripción está por expirar!';
        body = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #e60000;">¡Hola ${username}!</h2>
          <p>Tu suscripción al gimnasio <strong>expira en ${remainingDays} día(s)</strong>.</p>
          <p>¡No pierdas tu progreso! Renueva tu plan y sigue entrenando con nosotros 💪</p>
          <a href="https://tu-gimnasio.com/renovar" style="padding: 10px 20px; background-color: #e60000; color: white; text-decoration: none; border-radius: 5px;">Renovar Ahora</a>
        </div>
      `;
      } else if (remainingDays === 0) {
        subject = '❌ Tu suscripción ha vencido';
        body = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #e60000;">Hola ${username},</h2>
          <p>Lamentablemente, tu suscripción al gimnasio ha <strong>vencido</strong>.</p>
          <p>Pero no te preocupes, aún puedes renovarla y retomar tus entrenamientos.</p>
          <a href="https://tu-gimnasio.com/renovar" style="padding: 10px 20px; background-color: #e60000; color: white; text-decoration: none; border-radius: 5px;">Renovar Suscripción</a>
        </div>
      `;

     
        try {
          await this.userServices.softRemoveCustomerAndTrainer(identification);
          console.log(
            `✅ Usuario ${username} marcado como eliminado (soft delete)`,
          );
        } catch (err) {
          console.error(`❌ Error eliminando lógicamente a ${username}:`, err);
        }
      } else {
        continue; 
      }


      try {
        await this.mailServices.sendEmail(customerEmail, body, subject);
        console.log(`📧 Correo enviado a ${customerEmail}`);
      } catch (error) {
        console.error(`❌ Error enviando correo a ${customerEmail}:`, error);
      }

      
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return {
      message: `✅ Procesadas ${subcriptions.length} suscripciones.`,
    };
  }

  async checkSubscriptionAlert() {
    console.log('dias restantes');
    // const arreglo = [];
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
