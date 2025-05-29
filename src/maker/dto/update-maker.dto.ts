import { PartialType } from '@nestjs/mapped-types';
import { CreateMakerDto } from './create-maker.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMakerDto extends PartialType(CreateMakerDto) {
  @ApiPropertyOptional({
    example: 'Japón',
    description: 'Nuevo nombre del país asociado',
  })
  @IsOptional()
  @IsString()
  countryName?: string;
}
