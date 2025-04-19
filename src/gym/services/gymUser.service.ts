import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GymUser } from '../gymUser.entity';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { User } from 'src/auth/entity/user.entity';

@Injectable()
export class GymUserServices {
  constructor(
    @InjectRepository(GymUser)
    readonly gymUserRepository: Repository<GymUser>,
  ) {}

  async userAssociateToGym(gymId: string) {
    const SearchUserInGym = await this.gymUserRepository
      .createQueryBuilder('gymUser')
      .innerJoinAndSelect('gymUser.user', 'user')
      .innerJoin('gymUser.gym', 'gym')
      .where('gym.id = :gymId', { gymId })
      .andWhere('user.rol != :rol', { rol: 'administrador' })
      .getMany();
    console.log(SearchUserInGym);
    return SearchUserInGym;
  }

  async createAsocciateGym(gymId: string, userId: string) {
    const assignUserToGym = await this.gymUserRepository.create({
      gym: { id: gymId },
      user: { identification: userId },
    });
    await this.gymUserRepository.save(assignUserToGym);
    return assignUserToGym;
  }
}
