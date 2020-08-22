import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import IFindByMonthDTO from '@modules/appointments/dtos/IFindByMonthDTO';
import IFindByDayDTO from '@modules/appointments/dtos/IFindByDayDTO';
import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async findByMonth({
    providerId,
    month,
    year,
  }: IFindByMonthDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const appointmentsList = await this.ormRepository.find({
      where: {
        provider_id: providerId,
        date: Raw(dateFieldName => (
          `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
        )),
      },
    });

    return appointmentsList;
  }

  public async findByDay({
    providerId,
    month,
    year,
    day,
  }: IFindByDayDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointmentsList = await this.ormRepository.find({
      where: {
        provider_id: providerId,
        date: Raw(dateFieldName => (
          `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
        )),
      },
      relations: ['user'],
    });

    return appointmentsList;
  }

  public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    return findAppointment || undefined;
  }
}

export default AppointmentsRepository;
