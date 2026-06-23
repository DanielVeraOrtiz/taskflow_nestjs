import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { QueryFailedError } from 'typeorm';
import { ResponseUserDto } from './dto/response-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    // No uso spread, debido a que me quedaria password dentro de objeto.
    const user = this.usersRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      passwordHash,
    });

    // try/catch en caso de que al crear el usuario me salga error de violacion de unicidad por email
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
  async findAll(): Promise<ResponseUserDto[]> {
    return this.usersRepository.find();
  }

  // Se busca un user por id y en caso de no encontralo se arroja una excepcion built in de nest respecto
  // a no encontrar un elemento.
  async findOne(id: number): Promise<ResponseUserDto> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
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

    // try/catch en caso de email repetido error.
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

    // Intento borrar primero y si nada fue borrado entonces lanzo la excepcion que es mejor que preguntar
    // antes si existe el usuario usando un find.
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  // Exclusivo para el login de auth. Es necesario un select, debido a que por defecto del repository
  // se coloco que no entre passwordHash. Sin embargo, en login necesito la passwordHash para comprobar
  // si la password que mando es correcta.
  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        passwordHash: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
