import Registry from '../../infra/di/Registry';
import RideRepository from '../../infra/repository/RideRepository';
import PaymentGateway from '../gateway/PaymentGateway';

export default class FinishRide {
  readonly rideRepository: RideRepository;
  readonly paymentGateway: PaymentGateway;

  constructor() {
    this.rideRepository = Registry.getInstance().inject('rideRepository');
    this.paymentGateway = Registry.getInstance().inject('paymentGateway');
  }

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getRideById(input.rideId);

    ride.finish();
    await this.rideRepository.updateRide(ride);
    await this.paymentGateway.processPayment({
      rideId: ride.rideId,
      amount: ride.fare,
    });
  }
}

interface Input {
  rideId: string;
}
