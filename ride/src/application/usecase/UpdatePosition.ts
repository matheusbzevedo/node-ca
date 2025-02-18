import Position from '../../domain/entity/Position';
import PositionRepository from '../../infra/repository/PositionRepository';
import RideRepository from '../../infra/repository/RideRepository';

export default class UpdatePosition {
  constructor(
    readonly rideRepository: RideRepository,
    readonly positionRepository: PositionRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getRideById(input.rideId);

    ride.updatePosition(input.lat, input.long, input.date);
    await this.rideRepository.updateRide(ride);
    const position = Position.create(
      input.rideId,
      input.lat,
      input.long,
      input.date,
    );

    await this.positionRepository.save(position);

    await this.rideRepository.databaseConnection.commit();
  }
}

interface Input {
  rideId: string;
  lat: number;
  long: number;
  date: Date;
}
