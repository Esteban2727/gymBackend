import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SocketGateway } from '../../gateways/socket.gateway';
import { User } from 'src/auth/entity/user.entity';
import { GymUser } from 'src/gym/gymUser.entity';

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
      withDeleted: false
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
    this.socketGateway.emitDashboardUpdate({ percentageMale: data });
  }
}
