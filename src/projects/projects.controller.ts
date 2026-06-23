import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthDocsDecorators } from 'src/common/decorators/auth-docs.decorator';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseProjectDto } from './dto/response-project.dto';

@ApiTags('Projects')
@AuthDocsDecorators()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a Project' })
  @ApiCreatedResponse({
    description: 'Project created successfully',
    type: ResponseProjectDto,
  })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiOkResponse({
    description: 'Projects retrieved successfully',
    type: [ResponseProjectDto],
  })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({
    description: 'Project retrieved successfully',
    type: ResponseProjectDto,
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({
    description: 'Project updated successfully',
    type: ResponseProjectDto,
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiNoContentResponse({
    description: 'Project deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }
}
