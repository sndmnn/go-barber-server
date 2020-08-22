import {
  startOfHour, isBefore, getHours, format,
} from 'date-fns';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  private appointmentsRepository: IAppointmentsRepository;

  private notificationsRepository: INotificationsRepository;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('AppointmentsRepository')
      appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
      notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
      cacheProvider: ICacheProvider,
  ) {
    this.appointmentsRepository = appointmentsRepository;
    this.notificationsRepository = notificationsRepository;
    this.cacheProvider = cacheProvider;
  }

  public async execute({ provider_id, user_id, date }: IRequestDTO): Promise<Appointment> {
    const treatedDate = startOfHour(date);
    const appointmentHour = getHours(treatedDate);

    if (user_id === provider_id) {
      throw new AppError('It\'s not possible for user to be his own provider');
    }

    if (appointmentHour < 8 || appointmentHour > 17) {
      throw new AppError(
        'It\'s not possible to create an appointment outside schedule range',
      );
    }

    if (isBefore(treatedDate, Date.now())) {
      throw new AppError('It\'s not possible to book appointments in the past');
    }

    const appointmentInSameDate = await this.appointmentsRepository.findByDate(
      treatedDate,
      provider_id,
    );

    if (appointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: treatedDate,
    });

    const formattedDate = format(treatedDate, 'dd/MM/yyyy');
    const formattedTime = format(treatedDate, 'HH:mm');

    await this.notificationsRepository.create({
      recipientId: provider_id,
      content: `Novo agendamento para ${formattedDate} às ${formattedTime}h`,
    });

    this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        treatedDate,
        'yyyy-M-d',
      )}`,
    );

    return appointment;
  }
}

export default CreateAppointmentService;
