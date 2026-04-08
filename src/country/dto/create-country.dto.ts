import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCountryDto {
  @ApiProperty({
    example: 'México',
    description: 'Nombre del país',
    minLength: 2,
    maxLength: 45,
  })
  @IsString({ message: 'El nombre debe ser un texto' })
  @Length(2, 45, {
    message: 'El nombre debe tener entre 2 y 45 caracteres',
  })
  countryName: string;
}
