import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    example: 'user12@example.com',
    minLength: 4,
    maxLength: 100,
  })
  @IsEmail()
  @MinLength(4)
  @MaxLength(100)
  email!: string;

  @ApiProperty({
    example: 'PasswordExample12$',
    minLength: 8,
    maxLength: 100,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password!: string;
}
