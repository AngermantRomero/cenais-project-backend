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
}
