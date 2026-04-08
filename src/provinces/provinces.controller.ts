import { Controller, Get } from '@nestjs/common';
import { ProvinceService } from './provinces.service';
import { Province } from './entities/province.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('provinces')
@Controller('provinces')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Get()
  findAll(): Promise<Province[]> {
    return this.provinceService.findAll();
  }
}
