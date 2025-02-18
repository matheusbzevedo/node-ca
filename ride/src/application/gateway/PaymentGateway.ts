export default interface PaymentGateway {
  processPayment(input: InputProcessPayment): Promise<void>;
}

interface InputProcessPayment {
  rideId: string;
  amount: number;
}
