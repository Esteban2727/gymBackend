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

    private readonly socketGateway: SocketGateway,
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
    return this.GymUserRepository.createQueryBuilder('gymUser')
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
  }

  async updateDatasInformation(): Promise<void> {
    const data = await this.getDatasInformation('male');
    const dataPeople = await this.PersonasByGym();
    this.socketGateway.emitDashboardUpdate({ percentageMale: data });
    this.socketGateway.emitDashboardUpdate({ percentageMale: dataPeople });
  }

  async PersonasByGym() {
    return await this.userRepository
      .createQueryBuilder('u')
      .innerJoin('u.gymUsers', 'gu')
      .innerJoin('gu.gym', 'g')
      .select('g.id', 'gymId')
      .addSelect('g.name', 'gymName')
      .addSelect('COUNT(u.identification)', 'totalPeople')
      .groupBy('g.id')
      .addGroupBy('g.name')
      .getRawMany();
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
}
