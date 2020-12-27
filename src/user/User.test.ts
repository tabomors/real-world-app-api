import { getConnectionOptions } from 'typeorm';
import connection from '../lib/connection';
import { CreateUser, CreateUserParams } from './CreateUser.service';
import { GetUser } from './GetUser.service';
import { LoginUser, LoginUserParams } from './LoginUser.service';
import { verifyToken } from '../lib/jwt';
import { NotUniqError, AuthFailedError } from '../lib/errors';
import { UpdateUser, UpdateUserParams } from '../user/UpdateUser.service';

beforeAll(async () => {
  const connectionOptions = await getConnectionOptions();
  await connection.create({
    ...connectionOptions,
    database: 'real_world_app_test' as any,
    synchronize: true,
    logging: false,
  });
});

afterAll(async () => {
  await connection.close();
});

beforeEach(async () => {
  await connection.clear();
});

describe('User', () => {
  describe('Registration', () => {
    it('Should register user', async () => {
      const id = await registerUser({
        email: 'test@mail.com',
        username: 'test',
        password: 'test',
      });
      const data = await getUser(id);

      expect(data?.email).toBe('test@mail.com');
      expect(data?.username).toBe('test');
      expect(data?.bio).toBe(null);
      expect(data?.image).toBe(null);
    });

    it('Should not register users with same emails', async () => {
      await registerUser({
        email: 'foo@mail.com',
        username: 'bar',
        password: 'baz',
      });
      await expect(
        async () =>
          await registerUser({
            email: 'foo@mail.com',
            password: 'test',
            username: 'test',
          })
      ).rejects.toThrowError(NotUniqError);
    });

    it('Should not register user if email is invalid', async () => {
      await expect(
        async () =>
          await registerUser({
            email: 'test@mail',
            password: 'test',
            username: 'test',
          })
      ).rejects.toThrowError();
    });
  });

  describe('Login', () => {
    it('Should allow to login user if password and email are correct', async () => {
      await registerUser({
        email: 'test@mail.com',
        username: 'test',
        password: 'pass',
      });
      const token = await login({ email: 'test@mail.com', password: 'pass' });

      expect(token).not.toBeNull();
    });

    it('Should not allow to login user if password is incorrect', async () => {
      await registerUser({
        email: 'test@mail.com',
        username: 'test',
        password: 'pass',
      });
      await expect(
        async () =>
          await login({
            email: 'test@mail.com',
            password: 'pa$$',
          })
      ).rejects.toThrowError(AuthFailedError);
    });

    it('Should not allow to login user if user is not registered', async () => {
      await expect(
        async () =>
          await login({
            email: 'test@mail.com',
            password: 'pass',
          })
      ).rejects.toThrowError(AuthFailedError);
    });
  });

  describe('Update', () => {
    it('Should update user', async () => {
      const id = await registerUser({
        email: 'test@mail.com',
        password: 'test',
        username: 'test',
      });
      await updateUser(id, { bio: 'Updated bio', image: 'Updated image' });
      const user = await getUser(id);

      expect(user?.bio).toBe('Updated bio');
      expect(user?.image).toBe('Updated image');
    });

    it('Should not update user if there are no fields to update', async () => {
      const id = await registerUser({
        email: 'test@mail.com',
        password: 'test',
        username: 'test',
      });

      await expect(async () => await updateUser(id, {})).rejects.toThrowError();
    });
  });
});

async function registerUser({ email, username, password }: CreateUserParams) {
  const createUserService = new CreateUser({});
  const createUserRes = await createUserService.run<CreateUserParams>({
    email,
    username,
    password,
  });
  const { id } = verifyToken(createUserRes?.token as string) as {
    id: string;
  };
  return id;
}

async function getUser(id: string) {
  const getUserService = new GetUser({ userId: Number(id) });
  return await getUserService.run({});
}

async function login(params: LoginUserParams) {
  const loginUserService = new LoginUser({});
  const data = await loginUserService.run<LoginUserParams>({
    email: params.email,
    password: params.password,
  });
  return data?.token;
}

async function updateUser(id: string, params: UpdateUserParams) {
  const updateUserService = new UpdateUser({ userId: Number(id) });
  return await updateUserService.run<UpdateUserParams>(params);
}
