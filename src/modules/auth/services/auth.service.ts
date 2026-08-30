import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { USERS_REPOSITORY } from '@/modules/users/constants/users-repository.constant';
import type { IUsersRepository } from '@/modules/users/interfaces/users-repository.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginDto) {
    const user = await this.usersRepository.findByEmail(data.email);
    if (
      !user ||
      user.disabled ||
      !(await bcrypt.compare(data.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
      }),
    };
  }
}
