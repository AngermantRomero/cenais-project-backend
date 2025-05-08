import { ApiProperty } from '@nestjs/swagger';

export class MakerResponseDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-g1h2-3456ij7890kl',
    description: 'UUID del fabricante',
  })
  idMaker: string;

  @ApiProperty({ example: 'Toyota', required: true })
  brand: string;

  @ApiProperty({ example: 'Fabricante de vehículos', required: true })
  description: string;

  @ApiProperty({
    example: {
      idCountry: 'b2c3d4e5-f6g7-8901-h2i3-456j7890k1l2',
      country: 'Japón',
    },
  })
  country: {
    idCountry: string;
    country: string;
  };
}
