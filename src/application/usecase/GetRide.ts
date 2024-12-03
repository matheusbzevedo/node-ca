import { AccountRepository } from '../../infra/repository/AccountRepository';
import RideRepository from '../../infra/repository/RideRepository';

export default class GetRide {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly rideRepository: RideRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const ride = await this.rideRepository.getRideById(input.rideId);
    const passenger = await this.accountRepository.getAccountById(
      ride.passengerId,
    );
    let driver;

    if (ride.driverId) {
      driver = await this.accountRepository.getAccountById(ride.driverId);
    }

    return {
      fromLat: ride.getFromLat(),
      fromLong: ride.getFromLong(),
      passengerEmail: passenger!.getEmail(),
      passengerId: ride.passengerId,
      passengerName: passenger!.getName(),
      rideId: ride.rideId,
      status: ride.getStatus(),
      toLat: ride.getToLat(),
      toLong: ride.getToLong(),
      driverName: driver?.getName(),
      driverEmail: driver?.getEmail(),
    };
  }
}

interface Input {
  rideId: string;
}

interface Output {
  fromLat: number;
  fromLong: number;
  passengerEmail: string;
  passengerId: string;
  passengerName: string;
  rideId: string;
  status: string;
  toLat: number;
  toLong: number;
  driverName?: string;
  driverEmail?: string;
}
