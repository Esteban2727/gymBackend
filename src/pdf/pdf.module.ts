import { Module } from '@nestjs/common';
import { GeneratePdfController } from './controller/pdf.controller';
import { GeneratePdfServices } from './services/pdf.service';
import { DashboardModule } from 'src/dashboard/dashboard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';

@Module({
  imports: [DashboardModule, TypeOrmModule.forFeature([User])],

  controllers: [GeneratePdfController],
  providers: [GeneratePdfServices],
  exports: [GeneratePdfServices],
})
export class GeneratePdfModule {}
