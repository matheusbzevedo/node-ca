import { randomUUID } from 'node:crypto';

import Coord from '../vo/Coord';
import RideStatus, { RideStatusFactory } from '../vo/RideStatus';
import Segment from '../vo/Segment';
import Position from './Position';

export default class Ride {
  status: RideStatus;

  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    public driverId: string,
    private segment: Segment,
    status: string,
    readonly date: Date,
  ) {
    this.status = RideStatusFactory.create(this, status);
  }

  static create(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
  ) {
    const rideId = randomUUID();
    const status = 'requested';
    const date = new Date();

    return new Ride(
      rideId,
      passengerId,
      '',
      new Segment(new Coord(fromLat, fromLong), new Coord(toLat, toLong)),
      status,
      date,
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
  ) {
    return new Ride(
      rideId,
      passengerId,
      driverId,
      new Segment(new Coord(fromLat, fromLong), new Coord(toLat, toLong)),
      status,
      date,
    );
  }

  public start(): void {
    this.status.start();
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
