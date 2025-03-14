import { ChildEntity, Column, OneToMany } from 'typeorm';
import { User } from '../auth/entity/user.entity';
import { Subscription } from '../subcription/Entity/subcription.entity';

@ChildEntity()
export class Customer extends User {

  @Column({ type: 'date', nullable: true })
  membershipStartDate: Date;

  @Column({ default: 'Basic' })
  membershipType: string; 

  @OneToMany(() => Subscription, (subscription) => subscription.customer)
  subscriptions: Subscription[];
}
