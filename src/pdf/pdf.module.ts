import { Module } from "@nestjs/common";
import { GeneratePdfController } from "./controller/pdf.controller";
import { GeneratePdfServices } from "./services/pdf.service";

@Module({
  controllers: [GeneratePdfController],
  providers: [GeneratePdfServices],
  exports: [GeneratePdfServices], 
})
export class GeneratePdfModule {}
