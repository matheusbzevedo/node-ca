import { validate } from '../src/domain/validateCpf';

test.each(['97456321558', '71428793860', '87748248800'])(
  'Should be test a valid cpf: %s',
  (cpf: string) => {
    expect(validate(cpf)).toEqual(true);
  },
);

test.each([undefined, null, '11111111111', '123', '123456789123123123'])(
  'Should be test an invalid cpf: %s',
  (cpf: any) => {
    expect(validate(cpf)).toEqual(false);
  },
);
