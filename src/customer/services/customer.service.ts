import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { Repository } from 'typeorm';
import { Customer } from '../customer.entity';
import * as bcrypt from 'bcrypt';
import { Subscription } from 'src/subcription/Entity/subcription.entity';
import { GymUser } from 'src/gym/gymUser.entity';

export class CustomerService {
  constructor(
    @InjectRepository(User)
    readonly userReposotory: Repository<User>,
    @InjectRepository(Customer)
    readonly customerRepository: Repository<Customer>,
    @InjectRepository(Subscription)
    readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(GymUser)
    readonly GymuserRepository: Repository<GymUser>,
  ) {}
  async GetCustomerById(ident: string) {
    const bringDatas = await this.userReposotory.find({
      where: { identification: ident },
    });
    console.log(bringDatas, 1132);
    return bringDatas;
  }

  async createCustomer(
    cellphone: string,
    email: string,
    gender: string,
    identification: string,
    password: string,
    username: string,
    idgym: string,
  ) {
    console.log('entro');
    console.log(username, identification, email);
    const verifyExistingCustomer = await this.userReposotory.findOne({
      where: [
        { identification: identification },
        { username: username },
        { email: email },
      ],
      withDeleted: true,
    });
    console.log(verifyExistingCustomer, 'sss');
    if (verifyExistingCustomer) {
      return 'this customer existing already';
    }
    const HashPassword: string = await bcrypt.hash(
      password,
      await bcrypt.genSalt(),
    );
    const createCustomer = await this.customerRepository.create({
      username: username,
      cellphone: cellphone,
      email: email,
      gender: gender,
      identification: identification,
      password: HashPassword,
      rol: 'customer',
    });
    await this.customerRepository.save(createCustomer);
    const AssociateCustomerToGym = await this.GymuserRepository.create({
      gym: { id: idgym },
      user: { identification: identification },
    });
    await this.GymuserRepository.save(AssociateCustomerToGym);
    const AssociateCustomerToSubscription =
      await this.subscriptionRepository.create({
        customer: { identification: identification },
      });
    await this.subscriptionRepository.save(AssociateCustomerToSubscription);
    return 'created succefully';
  }

  async deleteCustomer(id: string) {
    const verifyExisting = await this.customerRepository.findOne({
      where: { identification: id },
      relations: ['subscriptions'],
    });

    const verifyExistingSubscription =
      await this.subscriptionRepository.findOne({
        where: { customer: { identification: id } },
      });

    const verifyGymAssociate = await this.GymuserRepository.findOne({
      where: { user: { identification: id } },
    });

    console.log('entro', verifyExisting);

    if (verifyExisting && verifyExistingSubscription && verifyGymAssociate) {
      console.log('paso por aqui');

      const subscription = await this.subscriptionRepository.findOne({
        where: { customer: { identification: id } },
      });

      if (subscription) {
        await this.subscriptionRepository.softRemove(subscription);
      }
      const Gymuser = await this.GymuserRepository.findOne({
        where: { user: { identification: id } },
      });
      await this.GymuserRepository.softRemove(Gymuser);

      await this.customerRepository.softRemove(verifyExisting);

      return 'deleted';
    }
    return 'dont exit that customer';
  }
}
