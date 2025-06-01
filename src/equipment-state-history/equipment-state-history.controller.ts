import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { EquipmentStateHistoryService } from './equipment-state-history.service';
import { CreateEquipmentStateHistoryDto } from './dto/create-equipment-state-history.dto';
import { FilterEquipmentStateHistoryDto } from './dto/filter-equipment-state-history.dto';

@Controller('equipment-state-history')
export class EquipmentStateHistoryController {
  constructor(private readonly historyService: EquipmentStateHistoryService) {}

  @Post()
  async create(@Body() createDto: CreateEquipmentStateHistoryDto) {
    return this.historyService.create(createDto);
  }

  @Get()
  async filter(@Query() query: FilterEquipmentStateHistoryDto) {
    return this.historyService.filter(query);
  }
}
