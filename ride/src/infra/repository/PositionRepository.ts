import Position from '../../domain/entity/Position';
import DatabaseConnection from '../database/DatabaseConnection';

export default interface PositionRepository {
  getByRideId(rideId: string): Promise<Position[]>;
  save(position: Position): Promise<void>;
}

export class PositionRepositoryDataBase implements PositionRepository {
  constructor(readonly databaseConnection: DatabaseConnection) {}
  async getByRideId(rideId: string): Promise<Position[]> {
    const positionData = await this.databaseConnection.query(
      'select * from cccat16.position where ride_id = $1',
      [rideId],
    );
    const positions: Position[] = [];

    for (const position of positionData) {
      positions.push(
        Position.restore(
          position.position_id,
          position.ride_id,
          Number.parseFloat(position.lat),
          Number.parseFloat(position.long),
          position.date,
        ),
      );
    }

    return positions;
  }

  async save(position: Position): Promise<void> {
    await this.databaseConnection.query(
      'insert into cccat16.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)',
      [
        position.positionId,
        position.rideId,
        position.coord.getLat(),
        position.coord.getLong(),
        position.date,
      ],
      true,
    );
  }
}
