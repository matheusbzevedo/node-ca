import type DomainEvent from "../../domain/event/DomainEvent";
import Registry from "../../infra/di/Registry";
import type Mediator from "../../infra/mediator/Mediator";
import type Queue from "../../infra/queue/Queue";
import type RideRepository from "../../infra/repository/RideRepository";
import type PaymentGateway from "../gateway/PaymentGateway";

export default class FinishRide {
	readonly rideRepository: RideRepository;
	readonly paymentGateway: PaymentGateway;
	readonly mediator: Mediator;
	readonly queue: Queue;

	constructor() {
		this.rideRepository = Registry.getInstance().inject("rideRepository");
		this.paymentGateway = Registry.getInstance().inject("paymentGateway");
		this.mediator = Registry.getInstance().inject("mediator");
		this.queue = Registry.getInstance().inject("queue");
	}

	async execute(input: Input): Promise<void> {
		const ride = await this.rideRepository.getRideById(input.rideId);
		ride.register(
			"rideCompleted",
			async (domainEvent: DomainEvent): Promise<void> =>
				await this.queue.publish(domainEvent.eventName, domainEvent.data),
		);
		ride.finish();
		await this.rideRepository.updateRide(ride);
		await this.queue.publish("rideCompleted", {
			rideId: ride.rideId,
			amount: ride.fare,
		});
	}
}

interface Input {
	rideId: string;
}
