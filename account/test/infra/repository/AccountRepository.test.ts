import { expect, test } from "vitest";

import Account from "../../../src/domain/entity/Account";
import { PgPromiseAdapter } from "../../../src/infra/database/DatabaseConnection";
import { AccountRepositoryDatabase } from "../../../src/infra/repository/AccountRepository";

test("Should be able to save data on account table and get by id", async () => {
	const account = Account.create(
		"John Doe",
		`joh.doe${Math.random()}@gmail.com`,
		"87748248800",
		"",
		true,
		false,
	);
	const databaseConnection = new PgPromiseAdapter();
	const accountRepository = new AccountRepositoryDatabase(databaseConnection);

	await accountRepository.saveAccount(account);
	const accountById = await accountRepository.getAccountById(account.accountId);

	expect(accountById?.accountId).toEqual(account.accountId);
	expect(accountById?.getName()).toEqual(account.getName());
	expect(accountById?.getEmail()).toEqual(account.getEmail());
	expect(accountById?.getCpf()).toEqual(account.getCpf());
	await databaseConnection.close();
});

test("Should be able to save data on account table and get by email", async () => {
	const account = Account.create(
		"John Doe",
		`joh.doe${Math.random()}@gmail.com`,
		"87748248800",
		"",
		true,
		false,
	);
	const databaseConnection = new PgPromiseAdapter();
	const accountRepository = new AccountRepositoryDatabase(databaseConnection);

	await accountRepository.saveAccount(account);
	const accountByEmail = await accountRepository.getAccountByEmail(
		account.getEmail(),
	);

	expect(accountByEmail?.accountId).toEqual(account.accountId);
	expect(accountByEmail?.getName()).toEqual(account.getName());
	expect(accountByEmail?.getEmail()).toEqual(account.getEmail());
	expect(accountByEmail?.getCpf()).toEqual(account.getCpf());
	await databaseConnection.close();
});
