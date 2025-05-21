import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { UserMeasurementService } from './userMeasurment.service';
import { CreateMeasurementDto } from './create-measurment.dto';

@Controller('measurements')
export class UserMeasurementController {
  constructor(private readonly measurementService: UserMeasurementService) {}

  @Post(':customerId')
  create(
    @Param('customerId', ParseIntPipe) customerId: string,
    @Body() dto: CreateMeasurementDto,
  ) {
    return this.measurementService.createMeasurement(customerId, dto);
  }

  @Get(':customerId')
  getByCustomerId(@Param('customerId', ParseIntPipe) customerId: string) {
    console.table(['Audi', 'Volvo', 'Ford']);
    return this.measurementService.getMeasurementsByCustomerId(customerId);
  }
}
