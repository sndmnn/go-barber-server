import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import GetProfileInfoService from '@modules/users/services/GetProfileInfoService';

class UserProfileController {
  public async getInfo(request: Request, response: Response): Promise<Response> {
    const getProfileInfoService = container.resolve(GetProfileInfoService);
    const profileInfo = await getProfileInfoService.execute(request.user.id);

    return response.json(classToClass(profileInfo));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const {
      name,
      email,
      old_password,
      password,
    } = request.body;

    const updateUserProfileService = container.resolve(UpdateProfileService);

    const user = await updateUserProfileService.execute({
      user_id,
      name,
      email,
      old_password,
      password,
    });

    return response.json(classToClass(user));
  }
}

export default UserProfileController;
