import Position from '../entity/Position';
import Segment from '../vo/Segment';

const DistanceCalculator = {
  calculate(positions: Position[]): number {
    let distance = 0;

    for (const [index, position] of positions.entries()) {
      if (index + 1 === positions.length) break;
      const nextPosition = positions[index + 1];
      const segment = new Segment(position.coord, nextPosition.coord);

      distance += segment.getDistance();
    }

    return distance;
  },
};

export default DistanceCalculator;
