import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMeasurement } from './user-measurment.entity';
import { Customer } from '../customer/customer.entity'; // Ajusta la ruta según tu estructura
import { CreateMeasurementDto } from './create-measurment.dto';

@Injectable()
export class UserMeasurementService {
  constructor(
    @InjectRepository(UserMeasurement)
    private readonly measurementRepo: Repository<UserMeasurement>,

    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async createMeasurement(customerId: string, dto: CreateMeasurementDto) {
    const customer = await this.customerRepo.findOne({
      where: { identification: customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id ${customerId} not found`);
    }

    const measurement = this.measurementRepo.create({
      ...dto,
      customer,
    });

    return this.measurementRepo.save(measurement);
  }

  async getMeasurementsByCustomerId(customerId: string) {
    const customer = await this.customerRepo.findOne({
      where: { identification: customerId },
      relations: ['measurements'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id ${customerId} not found`);
    }

    return this.measurementRepo.find({
      where: { customer: { identification: customerId } },
      order: { date: 'DESC' },
    });
  }
}
