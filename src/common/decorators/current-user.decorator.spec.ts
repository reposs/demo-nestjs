import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { describe, expect, it } from '@jest/globals';
import { CurrentUser } from './current-user.decorator';

function getParamDecoratorFactory() {
  class TestTarget {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    testMethod(@CurrentUser() _user: unknown) {}
  }

  const args = Reflect.getMetadata(
    ROUTE_ARGS_METADATA,
    TestTarget,
    'testMethod',
  ) as Record<string, { factory: (data: unknown, ctx: unknown) => unknown }>;
  return args[Object.keys(args)[0]].factory;
}

describe('CurrentUser Decorator', () => {
  it('extracts user from execution context', () => {
    const factory = getParamDecoratorFactory();
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ user: mockUser }),
      }),
    };

    const result = factory(undefined, mockContext);
    expect(result).toEqual(mockUser);
  });

  it('extracts specific property from user if provided', () => {
    const factory = getParamDecoratorFactory();
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ user: mockUser }),
      }),
    };

    const result = factory('email', mockContext);
    expect(result).toBe('test@example.com');
  });

  it('returns null if request has no user', () => {
    const factory = getParamDecoratorFactory();
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    };

    const result = factory(undefined, mockContext);
    expect(result).toBeNull();
  });
});
