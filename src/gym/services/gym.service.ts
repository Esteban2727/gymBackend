import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gym } from '../gym.entity';
import { IsNull, Not, Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { administrator } from '../entity/userAdministrador.entity';

@Injectable()
export class gymServices {
  constructor(
    @InjectRepository(Gym)
    readonly gymRepository: Repository<Gym>,
    @InjectRepository(administrator)
    readonly administratorRepository: Repository<administrator>,
  ) {}

  async verifyDatasGym(
    font: string,
    logoUrl: string,
    name: string,
    primaryColor: string,
    secondaryColor: string,
  ) {
    console.log(name);
    const verifyExistringGym = await this.gymRepository.findOne({
      where: [{ name: name }],
    });
    if (verifyExistringGym) {
      return 'este gymnasio ya esta registrado';
    }
    console.log(verifyExistringGym, 11);
    const gym = await this.gymRepository.create({
      font: font,
      logoUrl: logoUrl,
      name: name,
      primaryColor: primaryColor,
      secondaryColor: secondaryColor,
    });
    await this.gymRepository.save(gym);
    return false;
  }

  async deleteGymServices(id: string) {
    const verifyGym = await this.gymRepository.findOne({
      where: { id: id },
    });
    if (!verifyGym) {
      return 'ese gimnasio no existe en la base de datos';
    }
    await this.gymRepository.softRemove(verifyGym);
    return 'deleted';
  }

  async getDeletedGym() {
    const searchDeletedGym = await this.gymRepository.find({
      withDeleted: true,
      where: { deletedAt: Not(IsNull()) },
    });
    console.log(searchDeletedGym);
    return searchDeletedGym;
  }

  async getActiveGym() {
    const searchActivedGym = await this.gymRepository.find();
    return searchActivedGym;
  }

  async CreateUserAdministrator(
    cellphone: string,
    email: string,
    gender: string,
    identification: string,
    nameAdministrador: string,
    password: string,
  ) {
    const verifyUserGym = await this.administratorRepository.findOne({
      where: { identification: identification },
    });
    if (verifyUserGym) {
      return 'Este administrador ya fue creado';
    }
    const HashPassword: string = await bcrypt.hash(
      password,
      await bcrypt.genSalt(),
    );
    const createUserGym = await this.administratorRepository.create({
      email: email,
      gender: gender,
      identification: identification,
      rol: 'administrador',
      username: nameAdministrador,
      password: HashPassword,
      cellphone: cellphone,
    });

    await this.administratorRepository.save(createUserGym)
    
    return "Administrador creado exitosamente"
  }
}
