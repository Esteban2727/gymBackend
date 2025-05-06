import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  isString,
  IsString,
} from 'class-validator';
import { validateDatasMessages } from 'src/messages/messages';

export class TrainerDto {
  @IsNotEmpty({ message: validateDatasMessages.email.isNotEmpty })
  @IsEmail({}, { message: validateDatasMessages.email.isEmail })
  @IsString({ message: validateDatasMessages.email.isString })
  readonly email: string;

  @IsNotEmpty({ message: validateDatasMessages.password.isNotEmpty })
  @IsString({ message: validateDatasMessages.password.isString })
  @IsString({ message: validateDatasMessages.password.isPasswordlength })
  readonly password: string;

  @IsNotEmpty({ message: validateDatasMessages.cellphone.isNotEmpty })
  @IsString({ message: validateDatasMessages.cellphone.isCellphone })
  readonly cellphone: string;

  @IsNotEmpty({ message: validateDatasMessages.email.isNotEmpty })
  @IsString({ message: validateDatasMessages.username.isUsername })
  @IsString({ message: validateDatasMessages.email.isString })
  readonly username: string;

  @IsOptional()
  @IsString({ message: 'El rol debe ser un string' })
  readonly rol?: 'trainer';

  @IsNotEmpty({ message: validateDatasMessages.identification.isNotEmpty })
  @IsString({ message: validateDatasMessages.identification.isString })
  readonly identification: string;

  @IsNotEmpty({ message: validateDatasMessages.gender.isNotEmpty })
  @IsString({ message: validateDatasMessages.gender.isString })
  readonly gender: string;

  @IsString({ message: 'es un string' })
  @IsNotEmpty({ message: 'el campo de experiencia no puede dejarse vacía' })
  readonly yearExperience: string;

  @IsNotEmpty({ message: 'pon tus titulos' })
  readonly certifications: string | string[];

  @IsOptional()
  @IsNotEmpty({ message: 'id del gymnasio' })
  readonly idGym: string;
}
