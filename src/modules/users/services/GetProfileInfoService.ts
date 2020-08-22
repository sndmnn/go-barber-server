import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class GetProfileInfoService {
  private usersRepository: IUsersRepository;

  constructor(
    @inject('UsersRepository')
      usersRepository: IUsersRepository,
  ) {
    this.usersRepository = usersRepository;
  }

  public async execute(user_id: string): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    return user;
  }
}

export default GetProfileInfoService;
