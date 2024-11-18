import { mock, spy, stub } from 'sinon';
import { GetAccount } from '../../../src/application/usecase/GetAccount';
import { Signup } from '../../../src/application/usecase/Signup';
import Account from '../../../src/domain/Account';
import { PgPromiseAdapter } from '../../../src/infra/database/DatabaseConnection';
import { MailerGatewayMemory } from '../../../src/infra/gateway/MailerGateway';
import {
  AccountRepositoryDatabase,
  AccountRepositoryMemory,
} from '../../../src/infra/repository/AccountRepository';

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
  const accountRepository = new AccountRepositoryMemory();
  const mailerGateway = new MailerGatewayMemory();
  signup = new Signup(accountRepository, mailerGateway);
  getAccount = new GetAccount(accountRepository);
});

test('Should be able to create a passenger account', async function () {
  const input = {
    name: 'John Doe',
    email: `joh.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true,
  };
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toEqual(input.name);
  expect(outputGetAccount.email).toEqual(input.email);
  expect(outputGetAccount.cpf).toEqual(input.cpf);
});

test('Should be able to create a rider account', async function () {
  const input = {
    name: 'John Doe',
    email: `joh.doe${Math.random()}@gmail.com`,
    carPlate: 'AAA9999',
    cpf: '87748248800',
    isPassenger: false,
    isDriver: true,
  };
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toEqual(input.name);
  expect(outputGetAccount.email).toEqual(input.email);
  expect(outputGetAccount.cpf).toEqual(input.cpf);
});

test('Should not be able to create a rider account if car plate is invalid', async function () {
  const input = {
    name: 'John Doe',
    email: `joh.doe${Math.random()}@gmail.com`,
    carPlate: 'AAA999',
    cpf: '87748248800',
    isPassenger: false,
    isDriver: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Invalid car plate'),
  );
});

test('Should not be able to create passenger account if name is invalid', async function () {
  const input = {
    name: 'John',
    email: `joh.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Invalid name'),
  );
});

test('Should not be able to create passenger account if account already exists', async function () {
  const input = {
    name: 'John Doe',
    email: `joh.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true,
  };
  await signup.execute(input);
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Account already exists'),
  );
});

test('Should not be able to create passenger account if email is invalid', async function () {
  const input = {
    name: 'John Doe',
    email: `joh.doe${Math.random()}`,
    cpf: '87748248800',
    isPassenger: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Invalid email'),
  );
});

test('Should not be able to create passenger account if cpf is invalid', async function () {
  const input = {
    name: 'John Doe',
    email: `joh.doe${Math.random()}@gmail.com`,
    cpf: '877482488',
    isPassenger: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Invalid cpf'),
  );
});

test('Should be able to create a passenger account with stub', async function () {
  const input = {
    name: 'John Doe',
    email: `joh.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true,
  };
  const saveAccountStub = stub(
    AccountRepositoryDatabase.prototype,
    'saveAccount',
  ).resolves();
  const getAccountByEmailStub = stub(
    AccountRepositoryDatabase.prototype,
    'getAccountByEmail',
  ).resolves(undefined);
  const getAccountByIdStub = stub(
    AccountRepositoryDatabase.prototype,
    'getAccountById',
  ).resolves(
    Account.restore(
      '',
      input.name,
      input.email,
      input.cpf,
      '',
      input.isPassenger,
      false,
    ),
  );
  const databaseConnection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(databaseConnection);
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountRepository, mailerGateway);
  const getAccount = new GetAccount(accountRepository);
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toEqual(input.name);
  expect(outputGetAccount.email).toEqual(input.email);
  expect(outputGetAccount.cpf).toEqual(input.cpf);
  saveAccountStub.restore();
  getAccountByEmailStub.restore();
  getAccountByIdStub.restore();
});

test('Should be able to create a passenger account with spy', async function () {
  const input = {
    name: 'John Doe',
    email: `joh.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true,
  };
  const sendSpy = spy(MailerGatewayMemory.prototype, 'send');
  const databaseConnection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(databaseConnection);
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountRepository, mailerGateway);
  const getAccount = new GetAccount(accountRepository);
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toEqual(input.name);
  expect(outputGetAccount.email).toEqual(input.email);
  expect(outputGetAccount.cpf).toEqual(input.cpf);
  expect(sendSpy.calledOnce).toBe(true);
  expect(sendSpy.calledWith(input.email, 'Welcome', '')).toBe(true);
  sendSpy.restore();
});

test('Should be able to create a passenger account with mock', async function () {
  const input = {
    name: 'John Doe',
    email: `joh.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true,
  };
  const sendMock = mock(MailerGatewayMemory.prototype);
  sendMock
    .expects('send')
    .withArgs(input.email, 'Welcome', '')
    .once()
    .callsFake(async function () {
      console.log('abc');
    });
  const databaseConnection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(databaseConnection);
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountRepository, mailerGateway);
  const getAccount = new GetAccount(accountRepository);
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toEqual(input.name);
  expect(outputGetAccount.email).toEqual(input.email);
  expect(outputGetAccount.cpf).toEqual(input.cpf);
  sendMock.verify();
});
