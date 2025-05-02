import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiErrorResponse = (statusCode: number, message: string) => {
  return applyDecorators(
    ApiResponse({
      status: statusCode,
      description: message,
      schema: {
        example: {
          statusCode,
          message,
          data: null,
        },
      },
    }),
  );
};
