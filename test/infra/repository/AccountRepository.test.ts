import Account from '../../../src/domain/Account';
import { PgPromiseAdapter } from '../../../src/infra/database/DatabaseConnection';
import { AccountRepositoryDatabase } from '../../../src/infra/repository/AccountRepository';

test('Should be able to save data on account table and get by id', async function () {
  const account = Account.create(
    'John Doe',
    `joh.doe${Math.random()}@gmail.com`,
    '87748248800',
    '',
    true,
    false,
  );
  const databaseConnection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(databaseConnection);
  await accountRepository.saveAccount(account);
  const accountById = await accountRepository.getAccountById(account.accountId);
  expect(accountById?.accountId).toEqual(account.accountId);
  expect(accountById?.name).toEqual(account.name);
  expect(accountById?.email).toEqual(account.email);
  expect(accountById?.cpf).toEqual(account.cpf);
  await databaseConnection.close();
});

test('Should be able to save data on account table and get by email', async function () {
  const account = Account.create(
    'John Doe',
    `joh.doe${Math.random()}@gmail.com`,
    '87748248800',
    '',
    true,
    false,
  );
  const databaseConnection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(databaseConnection);
  await accountRepository.saveAccount(account);
  const accountByEmail = await accountRepository.getAccountByEmail(
    account.email,
  );
  expect(accountByEmail?.accountId).toEqual(account.accountId);
  expect(accountByEmail?.name).toEqual(account.name);
  expect(accountByEmail?.email).toEqual(account.email);
  expect(accountByEmail?.cpf).toEqual(account.cpf);
  await databaseConnection.close();
});
