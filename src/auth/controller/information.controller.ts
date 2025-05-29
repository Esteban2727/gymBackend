import { Body, Controller, Post } from '@nestjs/common';
import { InformationDto } from '../DTO/information.dto';
import { InformationEmailServices } from '../services/information.service';

@Controller('information')
export class InformationEmailController {
  constructor(
    private readonly informationEmailServices: InformationEmailServices,
  ) {}

  @Post()
  async createInformation(@Body() informationDto: InformationDto) {
    return await this.informationEmailServices.createInformation(
      informationDto,
    );
  }
}
