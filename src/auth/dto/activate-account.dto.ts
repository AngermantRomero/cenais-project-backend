import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ActivateAccountDto {
  @ApiProperty({
    example: 'Token123!',
    description:
      'Token de activación de cuenta o de recuperación de contraseña',
    required: true,
  })
  @IsString()
  token: string;

  @ApiProperty({
    example: 'PasswordSeguro123!',
    description: 'Password para la cuenta',
    required: true,
  })
  @IsString()
  @MinLength(8)
  password: string;
}
