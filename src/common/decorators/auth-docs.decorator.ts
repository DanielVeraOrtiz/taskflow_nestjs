import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

export function AuthDocsDecorators() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiHeader({
      name: 'Authorization',
      required: true,
      description: 'Bearer JWT token',
    }),
  );
}
