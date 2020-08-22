import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list a providers available schedules in a day', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider-1',
      user_id: 'user-1',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider-1',
      user_id: 'user-1',
      date: new Date(2020, 4, 20, 16, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => (
      new Date(2020, 4, 20, 11).getTime()
    ));

    const availability = await listProviderDayAvailabilityService.execute({
      providerId: 'provider-1',
      day: 20,
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, isAvailable: false },
        { hour: 9, isAvailable: false },
        { hour: 10, isAvailable: false },
        { hour: 13, isAvailable: true },
        { hour: 14, isAvailable: false },
        { hour: 15, isAvailable: true },
        { hour: 16, isAvailable: false },
        { hour: 17, isAvailable: true },
      ]),
    );
  });
});
