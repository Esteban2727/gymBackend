import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gym } from '../gym.entity';
import { IsNull, Not, Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { administrator } from '../entity/userAdministrador.entity';
import { GymUser } from '../gymUser.entity';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/auth/entity/user.entity';

@Injectable()
export class gymServices {
  constructor(
    @InjectRepository(Gym)
    readonly gymRepository: Repository<Gym>,
    @InjectRepository(administrator)
    readonly administratorRepository: Repository<administrator>,
    @InjectRepository(GymUser)
    readonly gymUserRepository: Repository<GymUser>,
    private readonly sendMail: MailService,
    @InjectRepository(User)
    readonly userRepository: Repository<User>,
    
  ) {}

  async verifyDatasGym(
    logoUrl: any,
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
    // Verificar si el gimnasio existe
    const verifyGym = await this.gymRepository.findOne({
      where: { id },
      relations: ['gymUsers', 'gymUsers.user'], // aseguramos que cargue los usuarios relacionados
    });
  
    if (!verifyGym) {
      return 'Ese gimnasio no existe en la base de datos';
    }
  
    // Obtener todos los usuarios relacionados al gimnasio a través de gymUser
    const gymUsers = verifyGym.gymUsers;
  
    if (gymUsers && gymUsers.length > 0) {
      const users = gymUsers.map(gymUser => gymUser.user);
  
      // Eliminamos los registros de gymUser
      await this.gymUserRepository.softRemove(gymUsers);
  
      // Eliminamos los usuarios relacionados
      await this.userRepository.softRemove(users);
    }
  
    // Finalmente eliminamos el gimnasio
    await this.gymRepository.softRemove(verifyGym);
  
    return 'Gimnasio, usuarios y relaciones eliminados correctamente';
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
    const searchActivedGym = await this.gymRepository
      .createQueryBuilder('gym')
      .select(['gym.name', 'gym.logo', 'us.username', 'us.email', 'us.rol'])
      .innerJoin(GymUser, 'gs', 'gs.gymId = gym.id')
      .innerJoin(User, 'us', 'us.identification = gs.userIdentification')
      .groupBy('gym.name , gym.logo, us.username,us.email,us.rol  ')
      .getRawMany();

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

    const subject = 'usuario creado, bienvenido';
    const html = `
  <div style="font-family: 'Roboto', sans-serif; background-color: #1e1e1e; padding: 30px; border-radius: 12px; max-width: 500px; margin: auto; color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);">
    <h1 style="color: #ff6f00; font-size: 24px;">Bienvenido al gimnasio, administrador ${nameAdministrador} 🏋️‍♂️</h1>

    <img src="https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif" alt="GIF Motivacional" style="width: 100%; border-radius: 8px; margin-top: 20px; border: 2px solid #ff6f00;" />

    <hr style="border: 1px dashed #ff6f00; margin: 20px 0;" />

    <p style="font-size: 16px;"><strong>Correo electrónico:</strong> <span style="color: #ffb84d;">${email}</span></p>
    <p style="font-size: 16px;"><strong>Contraseña:</strong> <span style="color: #ffb84d;">${password}</span></p>
    <p style="font-size: 16px;"><strong>Celular:</strong> <span style="color: #ffb84d;">${cellphone}</span></p>

    <hr style="border: 1px dashed #ff6f00; margin: 20px 0;" />

    <p style="font-size: 14px; color: #cccccc;">¡Gracias por unirte! Estamos emocionados de acompañarte en tu camino al éxito. 💪</p>
  </div>
`;
    await this.sendMail.sendEmail(email, html, subject);
    return assignUserToGym;
  }
}
