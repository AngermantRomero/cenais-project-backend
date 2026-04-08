import { CreateTypeEquipementDto } from './create-typeEquipement.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateTypeEquipementDto extends PartialType(
  CreateTypeEquipementDto,
) {}
