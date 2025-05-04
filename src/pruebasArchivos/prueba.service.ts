import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';

@Injectable()
export class ClientesService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async insertarConInsert(): Promise<void> {
    const start = Date.now();

    // Usando path.join para obtener la ruta absoluta del archivo
    const filePath = 'C:\\Users\\ASUS\\Documents\\clientes\\clientes.csv'; // Ruta completa del archivo CSV
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lineCount = 0;

    for await (const line of rl) {
      const values = line.split(';'); // Cambia a ',' si tu CSV está separado por comas
      await this.dataSource.query(
        `INSERT INTO clientes VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
        values,
      );
      lineCount++;
    }

    const end = Date.now();
    console.log(
      `Método INSERT: ${lineCount} filas insertadas en ${(end - start) / 1000}s`,
    );
  }

  async insertarPorBloques(batchSize = 1000): Promise<void> {
    const start = Date.now();

    // Usar path.join para obtener la ruta absoluta del archivo CSV
    const filePath = path.join(
      'C:\\',
      'Users',
      'ASUS',
      'Documents',
      'clientes',
      'clientes.csv',
    );
    const file = fs.readFileSync(filePath, 'utf-8');

    const lines = file.split('\n');
    let batch = [];

    for (const line of lines) {
      if (!line.trim()) continue;

      // Asumiendo que el CSV está separado por tabulaciones (\t)
      const values = line.split(';'); // Cambia '\t' por ';' si tu CSV está separado por punto y coma
      batch.push(`(${values.map((v) => `'${v}'`).join(',')})`);

      // Si alcanzamos el tamaño del lote, insertamos todos los datos en una sola consulta
      if (batch.length === batchSize) {
        const query = `INSERT INTO clientes VALUES ${batch.join(',')}`;
        await this.dataSource.query(query);
        batch = []; // Reseteamos el lote
      }
    }

    // Insertamos el resto de las filas si no alcanzó el tamaño del lote
    if (batch.length) {
      const query = `INSERT INTO clientes VALUES ${batch.join(',')}`;
      await this.dataSource.query(query);
    }

    const end = Date.now();
    console.log(`Método batch INSERT: Insertado en ${(end - start) / 1000}s`);
  }

  async insertarConLotes(batchSize = 1000): Promise<void> {
    const start = Date.now();
    const filePath = 'C:\\Users\\ASUS\\Documents\\clientes\\clientes.csv'; // Ruta completa del archivo CSV
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let batch = [];
    let lineCount = 0;

    for await (const line of rl) {
      if (!line.trim()) continue;
      const values = line.split(';'); // Asumiendo que el CSV está separado por punto y coma

      batch.push(`(${values.map((v) => `'${v}'`).join(',')})`);

      // Si alcanzamos el tamaño del lote, insertamos todos los datos en una sola consulta
      if (batch.length === batchSize) {
        const query = `INSERT INTO clientes VALUES ${batch.join(',')}`;
        await this.dataSource.query(query);
        batch = []; // Reseteamos el lote
      }

      lineCount++;
    }

    // Insertamos el resto de las filas si no alcanza el tamaño del lote
    if (batch.length) {
      const query = `INSERT INTO clientes VALUES ${batch.join(',')}`;
      await this.dataSource.query(query);
    }

    const end = Date.now();
    console.log(
      `Método inserción por lotes con transacciones: ${lineCount} filas insertadas en ${(end - start) / 1000}s`,
    );
  }
}
