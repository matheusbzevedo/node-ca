import { expect, test } from 'vitest';

import AcceptRide from '../../../src/application/usecase/AcceptRide';
import GetRide from '../../../src/application/usecase/GetRide';
import RequestRide from '../../../src/application/usecase/RequestRide';
import Signup from '../../../src/application/usecase/Signup';
import { PgPromiseAdapter } from '../../../src/infra/database/DatabaseConnection';
import { MailerGatewayMemory } from '../../../src/infra/gateway/MailerGateway';
import { AccountRepositoryDatabase } from '../../../src/infra/repository/AccountRepository';
import { RideRepositoryDatabase } from '../../../src/infra/repository/RideRepository';

test('Should be able to accept a ride', async () => {
  const databaseConnection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(databaseConnection);
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountRepository, mailerGateway);
  const inputSignup = {
    name: 'John Doe',
    email: `joh.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true,
  };
  const inputSignupDriver = {
    name: 'John Doe',
    email: `joh.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: 'AAA9999',
    isDriver: true,
  };
  const outputSignup = await signup.execute(inputSignup);
  const outputSignupDriver = await signup.execute(inputSignupDriver);
  const rideRepository = new RideRepositoryDatabase(databaseConnection);
  const requestRide = new RequestRide(accountRepository, rideRepository);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584_905_257_808_835,
    fromLong: -48.545_022_195_325_124,
    toLat: -27.496_887_588_317_275,
    toLong: -48.522_234_807_851_476,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  const acceptRide = new AcceptRide(accountRepository, rideRepository);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };

  await acceptRide.execute(inputAcceptRide);
  const inputGetRide = {
    rideId: outputRequestRide.rideId,
  };
  const getRide = new GetRide(accountRepository, rideRepository);
  const outputGetRide = await getRide.execute(inputGetRide);

  expect(outputGetRide.passengerId).toEqual(outputSignup.accountId);
  expect(outputGetRide.status).toEqual('accepted');
  expect(outputGetRide.driverName).toEqual(inputSignupDriver.name);
  await databaseConnection.close();
});
