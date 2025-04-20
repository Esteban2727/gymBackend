import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { Repository } from 'typeorm';
import { Customer } from '../customer.entity';
import * as bcrypt from 'bcrypt';
import { Subscription } from 'src/subcription/Entity/subcription.entity';
import { GymUser } from 'src/gym/gymUser.entity';
import { MailService } from 'src/mail/mail.service';
import { Gym } from 'src/gym/gym.entity';

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
    private readonly sendMail: MailService,
    @InjectRepository(Gym)
    readonly GymRepository: Repository<Gym>,
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
    const searchDataInformation = await this.GymRepository.findOne({
      where: { id: idgym },
    });
    if (!searchDataInformation) {
      return 'ese gymnasio no existe';
    }

    console.log('entro');
    console.log(username, identification, email);
    const verifyExistingCustomer = await this.userReposotory.findOne({
      where: [{ identification: identification }, { email: email }],
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

    const { name, primary, secondary, third, fourth, fontFamily } =
      searchDataInformation;

    const subject = 'usuario creado, bienvenido';
    const html = `
  <div style="font-family: ${fontFamily}, sans-serif; background-color: ${secondary}; padding: 30px; border-radius: 12px; max-width: 500px; margin: auto; color: ${third}; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);">
    <h1 style="color: ${primary}; font-size: 24px;">Bienvenido al gimnasio ${name} 🏋️‍♂️</h1>

    <img src="https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif" alt="GIF Motivacional"
      style="width: 100%; border-radius: 8px; margin-top: 20px; border: 2px solid ${primary};" />

    <hr style="border: 1px dashed ${primary}; margin: 20px 0;" />

    <p style="font-size: 16px;"><strong>Correo electrónico:</strong> <span style="color: ${fourth};">${email}</span></p>
    <p style="font-size: 16px;"><strong>Contraseña:</strong> <span style="color: ${fourth};">${password}</span></p>
    <p style="font-size: 16px;"><strong>Celular:</strong> <span style="color: ${fourth};">${cellphone}</span></p>

    <hr style="border: 1px dashed ${primary}; margin: 20px 0;" />

    <p style="font-size: 14px; color: ${third};">¡Gracias por unirte! Estamos emocionados de acompañarte en tu camino al éxito. 💪</p>
  </div>
`;
    await this.sendMail.sendEmail(email, html, subject);
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
