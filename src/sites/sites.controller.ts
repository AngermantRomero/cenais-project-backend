import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { SitiosService } from './sites.service';
import { CreateSitioDto } from './dto/create-sites.dto';
import { UpdateSitioDto } from './dto/update-sites.dto';

@Controller('sitios')
export class SitiosController {
  constructor(private readonly sitiosService: SitiosService) {}

  @Post()
  create(@Body() createSitioDto: CreateSitioDto) {
    return this.sitiosService.create(createSitioDto);
  }

  @Get()
  findAll() {
    return this.sitiosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const sitio = await this.sitiosService.findOne(+id);
    if (!sitio) {
      throw new NotFoundException('Sitio no encontrado');
    }
    return sitio;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSitioDto: UpdateSitioDto) {
    return this.sitiosService.update(+id, updateSitioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sitiosService.remove(+id);
  }
}
