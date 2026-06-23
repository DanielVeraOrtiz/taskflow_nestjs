import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    minLength: 4,
    maxLength: 30,
    example: 'Project LRAF',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  name!: string;

  @ApiProperty({
    minLength: 10,
    maxLength: 300,
    example: 'Is a project about play video games in web',
  })
  @MinLength(10)
  @MaxLength(300)
  @IsString()
  description!: string;
}
