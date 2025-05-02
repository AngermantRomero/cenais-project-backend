import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'ID único del usuario en formato UUID',
  })
  id: string;

  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del usuario',
  })
  name: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido del usuario',
  })
  lastName: string;

  @ApiProperty({
    example: 'juan.perez@example.com',
    description: 'Correo electrónico del usuario',
  })
  email: string;

  @ApiProperty({
    example: '+56912345678',
    description: 'Número de teléfono del usuario',
  })
  phone: string;

  @ApiProperty({
    example: 1,
    description: 'ID del rol asociado al usuario',
  })
  roleId: number;

  @ApiProperty({
    example: true,
    description: 'Indica si el usuario está activo',
  })
  isActive: boolean;

  @ApiProperty({
    example: '2023-10-25T12:00:00Z',
    description: 'Fecha de creación del usuario',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-10-25T12:00:00Z',
    description: 'Fecha de última actualización del usuario',
  })
  updateAt: Date;
}
