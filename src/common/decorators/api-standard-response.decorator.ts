import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { StandardResponseDto } from '../dto/response.dto';

export const ApiStandardResponse = <TModel extends Type<any>>(
  model: TModel,
  statusCode = 200,
  description = 'Respuesta exitosa',
) => {
  return applyDecorators(
    ApiResponse({
      status: statusCode,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(StandardResponseDto) },
          {
            properties: {
              statusCode: { example: statusCode },
              data: { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};
