import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from '../../auth/entity/user.entity';
import { GymUser } from 'src/gym/gymUser.entity';
import { Gym } from 'src/gym/gym.entity';
import { Subscription } from 'src/subcription/Entity/subcription.entity';
import { TrainerCustomer } from 'src/Trainer/trainerCustomer.entity';
import { Trainer } from 'src/Trainer/trainer.entity';

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
     const data = await this.userRepository
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
        'tm.trainerIdentification as cedulaEntrenador',
        'tr.username as nombreEntrenador',
        'tr.certifications as experiencia',
        'tr.yearExperience  as  year',
        'tr.profilePicture',
      ])
      .where('us.identification = :value', { value: id })
      .leftJoin(GymUser, 'gu', 'gu.userIdentification = us.identification')
      .leftJoin(Gym, 'gm', 'gm.id = gu.gymId')
      .leftJoin(
        Subscription,
        'sb',
        'sb.customerIdentification = us.identification',
      )
      .leftJoin(
        TrainerCustomer,
        'tm',
        'tm.customerIdentification = us.identification',
      )
      .leftJoin(Trainer, 'tr', 'tm.trainerIdentification = tr.identification')
      .getRawOne();

      
      return data
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
