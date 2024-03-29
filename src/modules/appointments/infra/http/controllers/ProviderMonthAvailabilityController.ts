import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;

    const { month, year } = request.query;

    const listProviderMonthAvailabilityService = container
      .resolve(ListProviderMonthAvailabilityService);

    const availability = await listProviderMonthAvailabilityService.execute({
      providerId: provider_id,
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}

export default ProviderMonthAvailabilityController;
