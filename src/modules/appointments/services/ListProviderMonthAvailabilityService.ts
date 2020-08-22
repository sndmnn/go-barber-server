import { inject, injectable } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  providerId: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  isAvailable: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  private appointmentsRepository: IAppointmentsRepository;

  constructor(
    @inject('AppointmentsRepository')
      appointmentsRepository: IAppointmentsRepository,
  ) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public async execute({ providerId, month, year }: IRequest): Promise<IResponse> {
    const appointmentsInMonth = await this.appointmentsRepository.findByMonth({
      providerId,
      month,
      year,
    });

    const numberOfDaysInMonth = getDaysInMonth(
      new Date(year, month - 1),
    );

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const availability = eachDayArray.map(day => {
      const compareDate = new Date(year, month - 1, day, 17, 0, 0);

      const appointmentsInDay = appointmentsInMonth.filter(appointment => (
        getDate(appointment.date) === day
      ));

      return {
        day,
        isAvailable: isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
