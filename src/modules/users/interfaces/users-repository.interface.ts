import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { PaginatorQueryDto } from '@/common/dto/paginator-query.dto';

export interface IUsersRepository {
  findAll(query?: PaginatorQueryDto): Promise<Omit<User, 'password'>[]>;
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDto): Promise<Omit<User, 'password'>>;
  update(id: string, data: UpdateUserDto): Promise<Omit<User, 'password'>>;
  remove(id: string): Promise<void>;
}
