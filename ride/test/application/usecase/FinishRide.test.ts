import { expect, test } from 'vitest';

import AcceptRide from '../../../src/application/usecase/AcceptRide';
import FinishRide from '../../../src/application/usecase/FinishRide';
import GetRide from '../../../src/application/usecase/GetRide';
import RequestRide from '../../../src/application/usecase/RequestRide';
import Signup from '../../../src/application/usecase/Signup';
import StartRide from '../../../src/application/usecase/StartRide';
import UpdatePosition from '../../../src/application/usecase/UpdatePosition';
import {
  PgPromiseAdapter,
  UnitOfWork,
} from '../../../src/infra/database/DatabaseConnection';
import Registry from '../../../src/infra/di/Registry';
import { MailerGatewayMemory } from '../../../src/infra/gateway/MailerGateway';
import PaymentGatewayHttp from '../../../src/infra/gateway/PaymentGatewayHttp';
import { AccountRepositoryDatabase } from '../../../src/infra/repository/AccountRepository';
import { PositionRepositoryDataBase } from '../../../src/infra/repository/PositionRepository';
import { RideRepositoryDatabase } from '../../../src/infra/repository/RideRepository';

test('Should be able to finish ride', async (): Promise<void> => {
  const connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const rideRepository = new RideRepositoryDatabase(connection);
  const positionRepository = new PositionRepositoryDataBase(connection);
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountRepository, mailerGateway);
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true,
  };
  const outputSignup = await signup.execute(inputSignup);
  const inputSignupDriver = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: 'AAA9999',
    isDriver: true,
  };
  const outPutSignupDriver = await signup.execute(inputSignupDriver);
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
    driverId: outPutSignupDriver.accountId,
  };

  await acceptRide.execute(inputAcceptRide);
  const startRide = new StartRide(rideRepository);
  const inputStartRide = {
    rideId: outputRequestRide.rideId,
  };

  await startRide.execute(inputStartRide);
  const unitOfWork = new UnitOfWork();
  const rideRepositoryUoW = new RideRepositoryDatabase(unitOfWork);
  const positionRepositoryUoW = new PositionRepositoryDataBase(unitOfWork);
  const updatePosition = new UpdatePosition(
    rideRepositoryUoW,
    positionRepositoryUoW,
  );
  const inputUpdatePosition1 = {
    rideId: outputRequestRide.rideId,
    lat: -27.584_905_257_808_835,
    long: -48.545_022_195_325_124,
    date: new Date('2023-03-01T21:30:00'),
  };

  await updatePosition.execute(inputUpdatePosition1);
  const inputUpdatePosition2 = {
    rideId: outputRequestRide.rideId,
    lat: -27.496_887_588_317_275,
    long: -48.522_234_807_851_476,
    date: new Date('2023-03-01T22:30:00'),
  };

  await updatePosition.execute(inputUpdatePosition2);
  const inputUpdatePosition3 = {
    rideId: outputRequestRide.rideId,
    lat: -27.584_905_257_808_835,
    long: -48.545_022_195_325_124,
    date: new Date('2023-03-01T23:30:00'),
  };

  await updatePosition.execute(inputUpdatePosition3);
  const inputGetRide = {
    rideId: outputRequestRide.rideId,
  };
  const inputFinishRide = {
    rideId: outputRequestRide.rideId,
  };
  const paymentGateway = new PaymentGatewayHttp();

  Registry.getInstance().provide('rideRepository', rideRepository);
  Registry.getInstance().provide('paymentGateway', paymentGateway);
  const finishRide = new FinishRide();

  await finishRide.execute(inputFinishRide);
  const getRide = new GetRide(
    accountRepository,
    rideRepository,
    positionRepository,
  );
  const outputGetRide = await getRide.execute(inputGetRide);

  expect(outputGetRide.passengerId).toEqual(outputSignup.accountId);
  expect(outputGetRide.fare).toBe(63);
  expect(outputGetRide.status).toBe('completed');
  await connection.close();
  await unitOfWork.close();
});
