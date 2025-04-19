import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trainer } from './trainer.entity';
import * as bcrypt from 'bcrypt';
import { GymUser } from 'src/gym/gymUser.entity';
import { User } from 'src/auth/entity/user.entity';

@Injectable()
export class TrainerServices {
  constructor(
    @InjectRepository(Trainer)
    readonly trainerRepository: Repository<Trainer>,
    @InjectRepository(GymUser)
    readonly trainerToGymRepository: Repository<GymUser>,
    @InjectRepository(User)
    readonly userRepository: Repository<User>,
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
      where: [
        { email: email },
        { identification: identification },
        { username: username },
      ],
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
