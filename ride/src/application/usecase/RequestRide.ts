import Ride from "../../domain/entity/Ride";
import type RideRepository from "../../infra/repository/RideRepository";
import type AccountGateway from "../gateway/AccountGateway";

export default class RequestRide {
	constructor(
		readonly rideRepository: RideRepository,
		readonly accountGateway: AccountGateway,
	) {}

	async execute(input: Input): Promise<Output> {
		const account = await this.accountGateway.getAccountById(input.passengerId);

		if (!account?.isPassenger)
			throw new Error("Account is not from a passenger");
		const hasActiveRide = await this.rideRepository.hasActiveRideByPassengerId(
			input.passengerId,
		);

		if (hasActiveRide) throw new Error("Passenger has an active ride");
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
