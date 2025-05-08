import { PartialType } from '@nestjs/mapped-types';
import { CreateMakerDto } from './create-maker.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateMakerDto extends PartialType(CreateMakerDto) {
  @IsOptional()
  @IsUUID('4')
  countryId?: string;
}
