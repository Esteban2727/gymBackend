import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExerciseGroupService } from '../services/exercise.service';
import { ExerciseDto } from '../exerciseDto';

@Controller()
export class ExerciseController {
  constructor(private readonly exerciseGroupService: ExerciseGroupService) {}
  @Get('exercises')
  async exerciseGroup() {
    const getExerciseGroup =
      await this.exerciseGroupService.getExerciseService();
    return getExerciseGroup;
  }
  @Post('exerciseCreate')
  async createExercise(@Body() nameDTO: ExerciseDto) {
    const { name, description, difficulty_level, equipment } = nameDTO;
    console.log(name);
    const p = await this.exerciseGroupService.createExerciseService(
      name,
      description,
      difficulty_level,
      equipment,
    );
    console.log(p);
    return p;
  }
}
