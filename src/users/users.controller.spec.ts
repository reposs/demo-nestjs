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

  beforeEach(() => {
    jest.clearAllMocks();
    usersController = new UsersController(usersService as never);
  });

  it('returns all users', async () => {
    usersService.findAll.mockResolvedValue([{ id: 'user-id' }]);

    await expect(usersController.findAll()).resolves.toEqual([
      { id: 'user-id' },
    ]);
    expect(usersService.findAll).toHaveBeenCalled();
  });

  it('updates a user using its UUID', async () => {
    const data = { disabled: true };
    usersService.update.mockResolvedValue({ id: 'user-id', ...data });

    await expect(usersController.update('user-id', data)).resolves.toEqual({
      id: 'user-id',
      disabled: true,
    });
    expect(usersService.update).toHaveBeenCalledWith('user-id', data);
  });

  it('removes a user using its UUID', async () => {
    usersService.remove.mockResolvedValue(undefined);

    await expect(usersController.remove('user-id')).resolves.toBeUndefined();
    expect(usersService.remove).toHaveBeenCalledWith('user-id');
  });
});
