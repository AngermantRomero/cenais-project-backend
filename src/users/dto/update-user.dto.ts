import {
  IsString,
  IsEmail,
  IsInt,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Carlos',
    description: 'Nuevo nombre del usuario (opcional)',
    minLength: 3,
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({
    example: 'González',
    description: 'Nuevo apellido del usuario (opcional)',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({
    example: 'carlos.gonzalez@example.com',
    description: 'Nuevo email del usuario (opcional)',
    format: 'email',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email?: string;

  @ApiPropertyOptional({
    example: '+5355555555',
    description: 'Nuevo teléfono del usuario (formato cubano) (opcional)',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('CU')
  phone?: string;

  @ApiPropertyOptional({
    example: 3,
    description: 'Nuevo ID de rol (número entero) (opcional)',
    type: 'integer',
    required: false,
  })
  @IsOptional()
  @IsInt()
  roleId?: number;

  @ApiPropertyOptional({
    example: 'NuevaPassword123!',
    description: 'Nueva contraseña (8-20 caracteres) (opcional)',
    minLength: 8,
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password?: string;
}
