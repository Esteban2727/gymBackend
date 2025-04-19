import { IsNotEmpty, IsString } from 'class-validator';
import { validateDatasMessages } from 'src/messages/messages';

export class CreateGymDto {
  @IsString({ message: validateDatasMessages.username.isString })
  @IsNotEmpty({ message: validateDatasMessages.username.isNotEmpty })
  nameAdministrador: string;

  @IsString({ message: validateDatasMessages.identification.isString })
  @IsNotEmpty({ message: validateDatasMessages.identification.isNotEmpty })
  identification: string;

  @IsString({ message: validateDatasMessages.email.isString })
  @IsNotEmpty({ message: validateDatasMessages.email.isNotEmpty })
  email: string;

  @IsString({ message: validateDatasMessages.password.isString })
  @IsNotEmpty({ message: validateDatasMessages.password.isNotEmpty })
  password: string;

  @IsNotEmpty({ message: validateDatasMessages.cellphone.isNotEmpty })
  cellphone: string;

  @IsNotEmpty({ message: validateDatasMessages.gender.isNotEmpty })
  @IsString({ message: validateDatasMessages.gender.isString })
  readonly gender: string;

  @IsNotEmpty({ message: 'no puede estar vacio el nombre del gym' })
  @IsString({ message: 'debe ser un string el nombre' })
  readonly nombreGym: string;
}
