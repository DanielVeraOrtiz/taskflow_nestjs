import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    // No uso spread, debido a que me quedaria password dentro de objeto.
    const user = this.usersRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      passwordHash,
    });

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError && (error as { code?: string }).code === '23505') {
        throw new ConflictException('Email already exists');
      }

      throw error;
    }
  }

  // Esta bien que devuelva una lista vacia en caso que no hayan usuarios
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // En cada caso que se busque un usuario por id se lanza excepcion si no lo encuentra
  // En el caso contrario devuelve un string vacio.
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    // Existe el usuario?
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Desempaqueto para tener la password aparte y cambiarla manualmente en
    // user al hashearla.
    const { password, ...userData } = updateUserDto;

    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }
    // Utilizo Object.assign para asignar todo de userData a user, como las propiedades
    // se repiten entonces se sobrescriben y luego se guarda este user con los campos actualizados.
    Object.assign(user, userData);

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError && (error as { code?: string }).code === '23505') {
        throw new ConflictException('Email already exists');
      }

      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
