import { inject, injectable } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  password: string;
  token: string;
}

@injectable()
class ResetPasswordService {
  private usersRepository: IUsersRepository;

  private userTokensRepository: IUserTokensRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository')
      usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
      userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
      hashProvider: IHashProvider,
  ) {
    this.usersRepository = usersRepository;
    this.userTokensRepository = userTokensRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({ token, password }: IRequestDTO): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exist');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exist');
    }

    const compareDate = addHours(userToken.created_at, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('The token expired');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.update(user);
  }
}

export default ResetPasswordService;
