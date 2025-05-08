import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExerciseMuscleGroup } from '../exerciseGroupMuscular.entity';
import { Repository } from 'typeorm';
import { MuscleGroup } from 'src/groupMuscle/Entity/muscleGroup.entity';
@Injectable()
export class ExerciseGroupMuscularServices {
  constructor(
    @InjectRepository(MuscleGroup)
    readonly groupMusculeRepository: Repository<MuscleGroup>,
  ) {}
  async getGroupMuscularServices() {
    const getData = await this.groupMusculeRepository.find();
    return getData;
  }
  async findByName(name: string): Promise<MuscleGroup | null> {
    return this.groupMusculeRepository.findOne({
      where: { name },
      relations: {
        exerciseMuscleGroups: {
          exercise: true,
        },
      },
    });
  }
  async createGroup(name: string) {
    const group = this.groupMusculeRepository.create({ name });
    await this.groupMusculeRepository.save(group);
    console.log(group);
    return { mensaje: 'creado exitosamente' };
  }
  async softDeleteBtName(name: string) {
    const group = await this.groupMusculeRepository.findOne({
      where: { name },
    });
    if (!group) {
      throw new Error('Grupo muscular no encontrado');
    }
    await this.groupMusculeRepository.softRemove(group); //softDelete: Elimina generando un registro
    return { mensaje: 'Grupo muscular eliminado (soft)' };
  }
}
