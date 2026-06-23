import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ResponseProjectDto } from './dto/response-project.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    user: JwtPayloadDto,
  ): Promise<ResponseProjectDto> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      createdBy: user.sub,
    });

    return await this.projectRepository.save(project);
  }

  async findAll(): Promise<ResponseProjectDto[]> {
    return this.projectRepository.find();
  }

  async findOne(id: number): Promise<ResponseProjectDto> {
    const project = await this.projectRepository.findOneBy({ id });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<ResponseProjectDto> {
    const project = await this.projectRepository.findOneBy({ id });
    if (!project) throw new NotFoundException('Project not found');
    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const result = await this.projectRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Project not found');
    }
  }
}
