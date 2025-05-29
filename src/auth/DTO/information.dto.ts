import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { validateDatasMessages } from 'src/messages/messages';

export class InformationDto {
  @IsNotEmpty({ message: validateDatasMessages.email.isNotEmpty })
  @IsEmail({}, { message: validateDatasMessages.email.isEmail })
  @IsString({ message: validateDatasMessages.email.isString })
  readonly email: string;

  @IsNotEmpty({ message: 'no puedes dejar el nombre vacio' })
  @IsString({ message: 'debe ser un strinig el name' })
  readonly name: string;

  @IsNotEmpty({ message: 'no puedes dejar el mensaje vacio' })
  @IsString({ message: 'debe ser un strinig el mensaje' })
  readonly message: string;
}
