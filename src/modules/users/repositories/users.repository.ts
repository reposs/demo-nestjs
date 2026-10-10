import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import type { IUsersRepository } from '../interfaces/users-repository.interface';
import { PaginatorQueryDto } from '@/common/dto/paginator-query.dto';

const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class UsersRepository implements OnModuleInit, IUsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async onModuleInit(): Promise<void> {
    const adminUser = await this.findByEmail('admin@example.com');
    if (!adminUser) {
      await this.create({
        firstname: 'Admin',
        lastname: 'User',
        email: 'admin@example.com',
        password: 'password',
      });
    }
  }

  async findAll(query?: PaginatorQueryDto): Promise<Omit<User, 'password'>[]> {
    if (!query) {
      return this.repository.find({
        order: { createdAt: 'DESC' },
      });
    }

    const { skip = 0, limit = 10 } = query;
    return this.repository.find({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async create(data: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);
    const user = this.repository.create({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: hashedPassword,
    });
    await this.repository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  async update(
    id: string,
    data: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.findById(id);
    if (
      data.email &&
      data.email !== user.email &&
      (await this.findByEmail(data.email))
    ) {
      throw new ConflictException('Email already in use');
    }

    if (data.firstname !== undefined) {
      user.firstname = data.firstname;
    }
    if (data.lastname !== undefined) {
      user.lastname = data.lastname;
    }
    if (data.email !== undefined) {
      user.email = data.email;
    }
    if (data.password !== undefined) {
      user.password = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);
    }
    if (data.disabled !== undefined) {
      user.disabled = data.disabled;
    }
    await this.repository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
