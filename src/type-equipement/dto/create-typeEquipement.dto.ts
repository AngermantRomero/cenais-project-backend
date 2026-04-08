import { IsString, Length, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateTypeEquipementDto {
  @ApiProperty({
    example: 'Equipamiento industrial',
    description: 'Descripción del tipo de equipamiento',
    required: true,
    maxLength: 45,
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía.' })
  @Length(1, 45, {})
  name: string;
}
