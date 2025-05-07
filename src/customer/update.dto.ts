import { IsOptional, IsString } from 'class-validator';

export class updateDto {
  @IsOptional()
  username: string;

  @IsOptional()
  cel: string;
}
