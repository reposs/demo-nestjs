import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  const repository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    usersService = new UsersService(repository as never);
  });

  it('delegates create to the repository', async () => {
    const data = {
      firstname: 'Ada',
      lastname: 'Lovelace',
      email: 'ada@example.com',
      password: 'password',
    };
    repository.create.mockResolvedValue({ id: 'user-id', ...data });

    await expect(usersService.create(data)).resolves.toEqual({
      id: 'user-id',
      ...data,
    });
    expect(repository.create).toHaveBeenCalledWith(data);
  });

  it('propagates remove to the repository', async () => {
    repository.remove.mockResolvedValue(undefined);

    await expect(usersService.remove('user-id')).resolves.toBeUndefined();
    expect(repository.remove).toHaveBeenCalledWith('user-id');
  });
});
