import { randomUUID } from "node:crypto";

import Observable from "../../infra/mediator/Observable";
import RideCompleted from "../event/RideCompleted";
import { FareCalculatorFactory } from "../service/FareCalculator";
import Coord from "../vo/Coord";
import type RideStatus from "../vo/RideStatus";
import { RideStatusFactory } from "../vo/RideStatus";
import Segment from "../vo/Segment";
import type Position from "./Position";

export default class Ride extends Observable {
	status: RideStatus;

	private constructor(
		readonly rideId: string,
		readonly passengerId: string,
		public driverId: string,
		private segment: Segment,
		status: string,
		readonly date: Date,
		public lastPosition: Coord,
		public distance: number,
		public fare: number,
	) {
		super();
		this.status = RideStatusFactory.create(this, status);
	}

	static create(
		passengerId: string,
		fromLat: number,
		fromLong: number,
		toLat: number,
		toLong: number,
	): Ride {
		const rideId = randomUUID();
		const status = "requested";
		const date = new Date();
		const lastPosition = new Coord(fromLat, fromLong);
		const distance = 0;
		const fare = 0;

		return new Ride(
			rideId,
			passengerId,
			"",
			new Segment(new Coord(fromLat, fromLong), new Coord(toLat, toLong)),
			status,
			date,
			lastPosition,
			distance,
			fare,
		);
	}

	static restore(
		rideId: string,
		passengerId: string,
		driverId: string,
		fromLat: number,
		fromLong: number,
		toLat: number,
		toLong: number,
		status: string,
		date: Date,
		lastLat: number,
		lastLong: number,
		distance: number,
		fare: number,
	): Ride {
		return new Ride(
			rideId,
			passengerId,
			driverId,
			new Segment(new Coord(fromLat, fromLong), new Coord(toLat, toLong)),
			status,
			date,
			new Coord(lastLat, lastLong),
			distance,
			fare,
		);
	}

	public start(): void {
		this.status.start();
	}

	public finish(): void {
		this.status.finish();
		this.notify(new RideCompleted({ rideId: this.rideId, amount: this.fare }));
	}

	public updatePosition(lat: number, long: number, date: Date): void {
		const newPosition = new Coord(lat, long);
		const distance = new Segment(this.lastPosition, newPosition).getDistance();

		this.distance += distance;
		this.fare += FareCalculatorFactory.create(date).calculate(distance);
		this.lastPosition = newPosition;
	}

	public accept(driverId: string): void {
		this.status.accept();
		this.driverId = driverId;
	}

	public getDistance(positions: Position[]): number {
		let distance = 0;

		for (const [index, position] of positions.entries()) {
			if (index + 1 === positions.length) break;
			const nextPosition = positions[index + 1];
			const segment = new Segment(position.coord, nextPosition.coord);

			distance += segment.getDistance();
		}

		return distance;
	}

	public getFromLat(): number {
		return this.segment.from.getLat();
	}

	public getFromLong(): number {
		return this.segment.from.getLong();
	}

	public getToLat(): number {
		return this.segment.to.getLat();
	}

	public getToLong(): number {
		return this.segment.to.getLong();
	}

	// public getDistance(): number {
	//   return this.segment.getDistance();
	// }

	public getStatus(): string {
		return this.status.value;
	}
}
