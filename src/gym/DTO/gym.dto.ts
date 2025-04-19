import { IsNotEmpty, IsString } from 'class-validator';
import { validateDatasMessages } from 'src/messages/messages';
import { Column } from 'typeorm';

export class GymDto {
  @IsString({ message: validateDatasMessages.username.isString })
  @IsNotEmpty({ message: validateDatasMessages.username.isNotEmpty })
  name: string;

  @IsString({ message: validateDatasMessages.primaryColor.isString })
  @IsNotEmpty({ message: validateDatasMessages.primaryColor.isNotEmpty })
  primaryColor: string;

  logoUrl: string;

  @IsString({ message: validateDatasMessages.secondaryColor.isString })
  @IsNotEmpty({ message: validateDatasMessages.secondaryColor.isNotEmpty })
  secondaryColor: string;

  @IsString({ message: validateDatasMessages.font.isString })
  @IsNotEmpty({ message: validateDatasMessages.font.isNotEmpty })
  font: string;
}
