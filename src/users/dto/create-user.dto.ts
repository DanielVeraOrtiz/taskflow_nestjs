import { IsString, IsEmail, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MaxLength(20)
  @MinLength(4)
  firstName!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(20)
  @MinLength(4)
  lastName!: string;

  @ApiProperty()
  @IsEmail()
  @MaxLength(50)
  @MinLength(4)
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password!: string;
}
