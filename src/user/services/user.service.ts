import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { User } from '../../auth/entity/user.entity';
import { GymUser } from 'src/gym/gymUser.entity';
import { Gym } from 'src/gym/gym.entity';
import { Subscription } from 'src/subcription/Entity/subcription.entity';
import { TrainerCustomer } from 'src/Trainer/trainerCustomer.entity';
import { Trainer } from 'src/Trainer/trainer.entity';
import { RoutineTrainer } from 'src/rutine/routineTrainer';
import { AdminDto } from '../adminDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(GymUser)
    private gymUserRepository: Repository<GymUser>,

    @InjectRepository(TrainerCustomer)
    private trainerCustomerRepository: Repository<TrainerCustomer>,

    @InjectRepository(RoutineTrainer)
    private routineTrainerRepository: Repository<RoutineTrainer>,

    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Gym)
    private gymRepository: Repository<Gym>,

    private readonly dataSource: DataSource,
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
        'gm.name as nameGym',
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

    return data;
  }

  async updateProfilePicture(userId: string, imageUrl: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { identification: userId },
      });

      if (!user) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
      }

      if (!imageUrl || imageUrl.trim() === '') {
        throw new InternalServerErrorException('URL de imagen inválida');
      }

      user.profilePicture = imageUrl;

      const updatedUser = await this.userRepository.save(user);

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
  async activateCustomerAndTrainer(id: string) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.getRepository(User).findOne({
        where: { identification: id },
        withDeleted: true,
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Recuperar usuario
      await manager.getRepository(User).recover(user);

      // Recuperar gym_user
      const gymUsers = await manager.getRepository(GymUser).find({
        where: { user: { identification: id } },
        withDeleted: true,
      });
      for (const gymUser of gymUsers) {
        await manager.getRepository(GymUser).recover(gymUser);
      }

      // Recuperar trainer_customer donde sea entrenador o cliente
      const trainerCustomers = await manager
        .getRepository(TrainerCustomer)
        .find({
          where: [
            { trainer: { identification: id } },
            { customer: { identification: id } },
          ],
          withDeleted: true,
        });
      for (const tc of trainerCustomers) {
        await manager.getRepository(TrainerCustomer).recover(tc);
      }

      // Recuperar routine_trainer (donde sea entrenador)
      const routineTrainers = await manager.getRepository(RoutineTrainer).find({
        where: { trainer: { identification: id } },
        withDeleted: true,
      });
      for (const rt of routineTrainers) {
        await manager.getRepository(RoutineTrainer).recover(rt);
      }

      // Recuperar subscriptions (donde sea cliente)
      const subscriptions = await manager.getRepository(Subscription).find({
        where: { customer: { identification: id } },
        withDeleted: true,
      });
      for (const sub of subscriptions) {
        await manager.getRepository(Subscription).recover(sub);
      }

      return {
        success: true,
        message: 'Usuario y relaciones reactivados con recover y transacción',
      };
    });
  }

  async softRemoveCustomerAndTrainer(id: string) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.getRepository(User).findOne({
        where: { identification: id },
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // SoftRemove - GymUser
      const gymUsers = await manager.getRepository(GymUser).find({
        where: { user: { identification: id } },
      });
      if (gymUsers.length > 0) {
        await manager.getRepository(GymUser).softRemove(gymUsers);
      }

      // SoftRemove - TrainerCustomer
      const trainerCustomers = await manager
        .getRepository(TrainerCustomer)
        .find({
          where: [
            { trainer: { identification: id } },
            { customer: { identification: id } },
          ],
        });
      if (trainerCustomers.length > 0) {
        await manager
          .getRepository(TrainerCustomer)
          .softRemove(trainerCustomers);
      }

      // SoftRemove - RoutineTrainer
      const routineTrainers = await manager.getRepository(RoutineTrainer).find({
        where: { trainer: { identification: id } },
      });
      if (routineTrainers.length > 0) {
        await manager.getRepository(RoutineTrainer).softRemove(routineTrainers);
      }

      // SoftRemove - Subscriptions
      const subscriptions = await manager.getRepository(Subscription).find({
        where: { customer: { identification: id } },
      });
      if (subscriptions.length > 0) {
        await manager.getRepository(Subscription).softRemove(subscriptions);
      }

      // Finalmente, softRemove del usuario
      await manager.getRepository(User).softRemove(user);

      return {
        success: true,
        message: 'Usuario y sus relaciones eliminados (soft)',
      };
    });
  }

  async getAllUserByGym(id: string): Promise<any> {
    const getAllUser = await this.userRepository
      .createQueryBuilder('us')
      .select([
        'us.username as name',
        'us.gender as gender',
        'us.identification as identificacion',
        'us.cellphone as celular',
        'us.email as email',
        'us.rol as rol',
        'us.profilePicture as imagen',
      ])
      .leftJoin(GymUser, 'gs', 'gs.userIdentification = us.identification')
      .leftJoin(Gym, 'gm', 'gm.id = gs.gymId')
      .where('us.rol != :rol  and us.rol != :roles', {
        rol: 'superadmin',
        roles: 'administrador',
      })
      .andWhere('gm.id = :id', { id })
      .getRawMany();

    return getAllUser;
  }
  async UpdateuserGym(id: string, adminDto: AdminDto,idGym:string) {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ cellphone: adminDto.cel, username: adminDto.name })
      .where('identification = :id', { id: id })
      .execute();

    await this.gymRepository
      .createQueryBuilder()
      .update(Gym)
      .set({
        name: adminDto.nombreGym,
      })
      .where('id = :id', { id: idGym })
      .execute();

    return 'actualizado exitosamente>';
  }
}
