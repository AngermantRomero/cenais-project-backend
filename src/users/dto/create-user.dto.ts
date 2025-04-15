import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsInt,
  MinLength,
  MaxLength,
  IsPhoneNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del usuario',
    minLength: 3,
    maxLength: 50,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido del usuario',
    maxLength: 100,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({
    example: 'juan.perez@example.com',
    description: 'Email del usuario (único)',
    format: 'email',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email: string;

  @ApiProperty({
    example: '+5351234567',
    description: 'Teléfono del usuario (formato cubano)',
    required: true,
  })
  @IsPhoneNumber('CU')
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 2,
    description: 'ID del rol del usuario (número entero)',
    type: 'integer',
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  roleId: number;

  @ApiProperty({
    example: 'Password123!',
    description: 'Contraseña del usuario (8-20 caracteres)',
    minLength: 8,
    maxLength: 20,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
