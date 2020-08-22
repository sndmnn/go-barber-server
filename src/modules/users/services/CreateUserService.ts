import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  name: string
  email: string
  password: string
}

@injectable()
class CreateUserService {
  private usersRepository: IUsersRepository;

  private hashProvider: IHashProvider;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('UsersRepository')
      usersRepository: IUsersRepository,

    @inject('HashProvider')
      hashProvider: IHashProvider,

    @inject('CacheProvider')
      cacheProvider: ICacheProvider,
  ) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
    this.cacheProvider = cacheProvider;
  }

  public async execute({ name, email, password }: IRequestDTO): Promise<User> {
    const existentUser = await this.usersRepository.findByEmail(email);

    if (existentUser) {
      throw new AppError('Email address already used');
    }

    const encryptedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: encryptedPassword,
    });

    this.cacheProvider.invalidatePrefix('providers-list');

    return user;
  }
}

export default CreateUserService;
