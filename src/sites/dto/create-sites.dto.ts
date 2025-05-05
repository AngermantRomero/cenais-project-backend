import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateSitioDto {
  @IsString()
  @IsNotEmpty()
  localidad: string;

  @IsInt()
  @IsNotEmpty()
  Provincias_idProvincia: number;

  @IsInt()
  @IsNotEmpty()
  Codigos_idCodigo: number;
}
