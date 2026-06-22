import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ResponseAuthRoutesDto } from './dto/response-auth-routes.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ResponseUserDto } from 'src/users/dto/response-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login for users' })
  @ApiOkResponse({
    description: 'User was logged successfully',
    type: [ResponseAuthRoutesDto],
  })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  @ApiOperation({ summary: 'Sign up for users' })
  @ApiOkResponse({
    description: 'User was signed up successfully',
    type: [ResponseAuthRoutesDto],
  })
  signUp(@Body() signUpDto: CreateUserDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('me')
  @ApiOperation({ summary: 'To find out if your JWT is authenticated' })
  @ApiOkResponse({
    description: 'User is authenticated',
    type: [ResponseUserDto],
  })
  authMe(@CurrentUser() user: JwtPayloadDto) {
    return this.authService.authMe(user);
  }
}
