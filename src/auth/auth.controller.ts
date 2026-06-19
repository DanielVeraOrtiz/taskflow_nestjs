import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ResponseAuthRoutesDto } from './dto/response-auth-routes.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

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
}
