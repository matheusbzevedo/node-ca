import type RideRepository from "../../infra/repository/RideRepository";
import type AccountGateway from "../gateway/AccountGateway";

export default class AcceptRide {
	constructor(
		readonly rideRepository: RideRepository,
		readonly accountGateway: AccountGateway,
	) {}

	async execute(input: Input): Promise<void> {
		const account = await this.accountGateway.getAccountById(input.driverId);

		if (!account?.isDriver) throw new Error("Account is not from a driver");
		const ride = await this.rideRepository.getRideById(input.rideId);

		ride.accept(input.driverId);
		await this.rideRepository.updateRide(ride);
	}
}

interface Input {
	rideId: string;
	driverId: string;
}
