import crypto from 'node:crypto';

import Coord from '../vo/Coord';

export default class Position {
  private constructor(
    readonly positionId: string,
    readonly rideId: string,
    readonly coord: Coord,
    readonly date: Date,
  ) {}

  static create(
    rideId: string,
    lat: number,
    long: number,
    date: Date,
  ): Position {
    const positionId = crypto.randomUUID();

    return new Position(positionId, rideId, new Coord(lat, long), date);
  }

  static restore(
    positionId: string,
    rideId: string,
    lat: number,
    long: number,
    date: Date,
  ): Position {
    return new Position(positionId, rideId, new Coord(lat, long), date);
  }
}
