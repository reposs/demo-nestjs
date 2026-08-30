import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let usersController: UsersController;
  const usersService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const makeSafeUser = (overrides = {}) => ({
    id: 'user-id',
    firstname: 'Ada',
    lastname: 'Lovelace',
    email: 'ada@example.com',
    disabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    usersController = new UsersController(usersService as any);
  });

  it('returns all users', async () => {
    const user = makeSafeUser({ id: 'user-id' });
    (usersService.findAll as any).mockResolvedValue([user]);

    await expect(usersController.findAll()).resolves.toEqual([user]);
    expect(usersService.findAll).toHaveBeenCalled();
  });

  it('updates a user using its UUID', async () => {
    const data = { disabled: true };
    const updatedUser = makeSafeUser({ id: 'user-id', ...data });
    (usersService.update as any).mockResolvedValue(updatedUser);

    await expect(usersController.update('user-id', data)).resolves.toEqual(
      updatedUser,
    );
    expect(usersService.update).toHaveBeenCalledWith('user-id', data);
  });

  it('removes a user using its UUID', async () => {
    (usersService.remove as any).mockResolvedValue(undefined);

    await expect(usersController.remove('user-id')).resolves.toBeUndefined();
    expect(usersService.remove).toHaveBeenCalledWith('user-id');
  });
});
