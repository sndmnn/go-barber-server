import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

import User from '@modules/users/infra/typeorm/entities/User';

class UsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findAllProviders({ exceptUserId }: IFindAllProvidersDTO): Promise<User[]> {
    let userList = this.users;

    if (exceptUserId) {
      userList = this.users.filter(user => user.id !== exceptUserId);
    }

    return userList;
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid() }, data);
    this.users.push(user);

    return user;
  }

  public async update(user: User): Promise<User> {
    const userIndex = this.users.findIndex(persistedUser => persistedUser.id === user.id);
    this.users[userIndex] = user;

    return user;
  }
}

export default UsersRepository;
