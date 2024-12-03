import Ride from '../../domain/entity/Ride';
import DatabaseConnection from '../database/DatabaseConnection';

export default interface RideRepository {
  getRideById(rideId: string): Promise<Ride>;
  hasActiveRideByPassengerId(passengerId: string): Promise<boolean>;
  saveRide(ride: Ride): Promise<void>;
  updateRide(ride: Ride): Promise<void>;
}

export class RideRepositoryDatabase implements RideRepository {
  constructor(readonly databaseConnection: DatabaseConnection) {}

  async getRideById(rideId: string): Promise<Ride> {
    const [rideData] = await this.databaseConnection.query(
      'select * from cccat16.ride where ride_id = $1',
      [rideId],
    );
    // const positionsData = await this.databaseConnection.query(
    //   'select * from cccat16.position where ride_id = $1',
    //   [rideId],
    // );
    const ride = Ride.restore(
      rideData.ride_id,
      rideData.passenger_id,
      rideData.driver_id,
      Number.parseFloat(rideData.from_lat),
      Number.parseFloat(rideData.from_long),
      Number.parseFloat(rideData.to_lat),
      Number.parseFloat(rideData.to_long),
      rideData.status,
      rideData.date,
    );
    // const positions = [];
    // for (const positionData of positionsData) {
    //   positions.push(
    //     Position.restore(
    //       positionData.position_id,
    //       parseFloat(positionData.lat),
    //       parseFloat(positionData.long),
    //       positionData.date,
    //     ),
    //   );
    // }
    // ride.positions = positions;

    return ride;
  }

  async hasActiveRideByPassengerId(passengerId: string): Promise<boolean> {
    const [ride] = await this.databaseConnection.query(
      `select * from cccat16.ride where passenger_id = $1 and status <> 'completed'`,
      [passengerId],
    );

    return !!ride;
  }

  async saveRide(ride: Ride): Promise<void> {
    await this.databaseConnection.query(
      'insert into cccat16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        ride.rideId,
        ride.passengerId,
        ride.getFromLat(),
        ride.getFromLong(),
        ride.getToLat(),
        ride.getToLong(),
        ride.getStatus(),
        ride.date,
      ],
    );
  }

  async updateRide(ride: Ride): Promise<void> {
    await this.databaseConnection.query(
      'update cccat16.ride set status = $1, driver_id = $2 where ride_id = $3',
      [ride.getStatus(), ride.driverId, ride.rideId],
    );
  }
}
