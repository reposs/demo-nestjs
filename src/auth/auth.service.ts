import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginDto) {
    const user = await this.usersService.findByEmail(data.email);
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
