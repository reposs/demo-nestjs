import { UnauthorizedException } from '@nestjs/common';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  const usersService = { findByEmail: jest.fn() };
  const jwtService = { signAsync: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(usersService as never, jwtService as never);
  });

  it('returns an access token for valid credentials', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'admin@example.com',
      password: bcrypt.hashSync('password', 10),
      disabled: false,
    });
    jwtService.signAsync.mockResolvedValue('jwt-token');

    const result = await authService.login({
      email: 'admin@example.com',
      password: 'password',
    });

    expect(result).toEqual({ access_token: 'jwt-token' });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      email: 'admin@example.com',
    });
  });

  it.each([
    ['an unknown user', undefined],
    ['a disabled user', { email: 'admin@example.com', disabled: true }],
  ])('rejects %s', async (_description, user) => {
    usersService.findByEmail.mockResolvedValue(user);

    await expect(
      authService.login({ email: 'admin@example.com', password: 'password' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
