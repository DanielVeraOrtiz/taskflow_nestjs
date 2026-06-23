import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

// En lugar de repetir ambos en todos los lados, hice uno solo que coloca a nivel de swagger todo lo relacionado
// a auth.
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
