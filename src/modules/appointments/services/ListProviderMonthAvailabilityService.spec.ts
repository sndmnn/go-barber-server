import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list a providers available days in a month', async () => {
    for (let hour = 8; hour < 18; hour += 1) {
      // eslint-disable-next-line no-await-in-loop
      await fakeAppointmentsRepository.create({
        provider_id: 'provider-1',
        user_id: 'user-1',
        date: new Date(2020, 4, 20, hour, 0, 0),
      });
    }

    await fakeAppointmentsRepository.create({
      provider_id: 'provider-1',
      user_id: 'user-1',
      date: new Date(2020, 4, 21, 10, 0, 0),
    });

    const availableAppointments = await listProviderMonthAvailabilityService.execute({
      providerId: 'provider-1',
      month: 5,
      year: 2020,
    });

    expect(availableAppointments).toEqual(expect.arrayContaining([
      { day: 19, isAvailable: true },
      { day: 20, isAvailable: false },
      { day: 21, isAvailable: true },
      { day: 22, isAvailable: true },
    ]));
  });
});
