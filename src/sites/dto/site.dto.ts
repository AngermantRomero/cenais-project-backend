import { ApiProperty } from '@nestjs/swagger';

export class SitesDto {
  @ApiProperty({
    example: 'Manicaragua',
    description: 'Nombre de la localidad del sitio',
  })
  locality: string;

  @ApiProperty({
    example: 'MGV',
    description: 'Codigo del sitio',
  })
  code: string;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'UUID de la Provincia',
  })
  province: string;
}
