import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Routine } from './rutine.entity';
import { UpdateRoutineDto } from './DTO/update-routine.dto';
import { RoutineTrainer } from './routineTrainer';
import { Trainer } from 'src/Trainer/trainer.entity';
import { GymUser } from 'src/gym/gymUser.entity';
import { RoutineExercise } from './routineExcersise.entity';
import { Exercise } from 'src/exercises/Entity/exercise.entity';
import { ExerciseTrainingType } from 'src/exercise-trainingType/Entity/exercise-trainingType.entity';
import { TrainingType } from 'src/trainingType/entity/trainingType.entity';
import { ExerciseMuscleGroup } from 'src/exerciseGroupMuscular/exerciseGroupMuscular.entity';
import { MuscleGroup } from 'src/groupMuscle/Entity/muscleGroup.entity';
import { RoutineDto } from './DTO/routine.dto';
import { RoutineCreateDto } from './RoutineCreateDto';
import { ExerciseGroupService } from 'src/exercises/services/exercise.service';

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
  async deleteServiceRoutine(id: string) {
    const routine = await this.routineRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['routineExercises', 'routineTrainers'],
    });

    if (!routine) {
      return { Advertencia: 'Rutina no existente' };
    }

    // Iniciar transacción
    await this.dataSource.transaction(async (manager) => {
      // 1. Obtener ejercicios relacionados con la rutina
      const routineExercises = await manager
        .getRepository(RoutineExercise)
        .find({
          where: { routine: { id: routine.id } },
          relations: ['exercise'],
        });

      for (const routineExercise of routineExercises) {
        const exerciseId = routineExercise.exercise.id;

        // 2. Eliminar asociaciones con tipo de entrenamiento
        const trainingRelations = await manager
          .getRepository(ExerciseTrainingType)
          .find({
            where: { exercise: { id: exerciseId } },
          });
        if (trainingRelations.length > 0) {
          await manager
            .getRepository(ExerciseTrainingType)
            .softRemove(trainingRelations);
        }

        // 3. Eliminar asociaciones con grupo muscular
        const muscleGroupRelations = await manager
          .getRepository(ExerciseMuscleGroup)
          .find({
            where: { exercise: { id: exerciseId } },
          });
        if (muscleGroupRelations.length > 0) {
          await manager
            .getRepository(ExerciseMuscleGroup)
            .softRemove(muscleGroupRelations);
        }

        // 4. Eliminar el ejercicio
        await manager
          .getRepository(Exercise)
          .softRemove(routineExercise.exercise);
      }

      // 5. Eliminar RoutineExercise
      await manager.getRepository(RoutineExercise).softRemove(routineExercises);

      // 6. Eliminar RoutineTrainer
      const trainers = await manager.getRepository(RoutineTrainer).find({
        where: { routine: { id: routine.id } },
      });
      if (trainers.length > 0) {
        await manager.getRepository(RoutineTrainer).softRemove(trainers);
      }

      // 7. Eliminar la rutina
      await manager.getRepository(Routine).softRemove(routine);
    });

    return { mensaje: 'Rutina eliminada exitosamente (soft delete)' };
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
      .set({ description: updateDto.description, name: updateDto.name })
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
        'r.id',
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
      .select(['r.name', 'r.description', 'r.id'])
      .leftJoin(RoutineTrainer, 'rt', 'rt.routineId = r.id')
      .leftJoin(Trainer, 'tr', 'tr.identification = rt.trainerIdentification')
      .where('tr.identification = :id', { id })
      .getRawMany();

    return verifyIdTrainer;
  }

  async getAllRoutine(
    id: string,
    trainingTypeName?: string,
    muscleGroupName?: string,
    difficultyLevel?: string,
  ) {
    const query = this.routineRepository
      .createQueryBuilder('routine')
      .innerJoin(RoutineExercise, 're', 're.routineId = routine.id')
      .innerJoin(Exercise, 'exercise', 'exercise.id = re.exerciseId')
      .innerJoin(ExerciseTrainingType, 'et', 'et.exercise_id = exercise.id')
      .innerJoin(TrainingType, 'type', 'type.id = et.training_type_id')
      .innerJoin(ExerciseMuscleGroup, 'emg', 'emg.exerciseId = exercise.id')
      .innerJoin(MuscleGroup, 'mg', 'mg.id = emg.muscleGroupId')
      .innerJoin(RoutineTrainer, 'rt', 'rt.routineId = routine.id')
      .where('rt.trainerIdentification = :id', { id: id })
      .select([
        'routine.id AS routineId',
        'routine.name AS routineName',
        'routine.description as descriptioRoutine',
        'type.name AS trainingTypeName',
        'type.description AS trainingTypeDescription',
        'exercise.name AS exerciseName',
        'exercise.description AS exerciseDescription',
        'exercise.equipment AS exerciseEquipment',
        'exercise.difficulty_level AS difficultyLevel',
        'mg.name AS muscleGroup',
      ]);

    if (trainingTypeName) {
      query.andWhere('type.name = :trainingTypeName', { trainingTypeName });
    }

    if (muscleGroupName) {
      query.andWhere('mg.name = :muscleGroupName', { muscleGroupName });
    }

    if (difficultyLevel) {
      query.andWhere('exercise.difficulty_level = :difficultyLevel', {
        difficultyLevel,
      });
    }

    return await query.getRawMany();
  }

  async createRoutine(routineDto: RoutineCreateDto, id: string) {
    const {
      name,
      description,
      order,
      repetitions,
      rest_time,
      equipment,
      dificultad,
      descriptionExercise,
      nameExercise,
      tipo,
      muscleGroup,
    } = routineDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Crear rutina
      const insertRoutine = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Routine)
        .values({
          name,
          description,
          is_active: true,
        })
        .returning('id')
        .execute();

      const routineId = insertRoutine.raw[0].id;

      // Crear ejercicio
      const insertExercise = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Exercise)
        .values({
          name: nameExercise,
          description: descriptionExercise,
          equipment,
          difficulty_level: dificultad,
          is_active: true,
        })
        .returning('id')
        .execute();

      const exerciseId = insertExercise.raw[0].id;

      // Asociar ejercicio con rutina
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(RoutineExercise)
        .values({
          routine: { id: routineId },
          exercise: { id: exerciseId },
          order,
          repetitions,
          rest_time,
        })
        .execute();

      // Buscar tipo de entrenamiento
      const training = await queryRunner.manager
        .getRepository(TrainingType)
        .createQueryBuilder('tr')
        .where('tr.name = :type', { type: tipo })
        .getOne();

      if (!training) throw new Error('Tipo de entrenamiento no encontrado');

      // Asociar tipo de entrenamiento con ejercicio
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(ExerciseTrainingType)
        .values({
          trainingType: { id: training.id },
          exercise: { id: exerciseId },
        })
        .execute();

      // Buscar grupo muscular
      const mg = await queryRunner.manager
        .getRepository(MuscleGroup)
        .createQueryBuilder('mg')
        .where('mg.name = :name', { name: muscleGroup })
        .getOne();

      if (!mg) throw new Error('Grupo muscular no encontrado');

      // Asociar grupo muscular con ejercicio
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(ExerciseMuscleGroup)
        .values({
          exercise: { id: exerciseId },
          muscleGroup: { id: mg.id },
        })
        .execute();

      const insertRoutineWithTrainer = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(RoutineTrainer)
        .values({
          routine: { id: insertRoutine.raw[0].id },
          trainer: { identification: id },
        })
        .execute();

      await queryRunner.commitTransaction();
      return { message: 'Rutina creada exitosamente', id: routineId };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error creando rutina:', error);
      throw new Error('No se pudo crear la rutina');
    } finally {
      await queryRunner.release();
    }
  }

  async bringRoutine(id: string) {
    const query = this.routineRepository
      .createQueryBuilder('routine')
      .innerJoin(RoutineExercise, 're', 're.routineId = routine.id')
      .innerJoin(Exercise, 'exercise', 'exercise.id = re.exerciseId')
      .innerJoin(ExerciseTrainingType, 'et', 'et.exercise_id = exercise.id')
      .innerJoin(TrainingType, 'type', 'type.id = et.training_type_id')
      .innerJoin(ExerciseMuscleGroup, 'emg', 'emg.exerciseId = exercise.id')
      .innerJoin(MuscleGroup, 'mg', 'mg.id = emg.muscleGroupId')
      .innerJoin(RoutineTrainer, 'rt', 'rt.routineId = routine.id')
      .where('routine.id = :id', { id: id })
      .select([
        'routine.id AS routineId',
        'routine.name AS routineName',
        'routine.description as descriptioRoutine',
        'type.name AS trainingTypeName',
        'type.description AS trainingTypeDescription',
        'exercise.name AS exerciseName',
        'exercise.description AS exerciseDescription',
        'exercise.equipment AS exerciseEquipment',
        'exercise.difficulty_level AS difficultyLevel',
        'mg.name AS muscleGroup',
      ]);

    return await query.getRawMany();
  }
}
