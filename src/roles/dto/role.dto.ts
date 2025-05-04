import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'ID único del Rol en formato UUID',
  })
  id: string;

  @ApiProperty({
    example: 'Administrator',
    description:
      'Nombre del Role. Solo se acepta Administrator, Technician o Guest',
  })
  name: string;
}
