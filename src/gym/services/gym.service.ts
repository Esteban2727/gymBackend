import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gym } from '../gym.entity';
import { IsNull, Not, Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { administrator } from '../entity/userAdministrador.entity';
import { GymUser } from '../gymUser.entity';

@Injectable()
export class gymServices {
  constructor(
    @InjectRepository(Gym)
    readonly gymRepository: Repository<Gym>,
    @InjectRepository(administrator)
    readonly administratorRepository: Repository<administrator>,
    @InjectRepository(GymUser)
    readonly gymUserRepository: Repository<GymUser>,
  ) {}

  async verifyDatasGym(

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
      logo: logoUrl,
      name: name,
      primary: primaryColor,
      secondary: secondaryColor,
    });
    await this.gymRepository.save(gym);
    return false;
  }

  async changeGym(
    id: string,

    logo: any,
    primary: string,
    secondary: string,
    third: string,
    fourth: string,
    fontFamily: string,
  ) {
    const verifyGym = await this.gymRepository.findOne({
      where: { id: id },
    });
    if (!verifyGym) {
      new BadRequestException('dont exist that gym');
    }
    const updateGym = await this.gymRepository
      .createQueryBuilder('gym')
      .update(Gym)
      .set({
        logo: logo,
        primary: primary,
        secondary: secondary,
        third: third,
        fourth: fourth,
        fontFamily: fontFamily,
      })
      .where('gym.id = :id', { id })
      .execute();

    return 'done';
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

  async getActiveGymByid(id: string) {
    const searchActivedGym = await this.gymRepository.findOne({
      where: { id: id },
    });
    return searchActivedGym;
  }

  async CreateUserAdministrator(
    cellphone: string,
    email: string,
    gender: string,
    identification: string,
    nameAdministrador: string,
    password: string,
    nombreGym: string,
  ) {
    const verifyUserGym = await this.administratorRepository.findOne({
      where: [{ identification }, { email }],
    });

    const verifyGym = await this.gymRepository.findOne({
      where: { name: nombreGym },
    });
    if (verifyGym) {
      throw new BadRequestException('Ya existe ese nombre de gymnasio');
    }
    if (verifyUserGym) {
      throw new BadRequestException(
        'Ya existe un administrador con esa identificación o correo',
      );
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

    await this.administratorRepository.save(createUserGym);

    const insertResult = await this.gymRepository
      .createQueryBuilder()
      .insert()
      .into('gym')
      .values({
        name: nombreGym,
        font: "Roboto', sans-serif",
        primaryColor: '#ff6f00',
        secondaryColor: '#1e1e1e',
      })
      .returning(['id'])
      .execute();

    const gymId = insertResult.raw[0].id;

    const assignUserToGym = await this.gymUserRepository.create({
      gym: { id: gymId },
      user: { identification: identification },
    });
    await this.gymUserRepository.save(assignUserToGym);
    return assignUserToGym;

    return 'Administrador y gimnasio creado exitosamente';
  }
}
