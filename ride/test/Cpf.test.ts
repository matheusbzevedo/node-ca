import { expect, test } from 'vitest';

import Cpf from '../src/domain/vo/Cpf';

test.each(['97456321558', '71428793860', '87748248800'])(
  'Should be test a valid cpf: %s',
  (cpf: string) => {
    expect(new Cpf(cpf)).toBeDefined();
  },
);

test.each([undefined, undefined, '11111111111', '123', '123456789123123123'])(
  'Should be test an invalid cpf: %s',
  (cpf: any) => {
    expect(() => new Cpf(cpf)).toThrow(new Error('Invalid cpf'));
  },
);
