import { Controller, Get } from '@nestjs/common';
import { ClientesService } from './prueba.service';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get('insertar')
  insertarClientes() {
    return this.clientesService.insertarConInsert();
  }

  @Get('batch')
  insertarPorBloques() {
    return this.clientesService.insertarPorBloques();
  }

  @Get('lotes')
  insertarConLotes() {
    return this.clientesService.insertarConLotes();
  }
}
