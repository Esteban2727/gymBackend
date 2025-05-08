import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MuscleGroup } from '../Entity/muscleGroup.entity';

@Injectable()
export class GroupMuscleServices {
  constructor(
    @InjectRepository(MuscleGroup)
    readonly groupMuscleRepository: Repository<MuscleGroup>,
  ) {}

  async getDatasMuscle() {
    return this.groupMuscleRepository.find();
  }

  async createGroupMuscle(name: string) {
    const createInDatabase = await this.groupMuscleRepository.create({
      name: name,
    });
    await this.groupMuscleRepository.save(createInDatabase);
    return 'Created';
  }

  async createGroup(name: string) {
    const group = this.groupMuscleRepository.create({ name });
    await this.groupMuscleRepository.save(group);
    console.log(group);
    return { mensaje: 'creado exitosamente' };
  }
}
