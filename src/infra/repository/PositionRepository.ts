import Position from '../../domain/entity/Position';
import DatabaseConnection from '../database/DatabaseConnection';

export default interface PositionRepository {
  save(position: Position): Promise<void>;
}

export class PositionRepositoryDataBase implements PositionRepository {
  constructor(readonly databaseConnection: DatabaseConnection) {}

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
    );
  }
}
