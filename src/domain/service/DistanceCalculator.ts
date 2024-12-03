import Coord from '../vo/Coord';

const DistanceCalculator = {
  calculate(from: Coord, to: Coord) {
    const earthRadius = 6371;
    const degreeToRadians = Math.PI / 180;
    const deltaLat = (to.getLat() - from.getLat()) * degreeToRadians;
    const deltaLong = (to.getLong() - from.getLong()) * degreeToRadians;
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(from.getLat() * degreeToRadians) *
        Math.cos(to.getLat() * degreeToRadians) *
        Math.sin(deltaLong / 2) *
        Math.sin(deltaLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return Math.round(distance);
  },
};

export default DistanceCalculator;
