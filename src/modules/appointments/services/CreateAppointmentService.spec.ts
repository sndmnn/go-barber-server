import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    fakeNotificationsRepository = new FakeNotificationsRepository();

    fakeCacheProvider = new FakeCacheProvider();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new Apoointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => (
      new Date(2020, 4, 10, 12).getTime()
    ));

    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: '1234',
      user_id: '123456',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1234');
  });

  it('should not create two appointments on the same date', async () => {
    const appointmentDate = new Date(2020, 7, 10, 13);

    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '1234',
      user_id: '123456',
    });

    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: '1234',
        user_id: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not create appointments on past dates', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => (
      new Date(2020, 4, 10, 12).getTime()
    ));

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 10, 11),
        provider_id: '1234',
        user_id: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not create an appointment with a user being his own provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => (
      new Date(2020, 4, 10, 12).getTime()
    ));

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 10, 13),
        provider_id: '123456',
        user_id: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not create an appointment outside schedule range', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => (
      new Date(2020, 4, 10, 12).getTime()
    ));

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 11, 7),
        provider_id: '123',
        user_id: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 11, 18),
        provider_id: '123',
        user_id: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
