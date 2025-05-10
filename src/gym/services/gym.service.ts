import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gym } from '../gym.entity';
import { DataSource, IsNull, Not, Repository } from 'typeorm';

import * as bcrypt from 'bcryptjs';
import { administrator } from '../entity/userAdministrador.entity';
import { GymUser } from '../gymUser.entity';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/auth/entity/user.entity';
import { DashboardServices } from 'src/dashboard/services/dashboard.service';
import { Customer } from 'src/customer/customer.entity';
import { error } from 'console';

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
    private readonly dataSource: DataSource,
    private readonly dashboardService: DashboardServices,
  ) {}
  async verifyDatasGym(
    logoUrl: any,
    name: string,
    primaryColor: string,
    secondaryColor: string,
  ) {
    console.log('cambios');
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
    await this.gymRepository
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

  async deleteGymServices(name: string) {
    console.log(name, 'entro el gym');

    const querybuilder = await this.dataSource.createQueryRunner();
    await querybuilder.connect();
    await querybuilder.startTransaction();
    try {
      const verifyGym = await querybuilder.manager.findOne(
        this.gymRepository.target,
        {
          where: { name: name },
          relations: ['gymUsers', 'gymUsers.user'],
          withDeleted: false,
        },
      );
      console.log(verifyGym, 'hola');
      if (!verifyGym) {
        return 'Ese gimnasio no existe en la base de datos';
      }

      const gymUsers = verifyGym.gymUsers;

      if (gymUsers && gymUsers.length > 0) {
        const users = gymUsers.map((gymUser) => gymUser.user);

        await querybuilder.manager.softRemove(gymUsers);

        await querybuilder.manager.softRemove(users);
      }

      await querybuilder.manager.softRemove(verifyGym);
      await querybuilder.commitTransaction();
      await this.dashboardService.updateDatasInformation();
    } catch (error) {
      await querybuilder.rollbackTransaction();
      throw error;
    } finally {
      await querybuilder.release();
    }

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

  async getActiveGymByid(gym: string) {
    const searchActivedGym = await this.gymRepository.findOne({
      where: { id: gym },
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
    const userByEmail = await this.administratorRepository.findOne({
      where: {
        email,
      },
      withDeleted: true,
    });

    const userByIdentification = await this.administratorRepository.findOne({
      where: {
        identification,
      },
      withDeleted: true,
    });

    if (userByEmail || userByIdentification) {
      throw new BadRequestException(
        'Ya existe un usuario con ese correo o identificación',
      );
    }
    const verifyGym = await this.gymRepository.findOne({
      where: { name: nombreGym },
      withDeleted: false,
    });
    if (verifyGym) {
      throw new BadRequestException('Ya existe ese nombre de gymnasio');
    }

    const HashPassword: string = await bcrypt.hash(
      password,
      await bcrypt.genSalt(),
    );

    const querybuilder = this.dataSource.createQueryRunner();
    await querybuilder.connect();
    await querybuilder.startTransaction();
    try {
      await querybuilder.manager
        .createQueryBuilder()
        .insert()
        .into('user')
        .values({
          email: email,
          gender: gender,
          identification: identification,
          rol: 'administrador',
          username: nameAdministrador,
          password: HashPassword,
          cellphone: cellphone,
        })
        .execute();

      const insertResult = await querybuilder.manager
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

      const assignUserToGym = await querybuilder.manager.create(
        this.gymUserRepository.target,
        {
          gym: { id: gymId },
          user: { identification: identification },
        },
      );
      await querybuilder.manager.save(
        this.gymUserRepository.target,
        assignUserToGym,
      );

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
      await querybuilder.commitTransaction();
      await this.dashboardService.updateDatasInformation();
      return assignUserToGym;
    } catch (error) {
      await querybuilder.rollbackTransaction();
      throw error;
    } finally {
      await querybuilder.release();
    }
  }

  async getInformation() {
    const getGymAndUser = await this.gymRepository
      .createQueryBuilder('gm')
      .select([
        'gm.logo',
        'gm.name',
        'gm.createdAt',
        'ad.username',
        'gm.id',

        `(SELECT COUNT(*) 
          FROM gym_user gu 
          INNER JOIN "user" u ON gu."userIdentification" = u."identification" 
          WHERE gu."gymId" = gm.id AND u.rol = 'customer' AND gu."deletedAt" IS NULL AND u."deletedAt" IS NULL
        ) AS "customerCount"`,

        // Contar 'trainers'
        `(SELECT COUNT(*) 
          FROM gym_user gu 
          INNER JOIN "user" u ON gu."userIdentification" = u."identification" 
          WHERE gu."gymId" = gm.id AND u.rol = 'Trainer' AND gu."deletedAt" IS NULL AND u."deletedAt" IS NULL
        ) AS "trainerCount"`,
      ])
      .innerJoin('gym_user', 'gu', 'gu.gymId = gm.id')
      .innerJoin(
        'user',
        'ad',
        "ad.identification = gu.userIdentification AND ad.rol = 'administrador'",
      )
      .where('gm.deletedAt IS NULL')
      .andWhere('gu.deletedAt IS NULL')
      .andWhere('ad.deletedAt IS NULL')
      .groupBy('gm.id, gm.logo, gm.name, ad.username, gm.createdAt')

      .orderBy('gm.createdAt', 'ASC')
      .getRawMany();

    return getGymAndUser;
  }
  async ActivateGym(id: string) {
    const verify = await this.gymRepository.findOne({
      where: { id: id },
      withDeleted: true,
    });
    if (!verify) {
      return 'ESE GYMNASIO NO EXISTE';
    }
    await this.gymRepository.recover(verify);
  }

  async getAllCustomer(id: string) {
    const dataCustomer = await this.gymRepository
      .createQueryBuilder('gym')
      .select([
        'cm.identification',
        'cm.username as nombre',
        'cm.email as correo ',
        'cm.gender',
        'cm.cellphone',
        'cm.profilePicture ',
        'cm.createdAt',
        'cm.deletedAt',
      ])
      .withDeleted()
      .leftJoin(GymUser, 'gu', 'gu.gymId = gym.id')
      .leftJoin(Customer, 'cm', 'cm.identification = gu.userIdentification')
      .where('gym.id = :id', { id })
      .andWhere('cm.rol != :rol', { rol: 'administrador' })
      .getRawMany();

    return dataCustomer;
  }

  async chamgeInformationGym(name: string, id: string): Promise<string> {
    const verifyGym = await this.gymRepository.findOne({
      where: { id: id },
    });
    if (!verifyGym) {
      throw error('ese gimnasio no existe');
    }
    const convert = name.toLowerCase().replace(' ', '').trim();
    console.log(convert);

    const verifyName = await this.gymRepository.find({
      where: { name: convert },
    });
    if (verifyName) {
      return `el nombre del gimnasio ${name} ya existe`;
    }
    await this.gymRepository
      .createQueryBuilder()
      .update(Gym)
      .set({
        name: name,
      })
      .where('id = :id', { id })
      .execute();
    return 'Cambios realizados';
  }
}
