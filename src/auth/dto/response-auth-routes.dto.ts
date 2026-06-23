import { ResponseUserDto } from 'src/users/dto/response-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponseAuthRoutesDto {
  @ApiProperty()
  @IsString()
  access_token!: string;

  @ApiProperty()
  user!: ResponseUserDto;
}
