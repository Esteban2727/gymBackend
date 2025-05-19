import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { validateDatasMessages } from 'src/messages/messages';

export class EditTrainerDto {
  @IsOptional()
  @IsString({ message: validateDatasMessages.email.isString })
  @IsNotEmpty({ message: validateDatasMessages.email.isNotEmpty })
  email: string;

  @IsOptional()
  @IsNotEmpty({ message: validateDatasMessages.cellphone.isNotEmpty })
  cellphone: string;

  @IsOptional()
  username: string;
}
