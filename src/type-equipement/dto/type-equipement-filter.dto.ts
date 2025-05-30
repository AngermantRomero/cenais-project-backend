import { IsOptional, IsString, Min, Length, IsUUID } from 'class-validator';

export class TypeEquipementFilterDto {
  @IsOptional()
  @IsUUID()
  @Min(1, { message: 'El ID debe ser mayor o igual a 1.' })
  id?: number;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto.' })
  @Length(1, 45, {
    message: 'La descripción debe tener entre 1 y 45 caracteres.',
  })
  description?: string;
}
