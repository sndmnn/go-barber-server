import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProvidersService = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the providers', async () => {
    const provider1 = await fakeUsersRepository.create({
      name: 'Provider 1',
      email: 'user1@example.com',
      password: '123456',
    });

    const provider2 = await fakeUsersRepository.create({
      name: 'Provider 2',
      email: 'user2@example.com',
      password: '123456',
    });

    const provider3 = await fakeUsersRepository.create({
      name: 'Provider 3',
      email: 'user3@example.com',
      password: '123456',
    });

    const authUser = await fakeUsersRepository.create({
      name: 'Authenticated User',
      email: 'auth@example.com',
      password: '123456',
    });

    const providersList = await listProvidersService.execute(authUser.id);

    expect(providersList).toEqual([
      provider1,
      provider2,
      provider3,
    ]);
  });
});
