import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { validateDatasMessages } from 'src/messages/messages';

export class LoginDto {
    @IsOptional()
  @IsNotEmpty({ message: validateDatasMessages.email.isNotEmpty })
  @IsEmail({}, { message: validateDatasMessages.email.isEmail })
  @IsString({ message: validateDatasMessages.email.isString })
  readonly email: string;

  @IsOptional()
  @IsNotEmpty({ message: validateDatasMessages.password.isNotEmpty })
  @IsString({ message: validateDatasMessages.password.isString })
  @IsString({ message: validateDatasMessages.password.isPasswordlength })
  readonly password: string;
}
