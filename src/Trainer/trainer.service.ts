import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Trainer } from './trainer.entity';
import * as bcrypt from 'bcryptjs';
import { GymUser } from 'src/gym/gymUser.entity';
import { User } from 'src/auth/entity/user.entity';
import { MailService } from 'src/mail/mail.service';
import { Gym } from 'src/gym/gym.entity';
import { TrainerCustomer } from './trainerCustomer.entity';
import { Customer } from 'src/customer/customer.entity';

@Injectable()
export class TrainerServices {
  constructor(
    @InjectRepository(Trainer)
    readonly trainerRepository: Repository<Trainer>,
    @InjectRepository(GymUser)
    readonly trainerToGymRepository: Repository<GymUser>,
    @InjectRepository(User)
    readonly userRepository: Repository<User>,
    private readonly sendMail: MailService,
    @InjectRepository(Gym)
    readonly gymRepository: Repository<Gym>,
    private readonly dataSource: DataSource,
    @InjectRepository(TrainerCustomer)
    readonly trainerCustomer: Repository<TrainerCustomer>,
    @InjectRepository(Customer)
    readonly customerRepository: Repository<Customer>,
  ) {}

  async getDataTrainer() {
    return this.trainerRepository.find();
  }

  async createTrainer(
    cellphone: string,
    email: string,
    gender: string,
    identification: string,
    password: string,
    username: string,
    especialization: any,
    yearExperience: string,
    idGym: string,
  ) {
    const existingTrainer = await this.userRepository.findOne({
      where: [{ email }, { identification }],
    });

    if (existingTrainer) {
      return 'The trainer data already exists in the database.';
    }

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const trainer = this.trainerRepository.create({
        cellphone,
        certifications: especialization,
        email,
        password: hashedPassword,
        gender,
        identification,
        rol: 'Trainer',
        username,
        yearExperience,
      });

      const savedTrainer = await queryRunner.manager.save(Trainer, trainer);

      console.log(idGym);
      const gym = await this.gymRepository.findOne({ where: { id: idGym } });
      if (!gym) throw new Error('Gym not found');

      // Crear relación gym-user
      const gymTrainer = this.trainerToGymRepository.create({
        gym: gym,
        user: savedTrainer,
      });

      await queryRunner.manager.save(gymTrainer);

      const { logo, fourth, fontFamily, primary, name, secondary, third } = gym;

      const subject = 'Usuario creado, ¡bienvenido!';
      const html = `
        <div style="font-family: ${fontFamily}, sans-serif; background-color: ${secondary}; padding: 30px; border-radius: 12px; max-width: 500px; margin: auto; color: ${third}; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);">
          <h1 style="color: ${primary}; font-size: 24px;">Bienvenido al gimnasio ${name} 🏋️‍♂️</h1>
  
          <img src="${logo}" alt="GIF Motivacional"
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

      await queryRunner.commitTransaction();

      return 'Trainer created successfully.';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error creating trainer:', error);
      throw new Error('There was a problem creating the trainer.');
    } finally {
      await queryRunner.release();
    }
  }

  async updateInformationTrainer(identification: string, newData: any) {
    const trainer = await this.trainerRepository.findOne({
      where: { identification: identification },
    });
    const filteredData = Object.fromEntries(
      Object.entries(newData).filter(([key, value]) => trainer[key] !== value),
    );

    if (Object.keys(filteredData).length === 0) {
      return { message: 'No changes detected.' };
    }

    await this.trainerRepository.update(
      { identification: identification },
      filteredData,
    );

    return { success: 'Trainer information updated successfully.' };
  }

  async getDataTrainerByGym(id: string) {
    return await this.trainerRepository
      .createQueryBuilder('tr')
      .leftJoinAndSelect(
        GymUser,
        'gm',
        'gm.userIdentification = tr.identification',
      )
      .leftJoinAndSelect(Gym, 'gym', 'gym.id = gm.gymId')
      .where('gym.id = :value', { value: id })
      .getMany();
  }

  async assignTrainer(id: any) {
    const { idCustomer, idTrainer } = id;

    const verifyExistingAssign = await this.trainerCustomer.findOne({
      where: {
        trainer: { identification: idTrainer },
        customer: { identification: idCustomer },
      },
    });
    if (verifyExistingAssign) {
      return 'ya fue asignado ese entrenador a ese usuario';
    }

    const assignTrainerToCustomer = await this.trainerCustomer
      .createQueryBuilder()
      .insert()
      .values({
        customer: idCustomer,
        trainer: idTrainer,
      })
      .execute();

    return assignTrainerToCustomer;
  }

  async getTrainerById(id: string): Promise<Trainer> {
    return await this.trainerRepository.findOne({
      where: { identification: id },
    });
  }

  async getCustomersAssigned(id: string) {
    const customerAssigned = await this.customerRepository
      .createQueryBuilder('cr')
      .leftJoinAndSelect(
        TrainerCustomer,
        'tc',
        'tc.customerIdentification = cr.identification',
      )
      .leftJoinAndSelect(
        Trainer,
        'tr',
        'tr.identification = tc.trainerIdentification',
      )
      .where('tr.identification = :id', { id })
      .getMany();

    return customerAssigned;
  }

  async updateData(id: string, cel: string, username: string): Promise<any> {
    const updateDataOfRepository = await this.trainerRepository
      .createQueryBuilder()
      .update(Trainer)
      .set({
        cellphone: cel,
        username: username,
      })
      .where('identification = :id', { id })
      .execute();
    return "actualizado";
}
