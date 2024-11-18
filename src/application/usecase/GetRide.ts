import { AccountRepository } from '../../infra/repository/AccountRepository';
import RideRepository from '../../infra/repository/RideRepository';

export default class GetRide {
  constructor(
    readonly accountDAO: AccountRepository,
    readonly rideDAO: RideRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const ride = await this.rideDAO.getRideById(input.rideId);
    const passenger = await this.accountDAO.getAccountById(ride.passengerId);

    return {
      fromLat: ride.fromLat,
      fromLong: ride.fromLong,
      passengerEmail: passenger!.email,
      passengerId: ride.passengerId,
      passengerName: passenger!.name,
      rideId: ride.rideId,
      status: ride.status,
      toLat: ride.toLat,
      toLong: ride.toLong,
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
}
