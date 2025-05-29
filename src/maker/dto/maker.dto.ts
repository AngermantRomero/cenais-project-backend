import { ApiProperty } from '@nestjs/swagger';
import { CountryDto } from 'src/country/dto/country.dto';
export class MakerResponseDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-g1h2-3456ij7890kl',
    description: 'UUID del fabricante',
    format: 'uuid',
  })
  idMaker: string;

  @ApiProperty({
    example: 'Toyota',
    description: 'Marca del fabricante',
    required: true,
  })
  brand: string;

  @ApiProperty({
    example: 'Fabricante de vehículos',
    description: 'Descripción del fabricante',
    required: true,
  })
  description: string;

  @ApiProperty({
    type: () => CountryDto,
    description: 'País de origen del fabricante',
    example: {
      id: 'b2c3d4e5-f6g7-8901-h2i3-456j7890k1l2',
      name: 'Japón',
    },
  })
  country: CountryDto;
}
