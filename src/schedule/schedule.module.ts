// src/asistencias/asistencias.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asistencia } from './attendance.entity';
import { AsistenciasService } from './service/schedule.service';
import { AsistenciasController } from './controller/schedule.controller';
import { Customer } from 'src/customer/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asistencia,Customer])],
  controllers: [AsistenciasController],
  providers: [AsistenciasService],
})
export class AsistenciasModule {}
