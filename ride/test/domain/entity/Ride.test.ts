import { expect, test } from 'vitest';

import Position from '../../../src/domain/entity/Position';
import DistanceCalculator from '../../../src/domain/service/DistanceCalculator';

test('Should be able to update position', async () => {
  const positions = [
    Position.create(
      '',
      -27.584_905_257_808_835,
      -48.545_022_195_325_124,
      new Date(),
    ),
    Position.create(
      '',
      -27.496_887_588_317_275,
      -48.522_234_807_851_476,
      new Date(),
    ),
  ];

  expect(DistanceCalculator.calculate(positions)).toBe(10);
});
