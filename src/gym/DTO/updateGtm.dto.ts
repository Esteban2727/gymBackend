import { IsString } from 'class-validator';

export class changeInformationDto {
  @IsString({ message: 'no es un string' })
  name: string;
}
