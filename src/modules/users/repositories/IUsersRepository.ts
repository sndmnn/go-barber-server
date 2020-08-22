import IFindAllProvidersDTO from '../dtos/IFindAllProvidersDTO';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

import User from '../infra/typeorm/entities/User';

interface IUsersRepository {
  findAllProviders(data: IFindAllProvidersDTO): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  update(user: User): Promise<User>;
}

export default IUsersRepository;
