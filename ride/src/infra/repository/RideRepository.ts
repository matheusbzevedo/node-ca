import Ride from "../../domain/entity/Ride";
import type DatabaseConnection from "../database/DatabaseConnection";

export default interface RideRepository {
	databaseConnection: DatabaseConnection;
	getRideById(rideId: string): Promise<Ride>;
	hasActiveRideByPassengerId(passengerId: string): Promise<boolean>;
	saveRide(ride: Ride): Promise<void>;
	updateRide(ride: Ride): Promise<void>;
}

export class RideRepositoryDatabase implements RideRepository {
	constructor(readonly databaseConnection: DatabaseConnection) {}

	async getRideById(rideId: string): Promise<Ride> {
		const [rideData] = await this.databaseConnection.query(
			"select * from cccat16.ride where ride_id = $1",
			[rideId],
		);
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
			Number.parseFloat(rideData.last_lat),
			Number.parseFloat(rideData.last_long),
			Number.parseFloat(rideData.distance),
			Number.parseFloat(rideData.fare),
		);

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
			`insert into cccat16.ride (
				ride_id,
				passenger_id,
				from_lat,
				from_long,
				to_lat,
				to_long,
				status,
				date,
				last_lat,
				last_long,
				distance,
				fare
			)
			values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
			[
				ride.rideId,
				ride.passengerId,
				ride.getFromLat(),
				ride.getFromLong(),
				ride.getToLat(),
				ride.getToLong(),
				ride.getStatus(),
				ride.date,
				ride.lastPosition.getLat(),
				ride.lastPosition.getLong(),
				ride.distance,
				ride.fare,
			],
			true,
		);
	}

	async updateRide(ride: Ride): Promise<void> {
		await this.databaseConnection.query(
			"update cccat16.ride set status = $1, driver_id = $2, last_lat = $3, last_long = $4, distance = $5, fare = $6 where ride_id = $7",
			[
				ride.getStatus(),
				ride.driverId,
				ride.lastPosition.getLat(),
				ride.lastPosition.getLong(),
				ride.distance,
				ride.fare,
				ride.rideId,
			],
			true,
		);
	}
}
