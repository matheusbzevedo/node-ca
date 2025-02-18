export default interface FareCalculator {
  calculate(distance: number): number;
}

export class NormalFareCalculator implements FareCalculator {
  calculate(distance: number): number {
    return distance * 2.1;
  }
}

export class OverNightFareCalculator implements FareCalculator {
  calculate(distance: number): number {
    return distance * 4.2;
  }
}

export const FareCalculatorFactory = {
  create(date: Date) {
    if (date.getHours() > 22) return new OverNightFareCalculator();
    if (date.getHours() <= 22) return new NormalFareCalculator();

    throw new Error('Invalid!');
  },
};
