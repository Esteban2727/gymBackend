import { IsNotEmpty, IsString } from 'class-validator';
import { validateDatasMessages } from 'src/messages/messages';
import { Column } from 'typeorm';

export class GymUserDto {
  @IsString({ message: validateDatasMessages.username.isString })
  @IsNotEmpty({ message: validateDatasMessages.username.isNotEmpty })
  idGym: string;

  @IsString({ message: validateDatasMessages.primaryColor.isString })
  @IsNotEmpty({ message: validateDatasMessages.primaryColor.isNotEmpty })
  idUser: string;
}
