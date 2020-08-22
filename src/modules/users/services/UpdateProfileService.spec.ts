import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update user name and email', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Ipsum',
      email: 'johnipsum@example.com',
    });

    expect(updatedUser.name).toBe('John Ipsum');
    expect(updatedUser.email).toBe('johnipsum@example.com');
  });

  it('should not update user email if the new one is already in use', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Henrique Cotta',
      email: 'henrique.cotta@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Update Test',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update user password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Ipsum',
      email: 'johnipsum@example.com',
      old_password: '123456',
      password: '123456-new-password',
    });

    expect(updatedUser.password).toBe('123456-new-password');
  });

  it('should not update user password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Ipsum',
        email: 'johnipsum@example.com',
        password: '123456-new-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not update user password with incorrect old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Ipsum',
        email: 'johnipsum@example.com',
        old_password: 'incorrect-password',
        password: '123456-new-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not retrieve information from an unexisting user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'unexisting-id',
        name: 'Unexisting User',
        email: 'unexisting@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
