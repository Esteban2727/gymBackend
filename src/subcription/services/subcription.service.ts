import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../Entity/subcription.entity';
import { Cron } from '@nestjs/schedule';
import { Customer } from 'src/customer/customer.entity';


@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,

  ) {}

  async getUserSubscription(userId: string){
    return await this.subscriptionRepository.findOne({
        where:{customer:{identification:userId}},
        relations:['customer']
    })
  }

  
  async reset(userId: string) {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription) throw new Error('Suscripción no encontrada');

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

    const subscriptions = await this.subscriptionRepository.find();
    for (const sub of subscriptions) {
      if (sub.remainingDays <= 5) {
        console.log("pocos dias restantes");
       
      }
    }
  }

  async checkSubscriptionAlert() {
    console.log('dias restantes');
const arreglo=[]
    //const subscriptions = await this.subscriptionRepository.find();
 const subscription = await this.subscriptionRepository.createQueryBuilder()
 
 .from(Subscription,"sub")
 .select("sub", "cs")
 .leftJoinAndSelect(Customer, "cs", "cs.identification = sub.customerIdentification")
 .where("sub.remainingDays < :value",{value:5})
 .getMany()
 console.log(subscription)
    // for (const sub of subscriptions) {
    //   if (sub.remainingDays <= 30) {
    //     arreglo.push(sub)
    //   }
      
    // }
    // if (arreglo.length == 0){
    //   return "no hay personas que les falten menos de 5 dias"
    // }

    return  subscription

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
      return  `te quedan ${subscription.remainingDays}`
   
    }
  }

}
