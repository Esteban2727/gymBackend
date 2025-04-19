import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { validateDatasMessages } from 'src/messages/messages';

export class GymDto {
  @IsOptional()
  name: string;

  @IsString({ message: validateDatasMessages.primaryColor.isString })
  @IsNotEmpty({ message: validateDatasMessages.primaryColor.isNotEmpty })
  primary: string;

  @IsOptional()
  logo: string;

  @IsString({ message: validateDatasMessages.secondaryColor.isString })
  @IsNotEmpty({ message: validateDatasMessages.secondaryColor.isNotEmpty })
  secondary: string;

  @IsString({ message: 'debe ser un string el fourth' })
  @IsNotEmpty({ message: 'debe tener un color el fourth' })
  fourth: string;

  @IsString({ message: 'debe ser un string el third' })
  @IsNotEmpty({ message: 'no puede estar vacio el third' })
  third: string;

  @IsString({ message: 'debe ser un string el fontFamily' })
  @IsNotEmpty({ message: 'no puede estar vacio el fontFamily' })
  fontFamily: string;
}
