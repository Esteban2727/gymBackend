import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { validateDatasMessages } from 'src/messages/messages';

export class RoutineCreateDto {
  @IsNotEmpty({ message: validateDatasMessages.name.isNotEmpty })
  @IsString({ message: validateDatasMessages.name.isString })
  readonly name: string;

  @IsNotEmpty({ message: validateDatasMessages.description.isNotEmpty })
  @IsString({ message: validateDatasMessages.description.isString })
  readonly description: string;

  @IsOptional()
  @IsNotEmpty({ message: validateDatasMessages.is_active.isNotEmpty })
  @IsBoolean({ message: validateDatasMessages.is_active.isBoolean })
  readonly is_active: boolean;

  @IsOptional()
  @IsNotEmpty({ message: validateDatasMessages.is_active.isNotEmpty })
  readonly order: number;

  @IsOptional()
  @IsNotEmpty({ message: validateDatasMessages.is_active.isNotEmpty })
  readonly repetitions: number;

  @IsOptional()
  @IsNotEmpty({ message: validateDatasMessages.is_active.isNotEmpty })
  readonly rest_time: number;

  @IsOptional()
  @IsNotEmpty({ message: validateDatasMessages.is_active.isNotEmpty })
  readonly equipment: string;
  @IsOptional()
  @IsNotEmpty({ message: validateDatasMessages.is_active.isNotEmpty })
  readonly dificultad: string;

  @IsOptional()
  @IsNotEmpty({ message: validateDatasMessages.is_active.isNotEmpty })
  readonly descriptionExercise: string;

  @IsOptional()
  @IsNotEmpty({ message: validateDatasMessages.is_active.isNotEmpty })
  readonly nameExercise: string;

  @IsOptional()
  @IsNotEmpty({ message: validateDatasMessages.is_active.isNotEmpty })
  readonly tipo: string;

  @IsOptional()
  @IsNotEmpty({ message: validateDatasMessages.is_active.isNotEmpty })
  readonly muscleGroup: string;
}
