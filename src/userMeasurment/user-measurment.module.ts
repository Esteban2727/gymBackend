import { Module } from '@nestjs/common';
import { UserMeasurementController } from './userMeasurment.controller';
import { UserMeasurementService } from './userMeasurment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMeasurement } from './user-measurment.entity';
import { Customer } from 'src/customer/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserMeasurement, Customer])],
  controllers: [UserMeasurementController],
  providers: [UserMeasurementService],
})
export class UserMeasurmentModule {}
