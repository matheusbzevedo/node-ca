import Position from '../../domain/entity/Position';
import PositionRepository from '../../infra/repository/PositionRepository';
import RideRepository from '../../infra/repository/RideRepository';

export default class UpdatePosition {
  constructor(
    readonly rideRepository: RideRepository,
    readonly positionRepository: PositionRepository,
  ) {}

  async execute(input: Input) {
    const position = Position.create(input.rideId, input.lat, input.long);

    await this.positionRepository.save(position);
  }
}

interface Input {
  rideId: string;
  lat: number;
  long: number;
}
