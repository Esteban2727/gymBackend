import { Module } from '@nestjs/common';
import { GeneratePdfController } from './controller/pdf.controller';
import { GeneratePdfServices } from './services/pdf.service';
import { DashboardModule } from 'src/dashboard/dashboard.module';

@Module({
  imports: [DashboardModule],
  controllers: [GeneratePdfController],
  providers: [GeneratePdfServices],
  exports: [GeneratePdfServices],
})
export class GeneratePdfModule {}
