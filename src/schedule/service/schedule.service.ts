// src/asistencias/asistencias.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asistencia } from '../attendance.entity';
import { Customer } from 'src/customer/customer.entity'; // Ajusta la ruta si es diferente

@Injectable()
export class AsistenciasService {
  constructor(
    @InjectRepository(Asistencia)
    private asistenciaRepo: Repository<Asistencia>,
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
  ) {}

  // Registrar asistencia del usuario
  async registrarAsistencia(userId: string, fecha: string) {
    // Validar si ya existe la asistencia en esa fecha
    const existente = await this.asistenciaRepo.findOne({
      where: { userId, fecha },
    });

    if (existente) return existente;

    // Verificar si el usuario existe
    const customer = await this.customerRepo.findOne({
      where: { identification: userId },
    });

    if (!customer) {
      throw new Error('Cliente no encontrado');
    }

    // Crear nueva asistencia
    const nueva = this.asistenciaRepo.create({
      userId,
      fecha,
      customer, // se enlaza automáticamente
    });

    return this.asistenciaRepo.save(nueva);
  }

  // Obtener todas las asistencias de un usuario
  async obtenerAsistenciasPorUsuario(userId: string) {
    return this.asistenciaRepo.find({
      where: { userId },
      order: { fecha: 'ASC' },
    });
  }
}
