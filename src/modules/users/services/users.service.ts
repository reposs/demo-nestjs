import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { USERS_REPOSITORY } from '../constants/users-repository.constant';
import type { IUsersRepository } from '../interfaces/users-repository.interface';
import { PaginatorQueryDto } from '@/common/dto/paginator-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  findAll(query?: PaginatorQueryDto) {
    return this.usersRepository.findAll(query);
  }

  findById(id: string) {
    return this.usersRepository.findById(id);
  }

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  create(data: CreateUserDto) {
    return this.usersRepository.create(data);
  }

  update(id: string, data: UpdateUserDto) {
    return this.usersRepository.update(id, data);
  }

  remove(id: string) {
    return this.usersRepository.remove(id);
  }
}
