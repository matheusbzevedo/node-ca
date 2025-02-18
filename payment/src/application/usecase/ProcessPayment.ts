export default class ProcessPayment {
  constructor() {}

  async execute(input: Input): Promise<void> {
    //
  }
}

interface Input {
  rideId: string;
  amount: number;
}
