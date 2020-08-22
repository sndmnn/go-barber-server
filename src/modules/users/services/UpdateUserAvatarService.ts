import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string
  avatarFileName: string
}

@injectable()
class UpdateUserAvatarService {
  private usersRepository: IUsersRepository;

  private storageProvider: IStorageProvider;

  constructor(
    @inject('UsersRepository')
      usersRepository: IUsersRepository,

    @inject('StorageProvider')
      storageProvider: IStorageProvider,
  ) {
    this.usersRepository = usersRepository;
    this.storageProvider = storageProvider;
  }

  public async execute({ user_id, avatarFileName }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    if (user.avatar) {
      this.storageProvider.deleteFile(user.avatar);
    }

    const fileName = await this.storageProvider.saveFile(avatarFileName);
    user.avatar = fileName;

    await this.usersRepository.update(user);

    return user;
  }
}

export default UpdateUserAvatarService;
