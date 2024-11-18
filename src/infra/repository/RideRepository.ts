import Ride from '../../domain/Ride';
import DatabaseConnection from '../database/DatabaseConnection';

export default interface RideRepository {
  getRideById(rideId: string): Promise<Ride>;
  hasActiveRideByPassengerId(passengerId: string): Promise<boolean>;
  saveRide(ride: Ride): Promise<void>;
}

export class RideRepositoryDatabase implements RideRepository {
  constructor(readonly databaseConnection: DatabaseConnection) {}

  async getRideById(rideId: string): Promise<any> {
    const [ride] = await this.databaseConnection.query(
      'select * from cccat16.ride where ride_id = $1',
      [rideId],
    );
    return Ride.restore(
      ride.ride_id,
      ride.passenger_id,
      parseFloat(ride.from_lat),
      parseFloat(ride.from_long),
      parseFloat(ride.to_lat),
      parseFloat(ride.to_long),
      ride.status,
      ride.date,
    );
  }

  async hasActiveRideByPassengerId(passengerId: string): Promise<boolean> {
    const [ride] = await this.databaseConnection.query(
      "select * from cccat16.ride where passenger_id = $1 and status <> 'completed'",
      [passengerId],
    );
    return !!ride;
  }

  async saveRide(ride: any): Promise<void> {
    await this.databaseConnection.query(
      'insert into cccat16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        ride.rideId,
        ride.passengerId,
        ride.fromLat,
        ride.fromLong,
        ride.toLat,
        ride.toLong,
        ride.status,
        ride.date,
      ],
    );
  }
}
