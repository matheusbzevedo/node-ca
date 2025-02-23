import Ride from '../../domain/entity/Ride';
import { AccountRepository } from '../../infra/repository/AccountRepository';
import RideRepository from '../../infra/repository/RideRepository';

export default class RequestRide {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly rideRepository: RideRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const account = await this.accountRepository.getAccountById(
      input.passengerId,
    );

    if (!account?.isPassenger)
      throw new Error('Account is not from a passenger');
    const hasActiveRide = await this.rideRepository.hasActiveRideByPassengerId(
      input.passengerId,
    );

    if (hasActiveRide) throw new Error('Passenger has an active ride');
    const ride = Ride.create(
      input.passengerId,
      input.fromLat,
      input.fromLong,
      input.toLat,
      input.toLong,
    );

    await this.rideRepository.saveRide(ride);

    return {
      rideId: ride.rideId,
    };
  }
}

interface Input {
  fromLat: number;
  fromLong: number;
  passengerId: string;
  toLat: number;
  toLong: number;
}

interface Output {
  rideId: string;
}
