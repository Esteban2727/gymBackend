import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Routine } from './rutine.entity';
import { UpdateRoutineDto } from './DTO/update-routine.dto';
import { RoutineTrainer } from './routineTrainer';
import { Trainer } from 'src/Trainer/trainer.entity';
import { GymUser } from 'src/gym/gymUser.entity';

@Injectable()
export class RoutineService {
  constructor(
    @InjectRepository(Routine) readonly routineRepository: Repository<Routine>,
    @InjectRepository(RoutineTrainer)
    readonly routineTrainerRepository: Repository<RoutineTrainer>,
    private readonly dataSource: DataSource,
  ) {}
  async getServiceRoutines() {
    const getAllRoutines = await this.routineRepository.find({
      withDeleted: false, //Evita que find() devuelva rutinas eliminadas con soft delete
    });
    return getAllRoutines;
  }
  async getServiceRoutineByName(name: string) {
    const specificRoutine = await this.routineRepository.findOne({
      where: { name },
    });
    if (!specificRoutine) {
      const getAllRoutines = await this.getServiceRoutines();
      return { Advertencia: 'Rutina no existente', getAllRoutines };
    }
    return specificRoutine;
  }
  async deleteServiceRoutine(name: string) {
    const routinetoDelete = await this.routineRepository.findOne({
      where: { name },
    });
    if (!routinetoDelete) {
      return { Advertencia: 'Rutina no existente' };
    }
    await this.routineRepository.softRemove(routinetoDelete);
    return { mensaje: 'Ejercico eliminado exitosamente (soft delete)' };
  }
  async createServiceRoutine(name: string, description: string, id: string) {
    const findRoutine = await this.routineRepository.findOne({
      where: { name },
      withDeleted: false,
    });
    if (findRoutine) {
      return { Advertencia: 'Rutina existente' };
    }
    const querybuilder = await this.dataSource.createQueryRunner();
    await querybuilder.connect();
    await querybuilder.startTransaction();

    try {
      const newRoutine = await querybuilder.manager
        .createQueryBuilder()
        .insert()
        .into(Routine)
        .values({
          name: name,
          description: description,
        })
        .returning('id')
        .execute();

      const insertRoutineWithTrainer = await querybuilder.manager
        .createQueryBuilder()
        .insert()
        .into(RoutineTrainer)
        .values({
          routine: { id: newRoutine.raw[0].id },
          trainer: { identification: id },
        })
        .execute();
      await querybuilder.commitTransaction();
      return newRoutine;
    } catch (e) {
      await querybuilder.rollbackTransaction();
      return 'error al realizar la transaccion ';
    } finally {
      await querybuilder.release();
    }
  }
  async updateServiceRoutine(id: number, updateDto: UpdateRoutineDto) {
    const verificate = await this.routineRepository.findOne({
      where: { id },
    });

    const nombre = verificate.name;
    const descripcion = verificate.description;
    const esta_activo = verificate.is_active;

    const { description, is_active, name } = updateDto;
    if (
      nombre == name &&
      descripcion == description &&
      esta_activo == is_active
    ) {
      return 'No hay cambios en los datos';
    }

    const result = await this.routineRepository
      .createQueryBuilder()
      .update(Routine)
      .set(updateDto)
      .where('id = :id', { id })
      .execute();

    if (result.affected === 0) {
      return { Advertencia: 'No se encontró ninguna rutina con ese ID' };
    }
    return { mensaje: 'Rutina actualizada correctamente' };
  }
  async serviceRecoverRoutine(id: number) {
    const findRoutine = await this.routineRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!findRoutine) {
      return 'La rutina no existe';
    }
    const recoverRoutine = await this.routineRepository.restore(id);
    return 'Rutina recuperada';
  }
  async serviceRoutinesTrainers(gymId: string) {
    console.log(gymId);
    const getRoutinesTrainer = await this.routineRepository
      .createQueryBuilder('r')
      .select([
        'r.name',
        'r.description',
        'tr.identification',
        'tr.username',
        'tr.profilePicture',
      ])
      .leftJoin(RoutineTrainer, 'rt', 'rt.routineId = r.id')
      .leftJoin(Trainer, 'tr', 'tr.identification = rt.trainerIdentification')
      .leftJoin(GymUser, 'gm', 'gm.userIdentification = tr.identification')
      .where('gm.gymId = :id', { id: gymId })
      .getRawMany();
    return getRoutinesTrainer;
  }

  async getTrainerWithRoutine(id: string) {
    const verifyIdTrainer = await this.routineRepository
      .createQueryBuilder('r')
      .select(['r.name', 'r.description'])
      .leftJoin(RoutineTrainer, 'rt', 'rt.routineId = r.id')
      .leftJoin(Trainer, 'tr', 'tr.identification = rt.trainerIdentification')
      .where('tr.identification = :id', { id })
      .getRawMany();

    return verifyIdTrainer;
  }
}
