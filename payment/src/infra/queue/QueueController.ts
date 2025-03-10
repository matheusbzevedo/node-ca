import type ProcessPayment from "../../application/usecase/ProcessPayment";
import type Queue from "./Queue";

export default class QueueController {
	constructor(queue: Queue, processPayment: ProcessPayment) {
		queue.consume(
			"rideCompleted.processPayment",
			async (input: any): Promise<void> => {
				await processPayment.execute(input);
			},
		);
	}
}
