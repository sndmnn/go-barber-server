import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import User from '@modules/users/infra/typeorm/entities/User';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

@injectable()
class ListProvidersService {
  private usersRepository: IUsersRepository;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('UsersRepository')
      usersRepository: IUsersRepository,

    @inject('CacheProvider')
      cacheProvider: ICacheProvider,
  ) {
    this.usersRepository = usersRepository;
    this.cacheProvider = cacheProvider;
  }

  public async execute(user_id: string): Promise<User[]> {
    let providerList = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`,
    );

    if (!providerList) {
      providerList = await this.usersRepository.findAllProviders({
        exceptUserId: user_id,
      });

      this.cacheProvider.save(`providers-list:${user_id}`,
        classToClass(providerList));
    }

    return providerList;
  }
}

export default ListProvidersService;
