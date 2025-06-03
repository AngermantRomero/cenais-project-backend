import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty, IsUUID } from 'class-validator';

export class AssignSiteDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del equipo',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  equipmentId: string;
  @ApiProperty({
    example: 'SAB',
    description: 'Código del sitio',
    required: true,
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  siteCode: string;
}
