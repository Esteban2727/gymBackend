import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exercise } from '../Entity/exercise.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExerciseGroupService {
  constructor(
    @InjectRepository(Exercise)
    readonly exerciseRepository: Repository<Exercise>,
  ) {}
  async getExerciseService() {
    const getExerciseRepository = await this.exerciseRepository.find();
    return getExerciseRepository;
  }
  async createExerciseService(
    name: string,
    description: string,
    difficulty_level: string,
    equipment: string,
  ) {
    const exercise = this.exerciseRepository.create({
      name: name,
      description: description,
      difficulty_level: difficulty_level,
      equipment: equipment,
    });
    await this.exerciseRepository.save(exercise);
    return { mensaje: 'creado exitosamente' };
  }
}
