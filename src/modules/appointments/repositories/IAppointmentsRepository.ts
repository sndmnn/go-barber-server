import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindByMonthDTO from '../dtos/IFindByMonthDTO';
import IFindByDayDTO from '../dtos/IFindByDayDTO';

interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByMonth(data: IFindByMonthDTO): Promise<Appointment[]>;
  findByDay(data: IFindByDayDTO): Promise<Appointment[]>;
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
}

export default IAppointmentsRepository;
