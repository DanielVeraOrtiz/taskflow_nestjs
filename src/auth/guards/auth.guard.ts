import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../common/decorators/public-route.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Buscar si hay un decorador con metadata con esa key. Esta es para saber si la ruta es publica.
    // En caso de ser publica el guard devuelve de inmediato true, lo cual implica que tiene acceso a la ruta
    // a la cual se dirige la request.
    const isPublicRoute = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublicRoute) {
      return true;
    }

    // Obtenemos el token de la request si existe y luego verificamos si es valido
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Not authorized');
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayloadDto>(token);
      // Si es valido el JWT, entonces asignamos el payload de este a user de la request. Para esto es que necesitabamos
      // extender Request del namespace Express.
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Not authorized');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
