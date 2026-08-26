import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async onModuleInit(): Promise<void> {
    if (!(await this.findByEmail('admin@example.com'))) {
      await this.create({
        firstname: 'Admin',
        lastname: 'User',
        email: 'admin@example.com',
        password: 'password',
      });
    }
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
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
    if (await this.findByEmail(data.email)) {
      throw new ConflictException('Email already in use');
    }

    const user = this.repository.create({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: bcrypt.hashSync(data.password, 10),
      disabled: data.disabled ?? false,
    });
    await this.repository.save(user);
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async update(id: string, data: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.findById(id);
    if (data.email && data.email !== user.email && (await this.findByEmail(data.email))) {
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
      user.password = bcrypt.hashSync(data.password, 10);
    }
    if (data.disabled !== undefined) {
      user.disabled = data.disabled;
    }
    await this.repository.save(user);
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (!result.affected) {
      throw new NotFoundException('User not found');
    }
  }
}
