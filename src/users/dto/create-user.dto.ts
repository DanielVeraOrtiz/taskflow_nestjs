import { IsString, IsEmail, MaxLength, MinLength, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Esteban',
    minLength: 4,
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  @MinLength(4)
  firstName!: string;

  @ApiProperty({
    example: 'Gonzalez',
    minLength: 4,
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  @MinLength(4)
  lastName!: string;

  @ApiProperty({
    example: 'esteban.gonzalez@example.com',
  })
  @IsEmail()
  @MaxLength(100)
  @MinLength(4)
  email!: string;

  @ApiProperty({
    example: 'MiPassword123!',
    minLength: 8,
    maxLength: 100,
    description:
      'Must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one symbol',
    },
  )
  password!: string;
}
