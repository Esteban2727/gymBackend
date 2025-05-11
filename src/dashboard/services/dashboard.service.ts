import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { SocketGateway } from '../../gateways/socket.gateway';
import { User } from 'src/auth/entity/user.entity';
import { GymUser } from 'src/gym/gymUser.entity';
import { Gym } from 'src/gym/gym.entity';
import { TrainerCustomer } from 'src/Trainer/trainerCustomer.entity';

@Injectable()
export class DashboardServices {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(GymUser)
    private readonly GymUserRepository: Repository<GymUser>,

    @InjectRepository(Gym)
    private readonly gymRepository: Repository<Gym>,

    readonly socketGateway: SocketGateway,
    readonly dataSource: DataSource,
  ) {}

  async getDatasInformation(gender: string): Promise<string> {
    const [, countGender] = await this.userRepository.findAndCount({
      where: { gender },
      withDeleted: false,
    });
    const totalUsers = await this.userRepository.count();
    const percentage = ((countGender / totalUsers) * 100).toFixed(2);
    return `${percentage}%`;
  }

  async getDatasinformationActive(): Promise<any> {
    const data = await this.GymUserRepository.createQueryBuilder('gymUser')
      .select('gym.id', 'gymId')
      .addSelect('gym.name', 'gymName')
      .addSelect('COUNT(gymUser.id)', 'activeUserCount')
      .addSelect(
        "json_agg(json_build_object('identification', user.identification, 'username', user.username, 'email', user.email))",
        'users',
      )
      .innerJoin('gymUser.gym', 'gym')
      .innerJoin('gymUser.user', 'user')
      .where('gymUser.isActive = :isActive', { isActive: true })
      .groupBy('gym.id')
      .addGroupBy('gym.name')
      .orderBy('gym.name', 'DESC')
      .getRawMany();

    this.socketGateway.emitDashboardUpdate({ activeUsersByGym: data });
    return data;
  }

  async updateDatasInformation(): Promise<void> {
    const data = await this.getDatasInformation('male');
    const dataPeople = await this.PersonasByGym();
    this.socketGateway.emitDashboardUpdate({ percentageMale: data });
    this.socketGateway.emitDashboardUpdate({ percentageMale: dataPeople });
  }

  async PersonasByGym() {
    const data = await this.userRepository
      .createQueryBuilder('u')
      .innerJoin('u.gymUsers', 'gu')
      .innerJoin('gu.gym', 'g')
      .select('g.id', 'gymId')
      .addSelect('g.name', 'gymName')
      .addSelect('COUNT(u.identification)', 'totalPeople')
      .groupBy('g.id')
      .addGroupBy('g.name')
      .getRawMany();

    this.socketGateway.emitDashboardUpdate({ peopleByGym: data });
    return data;
  }

  async getDatasInformationGenderByGym(gender: string, gymId: string) {
    const genderCount = await this.userRepository
      .createQueryBuilder('u')
      .leftJoin(GymUser, 'gu', 'gu.userIdentification = u.identification')
      .leftJoin(Gym, 'g', 'g.id = gu.gymId')
      .where('u.gender = :gender', { gender })
      .andWhere('u.rol != :rol', { rol: 'administrador' })
      .andWhere('g.id = :gymId', { gymId })
      .getCount();

    const totalUsersInGym = await this.userRepository
      .createQueryBuilder('u')
      .leftJoin(GymUser, 'gu', 'gu.userIdentification = u.identification')
      .leftJoin(Gym, 'g', 'g.id = gu.gymId')
      .where('g.id = :gymId', { gymId })
      .andWhere('u.rol != :rol', { rol: 'administrador' })
      .getCount();

    const percentage =
      totalUsersInGym > 0
        ? ((genderCount / totalUsersInGym) * 100).toFixed(2)
        : '0.00';

    this.socketGateway.emitDashboardUpdate({ percentageMale: percentage });
  }

  async getGymsActiveInactivePercentage(): Promise<{
    active: string;
    inactive: string;
  }> {
    const activeCount = await this.gymRepository.count({
      where: { deletedAt: null },
    });
    const totalCount = await this.gymRepository.count({ withDeleted: true });
    const inactiveCount = totalCount - activeCount;

    const activePercentage =
      totalCount > 0 ? ((activeCount / totalCount) * 100).toFixed(2) : '0.00';
    const inactivePercentage =
      totalCount > 0 ? ((inactiveCount / totalCount) * 100).toFixed(2) : '0.00';

    const payload = {
      active: `${activePercentage}%`,
      inactive: `${inactivePercentage}%`,
    };
    this.socketGateway.emitDashboardUpdate({ gymStatus: payload });
    return payload;
  }

  async getUsersRegisteredByMonth(): Promise<any[]> {
    const data = await this.userRepository
      .createQueryBuilder('user')
      .select(`TO_CHAR(user.createdAt, 'YYYY-MM')`, 'month')
      .addSelect('COUNT(*)', 'count')
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    this.socketGateway.emitDashboardUpdate({ usersPerMonth: data });
    return data;
  }

  async getBrandColorStats(): Promise<any[]> {
    const data = await this.gymRepository
      .createQueryBuilder('gym')
      .select('gym.primary', 'color')
      .addSelect('COUNT(*)', 'count')
      .groupBy('gym.primary')
      .orderBy('count', 'DESC')
      .getRawMany();

    this.socketGateway.emitDashboardUpdate({ brandColors: data });
    return data;
  }

  async emitFullDashboardUpdate() {
    const genderMale = await this.getDatasInformation('male');
    const people = await this.PersonasByGym();
    const activeUsers = await this.getDatasinformationActive();
    const colors = await this.getBrandColorStats();
    const gyms = await this.getGymsActiveInactivePercentage();
    const usersByMonth = await this.getUsersRegisteredByMonth();

    const payload = {
      genderMale,
      people,
      activeUsers,
      colors,
      gyms,
      usersByMonth,
    };

    this.socketGateway.emitDashboardUpdate(payload);
    return payload;
  }

  async getDatasInformationGenderByTrainer(gender: string, trainerId: string) {
    // Total de clientes asignados al entrenador
    const totalCustomers = await this.userRepository
      .createQueryBuilder('u')
      .innerJoin(
        TrainerCustomer,
        'tc',
        'tc.customerIdentification = u.identification',
      )
      .where('tc.trainerIdentification = :trainerId', { trainerId })
      .andWhere('u.rol != :rol', { rol: 'administrador' })
      .getCount();

    // Total de clientes de cierto género asignados al entrenador
    const genderCount = await this.userRepository
      .createQueryBuilder('u')
      .innerJoin(
        TrainerCustomer,
        'tc',
        'tc.customerIdentification = u.identification',
      )
      .where('tc.trainerIdentification = :trainerId', { trainerId })
      .andWhere('u.gender = :gender', { gender })
      .andWhere('u.rol != :rol', { rol: 'administrador' })
      .getCount();

    const percentage =
      totalCustomers > 0
        ? ((genderCount / totalCustomers) * 100).toFixed(2)
        : '0.00';

    this.socketGateway.emitDashboardUpdate({ percentageMale: percentage });

    return { percentageMale: percentage };
  }

  async getDatasInformationByTrainer(trainerId: string) {
    console.log(trainerId, 2222222);
    const gymUser = await this.GymUserRepository.createQueryBuilder('gu')
      .select(['gu.gymId'])
      .leftJoin(User, 'us', 'us.identification = gu.userIdentification')
      .where('gu.userIdentification = :trainerId', { trainerId })
      .getRawOne();

    if (!gymUser) {
      throw new Error('Entrenador no asignado a ningún gimnasio');
    }
    console.log(gymUser, 222431);

    // Total de usuarios del gimnasio, excluyendo administradores y entrenadores
    const totalUsersInGym = await this.userRepository
      .createQueryBuilder('u')
      .innerJoin(GymUser, 'gu', 'gu.userIdentification = u.identification')
      .where('gu.gymId = :gymId', { gymId: gymUser.gymId })
      .andWhere('u.rol = :rol', { rol: 'Trainer' })
      .getCount();

    console.log(totalUsersInGym, 3333);

    // Total de clientes asignados al entrenador
    const customerCount = await this.userRepository
      .createQueryBuilder('u')
      .innerJoin(
        TrainerCustomer,
        'tc',
        'tc.customerIdentification = u.identification',
      )
      .where('tc.trainerIdentification = :trainerId', { trainerId })
      .andWhere('u.rol != :rol', { rol: 'administrador' }) // por si acaso
      .getCount();

    console.log(customerCount, 45444);

    const percentage =
      totalUsersInGym > 0
        ? ((customerCount / totalUsersInGym) * 100).toFixed(2)
        : '0.00';

    this.socketGateway.emitDashboardUpdate({
      trainerCustomerPercentage: percentage,
    });

    return { trainerCustomerPercentage: percentage };
  }

  async emitFullDashboardUpdateTrainer(id:string) {
    const data1 = await this.getDatasInformationGenderByTrainer('male', id);
    const data2 = await this.getDatasInformationGenderByGym('male', id);

    const payload = {
      data1,
      data2,
    };

    this.socketGateway.emitDashboardUpdate(payload);
    return payload;
  }
}
