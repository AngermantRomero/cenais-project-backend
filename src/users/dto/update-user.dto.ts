import {
  IsString,
  IsEmail,
  IsInt,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum Role {
  Admin = 1,
  User = 2,
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Carlos',
    description: 'Nuevo nombre del usuario (opcional)',
    minLength: 3,
    maxLength: 50,
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
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({
    example: 'carlos.gonzalez@example.com',
    description: 'Nuevo email del usuario (opcional)',
    format: 'email',
  })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => (value ? value.trim().toLowerCase() : value))
  email?: string;

  @ApiPropertyOptional({
    example: '+5355555555',
    description: 'Nuevo teléfono del usuario (opcional)',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?\d{7,15}$/)
  phone?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Nuevo ID de rol (1=Admin, 2=User) (opcional)',
    enum: Role,
  })
  @IsOptional()
  @IsInt()
  @IsEnum(Role)
  roleId?: Role;

  @ApiPropertyOptional({
    example: 'NuevaPassword123!',
    description: 'Nueva contraseña (8-20 caracteres, con mayúsculas y números)',
    minLength: 8,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,20}$/)
  password?: string;
}
