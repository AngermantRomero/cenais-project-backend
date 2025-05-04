import { ApiProperty } from '@nestjs/swagger';

export class StandardResponseDto<T> {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Operación exitosa' })
  message: string;

  @ApiProperty({ nullable: true })
  data: T;
}
