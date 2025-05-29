import { ApiProperty } from '@nestjs/swagger';

export class CountryDto {
  @ApiProperty({
    example: 'b2c3d4e5-f6g7-8901-h2i3-456j7890k1l2',
    description: 'UUID del país',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    example: 'Japón',
    description: 'Nombre del país',
  })
  countryName: string;
}
