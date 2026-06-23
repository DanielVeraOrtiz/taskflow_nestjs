import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayloadDto } from '../../auth/dto/jwt-payload.dto';

export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext): JwtPayloadDto | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user;
  },
);
