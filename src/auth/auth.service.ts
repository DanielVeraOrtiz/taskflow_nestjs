import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ResponseAuthRoutesDto } from './dto/response-auth-routes.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { ResponseUserDto } from 'src/users/dto/response-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<ResponseAuthRoutesDto> {
    // Ojo que no repito logica, uso el usersService directo en lugar de hacerlo aqui, usersService
    // se encarga de cosas de users. Aqui necesito la passwordHash, por eso se hizo ese metodo nuevo con select.
    const user = await this.usersService.findOneByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // En caso que el user no este activo, o fue baneado o demas.
    if (!user?.isActive) {
      throw new UnauthorizedException('The user is no longer active');
    }

    const isValidPassword = await bcrypt.compare(signInDto.password, user?.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    // Tanto en login como en signup se devuelve access_token y user con el objeto entero menos passwordHash.
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async signUp(signUpDto: CreateUserDto): Promise<ResponseAuthRoutesDto> {
    const user = await this.usersService.create(signUpDto);

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user,
    };
  }

  // Cuando el usuario se sale de una pagina, y vuelve a entrar, tendra el jwt, con el cual debera enviar una solicitud
  // a auth/me. Aqui se buscara el user si existe y se devolvera, pero antes pasara por el guard que comprobara
  // que el jwt no haya vencido y sea valido
  async authMe(user: JwtPayloadDto): Promise<ResponseUserDto> {
    const userRow = await this.usersService.findOne(user.sub);
    return userRow;
  }
}
