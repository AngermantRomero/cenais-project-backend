import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { StandardResponseDto } from '../dto/response.dto';

export const ApiStandardArrayResponse = <TModel extends Type<any>>(
  model: TModel,
  statusCode = 200,
  description = 'Lista obtenida exitosamente',
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
              statusCode: { example: statusCode, type: 'number' },
              message: { example: description, type: 'string' },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
