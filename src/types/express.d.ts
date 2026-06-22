import { JwtPayloadDto } from '../auth/dto/jwt-payload.dto';

// Request de express por defecto no espera tener una propiedad user, por lo que se extiende y se hace
// global para evitar errores de tipos al asignar la propiedad request al payload del jwt.
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadDto;
    }
  }
}

export {};
