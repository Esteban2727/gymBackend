import { ChildEntity, Column, OneToMany } from 'typeorm';
import { User } from '../auth/entity/user.entity';
import { Subscription } from '../subcription/Entity/subcription.entity';
import { TrainerCustomer } from 'src/Trainer/trainerCustomer.entity';
import { UserMeasurement } from 'src/userMeasurment/user-measurment.entity';
import { Payment } from 'src/payment/payment.entity';

@ChildEntity()
export class Customer extends User {
  constructor() {
    super();
    this.rol = 'customer';
  }

  @Column({ type: 'date', nullable: true })
  membershipStartDate: Date;

  @Column({ default: 'Basic' })
  membershipType: string;

  @OneToMany(() => Subscription, (subscription) => subscription.customer)
  subscriptions: Subscription[];

  @OneToMany(() => TrainerCustomer, (tc) => tc.customer)
  trainers: TrainerCustomer[];

  @OneToMany(() => UserMeasurement, (m) => m.customer, { cascade: true })
  measurements: UserMeasurement[];
  @OneToMany(() => Payment, (payment) => payment.customer)
  payments: Payment[];
}
