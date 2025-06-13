import { IsOptional } from 'class-validator';

export class AdminDto {
  @IsOptional()
  name: string;

  @IsOptional()
  cel: string;

  @IsOptional()
  nombreGym: string;
}
