import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import GetProfileInfoService from './GetProfileInfoService';

let fakeUsersRepository: FakeUsersRepository;
let getProfileInfoService: GetProfileInfoService;

describe('GetProfileInfo', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    getProfileInfoService = new GetProfileInfoService(fakeUsersRepository);
  });

  it('should be able to retrieve user info', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const profileInfo = await getProfileInfoService.execute(user.id);

    expect(profileInfo.name).toBe('John Doe');
    expect(profileInfo.email).toBe('johndoe@example.com');
  });

  it('should not retrieve information from an unexisting user', async () => {
    await expect(
      getProfileInfoService.execute('unexisting-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
