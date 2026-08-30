import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, JwtStrategy } from './jwt.strategy';
import { IUsersRepository } from '@/modules/users/interfaces/users-repository.interface';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: ConfigService;
  let usersRepository: jest.Mocked<IUsersRepository>;

  beforeEach(() => {
    configService = {
      getOrThrow: jest.fn().mockReturnValue('test-secret'),
    } as unknown as ConfigService;
    usersRepository = {
      findByEmail: jest.fn(),
    } as unknown as jest.Mocked<IUsersRepository>;

    jwtStrategy = new JwtStrategy(configService, usersRepository);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should return payload when user exists and is active', async () => {
    const payload: JwtPayload = { userId: '123', email: 'test@example.com' };
    usersRepository.findByEmail.mockResolvedValue({
      id: '123',
      email: 'test@example.com',
      disabled: false,
    } as any);

    const result = await jwtStrategy.validate(payload);
    expect(result).toEqual(payload);
    expect(usersRepository.findByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
  });

  it('should throw UnauthorizedException when user does not exist', async () => {
    const payload: JwtPayload = { userId: '123', email: 'test@example.com' };
    usersRepository.findByEmail.mockResolvedValue(null);

    await expect(jwtStrategy.validate(payload)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(usersRepository.findByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
  });

  it('should throw UnauthorizedException when user is disabled', async () => {
    const payload: JwtPayload = { userId: '123', email: 'test@example.com' };
    usersRepository.findByEmail.mockResolvedValue({
      id: '123',
      email: 'test@example.com',
      disabled: true,
    } as any);

    await expect(jwtStrategy.validate(payload)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(usersRepository.findByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
  });
});
