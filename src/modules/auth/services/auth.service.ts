import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '@/modules/auth/dto/login.dto';
import { USERS_REPOSITORY } from '../../../users/constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: {
      findByEmail: (email: string) => Promise<any>;
    },
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
        userId: user.id,
        email: user.email,
      }),
    };
  }
}
