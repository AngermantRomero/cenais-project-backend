import { IsOptional, IsString, Length, IsUUID } from 'class-validator';

export class TypeEquipementFilterDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto.' })
  @Length(1, 45, {
    message: 'La descripción debe tener entre 1 y 45 caracteres.',
  })
  name?: string;
}
