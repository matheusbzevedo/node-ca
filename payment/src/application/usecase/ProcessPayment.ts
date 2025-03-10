export default class ProcessPayment {
	async execute(input: Input): Promise<void> {
		//
		console.log(input);
	}
}

interface Input {
	rideId: string;
	amount: number;
}
