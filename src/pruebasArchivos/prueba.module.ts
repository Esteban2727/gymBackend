import { Module } from '@nestjs/common';
import { ClientesService } from './prueba.service';
import { ClientesController } from './prueba.controller';

@Module({
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class pruebaModule {}
