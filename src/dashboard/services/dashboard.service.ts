import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SocketGateway } from '../../gateways/socket.gateway';
import { User } from 'src/auth/entity/user.entity';
import { GymUser } from 'src/gym/gymUser.entity';
import { Gym } from 'src/gym/gym.entity';

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
}
