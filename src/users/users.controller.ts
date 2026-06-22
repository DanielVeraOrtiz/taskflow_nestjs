import { Controller, Get, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiOkResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';

import { ParseIntPipe } from '@nestjs/common';
import { AuthDocsDecorators } from 'src/common/decorators/auth-docs.decorator';

@ApiTags('Users')
// Auth docs decorators son dos decorators de swagger para documentar que neceista Bearer Auth y
// documentar que necesita en Authorization un Bearer jwt.
@AuthDocsDecorators()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  // ApiOperation y ApiOkResponse de swagger para documentar, uno para dar un resumen del endpoint y otro
  // para dar la descripcion de la respose al salir bien conjunto con como se veria la response misma.
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    description: 'Users retrieved successfully',
    type: [ResponseUserDto],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  // ApiParam de swagger para documentar en este que necesita un param de numbre id.
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiNoContentResponse({
    description: 'User deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
