import { AccountRepository } from '../../infra/repository/AccountRepository';
import PositionRepository from '../../infra/repository/PositionRepository';
import RideRepository from '../../infra/repository/RideRepository';

export default class GetRide {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly rideRepository: RideRepository,
    readonly positionRepository: PositionRepository,
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
      distance: ride.distance,
      fare: ride.fare,
      fromLat: ride.getFromLat(),
      fromLong: ride.getFromLong(),
      passengerEmail: passenger!.getEmail(),
      passengerId: ride.passengerId,
      passengerName: passenger!.getName(),
      rideId: ride.rideId,
      status: ride.getStatus(),
      toLat: ride.getToLat(),
      toLong: ride.getToLong(),
      driverEmail: driver?.getEmail(),
      driverName: driver?.getName(),
    };
  }
}

interface Input {
  rideId: string;
}

interface Output {
  distance: number;
  fare: number;
  fromLat: number;
  fromLong: number;
  passengerEmail: string;
  passengerId: string;
  passengerName: string;
  rideId: string;
  status: string;
  toLat: number;
  toLong: number;
  driverEmail?: string;
  driverName?: string;
}
