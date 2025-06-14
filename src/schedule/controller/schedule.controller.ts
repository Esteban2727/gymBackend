import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AsistenciasService } from '../service/schedule.service';

@Controller('asistencias')
export class AsistenciasController {
  constructor(private readonly asistenciasService: AsistenciasService) {}

  @Post(':id')
  async registrar(@Body() body: { fecha: string }, @Param('id') id: string) {
    return this.asistenciasService.registrarAsistencia(id, body.fecha);
  }

  @Get(':userId')
  async obtener(@Param('userId') userId: string) {
    return this.asistenciasService.obtenerAsistenciasPorUsuario(userId);
  }
}
