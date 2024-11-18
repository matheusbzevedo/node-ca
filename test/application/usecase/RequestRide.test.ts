import GetRide from '../../../src/application/usecase/GetRide';
import RequestRide from '../../../src/application/usecase/RequestRide';
import { Signup } from '../../../src/application/usecase/Signup';
import { PgPromiseAdapter } from '../../../src/infra/database/DatabaseConnection';
import { MailerGatewayMemory } from '../../../src/infra/gateway/MailerGateway';
import { AccountRepositoryDatabase } from '../../../src/infra/repository/AccountRepository';
import { RideRepositoryDatabase } from '../../../src/infra/repository/RideRepository';

test('Should be able to request ride', async () => {
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
  const outputSignup = await signup.execute(inputSignup);
  const rideDAO = new RideRepositoryDatabase(databaseConnection);
  const requestRide = new RequestRide(accountRepository, rideDAO);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  expect(outputRequestRide.rideId).toBeDefined();
  const inputGetRide = {
    rideId: outputRequestRide.rideId,
  };
  const getRide = new GetRide(accountRepository, rideDAO);
  const outputGetRide = await getRide.execute(inputGetRide);
  expect(outputGetRide.passengerId).toEqual(outputSignup.accountId);
  expect(outputGetRide.status).toEqual('requested');
  expect(outputGetRide.fromLat).toEqual(inputRequestRide.fromLat);
  expect(outputGetRide.fromLong).toEqual(inputRequestRide.fromLong);
  expect(outputGetRide.toLat).toEqual(inputRequestRide.toLat);
  expect(outputGetRide.toLong).toEqual(inputRequestRide.toLong);
  expect(outputGetRide.passengerName).toEqual(inputSignup.name);
  expect(outputGetRide.passengerEmail).toEqual(inputSignup.email);
  await databaseConnection.close();
});

test('Should not be able to request ride if account is not from passenger', async () => {
  const databaseConnection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(databaseConnection);
  const rideDAO = new RideRepositoryDatabase(databaseConnection);
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountRepository, mailerGateway);
  const inputSignup = {
    name: 'John Doe',
    email: `joh.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isDriver: true,
  };
  const outputSignup = await signup.execute(inputSignup);
  const requestRide = new RequestRide(accountRepository, rideDAO);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error('Account is not from a passenger'),
  );
  await databaseConnection.close();
});

test('Should not be able to request ride if passenger already has another ride in progress', async () => {
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
  const outputSignup = await signup.execute(inputSignup);
  const rideDAO = new RideRepositoryDatabase(databaseConnection);
  const requestRide = new RequestRide(accountRepository, rideDAO);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  await requestRide.execute(inputRequestRide);
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error('Passenger has an active ride'),
  );
  await databaseConnection.close();
});
