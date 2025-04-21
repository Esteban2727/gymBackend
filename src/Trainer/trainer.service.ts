import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trainer } from './trainer.entity';
import * as bcrypt from 'bcrypt';
import { GymUser } from 'src/gym/gymUser.entity';
import { User } from 'src/auth/entity/user.entity';
import { MailService } from 'src/mail/mail.service';
import { Gym } from 'src/gym/gym.entity';

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
    especialization: string | string[],
    yearExperience: string,
    idGym: string,
  ) {
    const verifyTrainerExisting = await this.userRepository.findOne({
      where: [{ email: email }, { identification: identification }],
    });

    console.log(verifyTrainerExisting);
    if (verifyTrainerExisting) {
      return 'the datas of this trainer exits already in the database';
    }
    const HashPassword: string = await bcrypt.hash(
      password,
      await bcrypt.genSalt(),
    );
    const createTrainer = await this.trainerRepository.create({
      cellphone: cellphone,
      certifications: especialization,
      email: email,
      password: HashPassword,
      gender: gender,
      identification: identification,
      username: username,
      yearExperience: yearExperience,
    });

    await this.trainerRepository.save(createTrainer);
    const createGymTrainer = this.trainerToGymRepository.create({
      gym: { id: idGym },
      user: { identification: identification },
    });

    const { logo, fourth, fontFamily, primary, name, secondary, third } =
      await this.gymRepository.findOne({
        where: { id: idGym },
      });

    const subject = 'usuario creado, bienvenido';
    const html = `
  <div style="font-family: ${fontFamily}, sans-serif; background-color: ${secondary}; padding: 30px; border-radius: 12px; max-width: 500px; margin: auto; color: ${third}; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);">
    <h1 style="color: ${primary}; font-size: 24px;">Bienvenido al gimnasio ${name} 🏋️‍♂️</h1>

    <img src= "${logo}" alt="GIF Motivacional"
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

    await this.trainerToGymRepository.save(createGymTrainer);

    return 'created with succefully';
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
}
