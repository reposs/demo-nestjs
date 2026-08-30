import { ConflictException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;
  const repository = {
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    usersRepository = new UsersRepository(repository);
  });

  it('finds a user by email including its password', async () => {
    const user = {
      id: 'user-id',
      firstname: 'Test',
      lastname: 'User',
      email: 'user@example.com',
      password: 'hash',
      disabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const queryBuilder = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    };
    (queryBuilder.getOne as any).mockResolvedValue(user);
    repository.createQueryBuilder.mockReturnValue(queryBuilder);

    await expect(usersRepository.findByEmail(user.email)).resolves.toEqual(
      user,
    );
    expect(queryBuilder.addSelect).toHaveBeenCalledWith('user.password');
  });

  it('creates a user with a hashed password and hides it in the result', async () => {
    repository.create.mockImplementation((data) => ({
      id: 'user-id',
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: bcrypt.hashSync(data.password, 10),
      disabled: data.disabled ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    repository.save.mockResolvedValue(undefined);
    repository.createQueryBuilder.mockReturnValue({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    });
    repository.createQueryBuilder().getOne.mockResolvedValue(null);

    const result = await usersRepository.create({
      firstname: 'Ada',
      lastname: 'Lovelace',
      email: 'ada@example.com',
      password: 'password',
    });

    expect(result).not.toHaveProperty('password');
    expect(
      await bcrypt.compare(
        'password',
        repository.create.mock.calls[0][0].password,
      ),
    ).toBe(true);
  });

  it('rejects duplicate emails', async () => {
    repository.createQueryBuilder.mockReturnValue({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    });
    repository.createQueryBuilder().getOne.mockResolvedValue({
      email: 'ada@example.com',
    });

    await expect(
      usersRepository.create({
        firstname: 'Ada',
        lastname: 'Lovelace',
        email: 'ada@example.com',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects deleting an unknown user', async () => {
    repository.delete.mockResolvedValue({ affected: 0 });

    await expect(usersRepository.remove('missing-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
