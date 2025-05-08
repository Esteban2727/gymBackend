import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from '../../auth/entity/user.entity';
import { GymUser } from 'src/gym/gymUser.entity';
import { Gym } from 'src/gym/gym.entity';
import { Subscription } from 'src/subcription/Entity/subcription.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllUser() {
    return await this.userRepository.find({
      where: { rol: Not('superadmin'), deletedAt: null },
    });
  }
  async getUserById(id: string) {
    return await this.userRepository
      .createQueryBuilder('us')
      .select([
        'us.username',
        'us.cellphone',
        'us.email',
        'us.rol',
        'us.profilePicture',
        'us.gender',
        'us.identification',
        'gm.name',
        'sb.remainingDays',
        'sb.startDate',
      ])
      .where('us.identification = :value', { value: id })
      .innerJoin(GymUser, 'gu', 'gu.userIdentification = us.identification')
      .innerJoin(Gym, 'gm', 'gm.id = gu.gymId')
      .innerJoin(
        Subscription,
        'sb',
        'sb.customerIdentification = us.identification',
      )
      .getRawOne();
  }

  async updateProfilePicture(userId: string, imageUrl: string) {
    const user = await this.userRepository.findOne({
      where: { identification: userId },
    });
    if (!user) {
      throw new Error(' Usuario no encontrado');
    }
    user.profilePicture = imageUrl;
    await this.userRepository.save(user);
    return user;
  }

  async activateUser(id: string) {
    const verify = await this.userRepository.findOne({
      where: { identification: id },
      withDeleted: true,
    });
    if (!verify) {
      return 'ese usuario no esta en la base de datos';
    }
    await this.userRepository.recover(verify);
    return 'agregado de nuevo';
  }
}
