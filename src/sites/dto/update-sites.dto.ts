import { PartialType } from '@nestjs/mapped-types';
import { CreateSitioDto } from './create-sites.dto';

export class UpdateSitioDto extends PartialType(CreateSitioDto) {}
