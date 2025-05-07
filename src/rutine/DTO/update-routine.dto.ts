import { IsBoolean, IsOptional, IsString } from "class-validator";
import { validateDatasMessages } from "src/messages/messages";

export class UpdateRoutineDto {
  @IsOptional()
  @IsString({ message: validateDatasMessages.name.isString })
  name?: string;

  @IsOptional()
  @IsString({ message: validateDatasMessages.description.isString })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: validateDatasMessages.is_active.isBoolean })
  is_active?: boolean;
}
