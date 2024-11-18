import axios from 'axios';

axios.defaults.validateStatus = function () {
  return true;
};

test('Should be able to create a passenger account', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true,
  };
  const responseSignup = await axios.post(
    'http://localhost:3000/signup',
    input,
  );
  expect(responseSignup.status).toEqual(200);
  const outputSignup = responseSignup.data;
  expect(outputSignup.accountId).toBeDefined();
  const responseGetAccount = await axios.get(
    `http://localhost:3000/accounts/${outputSignup.accountId}`,
  );
  const outputGetAccount = responseGetAccount.data;
  expect(outputGetAccount.name).toEqual(input.name);
  expect(outputGetAccount.email).toEqual(input.email);
  expect(outputGetAccount.cpf).toEqual(input.cpf);
});

test('Should not be able to create a passenger account if email is already exists', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true,
  };
  await axios.post('http://localhost:3000/signup', input);
  const responseSignup = await axios.post(
    'http://localhost:3000/signup',
    input,
  );
  expect(responseSignup.status).toEqual(422);
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toEqual('Account already exists');
});
