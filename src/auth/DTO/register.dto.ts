import { validateDatasMessages } from '../../messages/messages';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class registerDTO {
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
  readonly rol: string;

  @IsNotEmpty({ message: validateDatasMessages.identification.isNotEmpty })
  @IsString({ message: validateDatasMessages.identification.isString })
  readonly identification: string;

  @IsNotEmpty({ message: validateDatasMessages.gender.isNotEmpty })
  @IsString({ message: validateDatasMessages.gender.isString })
  readonly gender: string;

  @IsNotEmpty({ message: "debe haber una id" })
  @IsString({ message: "el id es string" })
  readonly idgym: string;
}
