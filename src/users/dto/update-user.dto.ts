import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el usuario está activo',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
