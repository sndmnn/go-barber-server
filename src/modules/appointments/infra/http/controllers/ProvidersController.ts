import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProviderService from '@modules/appointments/services/ListProvidersService';

class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const listProviderService = container.resolve(ListProviderService);

    const providersList = await listProviderService.execute(userId);

    return response.json(classToClass(providersList));
  }
}

export default ProvidersController;
