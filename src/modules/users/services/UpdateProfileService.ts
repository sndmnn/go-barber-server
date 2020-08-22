import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  private usersRepository: IUsersRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository')
      usersRepository: IUsersRepository,

    @inject('HashProvider')
      hashProvider: IHashProvider,
  ) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exist', 401);
    }

    const existingUserWithEmail = await this.usersRepository.findByEmail(email);

    if (existingUserWithEmail && existingUserWithEmail.id !== user_id) {
      throw new AppError('Specified e-mail already in use ');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError(
        'It\'s not possible to update password without current password',
      );
    }

    if (password && old_password) {
      const isPasswordEqual = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!isPasswordEqual) {
        throw new AppError('Current password does not match');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.update(user);
  }
}

export default UpdateProfileService;
