import { ApiProperty } from '@nestjs/swagger';
import { Maker } from 'src/maker/entities/maker.entity';
import { Model } from 'src/model/entities/model.entity';

export class EquipmentDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'SN-12345' })
  serialNumber: string;

  @ApiProperty({ example: 'INV-789' })
  inventoryNumber: string;

  @ApiProperty({ example: '2023-01-15' })
  startOfOperation: Date;

  @ApiProperty({ type: () => Maker })
  maker: Maker;

  @ApiProperty({ type: () => Model })
  model: Model;
}
