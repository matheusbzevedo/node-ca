import { expect, test } from 'vitest';

import Ride from '../../../src/domain/entity/Ride';

test.skip('Should be able to update position', async () => {
  const ride = Ride.create('', 0, 0, 0, 0);

  ride.updatePosition(-27.584_905_257_808_835, -48.545_022_195_325_124);
  ride.updatePosition(-27.496_887_588_317_275, -48.522_234_807_851_476);
  expect(ride.getDistance([])).toBe(10);
});
