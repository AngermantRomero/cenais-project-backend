import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  IsUUID,
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
    example: '+5300000000',
    description: 'Teléfono del usuario (formato cubano)',
    required: true,
  })
  @IsPhoneNumber('CU')
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'UUID del rol',
  })
  @IsNotEmpty()
  @IsUUID()
  role: string;

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
