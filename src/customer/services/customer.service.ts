import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { Repository } from 'typeorm';
import { Customer } from '../customer.entity';
import * as bcrypt from 'bcryptjs';
import { Subscription } from 'src/subcription/Entity/subcription.entity';
import { GymUser } from 'src/gym/gymUser.entity';
import { MailService } from 'src/mail/mail.service';
import { Gym } from 'src/gym/gym.entity';
import { DashboardServices } from 'src/dashboard/services/dashboard.service';
import { Routine } from 'src/rutine/rutine.entity';
import { RoutineAssignment } from '../assignCustomerRutine.entity';
import { TrainerCustomer } from 'src/Trainer/trainerCustomer.entity';
import { NotFoundException } from '@nestjs/common';

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
    private readonly dashboardService: DashboardServices,

    @InjectRepository(Routine)
    readonly routineRepository: Repository<Routine>,
    @InjectRepository(RoutineAssignment)
    readonly assignRoutineRepository: Repository<RoutineAssignment>,
    @InjectRepository(TrainerCustomer)
    readonly trainerCustomerRepository: Repository<TrainerCustomer>,
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

    const verifyEmail = await this.userReposotory.findOne({
      where: { email: email },
    });
    if (verifyEmail) {
      return ' ese correo ya existe, usa otro ';
    }
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
    await this.dashboardService.emitFullDashboardUpdate();
    await this.dashboardService.getSubscriptionActivityByGymId(idgym);

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
      await this.dashboardService.emitFullDashboardUpdate();
      return 'deleted';
    }
    return 'dont exit that customer';
  }

  async updateData(id: string, cel: string, username: string): Promise<any> {
    const updateDataOfRepository = await this.customerRepository
      .createQueryBuilder()
      .update(Customer)
      .set({
        cellphone: cel,
        username: username,
      })
      .where('identification = :id', { id })
      .execute();
    return 'actualizado';
  }

  async assignRoutine(id: any) {
    const { routineId, customerId, trainerId } = id;
    const verifyRoutine = await this.routineRepository.findOne({
      where: { id: routineId },
    });
    if (!verifyRoutine) {
      throw new Error('no se encuentra esa rutina');
    }
    const verifyCustomer = await this.customerRepository.findOne({
      where: { identification: customerId },
    });
    if (!verifyCustomer) {
      throw new Error('no se encontro el customer');
    }

    await this.assignRoutineRepository
      .createQueryBuilder()
      .insert()
      .into(RoutineAssignment)
      .values({
        customer: { identification: customerId },
        routine: { id: routineId },
        trainer: { identification: trainerId },
      })
      .execute();
  }

  async getAssignedToCustomer(id: string) {
    const verifyExistingCustomer = await this.customerRepository.findOne({
      where: { identification: id },
    });
    if (!verifyExistingCustomer) {
      throw new Error('no existe ese cliente');
    }
    return await this.assignRoutineRepository.find({
      where: { customer: { identification: id } },
    });
  }

  async getCloseFriends(userId: string) {
    const customer = await this.userReposotory.findOne({
      where: { identification: userId },
    });
    console.log('paso', customer);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const relation = await this.trainerCustomerRepository.findOne({
      where: { customer: { identification: customer.identification } },
      relations: ['trainer', 'customer'],
    });
    console.log('relation', relation);
    if (!relation) {
      throw new NotFoundException('Trainer relation not found');
    }

    const trainerId = relation.trainer.identification;
    console.log(trainerId, 'rrrrr');
    const closeFriends = await this.customerRepository
      .createQueryBuilder('cm')
      .select(['cm.username', 'cm.profilePicture', 'cm.identification'])
      .innerJoin(
        TrainerCustomer,
        'tc',
        'tc.customerIdentification = cm.identification',
      )
      .where('tc.trainerIdentification = :trainerId', { trainerId })
      .andWhere('cm.rol = :rol and cm.identification <> :value', {
        rol: 'customer',
        value: userId,
      })

      .getMany();

    return closeFriends;
  }
}
