import { uuid } from 'uuidv4';
import {
  isEqual,
  getMonth,
  getYear,
  getDate,
} from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindByMonthDTO from '../../dtos/IFindByMonthDTO';
import IFindByDayDTO from '../../dtos/IFindByDayDTO';

import Appointment from '../../infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, {
      id: uuid(),
      date,
      provider_id,
      user_id,
    });
    this.appointments.push(appointment);

    return appointment;
  }

  public async findByMonth({
    providerId,
    month,
    year,
  }: IFindByMonthDTO): Promise<Appointment[]> {
    const appointmentsList = this.appointments.filter(appointment => (
      appointment.provider_id === providerId
      && (getMonth(appointment.date) + 1) === month
      && getYear(appointment.date) === year
    ));

    return appointmentsList;
  }

  public async findByDay({
    providerId,
    month,
    year,
    day,
  }: IFindByDayDTO): Promise<Appointment[]> {
    const appointmentsList = this.appointments.filter(appointment => (
      appointment.provider_id === providerId
      && (getMonth(appointment.date) + 1) === month
      && getYear(appointment.date) === year
      && getDate(appointment.date) === day
    ));

    return appointmentsList;
  }

  public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
    return this.appointments.find(appointment => isEqual(appointment.date, date)
      && appointment.provider_id === provider_id);
  }
}

export default AppointmentsRepository;
