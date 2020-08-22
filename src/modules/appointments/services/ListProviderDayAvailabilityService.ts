import { inject, injectable } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  providerId: string;
  month: number;
  year: number;
  day: number;
}

type IResponse = Array<{
  hour: number;
  isAvailable: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  private appointmentsRepository: IAppointmentsRepository;

  constructor(
    @inject('AppointmentsRepository')
      appointmentsRepository: IAppointmentsRepository,
  ) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public async execute({
    providerId,
    month,
    year,
    day,
  }: IRequest): Promise<IResponse> {
    const appointmentsInDay = await this.appointmentsRepository.findByDay({
      providerId,
      day,
      month,
      year,
    });

    const hourStart = 8;
    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );
    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map(hour => {
      const hasAppointmentHour = appointmentsInDay.find(appointment => (
        getHours(appointment.date) === hour
      ));

      const schedule = new Date(year, month - 1, day, hour);

      return {
        hour,
        isAvailable: !hasAppointmentHour && isAfter(schedule, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
