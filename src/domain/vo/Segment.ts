import Coord from './Coord';

export default class Segment {
  constructor(
    readonly from: Coord,
    readonly to: Coord,
  ) {}

  getDistance() {
    const earthRadius = 6371;
    const degreeToRadians = Math.PI / 180;
    const deltaLat = (this.to.getLat() - this.from.getLat()) * degreeToRadians;
    const deltaLong =
      (this.to.getLong() - this.from.getLong()) * degreeToRadians;
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(this.from.getLat() * degreeToRadians) *
        Math.cos(this.to.getLat() * degreeToRadians) *
        Math.sin(deltaLong / 2) *
        Math.sin(deltaLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return Math.round(distance);
  }
}
