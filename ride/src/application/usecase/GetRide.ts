import type PositionRepository from "../../infra/repository/PositionRepository";
import type RideRepository from "../../infra/repository/RideRepository";
import type AccountGateway from "../gateway/AccountGateway";

export default class GetRide {
	constructor(
		readonly rideRepository: RideRepository,
		readonly positionRepository: PositionRepository,
		readonly accountGateway: AccountGateway,
	) {}

	async execute(input: Input): Promise<Output> {
		const ride = await this.rideRepository.getRideById(input.rideId);
		const passenger = await this.accountGateway.getAccountById(
			ride.passengerId,
		);
		let driver;

		if (ride.driverId) {
			driver = await this.accountGateway.getAccountById(ride.driverId);
		}

		return {
			distance: ride.distance,
			fare: ride.fare,
			fromLat: ride.getFromLat(),
			fromLong: ride.getFromLong(),
			passengerEmail: passenger!.email,
			passengerId: ride.passengerId,
			passengerName: passenger!.name,
			rideId: ride.rideId,
			status: ride.getStatus(),
			toLat: ride.getToLat(),
			toLong: ride.getToLong(),
			driverEmail: driver?.email,
			driverName: driver?.name,
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
